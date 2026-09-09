# Feature: modifier

Modifier owns modifier-group/option admin CRUD, the modifier settings UI,
and the API client used to attach groups to products.

## Scope

- Modifier group create/update/permanent-delete
- Modifier option create/update/availability-toggle/permanent-delete
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
│                     # modifier-option-editor, modifier-option-dialog,
│                     # modifier-selection-cards, modifier-step-section,
│                     # modifier-pos-preview, modifier-tips-card,
│                     # group-product-assignment, modifier-product-picker,
│                     # modifier-product-row
├── hooks/            # useModifierService.ts
├── pages/            # settings-modifiers.tsx, modifier-detail.tsx
├── services/         # modifier.ts
├── types/            # modifier.dto.ts, modifier.model.ts
└── utils/            # modifier-group-preset.ts
```

## Key files

- `pages/settings-modifiers.tsx` — the group list wired into the store settings shell
- `pages/modifier-detail.tsx` — shared create/edit detail page (group + options + assignment)
- `hooks/useModifierService.ts` — group/option/assignment queries/mutations
- `services/modifier.ts` — modifier API calls

## Notes

- Keep `settings-modifiers.tsx` here even though it renders inside the `store` feature's settings shell.
- Group deletion is permanent (hard delete via `DELETE /modifier-groups/:id`;
  options and product links are removed by `ON DELETE CASCADE`, order
  history keeps its own snapshot). The UI confirms before calling it.
- Option deletion is permanent (hard delete via `DELETE /modifier-options/:id`;
  order history keeps its own name snapshot, so history is unaffected). The
  backend still blocks deleting an available option when remaining active
  options would fall below the group's `minSelect`; the editor pre-checks
  the same rule and warns up front.
- Assignment sort order is auto-appended (max + 1) at attach time; there is
  no reorder endpoint and no manual order input.
