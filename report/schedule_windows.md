# Scheduling the report on Windows

Your project lives on Windows (`D:\React Projects\HelpDesk`), so cron is
not available natively. Use **Task Scheduler** to invoke `run_report.bat`
twice a year.

## One-off: test the script manually first

Open PowerShell in the `report` folder and run:

```powershell
cd "D:\React Projects\HelpDesk\report"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env   # then edit .env with real values
.\run_report.bat
```

The `.docx` and the snapshot JSON will land in `report\out\`.

## Scheduled: create two Task Scheduler tasks

Option A - GUI (recommended on Windows 11):

1. Open **Task Scheduler** -> **Create Task** (not "Basic Task").
2. **General** tab:
   - Name: `WHO Health IQ Report - H1`
   - Select "Run whether user is logged on or not"
   - Check "Run with highest privileges"
3. **Triggers** tab -> **New**:
   - Begin the task: On a schedule
   - Monthly
   - Months: **January**
   - Days: **1**
   - Start: **06:00:00**
4. **Actions** tab -> **New**:
   - Action: Start a program
   - Program/script: `D:\React Projects\HelpDesk\report\run_report.bat`
   - Start in: `D:\React Projects\HelpDesk\report`
5. **Conditions** / **Settings**: leave defaults (or disable "Start only on AC
   power" on a laptop).
6. Save. Enter the Windows password when prompted.
7. Repeat all steps for a second task `WHO Health IQ Report - H2` with
   **Months: July, Day: 1** (same time, same action).

Option B - one-liner via `schtasks` (run each command in an elevated
PowerShell / cmd):

```
schtasks /Create /SC MONTHLY /MO 1 /D 1 /M JAN /TN "WHO Health IQ Report - H1" ^
    /TR "\"D:\React Projects\HelpDesk\report\run_report.bat\"" /ST 06:00 /RL HIGHEST /F

schtasks /Create /SC MONTHLY /MO 1 /D 1 /M JUL /TN "WHO Health IQ Report - H2" ^
    /TR "\"D:\React Projects\HelpDesk\report\run_report.bat\"" /ST 06:00 /RL HIGHEST /F
```

## Scheduling on Linux / macOS (cron)

Put this in `crontab -e`:

```
# Runs at 06:00 on Jan 1 and Jul 1 each year
0 6 1 1,7 * /absolute/path/to/HelpDesk/report/run_report.sh
```

## Verifying a scheduled run

- Each run writes a full log under `report\logs\run_YYYYMMDD_HHMMSS.log`.
- The `.docx` lands in `report\out\HealthIQ_Report_YYYY-H1.docx`
  (or H2).
- A snapshot JSON (`snapshot_YYYY-H1.json`) is written next to it and used
  by the NEXT run for the "Comparison vs previous period" section.
