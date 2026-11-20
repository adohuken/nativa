@echo off
title Subir Nativa a GitHub
color 0A
echo ========================================================
echo          SUBIENDO PROYECTO NATIVA A GITHUB
echo ========================================================
echo Repositorio destino: https://github.com/adohuken/nativa
echo.
cd /d "C:\Users\DavidAbarca\Proyecto\English"

echo Ejecutando Git con Gestor de Credenciales Oficial...
"C:\Program Files\Git\cmd\git.exe" push -u origin main

echo.
echo ========================================================
if %ERRORLEVEL% EQU 0 (
    echo [EXITO TOTAL] El proyecto se subio exitosamente a:
    echo https://github.com/adohuken/nativa
) else (
    echo [ERROR] Hubo un problema al subir. Revisa el mensaje arriba.
)
echo ========================================================
pause
