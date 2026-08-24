## Purpose

This file is the persistent working memory for the Kitchy authenticated frontend app.

Use it to get oriented quickly before making changes. It documents the current architecture as implemented, not the ideal future state.

For domain language and canonical business terms, see `CONTEXT.md`.

It is not the source of truth.

When this file conflicts with current code, routes, feature behavior, or newer project docs, follow the current code and update this file.

## How To Use This File

- Treat this file as a fast orientation layer, not a hard spec
- Re-read the relevant route, hook, service, and owning feature before making changes
- If implementation drift is discovered, update this file after the code change
- Do not preserve old assumptions just because they are written here
- Prefer current code over memory, and prefer current product decisions over stale notes

## Memory Maintenance Rule

Update this file when any of these change:

- route structure or layout ownership
- feature ownership or module boundaries
- Redux or React Query responsibilities
- data flow, service contracts, or demo mode behavior
- localStorage or other persisted client-side keys
- project scope decisions that affect what belongs in this repo

For each update:

1. verify the new behavior in code first
2. update only the sections affected
3. remove stale statements instead of layering contradictory notes
4. keep this file descriptive, short, and implementation-aware
5. if a deeper product/domain decision is needed, record that elsewhere and leave only the operational summary here

## Scope

- Repo: `kitchy-frontend`
- Product surface: authenticated app only
- Explicitly in scope: auth, store dashboard, onboarding, POS, KDS, orders, stations, products, categories, settings, reports, transactions
- Explicitly out of scope: landing pages, marketing pages, public website content
- Related external repo for landing site: `/Users/jaran/Documents/dev/personal/kitchy/kitchy-landing`

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router v6
- Redux Toolkit
- TanStack React Query
- Axios
- Custom UI components under `src/shared/components/ui`
- `@headlessui/react` for accessible overlays

Primary references:

- `package.json`
- `src/app/main.tsx`
- `src/app/App.tsx`
- `README.md`
- `AGENTS.md`

## App Shell

Top-level providers are mounted in `src/app/main.tsx` in this order:

1. Redux `Provider`
2. `LanguageProvider`
3. `QueryClientProvider`
4. `QuerySyncProvider`
5. `GoogleOAuthProvider`
6. `BrowserRouter`
7. `App`
8. global `GlobalModal`
9. global `LoadingOverlay`

Route composition lives in `src/app/App.tsx`.

## Route Map

Public routes:

- `/` -> redirects to `/login` in normal mode, `/try` in demo mode
- `/login`
- `/register`
- `/try` -> demo-only public trial entry

Authenticated non-store routes:

- `/dashboard` -> store selection dashboard
- `/onboarding` -> first-run wizard

Store-scoped routes using the main shared layout:

- `/store/:id` -> store dashboard
- `/store/:id/transactions`
- `/store/:id/transactions/:txId`
- `/store/:id/kds`
- `/store/:storeId/station/:id`

Store-scoped POS routes using a dedicated POS layout:

- `/store/:id/pos`
- `/store/:id/pos/payment`
- `/store/:id/pos/payment/success`

Store-scoped settings routes using the full-screen settings shell:

- `/store/:id/settings`
- `/store/:id/settings/products`
- `/store/:id/settings/stations`
- `/store/:id/settings/categories`
- `/store/:id/settings/shop`
- `/store/:id/settings/delivery`
- `/store/:id/settings/quick-notes`
- `/store/:id/settings/:section` (sections include `report`)

Notes:

- `SettingsPage` redirects missing or unknown sections to `kitchen`
- The report section lives at `/store/:id/settings/report`
- Specific legacy settings paths still coexist with the section router
- `ProtectedRoute` blocks all authenticated surfaces until auth readiness is known

## Layout Modes

There are three main authenticated shell modes.

### 1. Main layout

Reference: `src/shared/components/layout/layout.tsx`

- App bar + main content area (dock menu removed)
- Used by store dashboard, transactions, KDS, station detail
- Calls `useStoreContextSync()` on mount

### 2. POS layout

Reference: `src/features/pos/components/pos-layout.tsx`

- Wraps POS routes in `CartProvider`
- Reuses shared `Layout` with `hideSidebar` and `noPadding`
- Cart state is shared across POS nested routes

### 3. Settings full-screen shell

References:

- `src/features/store/components/settings-frame.tsx`
- `src/features/store/components/settings-layout.tsx`

- Separate chrome from the main sidebar layout
- Must still keep store/station context synchronized

## Feature Ownership

Each feature under `src/features/<name>/` has its own `README.md` covering scope, routes, structure, key files, data flow, and gotchas. Start with the feature README before reading the files listed below.

### `auth`

Owns login, register, Google login, current-user hydration, auth context, logout flow, cross-tab auth sync.

Key files:

- `src/features/auth/context/authContext.tsx`
- `src/features/auth/hooks/use-auth-queries.ts`
- `src/features/auth/pages/login.tsx`
- `src/features/auth/pages/register.tsx`

Behavior notes:

- Auth readiness is separate from authenticated state
- 401 responses trigger `auth:unauthorized` via Axios interceptor
- Login/register/navigation decisions are centralized in the auth provider

### `store`

Owns store selection dashboard, store dashboard, settings shell, settings sections, store CRUD hooks/services.

Key files:

- `src/features/store/pages/user-dashboard.tsx`
- `src/features/store/pages/store-dashboard.tsx`
- `src/features/store/pages/settings.tsx`
- `src/features/store/hooks/useStoreService.ts`

Behavior notes:

- `/dashboard` is the post-login store selector
- zero stores redirects the user into onboarding
- current store is mirrored into Redux

### `onboarding`

Owns first-run setup flow.

Key files:

- `src/features/onboarding/pages/onboarding-wizard.tsx`
- `src/features/onboarding/hooks/use-onboarding-flow.ts`
- `src/features/onboarding/services/onboarding-setup.ts`
- `src/features/onboarding/utils/onboarding-storage.ts`

Behavior notes:

- creates initial store and default station
- optionally creates starter menus
- persists some onboarding-derived local settings
- hands off directly into POS
- demo mode also exposes `/try`, a public trial entry that bypasses registration and bootstraps a demo session

### `pos`

Owns cart, POS product browsing, payment flow, and POS-specific route shell.

Key files:

- `src/features/pos/context/cartContext.tsx`
- `src/features/pos/pages/pos-home.tsx`
- `src/features/pos/pages/payment.tsx`
- `src/features/pos/pages/payment-success.tsx`

Behavior notes:

- cart default order type is still derived from onboarding `shopType`
- in demo mode, `/try` now separates demo data selection from POS order flow selection
- PromptPay QR is generated server-side (`POST /stores/:storeId/promptpay-qr` → `qrcode` data URL from the store's `settings.promptpay`); rendered on the payment screen (`qr-payment-section.tsx`) and the receipt; when no PromptPay ID is configured the QR slot shows a "configure" hint (button → store settings) instead. Hook: `usePromptpayQr(storeId, amount)` (key `["promptpay-qr", storeId, amount]`). Demo adapter returns `qrDataUrl: null`.

### `order`

Owns order CRUD, order hooks, and KDS order-station transitions.

Key files:

- `src/features/order/hooks/useOrder.ts`
- `src/features/order/services/order.ts`

### `kds`

Owns kitchen display board, station-scoped queue state, status progression, ready-to-serve notification flow.

Key files:

- `src/features/kds/pages/kds-board.tsx`
- `src/features/kds/hooks/useKds.ts`
- `src/features/kds/components/ready-to-serve-notifier.tsx`

Behavior notes:

- station selection affects visible queue
- pending cards are split into priority groups by elapsed time

### `transaction`

Owns transaction list/detail screens and transaction update actions.

Key files:

- `src/features/transaction/pages/transaction-list.tsx`
- `src/features/transaction/pages/transaction-detail.tsx`
- `src/features/transaction/services/transaction.ts`

Important note:

- transaction data is currently normalized from order-shaped payloads and `/orders/...` endpoints

### `report`

Owns reporting UI, presets, monthly breakdown views, and report service.

The report UI is exposed as a Settings Control Panel section (see `section-report.tsx`), reachable at `/store/:id/settings/report`.

Key files:

- `src/features/store/components/settings/section-report.tsx`
- `src/features/report/hooks/useReportData.ts`
- `src/features/report/services/report.ts`

Important note:

- non-demo mode still returns generated mock data, not a real API response

### `product`

Owns product CRUD and product UI used by settings/POS.

### `category`

Owns category CRUD and category settings UI.

### `station`

Owns station CRUD, station settings UI, and station detail page.

## Shared Foundations

### Redux state

Store setup: `src/shared/store/store.ts`

Current slices:

- `modal`
- `loading`
- `sound`
- `orders`
- `currentStore`
- `currentStation`

Practical rule:

- Redux here is mostly app session/UI coordination state, not the main server data source

### React Query

React Query is the main data-fetching layer for features.

Common patterns:

- list/detail queries live in feature hooks
- mutations invalidate affected queries
- some invalidation also happens centrally through the app event bus

### Store context sync

Reference: `src/shared/hooks/use-store-context-sync.ts`

This hook is critical for store-scoped screens.

It does all of the following:

- syncs route store id into Redux
- clears invalid station selection on store change
- hydrates store name into Redux once fetched
- auto-selects the first valid station when needed
- registers idle auto-reload behavior

Important operational rule:

- if a new store-scoped shell is introduced, it probably also needs `useStoreContextSync()`

### Event bus and query sync

References:

- `src/shared/events/app-events.ts`
- `src/shared/events/query-sync.tsx`

The event bus is the cross-feature coordination mechanism.

Current notable event groups:

- order lifecycle
- transaction lifecycle
- auth lifecycle
- ready-to-serve UI signals

`QuerySyncProvider` listens to these events and invalidates or clears React Query caches.

### Service layer

References:

- `src/shared/services/axios-client.ts`
- `src/shared/services/adapters/data-adapter.ts`
- `src/shared/services/adapters/api.adapter.ts`
- `src/shared/services/adapters/local.adapter.ts`

Current architecture:

- `axiosClient` adds bearer auth token from localStorage
- `axiosClient` emits `auth:unauthorized` on 401
- `DataAdapter` selects API mode or demo mode based on `VITE_DEMO_MODE`
- demo mode persists data in localStorage and provides offline CRUD-like behavior
- demo seed selection is now two-dimensional: demo store preset controls sample data, onboarding `shopType` still controls default POS order flow

Important caveat:

- service return shapes are not fully uniform across all features
- some services return axios responses
- some return normalized payloads
- some wrap demo results into axios-like objects

When editing feature hooks, verify the exact response shape before changing selectors or mutation logic.

## Persistence Keys

There is no single registry today. Persistence is spread across features.

Known important keys/areas:

- auth token in localStorage via auth query layer
- language: `app-language`
- theme via `src/shared/hooks/useTheme.ts`
- onboarding state via `src/features/onboarding/utils/onboarding-storage.ts`
- demo store preset: `demo:store-preset`
- demo seed version: `demo:seed-version`
- store settings (sales / payments / safety / store / delivery groups) and `orderLimit` are persisted on the backend via `PATCH /stores/:id` under the `store.settings` JSON column — no longer localStorage-only
- `PATCH /stores/:id` is guarded by `JwtAuthGuard` and scoped to the authenticated owner (`owner_id` match); `update()` requires `userId` from the route guard
- System quick actions in `section-system.tsx` are wired to real behavior: pause → `settings.paused` persisted + enforced in POS `handlePay` (banner + toast, no navigation); new day → query invalidation + toast; clear stale orders → open orders (status not `COMPLETED`/`CANCELLED`) are PATCHed to `CANCELLED` + invalidation + toast
- KDS dismissal state in `src/features/kds/utils/ready-to-serve-dismissed.ts`
- KDS new-order alert sound toggle: `kitchy.kds.alertSoundOn` (per device, default on) in `src/features/kds/utils/alert-sound-preference.ts` — independent of the global Redux `sound.isSoundOn` click-feedback setting

Before adding new persisted settings, search existing keys first.

Demo mode notes:

- `/try` is a single-step public entry in demo mode
- it selects a demo store preset: `CAFE`, `FAST_FOOD`, or `MADE_TO_ORDER`
- `/try` always seeds demo mode with `DINE_IN` as the default POS order flow
- changing the demo store preset invalidates the demo seed version and rehydrates local demo data
- `clearDemoData()` intentionally preserves the demo store preset key so the selected preset can be re-seeded

## i18n

References:

- `src/shared/i18n/language-context.tsx`
- `src/shared/i18n/use-translation.ts`
- `src/shared/i18n/messages/th.ts`
- `src/shared/i18n/messages/en.ts`

Notes:

- supported languages are Thai and English
- default language falls back to Thai unless localStorage explicitly says `en`
- translation lookup is message-key based with simple interpolation

## UI System

Shared UI lives under `src/shared/components/ui`.

Important architectural rule from repo docs:

- use custom components from `shared/components/ui`
- do not introduce shadcn/ui, Radix UI, or CVA into this repo

Theme and tokens live in app CSS files:

- `src/app/index.css`
- `src/app/theme.css`
- `src/app/tokens/*`

## Conventions That Matter

- Feature-based folder structure under `src/features`
- Shared code under `src/shared`
- Use `@/features/...` and `@/shared/...` imports
- Feature DTO types belong in `<feature>/types/<feature>.dto.ts`
- Feature model/UI types belong in `<feature>/types/<feature>.model.ts`
- Root route must continue to redirect to `/login`
- This repo must remain focused on the authenticated product app only

## Known Drift And Cleanup Backlog

These are real current inconsistencies, not hypothetical ones.

1. `src/features/landing` still exists even though landing pages were moved to another repo
2. `package.json` package name is still `kds-frontend`
3. store hook naming has legacy drift like `storeFinOneQuery`
4. service response normalization is inconsistent across features
5. report service is wired to `GET /reports`; `generateMockReportData` is used only by the demo local adapter
6. transaction service is still coupled to order endpoints and order-shaped payloads
7. legacy settings routes coexist with section-based routing

Treat these as caution areas when refactoring.

## Safe Starting Points For Future Agents

When starting work in this repo, read these first:

1. `AGENTS.md`
2. `README.md`
3. `PROJECT_MEMORY.md`
4. `src/app/App.tsx`
5. `src/app/main.tsx`

Then read the owning feature's `README.md` and inspect the relevant feature hook + service pair before changing behavior.

Recommended workflow for changes:

1. identify the route and owning feature
2. inspect the feature hook and service together
3. verify whether the screen depends on Redux store context, route params, or both
4. verify whether demo mode changes the response shape
5. check whether any app bus events or query invalidations also need updates

## Quick References

- Route map: `src/app/App.tsx`
- App bootstrap: `src/app/main.tsx`
- Main shell: `src/shared/components/layout/layout.tsx`
- Store context sync: `src/shared/hooks/use-store-context-sync.ts`
- Event bus: `src/shared/events/app-events.ts`
- Query invalidation bridge: `src/shared/events/query-sync.tsx`
- Demo/API switching: `src/shared/services/adapters/data-adapter.ts`
- Axios auth behavior: `src/shared/services/axios-client.ts`
- Auth provider: `src/features/auth/context/authContext.tsx`
- Store dashboard entry: `src/features/store/pages/user-dashboard.tsx`
- Onboarding entry: `src/features/onboarding/pages/onboarding-wizard.tsx`
