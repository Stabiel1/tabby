# Browser Agent Swarm (separate from Tabby)

This project is intentionally isolated from the Tabby codebase.

- **Tabby root:** `/workspace`
- **Browser Agent Swarm root:** `/workspace/browser-agent-swarm`

The Swarm project has its own dependencies, runtime files, schedule, and persistent data.

## 1) Setup

```bash
cd /workspace/browser-agent-swarm
npm install
cp .env.example .env
```

Update `.env` with real affiliate links.

## Optional: Browserbase (remote browser via `browse` CLI)

The official Cursor/agent skill lives at [browserbase.com/SKILL.md](https://browserbase.com/SKILL.md).  
If that URL is unreachable in your environment, the same content is in the open repo: [skills/browser/SKILL.md](https://github.com/browserbase/skills/blob/main/skills/browser/SKILL.md).

### Install CLI

```bash
which browse || npm install -g @browserbasehq/browse-cli
```

### Credentials

1. Sign in at [browserbase.com](https://www.browserbase.com/) and open **Settings** (API key) / **Overview** (project id if needed).
2. Export for remote sessions:

```bash
export BROWSERBASE_API_KEY="your_api_key"
# Optional if your setup documents a project id:
# export BROWSERBASE_PROJECT_ID="your_project_id"
```

You can copy the variable names into `.env` (see `.env.example`); load them in your shell before running `browse`, or use your orchestrator’s secret store.

### Local vs remote

- **Local:** no `BROWSERBASE_API_KEY` — `browse` uses local Chrome/Chromium when you use local mode.
- **Remote (Browserbase):** set `BROWSERBASE_API_KEY`, then e.g. `browse env remote` for stealth, CAPTCHAs, and residential proxies per the skill doc.

Useful checks from the skill:

```bash
browse env remote    # switch session to Browserbase (needs API key)
browse status
browse open https://example.com
browse snapshot
browse stop
```

This repo’s Playwright swarm (`docker-compose`, `swarm.spec.ts`) and the `browse` CLI are separate runtimes; use Browserbase where you want natural-language or remote-stealth automation alongside or instead of the containerized Playwright flow.

## 2) Bring up persistent container

```bash
cd /workspace/browser-agent-swarm
docker-compose up -d
```

## 3) One-time login to persist Grok session

```bash
docker exec -it supergrok-swarm npx playwright codegen https://grok.x.ai
```

Log in manually, then close the browser tab. Storage state is persisted in `/workspace/browser-agent-swarm/data`.

## 4) Run the swarm manually

```bash
cd /workspace/browser-agent-swarm
npm run test:swarm
```

## 5) Set daily schedule

```bash
crontab -e
```

Add:

```cron
0 9 * * * docker exec supergrok-swarm node /app/run-daily.js
```

## 6) Verify timeframe separation

```bash
cd /workspace/browser-agent-swarm
npm run check:timeframes
node run-daily.js --dry-run
```

This confirms:
- local vs UTC time
- next Swarm run at **09:00 UTC**
- clear cadence separation between Tabby and Swarm workflows
