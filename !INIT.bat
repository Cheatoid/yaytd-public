@echo off
rem cls
setlocal
cd /d "%~dp0"

set CACHE_DIR="yaytd-cache-repository"
if exist %CACHE_DIR% (
    echo Error: Cache repository already exists!
    rem exit /b 1
) else (
    gh repo create %CACHE_DIR% --confirm --enable-issues=false --enable-wiki=false --public
    gh repo clone %CACHE_DIR% %CACHE_DIR%
    gh repo view %CACHE_DIR% --web
    pushd "%CACHE_DIR%"
    git remote get-url origin >../remote.txt
    git fetch --all --prune
    git pull --ff-only
    git checkout -b main
    popd
)

:end
echo Press any key to end...
pause >nul
endlocal
