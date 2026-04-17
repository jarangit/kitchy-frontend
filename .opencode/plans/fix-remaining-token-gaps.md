# Fix Remaining Token Gaps

## Overview
Fix 3 remaining gaps in the CSS design token system:
1. Register spacing tokens in `@theme inline`
2. Fix Button secondary Layer 2 leak
3. Rename + map component tokens to Tailwind namespace convention

## Task 1: Register Spacing Tokens

**File:** `src/app/theme.css`

Add inside `@theme inline` before `/* Shadows */`:
```css
/* Spacing */
--spacing-1: var(--space-1);
--spacing-2: var(--space-2);
--spacing-3: var(--space-3);
--spacing-4: var(--space-4);
--spacing-5: var(--space-5);
--spacing-6: var(--space-6);
--spacing-7: var(--space-7);
--spacing-8: var(--space-8);
```

No JSX migration — just register for completeness.

## Task 2: Fix Button Secondary Layer 2 Leak

**File:** `src/shared/components/ui/button.tsx` line 16

Change:
```tsx
"bg-[var(--color-surface)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-bg-hover)]"
```
To:
```tsx
"bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-bg-hover)]"
```

(This will later become `bg-button-secondary-bg` after Task 3)

## Task 3: Rename Component Tokens to Tailwind Namespace

### Rename Convention

Tailwind v4 `@theme inline` uses variable prefix to determine utility mapping:
- `--color-*` → bg-*, text-*, border-*, outline-*
- `--spacing-*` → p-*, m-*, gap-*, w-*, h-*, size-*
- `--radius-*` → rounded-*
- `--font-size-*` → text-*
- `--font-weight-*` → font-*

### Token Rename Map

#### Button Tokens
| Old | New | Usage |
|-----|-----|-------|
| `--button-primary-bg` | `--color-button-primary-bg` | `bg-button-primary-bg` |
| `--button-primary-bg-hover` | `--color-button-primary-bg-hover` | `hover:bg-button-primary-bg-hover` |
| `--button-primary-text` | `--color-button-primary-text` | `text-button-primary-text` |
| `--button-secondary-bg` | `--color-button-secondary-bg` | `bg-button-secondary-bg` |
| `--button-secondary-bg-hover` | `--color-button-secondary-bg-hover` | `hover:bg-button-secondary-bg-hover` |
| `--button-secondary-text` | `--color-button-secondary-text` | `text-button-secondary-text` |
| `--button-secondary-border` | `--color-button-secondary-border` | `border-button-secondary-border` |
| `--button-danger-bg` | `--color-button-danger-bg` | `bg-button-danger-bg` |
| `--button-danger-bg-hover` | `--color-button-danger-bg-hover` | `hover:bg-button-danger-bg-hover` |
| `--button-danger-text` | `--color-button-danger-text` | `text-button-danger-text` |
| `--button-ghost-bg` | `--color-button-ghost-bg` | `bg-button-ghost-bg` |
| `--button-ghost-bg-hover` | `--color-button-ghost-bg-hover` | `hover:bg-button-ghost-bg-hover` |
| `--button-ghost-text` | `--color-button-ghost-text` | `text-button-ghost-text` |
| `--button-radius` | `--radius-button` | `rounded-button` |
| `--button-height-sm` | `--spacing-button-height-sm` | `h-button-height-sm` |
| `--button-height-md` | `--spacing-button-height-md` | `h-button-height-md` |
| `--button-height-lg` | `--spacing-button-height-lg` | `h-button-height-lg` |
| `--button-padding-x` | `--spacing-button-padding-x` | `px-button-padding-x` |
| `--button-font-weight` | `--font-weight-button` | `font-button` |
| `--button-font-size-sm` | `--font-size-button-sm` | `text-button-sm` |
| `--button-font-size-md` | `--font-size-button-md` | `text-button-md` |
| `--button-font-size-lg` | `--font-size-button-lg` | `text-button-lg` |

#### Card Tokens
| Old | New | Usage |
|-----|-----|-------|
| `--card-bg` | `--color-card-bg` | `bg-card-bg` |
| `--card-bg-hover` | `--color-card-bg-hover` | `hover:bg-card-bg-hover` |
| `--card-border` | `--color-card-border` | `border-card-border` |
| `--card-border-hover` | `--color-card-border-hover` | `hover:border-card-border-hover` |
| `--card-radius` | `--radius-card` | `rounded-card` |
| `--card-padding` | `--spacing-card-padding` | `p-card-padding` |
| `--card-title-font-size` | `--font-size-card-title` | `text-card-title` |
| `--card-title-font-weight` | `--font-weight-card-title` | `font-card-title` |
| `--card-description-font-size` | `--font-size-card-desc` | `text-card-desc` |

#### Toggle Tokens
| Old | New | Usage |
|-----|-----|-------|
| `--toggle-bg` | `--color-toggle-bg` | `bg-toggle-bg` |
| `--toggle-bg-active` | `--color-toggle-bg-active` | (inline style) |
| `--toggle-knob` | `--color-toggle-knob` | `bg-toggle-knob` |
| `--toggle-width` | `--spacing-toggle-width` | `w-toggle-width` |
| `--toggle-height` | `--spacing-toggle-height` | `h-toggle-height` |
| `--toggle-knob-size` | `--spacing-toggle-knob-size` | `w-toggle-knob-size` / `h-toggle-knob-size` |

#### Skeleton Tokens
| Old | New | Usage |
|-----|-----|-------|
| `--skeleton-bg` | `--color-skeleton-bg` | `bg-skeleton-bg` |
| `--skeleton-shimmer` | `--color-skeleton-shimmer` | (used in animation) |

#### Input Tokens
| Old | New | Usage |
|-----|-----|-------|
| `--input-bg` | `--color-input-bg` | `bg-input-bg` |
| `--input-border` | `--color-input-border` | `border-input-border` |
| `--input-border-hover` | `--color-input-border-hover` | `hover:border-input-border-hover` |
| `--input-border-focus` | `--color-input-border-focus` | `focus:border-input-border-focus` |
| `--input-text` | `--color-input-text` | `text-input-text` |
| `--input-placeholder` | `--color-input-placeholder` | `placeholder:text-input-placeholder` |
| `--input-radius` | `--radius-input` | `rounded-input` |
| `--input-height` | `--spacing-input-height` | `h-input-height` |
| `--input-padding-x` | `--spacing-input-padding-x` | `px-input-padding-x` |
| `--input-font-size` | `--font-size-input` | `text-input` |

#### Badge Tokens
| Old | New | Usage |
|-----|-----|-------|
| `--badge-radius` | `--radius-badge` | `rounded-badge` |
| `--badge-padding-x` | `--spacing-badge-padding-x` | `px-badge-padding-x` |
| `--badge-padding-y` | `--spacing-badge-padding-y` | `py-badge-padding-y` |
| `--badge-font-size` | `--font-size-badge` | `text-badge` |
| `--badge-font-weight` | `--font-weight-badge` | `font-badge` |
| `--badge-default-bg` | `--color-badge-default-bg` | `bg-badge-default-bg` |
| `--badge-default-text` | `--color-badge-default-text` | `text-badge-default-text` |
| `--badge-success-bg` | `--color-badge-success-bg` | `bg-badge-success-bg` |
| `--badge-success-text` | `--color-badge-success-text` | `text-badge-success-text` |
| `--badge-warning-bg` | `--color-badge-warning-bg` | `bg-badge-warning-bg` |
| `--badge-warning-text` | `--color-badge-warning-text` | `text-badge-warning-text` |
| `--badge-danger-bg` | `--color-badge-danger-bg` | `bg-badge-danger-bg` |
| `--badge-danger-text` | `--color-badge-danger-text` | `text-badge-danger-text` |
| `--badge-info-bg` | `--color-badge-info-bg` | `bg-badge-info-bg` |
| `--badge-info-text` | `--color-badge-info-text` | `text-badge-info-text` |

#### ChipTab Tokens
| Old | New | Usage |
|-----|-----|-------|
| `--chip-active-bg` | `--color-chip-active-bg` | `bg-chip-active-bg` |
| `--chip-active-text` | `--color-chip-active-text` | `text-chip-active-text` |
| `--chip-inactive-bg` | `--color-chip-inactive-bg` | `bg-chip-inactive-bg` |
| `--chip-inactive-text` | `--color-chip-inactive-text` | `text-chip-inactive-text` |
| `--chip-inactive-bg-hover` | `--color-chip-inactive-bg-hover` | `hover:bg-chip-inactive-bg-hover` |
| `--chip-radius` | `--radius-chip` | `rounded-chip` |
| `--chip-height-sm` | `--spacing-chip-height-sm` | `min-h-chip-height-sm` |
| `--chip-height-md` | `--spacing-chip-height-md` | `min-h-chip-height-md` |
| `--chip-height-lg` | `--spacing-chip-height-lg` | `min-h-chip-height-lg` |
| `--chip-padding-x` | `--spacing-chip-padding-x` | `px-chip-padding-x` |
| `--chip-font-weight` | `--font-weight-chip` | `font-chip` |
| `--chip-font-size` | `--font-size-chip` | `text-chip` |

#### SegmentedControl Tokens
| Old | New | Usage |
|-----|-----|-------|
| `--segment-bg` | `--color-segment-bg` | `bg-segment-bg` |
| `--segment-border` | `--color-segment-border` | `border-segment-border` |
| `--segment-active-bg` | `--color-segment-active-bg` | `bg-segment-active-bg` |
| `--segment-active-text` | `--color-segment-active-text` | `text-segment-active-text` |
| `--segment-inactive-text` | `--color-segment-inactive-text` | `text-segment-inactive-text` |
| `--segment-inactive-text-hover` | `--color-segment-inactive-text-hover` | `hover:text-segment-inactive-text-hover` |
| `--segment-radius` | `--radius-segment` | `rounded-segment` |
| `--segment-font-size` | `--font-size-segment` | `text-segment` |
| `--segment-font-weight` | `--font-weight-segment` | `font-segment` |

#### SelectionChip Tokens
| Old | New | Usage |
|-----|-----|-------|
| `--selection-border` | `--color-selection-border` | `border-selection-border` |
| `--selection-border-hover` | `--color-selection-border-hover` | `hover:border-selection-border-hover` |
| `--selection-text` | `--color-selection-text` | `text-selection-text` |
| `--selection-active-border` | `--color-selection-active-border` | `border-selection-active-border` |
| `--selection-active-bg` | `--color-selection-active-bg` | `bg-selection-active-bg` |
| `--selection-active-text` | `--color-selection-active-text` | `text-selection-active-text` |
| `--selection-radius` | `--radius-selection` | `rounded-selection` |
| `--selection-height` | `--spacing-selection-height` | `h-selection-height` |
| `--selection-font-size` | `--font-size-selection` | `text-selection` |
| `--selection-font-weight` | `--font-weight-selection` | `font-selection` |

#### Dialog Tokens
| Old | New | Usage |
|-----|-----|-------|
| `--dialog-bg` | `--color-dialog-bg` | `bg-dialog-bg` |
| `--dialog-border` | `--color-dialog-border` | `border-dialog-border` |
| `--dialog-radius` | `--radius-dialog` | `rounded-dialog` |
| `--dialog-padding` | `--spacing-dialog-padding` | `p-dialog-padding` |
| `--dialog-overlay` | `--color-dialog-overlay` | `backdrop:bg-dialog-overlay` |
| `--dialog-title-font-size` | `--font-size-dialog-title` | `text-dialog-title` |
| `--dialog-title-font-weight` | `--font-weight-dialog-title` | `font-dialog-title` |
| `--dialog-description-font-size` | `--font-size-dialog-desc` | `text-dialog-desc` |

#### Sidebar Tokens
| Old | New | Usage |
|-----|-----|-------|
| `--sidebar-bg` | `--color-sidebar-bg` | `bg-sidebar-bg` |
| `--sidebar-border` | `--color-sidebar-border` | `border-sidebar-border` |
| `--sidebar-width` | `--spacing-sidebar-width` | `w-sidebar-width` |
| `--sidebar-active-bg` | `--color-sidebar-active-bg` | `bg-sidebar-active-bg` |
| `--sidebar-active-text` | `--color-sidebar-active-text` | `text-sidebar-active-text` |
| `--sidebar-text` | `--color-sidebar-text` | `text-sidebar-text` |
| `--sidebar-hover-bg` | `--color-sidebar-hover-bg` | `hover:bg-sidebar-hover-bg` |

#### Select Tokens
| Old | New | Usage |
|-----|-----|-------|
| `--select-bg` | `--color-select-bg` | `bg-select-bg` |
| `--select-border` | `--color-select-border` | `border-select-border` |
| `--select-border-focus` | `--color-select-border-focus` | `focus:border-select-border-focus` |
| `--select-text` | `--color-select-text` | `text-select-text` |
| `--select-radius` | `--radius-select` | `rounded-select` |
| `--select-height` | `--spacing-select-height` | `h-select-height` |
| `--select-font-size` | `--font-size-select` | `text-select` |

#### Label Tokens (renamed to -comp to avoid text-label conflict)
| Old | New | Usage |
|-----|-----|-------|
| `--label-text` | `--color-label-comp-text` | `text-label-comp-text` |
| `--label-font-weight` | `--font-weight-label-comp` | `font-label-comp` |
| `--label-font-size` | `--font-size-label-comp` | `text-label-comp` |

### Dark Mode Overrides

Update `[data-theme="dark"]` section in `components.css`:
```css
[data-theme="dark"] {
  --color-sidebar-active-bg: rgba(255, 255, 255, 0.12);
  --color-button-secondary-bg: var(--color-surface);
  --color-button-ghost-bg-hover: var(--color-surface-hover);
  --color-dialog-bg: var(--color-surface);
  --color-dialog-border: var(--color-border);
}
```

### Files to Update (TSX)

1. `src/shared/components/ui/button.tsx` — button tokens + fix Layer 2 leak
2. `src/shared/components/ui/card.tsx` — card tokens
3. `src/shared/components/ui/badge.tsx` — badge tokens
4. `src/shared/components/ui/chip-tab.tsx` — chip tokens
5. `src/shared/components/ui/segmented-control.tsx` — segment tokens
6. `src/shared/components/ui/selection-chip.tsx` — selection tokens
7. `src/shared/components/ui/dialog.tsx` — dialog tokens
8. `src/shared/components/ui/input.tsx` — input + label tokens
9. `src/shared/components/ui/select.tsx` — select + label tokens
10. `src/shared/components/ui/label.tsx` — label tokens
11. `src/shared/components/ui/search-input.tsx` — input tokens
12. `src/shared/components/ui/toggle.tsx` — toggle tokens
13. `src/shared/components/ui/skeleton.tsx` — card tokens (reused)
14. `src/shared/components/layout/sidebar.tsx` — sidebar tokens
15. `src/shared/components/layout/layout.tsx` — sidebar-width
16. `src/shared/components/modal.tsx` — button + dialog tokens
17. `src/shared/components/common-modal.tsx` — dialog tokens
18. `src/shared/components/modals/error-modal.tsx` — button tokens
19. `src/shared/components/atoms/input.tsx` — input tokens
20. `src/shared/components/tab-item.tsx` — chip tokens
21. `src/features/product/components/add-up-menu.tsx` — input + button tokens
22. `src/features/store/components/add-up-store.tsx` — input + button tokens
23. `src/features/order/components/add-up-order.tsx` — input + button tokens
24. `src/features/transaction/pages/transaction-detail.tsx` — card tokens

### Build Verification
Run `yarn build` after all changes.