# `vp lint` runs an oxlint from a parent directory

`app/` is a Vite+ project (`vite-plus` 1.2.0). It does not install `oxlint`
itself. The folder above it stands for a parent checkout (for example the main
checkout that holds a git worktree): it has its own `node_modules/oxlint`
(1.60.0) and its own `.oxlintrc.json`.

`vp lint` should run the oxlint that `vite-plus` ships (1.88.0). It runs the
parent's 1.60.0 instead. That old oxlint then also applies the parent's
`.oxlintrc.json`, so the `lint.overrides` in `app/vite.config.ts` are ignored.

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

- `vp lint --version` prints `Version: 1.88.0`.
- `vp lint src` reports one error, in `src/new.js`. The override turns
  `no-debugger` off for `src/legacy/**`.

## Actual

- `vp lint --version` prints `Version: 1.60.0`.
- `vp lint src` reports two errors: `src/new.js` and `src/legacy/old.js`.
- `vp lint -c vite.config.ts src` reports one error, as expected, because
  `--config` turns off nested config discovery.

Delete the parent's `node_modules` and `vp lint src` reports one error again.

## Versions

- vite-plus 1.2.0 (latest on npm), oxlint 1.88.0 (shipped with it)
- oxlint 1.60.0 in the parent directory. The overrides are ignored with a
  parent oxlint up to 1.61.0; from 1.62.0 they apply, but `vp lint` still runs
  the parent's oxlint.
- Node 24.17.0, pnpm 12.11.2, Linux x64
