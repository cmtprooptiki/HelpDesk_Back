#!/usr/bin/env bash
# WHO Health IQ - 6-month report runner (Linux / WSL / Git Bash).
#
# Intended to be invoked from cron on Jan 1 and Jul 1:
#     0 6 1 1,7 *  /absolute/path/to/HelpDesk/report/run_report.sh
#
# Exit codes:
#     0  success
#     1  report generation failed
#     2  missing config (see generate_report.py output)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Activate a venv if one exists next to the script. Optional - the script
# works fine with a system/global Python too.
if [ -f "$SCRIPT_DIR/.venv/bin/activate" ]; then
    # shellcheck disable=SC1091
    source "$SCRIPT_DIR/.venv/bin/activate"
fi

LOG_DIR="$SCRIPT_DIR/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/run_$(date +%Y%m%d_%H%M%S).log"

echo "[run_report.sh] Starting at $(date)"  | tee -a "$LOG_FILE"
python generate_report.py "$@" 2>&1 | tee -a "$LOG_FILE"
status=${PIPESTATUS[0]}

echo "[run_report.sh] Finished with status=$status at $(date)" | tee -a "$LOG_FILE"
exit "$status"
