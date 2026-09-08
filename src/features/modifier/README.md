# Feature: modifier

Modifier owns modifier-group/option admin CRUD, the modifier settings UI,
and the API client used to attach groups to products.

## Scope

- Modifier group create/update/deactivate (no reactivate API — one-way)
- Modifier option create/update/availability-toggle/deactivate
- Modifier settings screen (groups table + option editor + product assignment)
- Shared selection/pricing/validation helpers live in
  `src/shared/utils/modifier-selection.ts` (used by POS too)

A ModifierGroup belongs to one Store and is attached to Products via
`ProductModifierGroup`. POS renders `SINGLE` as radio and `MULTIPLE` as
checkbox; `GET /products/:id` returns only active groups + available options.

## Routes

- `/store/:id/settings/modifiers` — group list (table only)
- `/store/:id/settings/modifiers/new` — create: group form, options unlock after creation
- `/store/:id/settings/modifiers/:groupId` — detail: group form + options + product assignment on one page

## Structure

```
src/features/modifier/
├── components/       # modifier-group-form, modifier-group-table,
│                     # modifier-option-editor, group-product-assignment
├── hooks/            # useModifierService.ts
├── pages/            # settings-modifiers.tsx, modifier-detail.tsx
├── services/         # modifier.ts
└── types/            # modifier.dto.ts, modifier.model.ts
```

## Key files

- `pages/settings-modifiers.tsx` — the group list wired into the store settings shell
- `pages/modifier-detail.tsx` — shared create/edit detail page (group + options + assignment)
- `hooks/useModifierService.ts` — group/option/assignment queries/mutations
- `services/modifier.ts` — modifier API calls

## Notes

- Keep `settings-modifiers.tsx` here even though it renders inside the `store` feature's settings shell.
- Group deactivation cannot be undone via API — the UI confirms before calling it.
- Option deactivation is blocked by the backend when remaining active options
  would fall below the group's `minSelect`; the server message is toasted.
- Assignment sort order is set at assign time only (no reorder endpoint).
