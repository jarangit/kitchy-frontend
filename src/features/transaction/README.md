# Feature: transaction

Transaction owns the transaction list/detail screens, filters, and transaction update actions.

## Scope

- Transaction list with filters
- Transaction detail
- Transaction update actions (e.g. flow/status changes)
- In-progress transactions count

A Transaction is the financial record associated with an Order: payment method, amount, receipt id, and purchased items. Use **Order** for the purchase/fulfillment record and **Transaction** for the financial record.

## Routes

- `/store/:id/transactions`
- `/store/:id/transactions/:txId`

## Structure

```
src/features/transaction/
├── components/       # transaction-card.tsx, transaction-filter.tsx, info-cell.tsx, detail-skeleton.tsx
├── hooks/            # useTransaction.ts, use-in-progress-transactions-count.ts
├── pages/            # transaction-list.tsx, transaction-detail.tsx
├── services/         # transaction.ts
├── strategies/       # flow-status-strategy.ts
├── types/            # transaction.dto.ts, transaction.model.ts
└── utils/            # transaction-formatters.ts
```

## Key files

- `pages/transaction-list.tsx` — filtered transaction list
- `pages/transaction-detail.tsx` — transaction detail
- `hooks/useTransaction.ts` — transaction queries/mutations
- `services/transaction.ts` — transaction API calls
- `strategies/flow-status-strategy.ts` — flow/status transition rules
- `utils/transaction-formatters.ts` — display formatting helpers

## Notes

- **Gotcha:** transaction data is currently normalized from order-shaped payloads and `/orders/...` endpoints. This is a known drift item — verify response shapes before changing selectors.