# `vp lint` runs an oxlint from a parent directory

- `app/`: Vite+ project (`vite-plus` 1.2.0), no `oxlint` of its own. `vite.config.ts` turns `no-debugger` off for `src/legacy/**`.
- Parent folder: `node_modules/oxlint` 1.60.0 + its own `.oxlintrc.json` (stands for e.g. the main checkout around a git worktree).

## Run

```sh
pnpm install            # parent: oxlint 1.60.0
cd app
pnpm install            # app: vite-plus 1.2.0
./node_modules/.bin/vp lint --version
./node_modules/.bin/vp lint src
./node_modules/.bin/vp lint -c vite.config.ts src
```

## Expected

- `--version`: `Version: 1.88.0` (the bundled oxlint).
- `vp lint src`: 1 error, `src/new.js`.

## Actual

- `--version`: `Version: 1.60.0` (the parent's).
- `vp lint src`: 2 errors, `src/new.js` + `src/legacy/old.js` — the override is ignored.
- `-c vite.config.ts`: 1 error (`--config` turns off nested config lookup).
- Delete the parent's `node_modules` → 1 error again.

## Versions

- vite-plus 1.2.0 (bundles oxlint 1.88.0).
- Parent oxlint 1.60.0. Up to 1.61.0 the overrides are ignored; from 1.62.0 they apply, but the parent's oxlint still runs.
- Node 24.17.0, pnpm 12.11.2, Linux x64. Also reproduced on Windows.
