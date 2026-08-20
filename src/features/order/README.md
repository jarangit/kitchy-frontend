# Feature: order

Order owns order CRUD, order hooks, order normalization, and KDS order-station transitions.

## Scope

- Order creation and management
- Order hooks consumed by POS, KDS, and shared components
- Order normalization between API/demo shapes and UI models
- Order-type strategy (DINE_IN / TOGO / DELIVERY)
- Order-station transitions consumed by KDS

Order is the customer purchase intent. It has its own lifecycle status (e.g. `NEW`, `PREPARING`, `READY`, `PENDING`, `COOKING`, `COMPLETED`, `CANCELLED`) which is distinct from both KDS Status and Transaction.

## Routes

No dedicated routes. Order UI is rendered inside the `pos` and `kds` features and via shared components (`src/shared/components/tab-order.tsx`).

## Structure

```
src/features/order/
├── components/       # list-orders.tsx, order-card.tsx, order-form.tsx
├── hooks/            # useOrder.ts
├── services/         # order.ts
├── strategies/       # order-type-strategy.ts
├── types/            # order.dto.ts, order.model.ts
└── utils/            # order-normalizer.ts
```

## Key files

- `hooks/useOrder.ts` — order queries/mutations (list, detail, create, status transitions)
- `services/order.ts` — order API calls
- `utils/order-normalizer.ts` — normalizes order payloads to UI models
- `strategies/order-type-strategy.ts` — order-type rules

## Notes

- There is no `pages/` directory here by design; order screens belong to the consuming feature.
- Order-station items power KDS cards — one card per order-station item.