param(
    [string]$apikey
)

$rootDir = $PSScriptRoot

if ($apikey) {
    $envFile = Join-Path $rootDir ".env"
    $envContent = Get-Content $envFile -Raw
    $updatedContent = $envContent -replace "OPSWAT_API_KEY=.*", "OPSWAT_API_KEY=$apikey"
    Set-Content -Path $envFile -Value $updatedContent -NoNewline
    Write-Host "API key has been updated in .env file"

    $backendEnvFile = Join-Path $PSScriptRoot "backend\.env"
    $backendEnvContent = Get-Content $backendEnvFile -Raw
    $updatedBackendContent = $backendEnvContent -replace "OPSWAT_API_KEY=.*", "OPSWAT_API_KEY=$apikey"
    Set-Content -Path $backendEnvFile -Value $updatedBackendContent -NoNewline
    
    Write-Host "API key has been updated in backend .env files"
}

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

Set-Location -Path .. -PassThru  *>> $logFile

Write-Host "Installing frontend npm packages..."
Set-Location -Path .\frontend -PassThru  *>> $logFile
npm install  *>> $logFile

Set-Location -Path .. -PassThru  *>> $logFile

Write-Host "Creating docker images..."
docker compose build  *>> $logFile

Write-Host "Starting docker containers..."
docker compose up -d  *>> $logFile

Write-Host "Installing electron npm packages..."
npm install  *>> $logFile

Write-Host "Building Electron app..."
npm run build  *>> $logFile

Write-Host "Installing the app..."
Start-Process -FilePath ".\electron\dist\MD-Cloud-Desktop Setup 1.0.0.exe"

# Write-Host "Running Context Menu ..."
# Start-Process -FilePath ".\assets\scan_with_opswat.reg"