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
