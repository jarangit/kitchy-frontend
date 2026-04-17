# Kitchy UI Design Audit Checklist

Use this checklist for each page in the authenticated product app (Dashboard, POS, KDS, Orders, Transactions, Reports, Settings).

## 1) Token Compliance

- [ ] No hardcoded colors (`bg-[#...]`, `text-[#...]`, `border-[#...]`)
- [ ] No hardcoded visual style values when token utility exists
- [ ] Prefer component tokens (`bg-card-bg`, `border-card-border`, `rounded-card`, `p-card-padding`)
- [ ] Reuse shared UI components before creating new ones
- [ ] Consistent use of tokenized interactive states (hover/focus/active)

## 2) Layout Rhythm

- [ ] Page header spacing is consistent with product app rhythm
- [ ] Section gaps are breathable (not dense)
- [ ] Card/list spacing follows calm editorial hierarchy
- [ ] Mobile and desktop spacing both reviewed
- [ ] No accidental dense table/admin feeling in operational screens

## 3) Visual Hierarchy

- [ ] Primary action and page title are visually clear
- [ ] Secondary metadata uses quieter text styles
- [ ] Amount/time/status scan quickly in list rows
- [ ] Borders are subtle and not overused
- [ ] Emphasis uses typography and spacing first, border second

## 4) Interaction Quality

- [ ] Clear active state for filters/chips/tabs
- [ ] Rows/cards are clearly tappable/clickable
- [ ] Focus visible states are present on interactive elements
- [ ] Motion is subtle and purposeful
- [ ] Empty/loading/error states match the same visual language

## 5) Product Consistency

- [ ] Matches Dashboard / POS / Report style language
- [ ] Uses same component anatomy for repeated patterns (rows, filters, cards)
- [ ] Copywriting tone is consistent per screen language (TH/EN)
- [ ] Avoids marketing/landing visual patterns in app screens

## Priority Rollout

1. POS core flows (`src/features/pos/pages/pos-home.tsx`, `src/features/pos/pages/payment.tsx`)
2. Orders + Transactions (`src/features/order/**`, `src/features/transaction/**`)
3. KDS operational board (`src/features/kds/**`)
4. Reports + Settings polish (`src/features/report/**`, `src/features/store/pages/settings*.tsx`)

## Done in this pass

- Transaction list visual refinement and hierarchy pass
- Transaction row readability and focus-state polish
- POS payment page: tokenized card treatment for payment method panel
- POS home page: tokenized borders/surfaces for cart shell and mobile cart panel
- Store user dashboard: removed explicit `any` in store card mapping
