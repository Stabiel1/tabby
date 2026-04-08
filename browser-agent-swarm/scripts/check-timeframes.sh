#!/usr/bin/env bash
set -euo pipefail

now_local="$(date '+%Y-%m-%d %H:%M:%S %Z')"
now_utc="$(date -u '+%Y-%m-%d %H:%M:%S UTC')"

next_utc="$(python3 - <<'PY'
from datetime import datetime, timedelta, timezone
now = datetime.now(timezone.utc)
next_run = now.replace(hour=9, minute=0, second=0, microsecond=0)
if next_run <= now:
    next_run += timedelta(days=1)
print(next_run.strftime("%Y-%m-%d %H:%M:%S UTC"))
PY
)"

cat <<EOF
=== Project Separation Check ===
Tabby project path: /workspace
Browser swarm path: /workspace/browser-agent-swarm

=== Timeframe Check ===
Current local time: $now_local
Current UTC time:   $now_utc
Swarm cron (UTC):   0 9 * * *
Next swarm run:     $next_utc

Tabby cadence:
- Continuous development/test workflows (manual or CI-triggered)

Swarm cadence:
- Daily autonomous browser run at 09:00 UTC via cron
EOF
