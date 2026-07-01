# PR checklist

A pass through this before every PR. Each item lists _what_ to do, _how_ to verify, and _why_ it matters. If you don't understand the why, ask before merging — the why is the part you'll need on the next PR.

---

## 1. Plan (before you write code)

- **Scope is one thing.** Am I solving one problem in this PR? Unrelated refactors, renames, and "while I'm here" cleanups go in a separate PR.
  _Why:_ mixed PRs are slow to review and risky to revert.

- **Component lives in the right place.** Used by one page → `src/routes/.../components/`. Used by 2+ pages → `src/lib/components/custom/`. shadcn primitives → `src/lib/components/ui/` (never write here by hand).
  _Why:_ the file structure is the only navigation we have.

- **Util / helper / store lives in the right place.** Used by one page → next to it as `src/routes/.../<name>.ts` (or `.svelte.ts` if it uses runes). Used by 2+ pages → `src/lib/utils.ts` for pure helpers, `src/lib/hooks/` for rune-based hooks, `src/lib/stores/` for shared reactive state, `src/lib/types/` for shared types.
  _Why:_ a helper that quietly grows into a second consumer is the start of duplication — promote it to `src/lib/` the moment a second page needs it, don't copy-paste.

- **Reuse before invent.** Is there already a shadcn primitive (`Button`, `Dialog`, `Drawer`, `DataTable`, …) or a custom component that fits? Check `.claude/shadcn-svelte-docs.md` and `src/lib/components/custom/`.
  _Why:_ every duplicated abstraction is a future inconsistency.

- **New dependency?** Ask before installing.
  _Why:_ `pnpm-lock.yaml` churn and bundle weight need a decision, not a default.

## 2. Build (while you code)

- **Follow Svelte 5 runes.** `$state`, `$derived`, `$effect`, `$props`. Use `{@render children()}`, never `<slot/>`. Destructure props with `let` (not `const`) so they stay reactive in closures.
  _Verify:_ run `mcp__svelte__svelte-autofixer` on every changed `.svelte` file until it reports zero issues.
  _Why:_ `const` destructuring captures the initial prop value — `state_referenced_locally` warnings are real bugs.

- **No hardcoded strings.** Every user-facing string goes through `m.*()` from `$lib/paraglide/messages.js`. Add keys to all three locales: `messages/en.json`, `messages/cs.json`, `messages/de.json`.
  _Verify:_ `pnpm exec paraglide-js compile` succeeds; switch the language picker — does every word change?
  _Why:_ shipping `'Loading…'` instead of `m.loading()` ships English to Czech users.

- **No hardcoded colors.** Use design tokens (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, `text-destructive`, …) — never `bg-white`, `text-gray-700`.
  _Verify:_ search your diff for hex codes, `bg-white`, `text-black`, `bg-gray-`.
  _Why:_ tokens flip automatically in dark mode; hex codes don't.

- **Dates and times use `Intl`.** Format with `new Intl.DateTimeFormat(localeState.current, { dateStyle, timeStyle })`. Never `Date.toString()` or `toLocaleDateString('en-US', …)`.
  _Why:_ `Tue Mar 05 2026 14:23:45 GMT+0100` is not a UI string. A Czech user expects `5. 3. 2026`.

- **Filter / sort / page state lives in the URL.** Use `sveltekit-search-params` (`createLogsParams` is the pattern). Never store filters in component `$state` only.
  _Why:_ refresh-safe, deep-linkable, browser back/forward works.

- **Personal preferences live in `localStorage`.** Column visibility, theme, sidebar collapsed — gate reads with `if (browser)` from `$app/environment`.
  _Why:_ SSR / `adapter-static` will crash if you touch `localStorage` at module load.

- **Loading, empty, error.** Every data view needs all three. Initial load → skeletons. Refetch with rows on screen → dim with `opacity-60`. No rows → "No results" message. Network error → visible state, not a silent empty.
  _Verify:_ simulate slow network in devtools; clear all rows; kill the fetch.
  _Why:_ "it works on my machine with cached data" is the most common PR regression.

- **Accessibility basics.** Icon-only buttons get `aria-label`. Images get `alt`. Form inputs have labels. Clickable rows that look like rows but trigger actions need a `role` or keyboard handler.
  _Why:_ screen readers and keyboard users are real users.

- **Comments explain _why_, not _what_.** If your comment restates the code, delete it. Keep comments that flag hidden constraints, workarounds, or non-obvious decisions.
  _Why:_ `// loop over the items` ages into noise; `// reset cursor — old cursor points into the pre-filter list` survives a refactor.

## 3. Ship (before you push)

- **Format.** `pnpm format`
- **Lint.** `pnpm lint` — no errors, no warnings.
- **Type check.** `pnpm check` — no errors in the files you touched. (Pre-existing errors in untouched files are not yours to fix.)
- **Build.** `pnpm build` — succeeds.
- **Manual smoke test.** Open the page in the browser. Test the golden path AND one edge case. UI changes that only pass type checks are not verified.
- **Diff review.** `git diff` — read every line. Is there debug code, `console.log`, commented-out blocks, unrelated whitespace? Delete it.
- **Title and description.** PR title under 70 chars, describes the _outcome_. Description explains _why_, lists the files of interest, and notes anything reviewers should test.

---

## Never

- **Never edit `src/lib/components/ui/`** — these are generated. To change one, regenerate: `pnpm dlx shadcn-svelte@latest add <component>`.
- **Never use `// @ts-ignore` or `// eslint-disable`** without a comment explaining the exact reason and a link to an issue.
- **Never commit `.env`, `*.local`, credentials**, or anything `gitignore` is supposed to catch.
- **Never push to `main` directly.** PRs only.
- **Never skip hooks** (`--no-verify`, `--no-gpg-sign`) — if a hook fails, fix the cause.
- **Never `git push --force` on a shared branch.** Force only your own feature branches, and prefer `--force-with-lease`.
- **Never bundle "drive-by" refactors** into a feature PR. Open a separate PR.

---

## Command cheat sheet

| Task                      | Command                                    |
| ------------------------- | ------------------------------------------ |
| Format files              | `pnpm format`                              |
| Lint                      | `pnpm lint`                                |
| Type check                | `pnpm check`                               |
| Dev server                | `pnpm dev`                                 |
| Production build          | `pnpm build`                               |
| Recompile translations    | `pnpm exec paraglide-js compile`           |
| Regenerate `$app/*` types | `pnpm exec svelte-kit sync`                |
| Re-add a shadcn primitive | `pnpm dlx shadcn-svelte@latest add <name>` |
