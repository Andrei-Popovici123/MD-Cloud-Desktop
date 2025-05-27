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


# sudo check
if [[ $EUID -ne 0 ]]; then
    echo "This script requires root privileges to uninstall the package and manage Docker."
    echo "Please run with sudo: sudo ./uninstall.sh"
    exit 1
fi


# docker
echo ""
if command -v docker &> /dev/null; then
  if [ -f "$root_folder/docker-compose.yaml" ]; then
    echo "Stopping Docker containers..."
    if docker compose -f "$root_folder/docker-compose.yaml" down; then
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
if apt list --installed | grep -q "$app_package_name"; then
    echo "Package '$app_package_name' found. Attempting to remove..."
    apt remove "$app_package_name" -y
    if [ $? -eq 0 ]; then
        echo " package uninstalled successfully."
    else
        echo "Failed to uninstall package"
    fi
else
    echo "package '$app_package_name' not found -> skipping removal"
fi



echo ""
echo "Deleting node_modules directories"

# node_modules
echo ""
if [ -d "$root_folder/node_modules" ]; then
    echo "Removing $root_folder/node_modules..."
    rm -rf "$root_folder/node_modules"
else
    echo "$root_folder/node_modules not found -> skipping."
fi


# frontend/node_modules
echo ""
if [ -d "$frontend_folder/node_modules" ]; then
    echo "Removing $frontend_folder/node_modules..."
    rm -rf "$frontend_folder/node_modules"
else
    echo "$frontend_folder/node_modules not found -> skipping."
fi


# backend/node_modules
echo ""
if [ -d "$backend_folder/node_modules" ]; then
    echo "Removing $backend_folder/node_modules..."
    rm -rf "$backend_folder/node_modules"
else
    echo "$backend_folder/node_modules not found -> skipping."
fi


# electron/dist
echo ""
echo "Deleting electron distribution folder"
if [ -d "$electron_dist" ]; then
    rm -rf "$electron_dist"
else
    echo "$electron_dist not found -> skipping."
fi


echo ""
echo "MD Cloud Desktop uninstall has been completed"