# Feature: kds

KDS owns the kitchen display board, station-scoped queue state, status progression, and the ready-to-serve notification flow.

## Scope

- KDS board per station
- Queue rendering (order columns grouped by elapsed time / priority)
- Status progression for KDS cards
- Ready-to-serve notification + dismissal state
- Pending order count indicator

A KDS Card is one order-station item, not the whole Order. A single Order can produce multiple cards when its Products belong to different Stations.

## Routes

- `/store/:id/kds` (wrapped in `KdsLayout`)

## Structure

```
src/features/kds/
├── components/
│   ├── kds-layout.tsx, kds-order-column.tsx, kds-stats-bar.tsx
│   ├── kds-sound-toggle.tsx
│   └── ready-to-serve-notifier.tsx
├── hooks/            # useKds.ts, use-alert-sound.ts, use-new-order-alert.ts, use-pending-orders-count.ts, use-ready-to-serve.ts
├── pages/            # kds-board.tsx
├── strategies/       # kds-status-strategy.ts
├── types/            # kds.dto.ts, kds.model.ts
└── utils/            # alert-sound-preference.ts, group-by-order.ts, parse-order-number.ts, play-new-order-chime.ts, ready-to-serve-dismissed.ts
```

## Key files

- `pages/kds-board.tsx` — the board screen
- `hooks/useKds.ts` — KDS queries/mutations
- `components/kds-layout.tsx` — KDS-specific shell mounted in `App.tsx`
- `components/ready-to-serve-notifier.tsx` — mounted app-wide; surfaces ready-to-serve signals
- `strategies/kds-status-strategy.ts` — canonical status progression logic
- `utils/ready-to-serve-dismissed.ts` — persisted dismissal state

## Behavior

- Station selection affects the visible queue.
- Pending cards are split into priority groups by elapsed time.
- KDS statuses are `PENDING`, `READY`, `SERVED` (distinct from the store-wide Order Status).
- Order-station transition work is owned by the `order` feature.
- New-order alert: `use-new-order-alert.ts` diffs arriving order IDs against a cumulative seen-set (per station scope) and plays a synthesized chime (`play-new-order-chime.ts`) once per batch. The first ready snapshot per station is a silent baseline; tracking continues while disabled so re-enabling never replays a backlog.
- Alert sound toggle: `kds-sound-toggle.tsx` in the stats bar (and top controls when stats are hidden). Independent of the global click-sound setting; persisted per device under localStorage key `kitchy.kds.alertSoundOn` (default on) via `alert-sound-preference.ts`. Enabling alerts unlocks the AudioContext inside the click gesture (browser autoplay policy).