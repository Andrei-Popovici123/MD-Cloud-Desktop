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
    # create and set root directory .env
    $envFile = Join-Path $rootDir ".env"
    if (-not (Test-Path $envFile)) {
        "OPSWAT_API_KEY=$apikey" | Set-Content -Path $envFile -NoNewline
        Write-Host "Created new .env file with API key"
    } else {
        $envContent = Get-Content $envFile -Raw
        $updatedContent = $envContent -replace "OPSWAT_API_KEY=.*", "OPSWAT_API_KEY=$apikey"
        Set-Content -Path $envFile -Value $updatedContent -NoNewline
        Write-Host "API key has been updated in .env file"
    }

    # create and set backend .env
    $backendEnvFile = Join-Path $PSScriptRoot "backend\.env"
    if (-not (Test-Path $backendEnvFile)) {
        "OPSWAT_API_KEY=$apikey" | Set-Content -Path $backendEnvFile -NoNewline
        Write-Host "Created new backend .env file with API key"
    } else {
        $backendEnvContent = Get-Content $backendEnvFile -Raw
        $updatedBackendContent = $backendEnvContent -replace "OPSWAT_API_KEY=.*", "OPSWAT_API_KEY=$apikey"
        Set-Content -Path $backendEnvFile -Value $updatedBackendContent -NoNewline
        Write-Host "API key has been updated in backend .env file"
    }
    
    Write-Host "API key has been set in all .env files"
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