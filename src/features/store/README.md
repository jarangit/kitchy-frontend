# Feature: store

Store owns the store-selection dashboard, the store dashboard, the full-screen settings shell, the settings section router, and store CRUD hooks/services.

## Scope

- Store selection dashboard (post-login)
- Store dashboard
- Settings shell, navigation, and control-panel sections
- Store CRUD hooks/services
- Legacy settings pages for products, shop, delivery, and quick notes

Does **not** own station settings or category settings pages — those live in their own features (`station/pages/settings-stations.tsx`, `category/pages/settings-categories.tsx`) but are wired into the settings shell here.

## Routes

- `/dashboard` — store selector
- `/store/:id` — store dashboard
- `/store/:id/settings` — settings shell / section router
- `/store/:id/settings/products`
- `/store/:id/settings/shop`
- `/store/:id/settings/delivery`
- `/store/:id/settings/quick-notes`
- `/store/:id/settings/:section` — control-panel section router (includes `report`)

## Structure

```
src/features/store/
├── components/
│   ├── settings-frame.tsx, settings-layout.tsx, settings-nav.tsx
│   ├── settings-shell.tsx, settings-sections.ts
│   ├── settings-section-header.tsx
│   └── settings/
│       ├── section-store.tsx, section-kitchen.tsx, section-sales.tsx
│       ├── section-payments.tsx, section-devices.tsx
│       ├── section-safety.tsx, section-system.tsx
│       └── section-report.tsx (renders the report feature UI)
├── hooks/            # useStoreService.ts
├── pages/            # user-dashboard.tsx, store-dashboard.tsx, settings*.tsx
├── services/         # store.ts
└── types/            # store.dto.ts, store.model.ts
```

## Key files

- `pages/user-dashboard.tsx` — post-login store selector; redirects into onboarding when there are zero stores
- `pages/store-dashboard.tsx` — the main store dashboard
- `pages/settings.tsx` — settings shell + section router; unknown sections redirect to `kitchen`
- `components/settings-sections.ts` — registry mapping section names to settings components
- `hooks/useStoreService.ts` — store queries/mutations

## Data flow

- The current store is mirrored into Redux (`currentStore` slice) via `useStoreContextSync()`.
- Settings screens must keep store/station context synchronized.

## Notes

- Legacy settings routes coexist with the section-based router; keep the specific routes defined **before** the `:section` catch-all in `App.tsx`.
- The report section is served from `components/settings/section-report.tsx` but the logic lives in the `report` feature.