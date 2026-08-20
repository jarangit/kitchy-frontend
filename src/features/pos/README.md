# Feature: pos

POS owns the point-of-sale workflow: cart state, product browsing, order building, payment, and the POS-specific route shell.

## Scope

- Cart state shared across POS routes (`CartProvider`)
- Product/category browsing grid
- Order item notes, table picker, delivery details
- Order summary and payment (cash, QR/PromptPay)
- Payment success screen
- POS layout wrapping nested routes

POS is the in-store selling workflow. Payment creates or completes the Transaction associated with the Order.

## Routes

- `/store/:id/pos` — POS home (browse products, build cart)
- `/store/:id/pos/payment`
- `/store/:id/pos/payment/success`

All three routes share a single `CartProvider` mounted in `PosLayout`.

## Structure

```
src/features/pos/
├── components/
│   ├── pos-layout.tsx, header.tsx, product-grid.tsx, category-tabs.tsx
│   ├── cart-area.tsx, cart-item.tsx, cart-summary.tsx
│   ├── order-summary.tsx, payment-receipt.tsx
│   ├── cash-payment-section.tsx, qr-payment-section.tsx
│   └── item-note-dialog.tsx, table-picker-dialog.tsx, delivery-details-dialog.tsx
├── context/          # cartContext.tsx, cart-context-value.ts, cart-hooks.ts
├── hooks/            # useCart.ts
├── pages/            # pos-home.tsx, payment.tsx, payment-success.tsx
├── strategies/       # payment-strategy.ts
├── types/            # pos.dto.ts, pos.model.ts
└── utils/            # get-next-queue-number.ts, get-next-delivery-order-number.ts
```

## Key files

- `components/pos-layout.tsx` — POS shell mounted in `App.tsx`; provides `CartProvider`
- `context/cartContext.tsx` — cart state + actions
- `pages/pos-home.tsx` — product browsing + cart building
- `pages/payment.tsx` — payment flow
- `pages/payment-success.tsx` — success confirmation

## Behavior

- The cart's default order type is derived from the onboarding `shopType`.
- In demo mode, `/try` separates demo data selection from the POS order-flow selection.

## Notes

- `pos-layout.tsx` reuses the shared `Layout` with `hideSidebar` and `noPadding`.