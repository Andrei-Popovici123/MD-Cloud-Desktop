#!/usr/bin/env bash
set -e

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 -apikey <your-api-key>"
  exit 1
fi
API_KEY=$2

root_folder="$(dirname "$(readlink -f "$0")")"
logfile="$root_folder/install.log"

if ! docker version > "$logfile" 2>&1; then
  echo "Docker is not installed or not in your PATH."
  echo "Please install Docker first: https://docs.docker.com/engine/install/ubuntu/"
  exit 1
fi

echo "Docker is installed, proceeding..."


echo ""
echo "Installing backend npm packages..."
cd backend >> "$logfile" 2>&1
npm install >> "$logfile" 2>&1

if [ ! -z "$API_KEY" ]; then
    root_env="$root_folder/.env"
    backend_env="$root_folder/backend/.env"
    
    if [ ! -f "$root_env" ]; then
        echo "OPSWAT_API_KEY=$API_KEY" > "$root_env"
    else
        sed -i "s/OPSWAT_API_KEY=.*/OPSWAT_API_KEY=$API_KEY/" "$root_env"
    fi
    
    if [ ! -f "$backend_env" ]; then
        echo "OPSWAT_API_KEY=$API_KEY" > "$backend_env"
    else
        sed -i "s/OPSWAT_API_KEY=.*/OPSWAT_API_KEY=$API_KEY/" "$backend_env"
    fi
    
    echo "API key has been updated in both .env files"
fi

cd .. >> "$logfile" 2>&1

echo ""
echo "Installing frontend npm packages..."
cd frontend >> "$logfile" 2>&1
npm install >> "$logfile" 2>&1

cd .. >> "$logfile" 2>&1

echo ""
echo "Creating docker images..."
docker compose build >> "$logfile" 2>&1

echo ""
echo "Starting docker containers..."
docker compose -p mddesktop up -d  >> "$logfile" 2>&1

echo ""
echo "Installing Electron npm packages..."
npm install >> "$logfile" 2>&1

echo ""
echo "Building the Electron app..."
npm run build >> "$logfile" 2>&1

echo ""
echo "Installing the app..."
sudo dpkg -i electron/dist/md-desktop_1.0.0_amd64.deb >> "$logfile" 2>&1

echo ""
echo "Adding desktop shortcut..."
cp /usr/share/applications/md-desktop.desktop "$HOME/Desktop/" >> "$logfile" 2>&1

if command -v gio &>/dev/null; then
  echo "Marking launcher as trusted..."
  gio set "$HOME/Desktop/md-desktop.desktop" metadata::trusted true >> "$logfile" 2>&1
else
  echo "Warning: 'gio' not found; you may need to right-click and Allow Launching manually."
fi


chmod +x $HOME/Desktop/md-desktop.desktop

cd electron/dist/linux-unpacked
sudo chmod 4755 chrome-sandbox
sudo chown root:root chrome-sandbox

echo ""
echo "MD Desktop install has been completed"