@echo off
title HSRP Vision Startup Manager
echo ===================================================
echo   Starting HSRP Vision Project (YOLOv8 + CNN)
echo ===================================================
echo.

:: 1. Start the FastAPI Backend in a new window
echo [1/3] Starting Python Backend...
start "HSRP Backend" cmd /k "cd /d %~dp0 && call venv\Scripts\activate && cd backend && uvicorn main:app --reload"

:: 2. Start the React Frontend in a new window
echo [2/3] Starting React Frontend...
start "HSRP Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"

:: 3. Wait for 3 seconds to let the servers boot up, then open the browser
echo [3/3] Waiting for servers to initialize...
timeout /t 3 /nobreak >nul
start http://localhost:5173/

echo.
echo All services launched! You can minimize these windows.
echo Close the popup terminal windows to stop the servers later.