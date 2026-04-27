# WHO Health IQ - 6-Month DOCX Report Generator

Automated pipeline that pulls HelpDesk data from the `HelpDesk_Back` Express
API, asks Claude to write the narrative, and produces a professional Word
document suitable for WHO program leads.

```
HelpDesk/
├── HelpDesk_Back/        # Express backend (endpoints added in controllers/reports.js)
├── HelpDesk_Front/
└── report/               # <-- this folder
    ├── generate_report.py
    ├── requirements.txt
    ├── .env.example
    ├── run_report.sh     # Linux / WSL / Git Bash
    ├── run_report.bat    # Windows
    ├── schedule_windows.md
    └── out/              # generated DOCX + snapshots (created on first run)
```

## 1. Backend endpoints added

Four new GET endpoints, all behind `verifyUser + adminOnly`:

| Endpoint                                | Purpose                                          |
|-----------------------------------------|--------------------------------------------------|
| `GET /reports/summary?from&to`          | Totals + status/severity/category breakdowns     |
| `GET /reports/by-organization?from&to`  | Per-org totals, statuses, severities             |
| `GET /reports/trends?months=6`          | Monthly counts for last N months (zero-filled)   |
| `GET /reports/full-export?from&to`      | Flat JSON of issues + joined org/category names  |

The existing `GET /reports/assistant` and `POST /reports/analyze` are
**not** touched.

Dates are filtered against `createdAt` (always populated by Sequelize). The
report period is passed as `from=YYYY-MM-DD&to=YYYY-MM-DD`.

## 2. First-time setup

### Python environment

```powershell
cd "D:\React Projects\HelpDesk\report"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

(Linux/Mac: `python3 -m venv .venv && source .venv/bin/activate`.)

### Configure credentials

```powershell
copy .env.example .env
notepad .env
```

Fill in:

- `ANTHROPIC_API_KEY` - your Claude API key (starts with `sk-ant-...`)
- `HELPDESK_BASE_URL` - defaults to `http://localhost:5000`
- `HELPDESK_EMAIL` / `HELPDESK_PASSWORD` - an admin user; the script logs
  in with `POST /login` and reuses the session cookie

`.env` is in `.gitignore` so your key is never committed.

### Alternative: system-level env var

If you prefer not to use a `.env` file, set the key in Windows once:

```powershell
setx ANTHROPIC_API_KEY "sk-ant-..."
```

Then open a fresh terminal. The script will pick it up through
`os.environ`, since `load_dotenv` does not override real env vars.

## 3. Running it

Make sure HelpDesk_Back is running (`npm start` inside `HelpDesk_Back`),
then:

```powershell
# Auto-detect the current half-year
python generate_report.py

# Explicit half-year
python generate_report.py --half H1 --year 2026

# Arbitrary range
python generate_report.py --from 2026-01-01 --to 2026-06-30 --label 2026-H1
```

Output:

```
report\out\HealthIQ_Report_2026-H1.docx   # the report
report\out\snapshot_2026-H1.json          # used by the NEXT run's "comparison" section
report\logs\run_YYYYMMDD_HHMMSS.log       # when invoked via run_report.bat / .sh
```

> When you open the `.docx`, right-click the table of contents and choose
> **Update Field** so page numbers populate. Word can only compute page
> numbers after it lays out the document.

## 4. What's in the report

1. Cover page (title, period, generation timestamp)
2. Table of contents (auto-populated on first open)
3. Executive summary *(Claude)*
4. Summary statistics - totals, status/severity/category tables + charts
5. Trend over time - line chart + month-by-month table
6. Key findings *(Claude)*
7. Per-organization breakdown - bar chart + table + commentary *(Claude)*
8. Comparison vs previous period - numeric delta + commentary *(Claude)*
9. Recommendations *(Claude)*
10. Appendix: raw data table (ID, date, org, category, severity, status, description)

## 5. Automation

- **Windows**: use Task Scheduler with `run_report.bat` - see
  [`schedule_windows.md`](./schedule_windows.md).
- **Linux/Mac**: add this line to `crontab -e`:
  ```
  0 6 1 1,7 *  /path/to/HelpDesk/report/run_report.sh
  ```
  Runs at 06:00 on January 1 and July 1 every year.

## 6. Disabled by default (stubs)

Per current project config, both of these are stubbed and log a `[skip]`
message. Uncomment and configure when you're ready:

- **Google Drive upload**: `upload_to_google_drive()` in
  `generate_report.py`. Needs `google-api-python-client`, a service-account
  JSON, and a `DRIVE_FOLDER_ID` env var.
- **Email notification**: `send_email_notification()` in
  `generate_report.py`. Needs `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS`/
  `NOTIFY_TO` env vars.

## 7. Troubleshooting

| Symptom                             | Likely cause / fix                                              |
|-------------------------------------|-----------------------------------------------------------------|
| `Login failed (404)`                | `HELPDESK_EMAIL` has no matching user                           |
| `Login failed (400)`                | Wrong `HELPDESK_PASSWORD`                                       |
| `GET /reports/summary failed (403)` | User exists but `role` is not `admin`                           |
| `Missing required env vars: ...`    | Forgot to copy/edit `.env`                                      |
| Empty DOCX sections                 | Claude API call failed - check `ANTHROPIC_API_KEY` and the log  |
| TOC page is empty                   | Open in Word, right-click TOC -> Update Field                   |
| Chart missing in DOCX               | That breakdown returned zero rows for the period                |
