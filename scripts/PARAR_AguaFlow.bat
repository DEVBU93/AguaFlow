@echo off
title AguaFlow — Parando servicios...
color 0C
cls
echo.
echo  ████████████████████████████████████████
echo   AGUA FLOW — Parando servicios
echo  ████████████████████████████████████████
echo.

set "PROJECT_DIR=%~dp0"
if exist "%PROJECT_DIR%backend\package.json" ( set "ROOT=%PROJECT_DIR%" ) else ( set "ROOT=%PROJECT_DIR%.." )

taskkill /F /FI "WINDOWTITLE eq *AguaFlow*" >nul 2>&1
echo  [OK] Procesos Node parados

cd /d "%ROOT%"
docker-compose stop postgres >nul 2>&1
echo  [OK] PostgreSQL AguaFlow parado

echo.
echo  ✅ AguaFlow parado correctamente.
timeout /t 3 /nobreak >nul
exit
