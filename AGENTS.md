# AGENTS.md

Instructions for **AI coding agents** and automation working in this repository (including Cursor Cloud). Human contributors should still read `CONTRIBUTING.md` and product docs.

## Repository overview

This repo contains **two independent projects**. Do not mix their tooling or file layout.

| Project | Root | Stack |
|---------|------|-------|
| **Tabby** (self-hosted AI coding assistant) | `/workspace` (repo root) | Rust workspace + pnpm/Turbo (website, VS Code extension, etc.) |
| **Browser Agent Swarm** | `/workspace/browser-agent-swarm` | npm + Playwright + Docker |

- **Full path map:** `.cursor/PROJECT_MAP.md`
- **Cursor rules (machine-facing):** `.cursor/rules/*.mdc` — always respect `project-layout.mdc` (Tabby vs swarm scoping).

### Scoping

- **Tabby work:** `crates/`, `ee/`, `clients/`, `website/`, `python/`, `ci/`, root `Cargo.toml`, root `package.json` (pnpm workspace). Primary build: `cargo` from repo root.
- **Swarm work:** Only under `browser-agent-swarm/`. Use **npm** there, not pnpm at the repo root.
- If the task mentions swarm, Playwright, Grok, Browserbase, or Docker Compose for the browser agent, **default to `browser-agent-swarm/`** unless the user explicitly asks to integrate with Tabby.

## System dependencies (pre-installed in typical cloud snapshots)

Tabby’s Rust build often needs Ubuntu packages such as: `protobuf-compiler`, `libopenblas-dev`, `libssl-dev`, `pkg-config`, `cmake`, `libstdc++-14-dev`, `graphviz`, `sqlite3`.

When using Clang as the C++ linker, a symlink may be required:

```text
/usr/lib/x86_64-linux-gnu/libstdc++.so -> /usr/lib/gcc/x86_64-linux-gnu/14/libstdc++.so
```

Many snapshots already include this; if you rebuild the environment from scratch, recreate it with `sudo ln -sf` as needed.

## Tabby — build, test, lint

- **Build:** `cargo build` from repo root. See `CONTRIBUTING.md` for dependency details.
- **Tests (agent-friendly default):** `cargo test -- --skip golden` — golden tests download models and are very slow on CPU.
  - **External URL / crawler tests:** may fail when egress is restricted — skip with `--skip test_crawler_llms`.
  - **mailpit SMTP tests:** optional locally (`test_send_email`, `test_allow_self_signup`, etc.); see `CONTRIBUTING.md`.
- **CI-style focused tests** (when you only touched the `tabby` binary crate): `cargo test --doc`, then `cargo test --bin tabby --no-default-features`, then `cargo test --bin tabby --lib` (matches `.github/workflows/test-rust.yml` for PRs).
- **Node:** Root `package.json` is a **pnpm** workspace (Turbo). Use `pnpm install`, `pnpm lint`, `pnpm build`. Requires Node ≥ 18 and pnpm ≥ 9 per `package.json` `engines`.
- **Webserver UI assets:** `make update-ui` copies built `tabby-ui` output into `ee/tabby-webserver/ui/`.
- **Rust autofix / style (optional):** `make fix` (used in CI autofix workflow) runs formatting and related fixes; requires a suitable nightly toolchain if you mirror CI.

### Running the Tabby server in restricted environments

The default config may try to download `Nomic-Embed-Text` from Hugging Face (often blocked by egress). Use an HTTP embedding stub in `$TABBY_ROOT/config.toml`:

```toml
[model.embedding.http]
kind = "llama.cpp/embedding"
api_endpoint = "http://localhost:9999"
model_name = "placeholder"
```

Then run: `TABBY_ROOT=/tmp/tabby_data cargo run -- serve --port 8081`

### SQLite

If you see `database is locked` on startup, remove stale `dev-db.sqlite*` files under `$TABBY_ROOT/ee/` and retry with a fresh `TABBY_ROOT`.

## Browser Agent Swarm

- **Install:** `cd browser-agent-swarm && npm install`
- **Tests:** `npm run test:swarm` (Playwright; needs Docker and `.env` — see `browser-agent-swarm/README.md`)
- **Schedule check:** `npm run check:timeframes` (reads `swarm.yaml`)
- **Daily runner / compose / Browserbase:** `browser-agent-swarm/README.md`
- **Secrets:** Put keys in `.env` (or your env provider); never commit credentials.

## Git submodules

`crates/llama-cpp-server/llama.cpp` is a submodule. If it is empty:

```bash
git submodule update --recursive --init
```

## Safety and hygiene

- Keep changes **scoped** to the project (Tabby vs swarm) that the task targets.
- Do not commit secrets, API keys, or machine-specific paths.
- Prefer matching existing patterns (imports, naming, CI expectations) over drive-by refactors.
