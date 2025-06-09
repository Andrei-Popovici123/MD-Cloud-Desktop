param(
    [string]$apikey
)

$rootDir = $PSScriptRoot

$logFile = Join-Path $rootDir "install.log"
Clear-Content -Path $logFile -ErrorAction SilentlyContinue

Write-Host "Checking if Docker is installed..."

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker is not installed. Please install Docker Desktop from https://docs.docker.com/desktop/setup/install/windows-install/"
    Exit 1
}

Write-Host "Docker is installed. Checking if Docker Desktop is running..."

if (-not ((docker ps 2>&1) -match '^(?!error)')) {
    Write-Host "Docker Desktop is not running. Please start Docker Desktop and try again."
    Exit 1
}

Write-Host "Docker Desktop is running. Proceeding..."

Write-Host "Installing backend npm packages..."
Set-Location -Path .\backend -PassThru  *>> $logFile
npm install  *>> $logFile

if ($apikey) {
    $apiKeyScript = Join-Path $rootDir "backend\src\utils\saveApiKey.js"
    node $apiKeyScript $apikey *>> $logFile

    Write-Host "API key has been securely stored"
}

Set-Location -Path .. -PassThru  *>> $logFile

Write-Host "Installing frontend npm packages..."
Set-Location -Path .\frontend -PassThru  *>> $logFile
npm install  *>> $logFile

Set-Location -Path .. -PassThru  *>> $logFile

Write-Host "Creating docker images..."
docker compose build  *>> $logFile

Write-Host "Starting docker containers..."
docker compose -p mddesktop up -d  *>> $logFile

Write-Host "Installing electron npm packages..."
npm install  *>> $logFile

Write-Host "Building Electron app..."
npm run build  *>> $logFile

Write-Host "Installing the app..."
Start-Process -FilePath ".\electron\dist\MD-Desktop Setup 1.0.0.exe"

# Write-Host "Running Context Menu ..."
# Start-Process -FilePath ".\assets\scan_with_opswat.reg"