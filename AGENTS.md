# AGENTS.md

## Architecture

This project is the **Kitchy application frontend**. It uses a **feature-based architecture** with React + TypeScript + Tailwind CSS v4 + Vite.

This repo must stay focused on the authenticated product app: auth, store dashboard, POS, KDS, orders, stations, products, settings, reports, and transactions. Do not add landing pages, marketing pages, public websites, campaign pages, or SEO-focused content here. The landing page has been split into a separate repo at:

```
/Users/jaran/Documents/dev/personal/kitchy/kitchy-landing
```

```
src/
├── app/          # Entry point (main.tsx, App.tsx, global styles + design tokens)
├── features/     # Feature modules
│   ├── auth/     # Login, auth context, token management
│   ├── store/    # Store dashboard, settings (shop/products/categories)
│   ├── order/    # Order creation and management
│   ├── station/  # Station CRUD
│   ├── product/  # Product CRUD
│   ├── pos/      # POS home, payment, payment success
│   └── transaction/ # Transaction list and detail
└── shared/       # Shared code (components, hooks, services, store, utils)
```

Each feature has its own `pages/`, `components/`, `hooks/`, `services/`, and `types/` subdirectories as needed.

The root route `/` redirects to `/login`. Public marketing content belongs in the separate landing repo, not this app repo.

## Types Convention

Each feature has a `types/` directory with:
- `<feature>.dto.ts` -- API request/response shapes (DTO)
- `<feature>.model.ts` -- UI/domain models, form data types

Component props (`interface Props`) stay inline in the component file.
Shared types (e.g. Redux store types) stay in `shared/`.

## Import Rules

- Use `@/features/<name>/...` and `@/shared/...` for all imports.
- Do not import across features directly -- use `shared/` instead.

## Styling

- **Tailwind CSS v4** with `@tailwindcss/vite` plugin and `@theme inline` in `index.css`.
- No `tailwind.config.js` -- all theming is done through CSS variables and `@theme inline`.
- No shadcn/ui, no Radix UI, no CVA. All UI components are custom-built in `shared/components/ui/`.
- Shared components: Button, Card, Badge, Dialog, Select, Input, Label.
- `@headlessui/react` is used for accessible modal overlays only.

## Design Tokens — Layer Access

Tokens are organized in three layers under `src/app/tokens/`:
- **Layer 1 — Primitives** (`primitives.css`): raw values (colors, spacing, sizes). Never referenced in component code.
- **Layer 2 — Semantic** (`semantic.css`): meaning-based tokens mapped from primitives (e.g. `--color-surface`, `--color-text-primary`).
- **Layer 3 — Component** (`components.css`): the only layer UI components may access, grouped by component (e.g. `--color-button-primary-bg`, `--radius-segment`).

`src/app/theme.css` maps layers 1-3 onto Tailwind utility namespaces (`--color-*` → `bg-*`/`text-*`/`border-*`, `--spacing-*` → `p-*`/`h-*`/`min-h-*`, `--radius-*` → `rounded-*`) plus custom `@utility` classes (`text-button-*`, `duration-*`, etc.).

Rules for component code (`*.tsx`/`*.ts` under `src/features/` and `src/shared/`):
- Reference tokens **only through Tailwind utilities** mapped in `theme.css` — either Layer 3 component tokens (`bg-button-primary-bg`, `rounded-segment`) or semantic utilities (`bg-surface`, `text-text-primary`).
- **Never write `var(--...)` in component code.** No direct access to primitives (Layer 1) or raw token vars. CSS files may reference token vars; component code may not.
- SVG presentation attributes in charts may use `fill-*`/`stroke-*` utilities instead of raw colors.
- **Non-token exceptions (not styling):** raw hex values are allowed where they are data or brand assets, not design tokens — e.g. third-party logo SVGs (Google sign-in `fill="#EA4335"` etc.) and domain data colors (user-selectable station color swatches `#FFFFFF`/`#111315`, seed data). These bypass the token system by design.
- Enforced by `npm run lint:styles` (`scripts/lint-styles.mjs`). The token gallery (`token-gallery.tsx`) is the only whitelisted exception.

Token creation policy:
- Prefer an existing semantic or component utility first. Do not create a new Layer 3 token if `bg-surface`, `border-border`, `h-input-height`, `rounded-card`, etc. already express the intent.
- Create a new Layer 3 token when the value represents a stable component seam: reused across the same component family, likely to diverge from semantic defaults later, or a repeated effect/calc value that would otherwise require arbitrary classes.
- Avoid creating a Layer 3 token for one-off styling in a single component unless that value is expected to repeat or needs a meaningful name for future theming.
- When adding a new Layer 3 token, wire it through `theme.css`, add dark-mode overrides only if the value truly differs in dark mode, and remove obsolete aliases if the new token replaces them.
- Before adding a new token, check whether the same value already exists under another component token. Prefer reusing the existing token when the visual role is the same; prefer a new token when the role is different and should remain a future seam.

## Formatting

- **Prettier** is the code formatter for `src/`. After making any code changes, run `npm run format` (or `npm run format:check` to verify) before finishing. Do not hand-format code; let Prettier handle it.

## UI Design Guidelines

When building or modifying UI components, load the `apple-newsroom-style` skill for the full Design DNA, token rules, component patterns, and visual guidelines.

Apply those UI guidelines to product app screens and operational workflows. Do not create landing-page hero sections or marketing layouts in this repo.
