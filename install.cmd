@ECHO OFF
SET ThisScriptsDirectory=%~dp0
SET PowerShellScriptPath=%ThisScriptsDirectory%install.ps1

IF "%1"=="-apikey" (
    IF NOT "%2"=="" (
        PowerShell -NoProfile -ExecutionPolicy Bypass -Command "& '%PowerShellScriptPath%' -apikey '%2'"
    ) ELSE (
        ECHO Error: API key value not provided
        EXIT /B 1
    )
) ELSE (
    PowerShell -NoProfile -ExecutionPolicy Bypass -Command "& '%PowerShellScriptPath%'"
)