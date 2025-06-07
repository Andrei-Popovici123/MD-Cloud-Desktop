#!/usr/bin/env bash
set -e
# need to do this command
# chmod +x install.sh

if [ "$#" -ne 3 ]; then
  echo "Usage: $0 -apikey <your-api-key>"
  exit 1
fi
API_KEY=$3

root_folder="$(dirname "$(readlink -f "$0")")"
logfile="$root_folder/install.log"

if ! docker version > "$logfile" 2>&1; then
  echo "Docker is not installed or not in your PATH."
  echo "Please install Docker first: https://docs.docker.com/engine/install/ubuntu/"
  exit 1
fi

echo "Docker is installed, proceeding..."

# echo ""
# echo "Installing libsecret package..."
# sudo apt-get install libsecret-1-dev >> "$logfile" 2>&1


echo ""
echo "Installing backend npm packages..."
cd backend >> "$logfile" 2>&1
npm install >> "$logfile" 2>&1

echo "Running saveApiKey script..."
node backend/src/utils/saveApiKey.js "$API_KEY" >> "$logfile" 2>&1
echo "API key has been securely saved"

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
docker compose up -d >> "$logfile" 2>&1

echo ""
echo "Installing Electron npm packages..."
npm install >> "$logfile" 2>&1

echo ""
echo "Building the Electron app..."
npm run build >> "$logfile" 2>&1

echo ""
echo "Installing the app..."
sudo dpkg -i electron/dist/md-cloud-desktop_1.0.0_amd64.deb >> "$logfile" 2>&1

echo ""
echo "Adding desktop shortcut..."
cp /usr/share/applications/md-cloud-desktop.desktop "$HOME/Desktop/" >> "$logfile" 2>&1

if command -v gio > "$logfile" 2>&1; then
  echo "Marking launcher as trusted..."
  gio set "$HOME/Desktop/md-cloud-desktop.desktop" metadata::trusted true >> "$logfile" 2>&1
else
  echo "Warning: 'gio' not found; you may need to right-click and Allow Launching manually."
fi


chmod +x $HOME/Desktop/md-cloud-desktop.desktop

cd electron/dist/linux-unpacked
sudo chmod 4755 chrome-sandbox
sudo chown root:root chrome-sandbox

echo ""
echo "MD Cloud Desktop install has been completed"