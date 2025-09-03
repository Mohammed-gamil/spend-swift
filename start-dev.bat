@echo off
echo Starting PR Management System Development Server...
echo.
echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo Checking npm installation...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo Starting Vite development server...
echo Vite will automatically open your browser.
echo.
npx vite --host 0.0.0.0
pause
