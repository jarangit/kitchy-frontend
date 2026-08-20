# Feature: product

Product owns product CRUD and the product UI used by settings and POS.

## Scope

- Product create/update/delete
- Product list for settings and POS menu
- Product cards/table/food list UI

A Product is a sellable menu item offered by a Store. It can belong to one Category and one Station. The canonical domain term is **Product**, not "Menu".

## Routes

No dedicated routes. Product pages are rendered through the `store` settings feature at `/store/:id/settings/products` and through the POS grid.

## Structure

```
src/features/product/
├── components/       # add-up-product.tsx, product-table.tsx, product-card.tsx, food-list.tsx
├── hooks/            # useProductService.ts
├── services/         # product.ts
└── types/            # product.dto.ts, product.model.ts
```

## Key files

- `components/add-up-product.tsx` — create/update form used by settings
- `components/product-table.tsx` — settings table
- `components/product-card.tsx` / `food-list.tsx` — POS-facing menu UI
- `hooks/useProductService.ts` — product queries/mutations
- `services/product.ts` — product API calls

## Notes

- No `pages/` directory here by design; product screens belong to the consuming feature (`store` settings or `pos`).