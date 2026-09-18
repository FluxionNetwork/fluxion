#!/usr/bin/env bash

# ============================================================ #
# ================ < Window Utils > ========================== #
# ============================================================ #
# Abstraction layer over xterm/tmux for headless operation.
# When -m/--multiplexer is set, uses tmux instead of xterm.

FLUXIONWindowCounter=0

fluxion_window_init() {
	# Scan-only mode doesn't need a terminal multiplexer.
	if [ "$FLUXIONScanOnly" ]; then
		FLUXIONDisplayMode="headless"
		return 0
	fi

	if [ "$FLUXIONTMux" ]; then
		FLUXIONDisplayMode="tmux"

		# If not already inside a tmux session, re-exec inside one.
		if [ -z "$TMUX" ]; then
			local _sessionName="FLUXION"
			tmux has-session -t "$_sessionName" 2>/dev/null && _sessionName="FLUXION_$$"
			exec env LANG=C.UTF-8 LC_ALL=C.UTF-8 \
				tmux new-session -s "$_sessionName" "$0 $FLUXIONOriginalArgs"
		fi

		# Ensure UTF-8 is set for the current session's environment.
		tmux set-environment LANG C.UTF-8 2>/dev/null
		tmux set-environment LC_ALL C.UTF-8 2>/dev/null
		export LANG=C.UTF-8
		export LC_ALL=C.UTF-8

		# If already inside tmux (either we just re-execed or user ran inside tmux),
		# rename the session to FLUXION for consistency.
		tmux rename-session FLUXION 2>/dev/null

		# Enable mouse support (scrolling, pane selection).
		tmux set-option -g mouse on 2>/dev/null
	else
		FLUXIONDisplayMode="xterm"
	fi
}

# fluxion_window_open <pid_var> <title> <geometry> <bg> <fg> <command>
#   pid_var=""  -> foreground/blocking (waits for command to finish)
#   pid_var="X" -> background (stores xterm/tmux parent PID in variable X)
#   In debug mode, windows remain open after command exits.
fluxion_window_open() {
	local pidVar="$1"
	local title="$2"
	local geometry="$3"
	local bg="$4"
	local fg="$5"
	local command="$6"

	FLUXIONWindowCounter=$((FLUXIONWindowCounter + 1))
	local windowName="${title:0:30}_${FLUXIONWindowCounter}"
	# Sanitize window name for tmux (no dots or colons)
	windowName=$(echo "$windowName" | tr '.:"' '___')

	if [ "$FLUXIONScanOnly" ]; then
		# Scan-only mode: no terminal windows, just background processes.
		if [ -z "$pidVar" ]; then
			# Foreground/blocking: run directly.
			eval $command
		else
			# Background: run in background, capture PID.
			eval $command &>/dev/null &
			eval "$pidVar=$!"
		fi
	elif [ "$FLUXIONDisplayMode" = "tmux" ]; then
		# Write command to a temp script to avoid all quoting issues with tmux.
		local cmdScript="$FLUXIONWorkspacePath/.cmd_${FLUXIONWindowCounter}.sh"

		if [ -z "$pidVar" ]; then
			# Foreground/blocking: create window, poll until command finishes.
			local doneFile="$FLUXIONWorkspacePath/.window_done_${FLUXIONWindowCounter}"
			rm -f "$doneFile"

			# Use a trap so the done file is written even if the window is
			# closed via Ctrl+C (SIGINT kills the process group before the
			# shell can run a trailing "; echo done" suffix).
			printf '#!/usr/bin/env bash\ntrap '"'"'echo done > "%s"'"'"' EXIT\n%s\n' \
				"$doneFile" "$command" > "$cmdScript"
			chmod +x "$cmdScript"

			if [ "$FLUXIONDebug" ]; then
				tmux new-window -n "$windowName" \
					"$cmdScript; echo 'Press enter to close...'; read"
			else
				tmux new-window -n "$windowName" "$cmdScript"
			fi

			# Poll until the command finishes.
			while [ ! -f "$doneFile" ]; do
				sleep 0.5
			done
			rm -f "$doneFile"
			rm -f "$cmdScript"

			# Refocus the main pane so the caller's output is immediately
			# visible without the user having to switch tmux windows manually.
			[ "$TMUX_PANE" ] && tmux select-pane -t "$TMUX_PANE" 2>/dev/null
		else
			# Background: create detached window, get PID.
			printf '#!/usr/bin/env bash\n%s\n' "$command" > "$cmdScript"
			chmod +x "$cmdScript"
			tmux new-window -d -n "$windowName" "$cmdScript"

			if [ "$FLUXIONDebug" ]; then
				# Set remain-on-exit for debug mode
				tmux set-option -t "$windowName" remain-on-exit on 2>/dev/null
			fi

			# Get the PID of the process running in the new pane.
			local panePID
			panePID=$(tmux list-panes -t "$windowName" -F '#{pane_pid}' 2>/dev/null | head -1)

			if [ -z "$panePID" ]; then
				# Fallback: try to get PID by listing all windows
				sleep 0.5
				panePID=$(tmux list-panes -t "$windowName" -F '#{pane_pid}' 2>/dev/null | head -1)
			fi

			eval "$pidVar=$panePID"
		fi
	else
		# xterm mode (original behavior)
		local holdFlag=""
		if [ "$FLUXIONDebug" ]; then
			holdFlag="-hold"
		fi

		if [ -z "$pidVar" ]; then
			# Foreground/blocking
			xterm $holdFlag -title "$title" $geometry \
				-bg "$bg" -fg "$fg" -e "$command" 2>> $FLUXIONOutputDevice
		else
			# Background
			xterm $holdFlag -title "$title" $geometry \
				-bg "$bg" -fg "$fg" -e "$command" &
			eval "$pidVar=$!"
		fi
	fi

	return 0
}

# fluxion_window_close <pid_var_name>
# Kills the window and its process tree, then clears the variable.
fluxion_window_close() {
	local pidVarName="$1"
	local pid="${!pidVarName}"

	if [ "$pid" ]; then
		kill "$pid" &> /dev/null
		# Also kill children
		local children
		children=$(pgrep -P "$pid" 2>/dev/null)
		if [ "$children" ]; then
			kill $children &> /dev/null
		fi
		eval "$pidVarName=''"
	fi
}

# fluxion_window_cleanup
# Kills the entire FLUXION tmux session at shutdown.
fluxion_window_cleanup() {
	if [ "$FLUXIONDisplayMode" = "tmux" ]; then
		# Kill all windows in the FLUXION session except the current one
		local currentWindow
		currentWindow=$(tmux display-message -p '#{window_id}' 2>/dev/null)

		# Kill all other windows
		local window
		for window in $(tmux list-windows -F '#{window_id}' 2>/dev/null); do
			if [ "$window" != "$currentWindow" ]; then
				tmux kill-window -t "$window" 2>/dev/null
			fi
		done
	fi
}

# FLUXSCRIPT END
