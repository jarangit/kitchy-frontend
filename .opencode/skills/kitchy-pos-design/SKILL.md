---
name: kitchy-pos-design
description: Kitchy POS design principles, UI patterns, and token system rules for building touch-first POS interfaces
---

# Kitchy POS Design DNA

These principles are **non-negotiable**. Every UI decision must pass through them.

---

## 1. Speed Over Everything

The POS must feel instant. A cashier processes 100+ orders/day — every 200ms delay compounds.

**Rules:**
- No loading spinners that block interaction. Use skeleton placeholders or optimistic UI.
- Transitions must be ≤150ms (`--motion-fast`). Never use `--motion-slow` for user-initiated actions.
- Avoid unnecessary re-renders. Memoize expensive lists (product grids, cart items).
- Prefetch data when possible (e.g., load products on store entry, not on POS open).
- No confirmation dialogs for reversible actions. Just do it and offer undo.

---

## 2. One Surface, No Navigation

Everything the cashier needs lives on one screen. Page changes kill speed.

**Rules:**
- POS home = product grid + cart. Never separate them into different pages.
- Use overlays/dialogs for secondary flows (payment, discounts). Not page navigation.
- Avoid nested navigation deeper than 2 levels in the POS flow.
- Sidebars and modals slide in. They don't push content away.
- The cart must always be visible while browsing products.

---

## 3. Zero Thinking UX

If a cashier has to think about what a button does, the design failed.

**Rules:**
- Labels over icons. Always include text labels. Icon-only buttons need `aria-label` AND a visible tooltip.
- Use action verbs: "Pay ฿120", "Add to Cart", "Print Receipt" — not "Submit", "Continue", "OK".
- Color = meaning. Green = money/success. Red = danger/delete. Don't use green for non-monetary actions.
- Group related actions visually. Payment methods together, cart actions together.
- Numbers should always include currency symbol: `฿120.00` not `120`.

---

## 4. Touch-First Always

This runs on tablets and touch screens. Mouse is secondary.

**Rules:**
- Minimum touch target: **44px** (`--button-height-md`). No exceptions.
- For frequently-tapped targets (product cards, +/- buttons): **56px** (`--button-height-lg`).
- Gap between adjacent touch targets: minimum **8px** (`--space-2`).
- Never rely on hover states for critical information. Hover enhances, never gates.
- Use `active:scale-[0.98]` for tap feedback on all interactive elements.
- Scrollable areas need generous padding at edges for thumb reach.

**Touch target reference:**
```
--button-height-sm: 36px   → secondary actions only
--button-height-md: 44px   → standard buttons, inputs
--button-height-lg: 56px   → primary actions, product cards
```

---

## 5. Calm and Minimal

The POS should feel like a quiet tool, not a dashboard screaming for attention.

**Rules:**
- Background hierarchy: `--color-bg` (base) → `--color-surface` (cards) → `--color-surface-hover` (interactive).
- Use the green primary (`--color-primary`) sparingly — only for: primary CTA, prices, success states.
- Text hierarchy: max 3 levels per view. `--color-text-primary` → `--color-text-secondary` → `--color-text-tertiary`.
- Borders are subtle: `--color-border` (1px). Never use thick or colored borders for decoration.
- White space is a feature. Don't fill every pixel. Use `--space-4` (16px) minimum padding inside cards.
- Font weights: Regular for body, Medium for labels, Bold for prices/totals only.
- No shadows heavier than `shadow-sm`. Use border + background instead.

---

## 6. Immediate Feedback

Every action must produce visible, instant feedback.

**Rules:**
- Buttons: `active:scale-[0.98]` + `transition-all duration-[var(--motion-fast)]`.
- Adding to cart: brief highlight/animation on the cart area.
- Errors: inline, next to the field. Never use alert() or generic toasts for form errors.
- Success states: green badge or checkmark, auto-dismiss after 2s.
- Disabled states: `opacity-50 cursor-not-allowed`. Never hide disabled actions — show them grayed out.
- Loading states for async actions: button shows spinner inside (same dimensions), not a separate overlay.

---

## 7. System Does the Work

Automate everything the cashier shouldn't think about.

**Rules:**
- Auto-calculate totals, taxes, change. Never ask the user to input a total.
- Smart defaults: most common payment method pre-selected, default quantity = 1.
- Pre-fill where possible: last used store, remembered preferences.
- Search is instant-filter (keydown), not submit-and-wait.
- Category "All" is always available and selected by default.
- When cart is empty, show a calm empty state with a hint — not a blank void.

---

# Token System Architecture

## 3-Layer Strict Rule

```
Layer 1: Primitive    →  Raw values (--gray-500, --green-500)
Layer 2: Semantic     →  Meaning-based (--color-primary, --color-text-primary)
Layer 3: Component    →  Per-component (--button-primary-bg, --card-bg)
```

### What to use where

| Context | Use this layer | Example |
|---|---|---|
| `shared/components/ui/*` | Component tokens (Layer 3) | `var(--button-primary-bg)` |
| Feature components (`features/pos/components/*`) | Semantic tokens (Layer 2) | `var(--color-text-primary)`, `var(--color-border)` |
| Feature components — using shared UI | Import shared component, don't restyle | `<Button variant="primary">` |
| New shared component | Create new component tokens in `index.css` first | Define `--badge-*` tokens, then use them |

### DO / DON'T

```tsx
// ✅ CORRECT — shared Button uses component tokens
bg-[var(--button-primary-bg)]
text-[var(--button-primary-text)]

// ✅ CORRECT — feature component uses semantic tokens
text-[var(--color-text-primary)]
border-[var(--color-border)]
bg-[var(--color-surface)]

// ❌ WRONG — primitive token in a component
bg-[var(--gray-100)]
text-[var(--green-500)]

// ❌ WRONG — hardcoded color
bg-green-500
text-[#34c759]
bg-white
text-gray-900

// ❌ WRONG — Tailwind default palette (bypasses token system)
bg-slate-100
text-zinc-600
border-neutral-200
```

### Adding a new shared component

1. Define component tokens in `:root` block of `src/app/index.css`
2. Add dark mode overrides in `[data-theme="dark"]` if needed
3. Create the component in `src/shared/components/ui/`
4. Use ONLY the new component tokens inside it

---

# Dark Mode Checklist

When adding or modifying any UI:

- [ ] Use semantic tokens (`--color-*`), never hardcoded colors
- [ ] Background uses `--color-bg` or `--color-surface`, not `bg-white`
- [ ] Text uses `--color-text-primary/secondary/tertiary`, not `text-gray-*`
- [ ] Borders use `--color-border`, not `border-gray-*`
- [ ] Status colors use semantic: `--color-success`, `--color-danger`, etc.
- [ ] Test by adding `data-theme="dark"` to `<html>` and visually checking
- [ ] Overlays use `--color-overlay` for backdrop

---

# Available Shared Components

Import from `@/shared/components/ui/*`:

| Component | Variants | Sizes | File |
|---|---|---|---|
| `Button` | `primary`, `secondary`, `danger`, `ghost` | `sm`, `md`, `lg`, `icon` | `button.tsx` |
| `Card` + `CardHeader` + `CardTitle` + `CardContent` | — | — | `card.tsx` |
| `Badge` | `default`, `success`, `danger`, `warning`, `info` | — | `badge.tsx` |
| `Dialog` | — | — | `dialog.tsx` |
| `Select` | — | — | `select.tsx` |
| `Input` | — | — | `input.tsx` |
| `Label` | — | — | `label.tsx` |

**Always use these instead of creating one-off styled elements.**

---

# Component Pattern Template

When building a new POS component:

```tsx
// 1. Props interface inline — no separate file
interface Props {
  items: Item[];
  onAction: (id: number) => void;
}

// 2. Named function or const — consistent with codebase
const MyComponent = ({ items, onAction }: Props) => {
  return (
    // 3. Use semantic tokens for layout
    <div className="bg-[var(--color-surface)] rounded-xl p-[var(--space-4)]">

      {/* 4. Touch target ≥ 44px */}
      <button
        onClick={() => onAction(item.id)}
        className="
          h-11 min-w-[44px]
          bg-[var(--color-bg)]
          border border-[var(--color-border)]
          rounded-xl
          active:scale-[0.98]
          transition-all duration-[var(--motion-fast)]
        "
      >
        {/* 5. Labels with text hierarchy */}
        <span className="text-sm font-medium text-[var(--color-text-primary)]">
          {item.name}
        </span>
        {/* 6. Prices in green, with currency */}
        <span className="font-bold text-[var(--color-success)]">
          ฿{item.price.toFixed(2)}
        </span>
      </button>
    </div>
  );
};

export default MyComponent;
```
