# Feature: onboarding

Onboarding owns the first-run setup flow and the demo-mode public trial entry.

## Scope

- First-run wizard (welcome → store info → menu → shop type)
- Creates the initial Store and default Station
- Optionally creates starter menus
- Persists onboarding-derived local settings
- Demo-mode `/try` entry that bootstraps a demo session

Does **not** own ongoing settings — after setup, configuration belongs in the `store` settings feature.

## Routes

- `/onboarding` — protected first-run wizard
- `/try` — demo-only public trial entry (bypasses registration)

## Structure

```
src/features/onboarding/
├── components/
│   ├── wizard-shell.tsx, progress-dots.tsx, success-moment.tsx
│   ├── step-welcome.tsx, step-store-info.tsx, step-add-menu.tsx, step-shop-type.tsx
│   ├── coach-mark.tsx, coach-mark.css, pos-coach-overlay.tsx
├── context/          # onboarding-context.tsx, onboarding-context-value.ts, onboarding-hooks.ts
├── hooks/            # use-onboarding-flow.ts
├── pages/            # onboarding-wizard.tsx, demo-trial-entry.tsx
├── services/         # onboarding-setup.ts
├── types/            # onboarding.model.ts
└── utils/            # onboarding-storage.ts
```

## Key files

- `pages/onboarding-wizard.tsx` — the wizard entry point
- `hooks/use-onboarding-flow.ts` — step orchestration
- `services/onboarding-setup.ts` — creates store + default station (and optional starter menus)
- `utils/onboarding-storage.ts` — persists onboarding state locally
- `pages/demo-trial-entry.tsx` — `/try` demo entry

## Behavior

- Completing the flow hands off directly into POS.
- Demo mode (`/try`) selects a demo store preset (`CAFE`, `FAST_FOOD`, `MADE_TO_ORDER`) and seeds demo data with `DINE_IN` as the default POS order flow.
- The onboarding `shopType` choice maps to the POS default Order Type.

## Notes

- Coach marks are rendered as an overlay over POS screens (`pos-coach-overlay.tsx`).