# Feature: auth

Auth owns login, register, Google sign-in, current-user hydration, the auth context, the logout flow, and cross-tab auth sync. Every authenticated surface in the app depends on it.

## Scope

- Login (email/password) and register
- Google OAuth sign-in
- Current-user hydration after sign-in
- Auth context exposed to the rest of the app via `useAuth()`
- Logout flow
- Cross-tab auth synchronization

Does **not** own route protection logic (that lives in `src/shared/components/protected-route.tsx`).

## Routes

- `/login`
- `/register`

## Structure

```
src/features/auth/
├── components/       # google-sign-in-button.tsx
├── context/          # authContext.tsx (provider), auth-context.ts (value/type)
├── events/           # auth-channel.ts (cross-tab sync + auth events)
├── hooks/            # useAuth.ts, use-auth-queries.ts
├── pages/            # login.tsx, register.tsx
├── services/         # user.ts (auth API calls)
└── types/            # auth.dto.ts, auth.model.ts
```

## Key files

- `context/authContext.tsx` — the `AuthProvider` mounted at the app root; centralizes login/register/navigation decisions
- `hooks/use-auth-queries.ts` — auth queries/mutations (sign-in, register, current user hydration)
- `hooks/useAuth.ts` — the public hook components call to read auth state
- `services/user.ts` — auth API requests
- `events/auth-channel.ts` — broadcasts auth state changes across tabs
- `pages/login.tsx`, `pages/register.tsx` — the public screens

## Data flow

- Auth readiness is tracked separately from authenticated state; `ProtectedRoute` waits for readiness before rendering.
- The Axios client (`src/shared/services/axios-client.ts`) emits `auth:unauthorized` on a 401; the auth layer reacts to it.

## Notes

- In demo mode (`VITE_DEMO_MODE=true`) `/login` and `/register` redirect to `/try`.
- Follow the provider order in `src/app/main.tsx` — `AuthProvider` sits above routing.