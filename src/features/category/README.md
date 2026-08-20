# Feature: category

Category owns category CRUD and the category settings UI.

## Scope

- Category create/update/delete
- Category list for settings and menu browsing
- Category settings screen

A Category is a grouping used to organize Products within a Store.

## Routes

- `/store/:id/settings/categories`

## Structure

```
src/features/category/
├── components/       # add-up-category.tsx, category-table.tsx
├── hooks/            # useCategoryService.ts
├── pages/            # settings-categories.tsx
├── services/         # category.ts
└── types/            # category.dto.ts, category.model.ts
```

## Key files

- `pages/settings-categories.tsx` — the settings page wired into the store settings shell
- `hooks/useCategoryService.ts` — category queries/mutations
- `services/category.ts` — category API calls

## Notes

- Keep `settings-categories.tsx` here even though it renders inside the `store` feature's settings shell.