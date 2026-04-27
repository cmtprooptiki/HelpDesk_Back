@echo off
REM WHO Health IQ - 6-month report runner (Windows).
REM Scheduled via Task Scheduler (see schedule_windows.md).

setlocal
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

REM Activate a local venv if present - optional.
if exist "%SCRIPT_DIR%.venv\Scripts\activate.bat" (
    call "%SCRIPT_DIR%.venv\Scripts\activate.bat"
)

if not exist "%SCRIPT_DIR%logs" mkdir "%SCRIPT_DIR%logs"

REM Timestamped log: YYYYMMDD_HHMMSS
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value ^| find "="') do set DT=%%I
set STAMP=%DT:~0,8%_%DT:~8,6%
set LOG_FILE=%SCRIPT_DIR%logs\run_%STAMP%.log

echo [run_report.bat] Starting at %date% %time% >> "%LOG_FILE%"
python generate_report.py %* >> "%LOG_FILE%" 2>&1
set STATUS=%ERRORLEVEL%
echo [run_report.bat] Finished with status=%STATUS% at %date% %time% >> "%LOG_FILE%"

exit /b %STATUS%
