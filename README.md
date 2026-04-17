# Kitchy Frontend App

This repository contains the Kitchy authenticated application frontend.

It is focused on product workflows only:

- Login and auth state
- Store dashboard
- POS
- KDS
- Orders
- Stations
- Products
- Store settings
- Reports
- Transactions

The public landing/marketing site has been split into a separate repository:

```text
/Users/jaran/Documents/dev/personal/kitchy/kitchy-landing
```

Do not add landing pages, marketing pages, public website sections, campaign pages, or SEO content back into this repo.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS v4
- Custom shared UI components in `src/shared/components/ui`
- Design tokens in `src/app/tokens` and `src/app/theme.css`

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Routing

The root route `/` redirects to `/login`.

All product routes live under app-specific paths such as `/dashboard`, `/store/:id`, `/store/:id/pos`, `/store/:id/kds`, `/store/:id/report`, and `/store/:id/settings`.
