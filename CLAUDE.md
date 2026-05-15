## Project Configuration

- **Language**: TypeScript
- **Package Manager**: pnpm
- **Add-ons**: prettier, eslint, tailwindcss, sveltekit-adapter, mcp

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

---

## Project Context

This is a rewrite of an existing React CRM. We are replicating pages
but visually and structurally improving them using SvelteKit + shadcn-svelte.
YOU DONT HAVE TO COPY THE EXISTING STYLES OR COMPONENTS OR LAYOUT, FROM SOURCE IMAGES YOU HAVE TO JUST GRASP WHAT SHOULD BE ON THE PAGE AND THEN REWORK HOW IT SHOWN TO CLEAN MINIMALISTIC SIMPLE SHADCN UI THAT WILL BE SIMILAR TO OTHER WEBSITE AND FEEL UNITED
No backend logic yet — all data is placeholder (faker js). The app will be deployed as a
static site (adapter-static).

Future stack (not yet integrated, do not add until asked):

- orval generates a TanStack Query client from our OpenAPI spec
- @tanstack/svelte-query for server state
- sveltekit-superforms + formsnap for forms

## Conventions

### File structure

- `src/lib/components/ui/` — shadcn-svelte primitives. DO NOT EDIT.
  Regenerate with `pnpm dlx shadcn-svelte@latest add <component>`.
- `src/lib/components/custom/` — our own composite components built on shadcn.
- `src/lib/mocks/` — placeholder data, one file per entity, fully typed.
- `src/lib/types/` — shared TypeScript types.
- `src/routes/` — pages only. No components, no utils, no styles.

### Styling

- Tailwind v4, CSS-first config in `src/app.css`.
- Use shadcn-svelte design tokens (bg-background, text-foreground, etc.)
  — never hardcoded colors.
- Class lists sorted by prettier-plugin-tailwindcss (don't reorder manually).

### Components

- Use shadcn-svelte primitives wherever possible before reaching for custom.
- For new composite components, follow the pattern in `src/lib/components/`.
- Tables: use the shadcn-svelte Data Table pattern (TanStack Table).
- Forms: plain Svelte forms for now. Superforms + formsnap later.

### Svelte 5

- Use runes ($state, $props, $derived, $effect). No legacy reactive syntax.
- Use `{@render children()}` for slots, not <slot/>.
- Run svelte-autofixer (via MCP) on any Svelte code before responding.

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm check` — type check
- `pnpm lint` — prettier + eslint
- `pnpm format` — prettier --write

## Workflow rules

- After ANY change to Svelte/TS files, run `pnpm check && pnpm lint`
  and fix issues before considering the task done.
- One page per session. Don't refactor unrelated code.
- Never edit files in `src/lib/components/ui/` — they're generated.
- Never edit files in `src/lib/api/generated/` once orval is set up.
- Ask before installing new dependencies.

## Reference docs

When working with shadcn-svelte components, consult `.claude/shadcn-svelte-docs.md`
before generating code. It contains the full, authoritative shadcn-svelte
documentation — component APIs, props, install commands, and examples.

Use it whenever:

- Building or modifying a component from `src/lib/components/ui/`
- Composing shadcn primitives into a new composite component
- Verifying prop names, slot/snippet APIs, or styling conventions
- A user asks "how do I do X with shadcn-svelte"

Read the relevant section with the Read tool — do not paste the whole file
into context, it's large. Search for the component name first.
