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

$desktopExe = "$Env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
if ( -not (Test-Path $desktopExe)) {
    Write-Host "Docker Desktop is not installed. Please install it from https://docs.docker.com/desktop/setup/install/windows-install/"
    Exit 1
}
else {
    Write-Host "Running Docker Desktop..."
    docker desktop start  *>> $logFile
    Start-Sleep -Seconds 10
}


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