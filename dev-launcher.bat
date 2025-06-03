@echo off
set FILE_PATH=%1

REM Navigate to project folder
cd /d D:\Projects\MD-Cloud-Desktop


REM Pass FILE_PATH as an argument to npm start
 npm run start  -- "%FILE_PATH%"