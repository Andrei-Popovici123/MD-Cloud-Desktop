#!/bin/bash
set -e

# need to do this command
# chmod +x uninstall.sh

# folders
root_folder="$(dirname "$(readlink -f "$0")")"
frontend_folder="$root_folder/frontend"
backend_folder="$root_folder/backend"
electron_dist="$root_folder/electron/dist"
app_package_name="md-cloud-desktop"
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

echo "Running deleteApiKey script..."
node backend/src/utils/deleteApiKey.js >> "$logfile" 2>&1

# docker
echo ""
if command -v docker >> "$logfile" 2>&1; then
  if [ -f "$root_folder/docker-compose.yaml" ]; then
    echo "Stopping Docker containers..."
    if docker compose -f "$root_folder/docker-compose.yaml" down >> "$logfile" 2>&1; then
      echo "Docker containers stopped and removed."
    else
      echo "Docker cleanup ran but some containers failed to stop."
    fi
  else
    echo "No docker-compose.yaml found; skipping Docker cleanup."
  fi
else
  echo "Docker not installed or not in PATH; skipping all Docker steps."
fi

# package
echo ""
echo "Uninstalling MD Cloud Desktop package"
if apt list --installed  >> "$logfile" 2>&1 | grep -q "$app_package_name"; then
    echo "Package '$app_package_name' found. Attempting to remove..."
    apt remove "$app_package_name" -y  >> "$logfile" 2>&1
    if [ $? -eq 0 ]; then
        echo " package uninstalled successfully."
    else
        echo "Failed to uninstall package"
    fi
else
    echo "package '$app_package_name' not found -> skipping removal"
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
echo "Deleting node_modules directories"

# node_modules
echo ""
if [ -d "$root_folder/node_modules" ]; then
    echo "Removing $root_folder/node_modules..."
    rm -rf "$root_folder/node_modules" >> "$logfile" 2>&1
else
    echo "Electron node_modules directory not found -> skipping."
fi


# frontend/node_modules
echo ""
if [ -d "$frontend_folder/node_modules" ]; then
    echo "Removing $frontend_folder/node_modules..."
    rm -rf "$frontend_folder/node_modules" >> "$logfile" 2>&1
else
    echo "Frontend node_modules directory not found -> skipping."
fi


# backend/node_modules
echo ""
if [ -d "$backend_folder/node_modules" ]; then
    echo "Removing $backend_folder/node_modules..."
    rm -rf "$backend_folder/node_modules" >> "$logfile" 2>&1
else
    echo "Backend node_modules directory not found -> skipping."
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
echo "MD Cloud Desktop uninstall has been completed"