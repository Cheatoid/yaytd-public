@echo off
cls
setlocal
cd /d "%~dp0"

echo You should only run this in case your local cache is messed up!
echo Press any key to proceed; otherwise, close this window (CTRL+C).
pause >nul

set CACHE_DIR="yaytd-cache-repository"
pushd "%CACHE_DIR%"
git stash clear
git reset --hard HEAD
popd

echo Amen to that...
pause >nul
endlocal
