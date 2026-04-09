@echo off
title FreeCode Web IDE - Launcher
color 0B

echo ========================================================
echo        FreeCode Web IDE + Local Proxy Launcher
echo ========================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

:: 2. Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm is not installed or not in PATH!
    echo Please make sure npm is installed alongside Node.js.
    echo.
    pause
    exit /b 1
)

:: 3. Install dependencies if node_modules doesn't exist
if not exist "node_modules\" (
    echo [INFO] First time setup: Installing dependencies...
    echo This may take a few minutes. Please wait...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to install dependencies! Please check your internet connection.
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencies installed!
    echo.
)

:: 4. Start the application
echo [INFO] Starting FreeCode Web IDE and Proxy Server...
echo [INFO] Both services will run in this window. Press Ctrl+C to stop them.
echo.
call npm start

pause