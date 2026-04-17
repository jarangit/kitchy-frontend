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

## UI Design Guidelines

When building or modifying UI components, load the `apple-newsroom-style` skill for the full Design DNA, token rules, component patterns, and visual guidelines.

Apply those UI guidelines to product app screens and operational workflows. Do not create landing-page hero sections or marketing layouts in this repo.
