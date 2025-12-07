@echo off
echo ======================================
echo   Auto Git Commit and Push Script
echo ======================================
echo.

REM Ask for commit message
set /p MSG=Enter commit message (leave empty for default): 

REM Use default message if user pressed Enter with no text
if "%MSG%"=="" set MSG=Auto commit %date% %time%

echo.
echo Staging all changes...
git add .

echo.
echo Committing with message: "%MSG%"
git commit -m "%MSG%"

echo.
echo Pushing to remote 'origin' on branch 'main'...
git push origin main

echo.
echo Done!
pause