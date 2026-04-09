# AGENTS.md

## Cursor Cloud specific instructions

### Repository overview

This repo contains **two independent projects**:

| Project | Root | Stack |
|---------|------|-------|
| **Tabby** (AI coding assistant) | `/workspace` | Rust + Node.js (pnpm) |
| **Browser Agent Swarm** | `/workspace/browser-agent-swarm` | Node.js (npm) + Playwright + Docker |

See `.cursor/PROJECT_MAP.md` for the full layout.

### System dependencies (pre-installed in snapshot)

Tabby's Rust build needs these Ubuntu packages: `protobuf-compiler`, `libopenblas-dev`, `libssl-dev`, `pkg-config`, `cmake`, `libstdc++-14-dev`, `graphviz`, `sqlite3`.

A symlink is required for the C++ linker when using Clang:
```
/usr/lib/x86_64-linux-gnu/libstdc++.so -> /usr/lib/gcc/x86_64-linux-gnu/14/libstdc++.so
```
The snapshot already has this; if rebuilding the environment from scratch, recreate it with `sudo ln -sf`.

### Tabby — build / test / run

- **Build:** `cargo build` from repo root. Follow `CONTRIBUTING.md` for details.
- **Tests:** `cargo test -- --skip golden` (golden tests download models and are very slow on CPU).
  - Tests in `tabby-crawler` that hit external URLs will fail due to egress restrictions — skip with `--skip test_crawler_llms`.
  - Tests requiring `mailpit` SMTP server will also fail (`test_send_email`, `test_allow_self_signup`, etc.) — these are optional per `CONTRIBUTING.md`.
- **Lint (Node):** `pnpm lint` from repo root runs ESLint/Prettier across the pnpm workspace.
- **Node build:** `pnpm build` (runs turbo across all workspace packages including `tabby-ui`).
- **Update webserver UI assets:** `make update-ui` copies the built `tabby-ui` output into `ee/tabby-webserver/ui/`.
- **Run server:** The default config tries to download `Nomic-Embed-Text` from HuggingFace (blocked by egress restrictions). To bypass this, create `$TABBY_ROOT/config.toml` with an HTTP embedding config:
  ```toml
  [model.embedding.http]
  kind = "llama.cpp/embedding"
  api_endpoint = "http://localhost:9999"
  model_name = "placeholder"
  ```
  Then run: `TABBY_ROOT=/tmp/tabby_data cargo run -- serve --port 8081`
- **SQLite gotcha:** If you see "database is locked" on startup, delete any stale `dev-db.sqlite*` files under `$TABBY_ROOT/ee/` and retry with a fresh `TABBY_ROOT`.

### Browser Agent Swarm

- **Install:** `cd browser-agent-swarm && npm install`
- **Run tests:** `npm run test:swarm` (requires Docker and `.env` with credentials — see `browser-agent-swarm/README.md`).
- Swarm uses its own `package.json`; do **not** run `pnpm install` at the repo root for swarm deps.

### Git submodules

The repo includes `crates/llama-cpp-server/llama.cpp` as a submodule. Run `git submodule update --recursive --init` if it is not populated.
