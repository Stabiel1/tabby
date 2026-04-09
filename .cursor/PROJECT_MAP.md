# Project map (Tabby + Browser Agent Swarm)

This repository contains **two independent projects**. Treat them as separate roots for edits, tooling, and runtime.

## Layout

| Area | Path | Purpose |
|------|------|---------|
| **Tabby** | `/workspace` (repo root) | Rust workspace (`Cargo.toml`, `crates/`, `ee/`), VSCode/clients, docs site (`website/`), CI (`ci/`) |
| **Browser Agent Swarm** | `/workspace/browser-agent-swarm` | Playwright swarm, Docker Compose, daily runner, Browserbase/`browse` CLI notes |

## Quick navigation

- **Tabby CLI / server:** `crates/tabby`, enterprise web in `ee/tabby-webserver`
- **Swarm setup:** `browser-agent-swarm/README.md`
- **Swarm stack:** `browser-agent-swarm/docker-compose.yml`, `browser-agent-swarm/swarm.spec.ts`
- **Swarm env template:** `browser-agent-swarm/.env.example`
- **Timeframe / schedule checks:** `browser-agent-swarm/scripts/check-timeframes.sh`, `browser-agent-swarm/swarm.yaml`

## Cursor rules

Machine-facing guidance lives in `.cursor/rules/*.mdc` (scopes via `globs` or `alwaysApply`).

## Do not mix

- Do not add swarm-only Docker/Playwright files at the Tabby repo root unless deliberately integrating (default: keep under `browser-agent-swarm/`).
- Do not run `npm install` at repo root expecting swarm deps; swarm uses `browser-agent-swarm/package.json`.
