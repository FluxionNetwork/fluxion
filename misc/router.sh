#!/bin/bash

# Router configuration helper for Fluxion-NG
# Get arguments
if ! CLiArguments=$(getopt --options="hu" --name "FLUXION V1.0" -- "$@"); then
    echo -e "\033[31mParameter error detected\033[0m"
    exit 1
fi

eval set -- "$CLiArguments"

while [ "$1" != "" ] && [ "$1" != "--" ]; do
    case "$1" in
        -h) echo "Usage: router.sh [-h] [-u]"; exit 0;;
        -u) echo "Updating router configuration..."; shift;;
    esac
    shift
done

echo "Router configuration helper - no operations specified."
