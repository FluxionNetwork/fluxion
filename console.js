#Update
  #!/usr/bin/env bash

clear
HEADER_SIZE="####"

# Function to print headers
print_header() {
  echo "$HEADER_SIZE $1"
  echo -ne "\n\n"
}

# Function to check if a directory exists
check_directory() {
  if [ -d "$1" ]; then
    return 0
  else
    return 1
  fi
}

# Function to check if a file exists
check_file() {
  if [ -f "$1" ]; then
    return 0
  else
    return 1
  fi
}

# Function to display an error message and exit
display_error() {
  echo -e "\033[31mError: $1\033[0m"
  exit 1
}

# Check if the 'lib' directory exists
if check_directory "lib"; then
  source lib/InterfaceUtils.sh
  source lib/ChipsetUtils.sh
elif check_directory "../lib"; then
  source ../lib/InterfaceUtils.sh
  source ../lib/ChipsetUtils.sh
else
  display_error "lib folder not found"
fi

# Check if an argument is provided
if [ ! "$1" ]; then
  display_error "Usage: $0 [wireless_interface]"
fi

# Print FLUXION Info
print_header "FLUXION Info"
if check_file "fluxion.sh"; then
  FLUXIONInfo=($(grep -oE "FLUXION(Version|Revision)=[0-9]+" fluxion.sh))
else
  FLUXIONInfo=($(grep -oE "FLUXION(Version|Revision)=[0-9]+" ../fluxion.sh))
fi
echo "FLUXION V${FLUXIONInfo[0]/*=/}.${FLUXIONInfo[1]/*=/}"

# ... (continue with other sections)

# Print System Info
print_header "System Info"
if [ -r "/proc/version" ]; then
  echo "**Chipset:** $(cat /proc/version)"
else
  echo "**Chipset:** $(uname -r)"
fi

# Print Chipset Info
print_header "Chipset"
chipset=$(airmon-ng | grep "$1" | awk '{print $3}')
echo "Chipset: $chipset"
check_chipset "$chipset"
