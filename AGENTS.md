# 311 Watch Repository Guidelines

## Purpose

`311-watch` is an Expo Router app for exploring a 311-style civic monitoring experience.

The codebase is small, TypeScript-first, and organized around a few clear layers:

- `app/` for routes and layout wiring
- `components/` for reusable UI building blocks
- `features/` for screen-level behavior and domain state
- `hooks/` for shared React hooks
- `lib/` for API clients, normalization, and lower-level utilities

Keep new code inside the smallest layer that fits the job.

## Build, Lint, Test

Install dependencies:

```bash
npm install
```

Start the Expo dev server:

```bash
npm run start
```

Run on a specific platform:

```bash
npm run android
npm run ios
npm run web
```

Lint the project:

```bash
npm run lint
```

Run the test suite:

```bash
npm run test
```

Run one test file:

```bash
npm run test -- --runInBand path/to/file.test.tsx
```

Run one test by name:

```bash
npm run test -- -t "test name"
```

Type-check the app:

```bash
npm run typecheck
```

Notes:

- There is no dedicated production build script in `package.json` yet.
- For local verification, prefer `npm run lint` plus `npm run typecheck` before assuming changes are safe.
- Keep any future build command documented here if the project adds one.

## Code Style

- Use strict TypeScript patterns; avoid `any` unless there is no reasonable alternative.
- Prefer explicit exported `type` aliases for props, API shapes, and normalized domain objects.
- Keep functions small and single-purpose.
- Use guard clauses early instead of nested branching when validating data.
- Return `null` from normalizers or render helpers when data is unusable rather than throwing.
- Keep user-facing error strings short, factual, and actionable.
- Use named exports by default for components, hooks, and utilities.
- Use default exports only for Expo Router route files such as `app/index.tsx` or `app/_layout.tsx`.

## Imports

- Prefer aliased imports with `@/` for cross-folder imports.
- Keep relative imports for nearby files only, especially inside `app/`, `components/`, `hooks/`, and `lib/`.
- Place external imports before internal imports.
- Keep type-only imports explicit with `import type`.
- Do not introduce barrel files unless they remove real duplication.

## Formatting

- Use 2 spaces for indentation.
- Use single quotes.
- Keep semicolons.
- Preserve trailing commas where the formatter emits them.
- Keep JSX readable and favor small, focused components over large inline trees.
- Prefer concise helper functions over deeply nested inline expressions.

## Naming Conventions

- Components: `PascalCase`.
- Hooks: `useSomething`.
- Functions, variables, and object keys: `camelCase`.
- Files: `kebab-case` for components, hooks, and utilities unless the framework requires otherwise.
- Route files under `app/` should follow Expo Router conventions and keep names simple.
- Tests should name the behavior under test, not the implementation detail.

## React Native And Expo

- Keep route files thin; move stateful or reusable logic into `components/`, `features/`, `hooks/`, or `lib/`.
- Prefer Expo-compatible packages and documented install paths.
- Use `className` with NativeWind where the file already follows that pattern.
- Keep UI smoke-testable on a small screen first.
- Avoid introducing new native dependencies unless they are clearly needed.

## Data And Error Handling

- Normalize external API data in `lib/` before it reaches the UI.
- Treat remote fields as optional until they are validated.
- Prefer returning a typed fallback or `null` over throwing from parsing and normalization code.
- Surface failures in the UI with a clear retry path when the user can recover.
- Keep fetch and timeout behavior encapsulated in the client layer.

## Testing Guidelines

- Place tests next to the feature area when that is the clearest structure.
- Use React Native Testing Library for UI behavior.
- Keep tests deterministic and focused on observable output.
- When a feature touches parsing or API normalization, add coverage for both happy-path and invalid input.
- For hook-heavy logic, test the resulting state or rendered output instead of implementation details.
- Prefer one assertion story per test when possible.

## Commit And PR Style

- Recent history uses short, imperative commit subjects.
- Keep commits focused on one logical change.
- Mention any new scripts, setup steps, or platform caveats in the PR description.
- Include screenshots only for UI changes.
- Call out skipped tests explicitly instead of leaving them implied.

## Agent Notes

- Check the repo for new scripts or conventions before making larger changes.
- Keep changes minimal and aligned with the existing app shape.
- If you add a new toolchain, update this file in the same change.
- No `.cursor/rules/` or `.github/copilot-instructions.md` files are present in this repository at the time this guide was written.
