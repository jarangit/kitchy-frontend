# AGENTS.md

## Architecture

This project uses a **feature-based architecture**.

```
src/
├── app/          # Entry point (main.tsx, App.tsx, global styles)
├── features/     # Feature modules
│   ├── auth/
│   ├── landing/
│   ├── store/
│   ├── order/
│   ├── station/
│   ├── product/
│   └── kitchen/
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
