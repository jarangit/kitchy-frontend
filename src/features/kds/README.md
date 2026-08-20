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
│   └── ready-to-serve-notifier.tsx
├── hooks/            # useKds.ts, use-pending-orders-count.ts, use-ready-to-serve.ts
├── pages/            # kds-board.tsx
├── strategies/       # kds-status-strategy.ts
├── types/            # kds.dto.ts, kds.model.ts
└── utils/            # group-by-order.ts, parse-order-number.ts, ready-to-serve-dismissed.ts
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