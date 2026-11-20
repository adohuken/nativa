@echo off
title Subir Nativa a GitHub con Token
color 0B
echo ========================================================
echo       SUBIR NATIVA A GITHUB (CON TOKEN PERSONAL)
echo ========================================================
echo Si tu navegador no abre la ventana de GitHub automaticamente,
echo puedes generar un Token personal en:
echo https://github.com/settings/tokens (permiso: 'repo')
echo.
set /p GH_TOKEN="Pega tu Personal Access Token aqui y presiona Enter: "

if "%GH_TOKEN%"=="" (
    echo No ingresaste ningun token. Operacion cancelada.
    pause
    exit /b
)

echo.
echo Subiendo proyecto a https://github.com/adohuken/nativa ...
cd /d "C:\Users\DavidAbarca\Proyecto\English"
"C:\Program Files\Git\cmd\git.exe" remote set-url origin https://adohuken:%GH_TOKEN%@github.com/adohuken/nativa.git
"C:\Program Files\Git\cmd\git.exe" push -u origin main

echo.
echo ========================================================
if %ERRORLEVEL% EQU 0 (
    echo [EXITO TOTAL] Todo el proyecto Nativa fue subido a:
    echo https://github.com/adohuken/nativa
) else (
    echo [ERROR] Verifica que el token tenga permiso 'repo' y que no haya expirado.
)
echo ========================================================
pause
