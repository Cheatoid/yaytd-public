@echo off
rem cls
setlocal
cd /d "%~dp0"

set CACHE_DIR="yaytd-cache-repository"
pushd "%CACHE_DIR%"
git branch --move --force main
git fetch --all --prune
git pull --ff-only
git add --all
git commit -a --allow-empty-message -m ""
git push origin main --set-upstream
popd

echo Press any key when you are done looking at this...
pause >nul
endlocal
