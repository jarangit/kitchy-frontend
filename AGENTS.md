# AGENTS.md

## Architecture

This project uses a **feature-based architecture** with React + TypeScript + Tailwind CSS v4 + Vite.

```
src/
├── app/          # Entry point (main.tsx, App.tsx, global styles + design tokens)
├── features/     # Feature modules
│   ├── auth/     # Login, auth context, token management
│   ├── landing/  # Landing page
│   ├── store/    # Store dashboard, settings (shop/products/categories)
│   ├── order/    # Order creation and management
│   ├── station/  # Station CRUD
│   ├── product/  # Product CRUD
│   ├── pos/      # POS home, payment, payment success
│   └── transaction/ # Transaction list and detail
└── shared/       # Shared code (components, hooks, services, store, utils)
```

Each feature has its own `pages/`, `components/`, `hooks/`, `services/`, and `types/` subdirectories as needed.

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
