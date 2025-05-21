#!/usr/bin/env bash

echo "Installing npm packages..."
npm install

echo "Building the Electron app..."
npm run build

echo "Installing the app..."
#to be modified