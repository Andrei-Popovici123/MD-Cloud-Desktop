#!/usr/bin/env bash
set -e
# need to do this command
# chmod +x install.sh

# Check that `docker` exists and prints a version
if ! docker version > /dev/null 2>&1; then
  echo "Docker is not installed or not in your PATH."
  echo "Install Docker firstly: https://docs.docker.com/engine/install/ubuntu/"
  exit 1
fi

echo "Docker is installed, proceeding..."

echo ""
echo "Installing backend npm packages..."
cd backend
npm install

cd ..

echo ""
echo "Installing frontend npm packages..."
cd frontend
npm install

cd ..

echo ""
echo "Creating docker images..."
docker-compose build

echo ""
echo "Starting docker containers..."
docker-compose up -d

echo ""
echo "Installing Electron npm packages..."
npm install

echo ""
echo "Building the Electron app..."
npm run build

echo ""
echo "Installing the app..."
sudo dpkg -i electron/dist/md-cloud-desktop_1.0.0_amd64.deb

cd electron/dist/linux-unpacked
sudo chmod 4755 chrome-sandbox
sudo chown root:root chrome-sandbox