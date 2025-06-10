#!/bin/bash
set -e

# need to do this command
# chmod +x uninstall.sh

# folders
root_folder="$(dirname "$(readlink -f "$0")")"
frontend_folder="$root_folder/frontend"
backend_folder="$root_folder/backend"
electron_dist="$root_folder/electron/dist"
app_package_name="md-desktop"
logfile="$root_folder/uninstall.log"
> "$logfile"

if [ -n "$SUDO_USER" ]; then
  user_home=$(getent passwd "$SUDO_USER" | cut -d: -f6)
else
  user_home="$HOME"
fi
desktop_shortcut_path="$user_home/Desktop/${app_package_name}.desktop"

# sudo check
if [[ $EUID -ne 0 ]]; then
    echo "This script requires root privileges to uninstall the package and manage Docker."
    echo "Please run with sudo: sudo ./uninstall.sh"
    exit 1
fi

# apikey
echo "Removing API key..."
node backend/src/utils/deleteApiKey.js >> "$logfile" 2>&1

# docker
echo ""
echo "Removing Docker containers and images..."
docker compose -p mddesktop down --rmi all >> "$logfile" 2>&1
echo "Docker containers and images removed"

# package
echo ""
echo "Uninstalling MD Desktop package"
if apt list --installed  >> "$logfile" 2>&1 | grep -q "$app_package_name"; then
    echo "Package '$app_package_name' found. Attempting to remove..."
    apt remove "$app_package_name" -y  >> "$logfile" 2>&1
    if [ $? -eq 0 ]; then
        echo "Package uninstalled successfully."
    else
        echo "Failed to uninstall package"
    fi
else
    echo "Package '$app_package_name' not found -> skipping removal"
fi

# desktop shortcut
echo ""
echo "Removing desktop shortcut..."
if [ -f "$desktop_shortcut_path" ]; then
    rm "$desktop_shortcut_path"  >> "$logfile" 2>&1
    echo "Desktop shortcut removed."
    #echo $desktop_shortcut_path
else
    echo "Desktop shortcut not found -> skipping removal."
    #echo $desktop_shortcut_path
fi

echo ""
echo "Deleting dependencies directories"

# node_modules
echo ""
if [ -d "$root_folder/node_modules" ]; then
    echo "Removing electron dependencies..."
    rm -rf "$root_folder/node_modules" >> "$logfile" 2>&1
else
    echo "Electron dependencies directory not found -> skipping."
fi


# frontend/node_modules
echo ""
if [ -d "$frontend_folder/node_modules" ]; then
    echo "Removing frontend dependencies..."
    rm -rf "$frontend_folder/node_modules" >> "$logfile" 2>&1
else
    echo "Frontend dependencies directory not found -> skipping."
fi


# backend/node_modules
echo ""
if [ -d "$backend_folder/node_modules" ]; then
    echo "Removing backend dependencies..."
    rm -rf "$backend_folder/node_modules" >> "$logfile" 2>&1
else
    echo "Backend dependencies directory not found -> skipping."
fi


# electron/dist
echo ""
echo "Deleting electron distribution folder"
if [ -d "$electron_dist" ]; then
    rm -rf "$electron_dist" >> "$logfile" 2>&1
else
    echo "Electron distribution directory not found -> skipping."
fi


echo ""
echo "MD Desktop uninstall has been completed"