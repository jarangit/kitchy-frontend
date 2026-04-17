# Apple Newsroom–Inspired UI Style Guide

> **Skill name**: `apple-newsroom-style`
> **Use when**: Creating, modifying, or reviewing any UI component, page, or layout in this project.
> **Description**: Comprehensive UI style guide for building calm, editorial, premium product-app interfaces inspired by Apple Newsroom.

This repo is the authenticated Kitchy product app only. Apply this style to operational screens such as POS, KDS, store dashboards, settings, reports, transactions, products, stations, and orders. Do not create landing pages, marketing pages, public websites, campaign pages, SEO pages, or promotional hero layouts in this repo; those belong in `/Users/jaran/Documents/dev/personal/kitchy/kitchy-landing`.

---

## Project-Specific Implementation

### Token Files

| Layer | File | Usage |
|---|---|---|
| Primitive | `src/app/tokens/primitives.css` | Raw values — never use directly in components |
| Semantic | `src/app/tokens/semantic.css` | Use in feature components (`text-text-primary`, `bg-surface`, etc.) |
| Component | `src/app/tokens/components.css` | Use in shared UI components (`bg-card-bg`, `border-card-border`, etc.) |
| Theme | `src/app/theme.css` | `@theme inline` registration + `@utility` composites |

### Typography Utilities

Use these `@utility` composite classes (defined in `theme.css`):

| Class | Purpose |
|---|---|
| `text-display` | App page titles and major product headings |
| `text-heading` | Section headings, large numbers |
| `text-title` | Card titles, modal titles |
| `text-subtitle` | Sub-headings, secondary titles |
| `text-body` | Body text |
| `text-body-sm` | Secondary body, metadata |
| `text-label` | Form labels, small UI text |
| `text-caption` | Timestamps, tertiary metadata |

### Semantic Color Utilities

Use Tailwind shorthand — not `var()` syntax:

| Token | Tailwind Class |
|---|---|
| `--color-text-primary` | `text-text-primary` |
| `--color-text-secondary` | `text-text-secondary` |
| `--color-text-tertiary` | `text-text-tertiary` |
| `--color-bg` | `bg-bg` |
| `--color-surface` | `bg-surface` |
| `--color-border` | `border-border` |
| `--color-primary` | `bg-primary`, `text-primary` |

### Existing Shared Components

Always reuse before creating new:

| Component | File | Tokens |
|---|---|---|
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` | `shared/components/ui/card.tsx` | `bg-card-bg`, `border-card-border`, `rounded-card`, `p-card-padding` |
| `Button` | `shared/components/ui/button.tsx` | `bg-button-primary-bg`, etc. |
| `Dialog` | `shared/components/ui/dialog.tsx` | `bg-dialog-bg`, `rounded-dialog` |
| `Badge` | `shared/components/ui/badge.tsx` | Component tokens |
| `Input` | `shared/components/ui/input.tsx` | Component tokens |
| `Select` | `shared/components/ui/select.tsx` | Component tokens |
| `Label` | `shared/components/ui/label.tsx` | Component tokens |
| `Skeleton`, `SkeletonCard` | `shared/components/ui/skeleton.tsx` | Mirrors Card tokens |

### Weight Tokens

Use `font-[var(--weight-*)]` — never raw numeric values:

- `--weight-regular` (400)
- `--weight-medium` (500)
- `--weight-semibold` (600)

Avoid 700 (bold). Let spacing and scale create hierarchy, not weight.

### Radius Tokens

Use `rounded-radius-*` classes:

- `rounded-radius-sm`
- `rounded-radius-md`
- `rounded-radius-lg` (default for cards)
- `rounded-radius-xl`
- `rounded-radius-2xl`
- `rounded-radius-full` (pills, avatars)

### Motion Tokens

Use `duration-[var(--motion-fast)]` for all transitions. Keep interactions subtle.

---

## Goal

Create product app UI that feels calm, editorial, premium, and highly readable, inspired by Apple Newsroom. This style is structured, restrained, workflow-first, and content-first.

---

## 1. Design DNA

### 1.1 Content first

The interface should make articles, headlines, images, and dates feel more important than UI chrome.

- UI should disappear behind content.
- Headlines, thumbnails, spacing, and grouping carry the experience.
- Avoid decorative elements unless they improve scanning.

### 1.2 Quiet premium

The page should feel expensive through restraint, not visual effects.

- Use soft neutrals, not loud colors.
- Avoid heavy shadows, gradients, glossy cards, and dense borders.
- Use whitespace generously.

### 1.3 Editorial rhythm

The layout should feel like a modern magazine grid.

- Use clear section blocks with strong vertical spacing.
- Mix card sizes for visual hierarchy.
- Lead stories should be larger and more prominent.

### 1.4 Consistent calm

Nothing should scream for attention.

- Only one or two focal areas per section.
- Use accent color sparingly.
- Keep interactions subtle and predictable.

### 1.5 Scannable hierarchy

A user should understand the page within a few seconds.

- Section title first.
- Lead story second.
- Supporting cards third.
- Metadata remains visible but secondary.

---

## 2. Visual Characteristics

### 2.1 Overall feel

- Neutral light background
- Thin, quiet top navigation
- Generous spacing between sections
- Rounded cards with soft edges
- Strong image usage
- Typography-led hierarchy
- Low-noise footer

### 2.2 What makes it feel like Apple Newsroom

- Minimal black/gray navigation
- Large content canvas centered on page
- Cards with very soft contrast from background
- Headlines that are serious, editorial, and readable
- Dates and categories are understated
- Large lead content followed by supporting content blocks
- No visual clutter, no marketing overload

---

## 3. Layout System

### 3.1 Page structure

Use this page rhythm:

1. Top global navigation
2. Primary content section with lead cards
3. Secondary editorial/story section
4. News list / archive section
5. Minimal footer

### 3.2 Content width

- Use a centered content container.
- Recommended max width: 1120px–1280px
- Avoid full-bleed content except when intentionally featured.

### 3.3 Grid system

Use a magazine-like responsive grid.

- **Desktop**: 12-column grid, gap 20–24px
- **Tablet**: 8-column grid
- **Mobile**: 4-column grid

### 3.4 Section rhythm

- Section top margin: 64–96px
- Section bottom margin: 64–96px
- Heading to content gap: 20–32px

### 3.5 Card rhythm

Support three card scales:

- **Hero card**: large, dominant
- **Feature card**: medium
- **Standard card**: compact

---

## 4. Card Design Principles

### 4.1 Card behavior

Cards should feel like editorial blocks, not dashboard widgets.

- Rounded corners
- Soft, almost invisible border or no border
- No strong drop shadow
- Image-first composition when content supports it
- Comfortable internal padding

### 4.2 Card hierarchy

- **Hero card**: Large image area, strong headline, supporting metadata below or beside
- **Feature card**: Medium image, headline with 2–3 lines max, small metadata
- **Standard card**: Compact image, short headline, date/category below

### 4.3 Card composition rules

- Image aspect ratios should be consistent within the same group.
- Headline line-clamp should be controlled.
- Metadata should never compete with headline.
- Avoid too many badges, pills, icons, or labels.

---

## 5. Typography System

Typography is the main tool for hierarchy. It should feel editorial, clean, and modern.

### 5.1 Tone

- Serious, refined, highly legible
- More editorial than app-like
- Avoid overly playful type treatments

### 5.2 Font direction

Best choices: SF Pro Display / SF Pro Text, or close alternatives: Inter, Helvetica Neue, Sarabun for Thai pairing if needed.

### 5.3 Type scale

| Token | Size / Line-height |
|---|---|
| display-lg | 48 / 56 |
| display-md | 40 / 48 |
| heading-xl | 32 / 40 |
| heading-lg | 24 / 32 |
| heading-md | 20 / 28 |
| body-lg | 18 / 28 |
| body-md | 16 / 24 |
| body-sm | 14 / 20 |
| caption | 12 / 16 |

### 5.4 Weight strategy

- Use 400, 500, 600 mostly
- Avoid overusing very bold weights
- Let spacing and scale create hierarchy

### 5.5 Text usage rules

- Headlines: dark, clear, restrained
- Body: neutral dark gray
- Metadata: lighter gray
- Navigation: compact and quiet

---

## 6. Color System

### 6.1 Color philosophy

Color should support content, not dominate it.

### 6.2 Base palette

| Token | Value |
|---|---|
| bg.page | #F5F5F7 |
| bg.surface | #FFFFFF |
| bg.subtle | #FBFBFD |
| text.primary | #1D1D1F |
| text.secondary | #6E6E73 |
| text.tertiary | #86868B |
| border.subtle | #E5E5EA |
| nav.dark | #1D1D1F |
| nav.dark-muted | #2C2C2E |

### 6.3 Accent usage

- Link blue only where needed
- Section emphasis should come from layout, not saturated color
- Avoid colorful UI chrome

### 6.4 Contrast rules

- Text contrast must remain high
- Metadata should be lighter but still legible
- Cards should separate from background with tone more than shadow

---

## 7. Spacing and Density

### 7.1 Spacing scale

4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

### 7.2 Density rules

- Prefer airy layouts over dense ones
- Don't pack too many cards into one viewport row unless they are clearly secondary
- Let the page breathe

---

## 8. Navigation Style

### 8.1 Top bar

- Small height
- Dark background or subtle neutral depending on brand
- Compact labels
- No oversized buttons
- Search and utility actions should be understated

### 8.2 Navigation behavior

- Clear categories
- Minimal hover effects
- Current state subtle, not loud

---

## 9. Imagery Direction

### 9.1 Image rules

- High quality only
- Clean crops
- Consistent corner radius
- Avoid busy overlays on every card
- Use images only when they support product context or item recognition

### 9.2 Image treatment

- No heavy filters
- No aggressive gradients unless needed for text contrast
- Keep imagery crisp and premium

---

## 10. Interaction Style

### 10.1 Motion

- Fast fades
- Light hover elevation or tint changes
- No bouncy app-like behavior

### 10.2 Hover/focus

- Understated transitions
- Slight opacity or surface shift
- Keyboard focus visible and accessible

### 10.3 Scrolling

Screens should feel continuous and editorial while still supporting fast operational workflows.

---

## 11. Content Strategy Rules

### 11.1 Headlines

- Short, calm, precise
- Avoid hype language
- Let the product or story speak for itself

### 11.2 Metadata

Use a quiet pattern: Category, Date, Small supporting info.

### 11.3 Section naming

Keep section titles simple and product-specific: Orders, Reports, Settings, Products, Stations, Transactions.

---

## 12. Component Guidance

### 12.1 Page-level components

AppShell, Sidebar, SectionHeader, DataCard, DetailPanel, Toolbar, FilterBar, EmptyState, Dialog.

### 12.2 Story card tokens

Each card should use component tokens only. Example:

- `--card-bg`
- `--card-radius`
- `--card-padding`
- `--card-title-color`
- `--card-meta-color`

### 12.3 Section tokens

- `--section-gap`
- `--section-title-size`
- `--section-title-color`
- `--section-content-gap`

---

## 13. What To Avoid

- Heavy shadows
- Loud gradients
- Bright multi-color UI chrome
- Dashboard-style metric cards
- Overly dense grids
- Too many labels or pills on each card
- Thick borders everywhere
- Bold typography everywhere
- Excessive animations
- Multiple competing CTAs

---

## 14. Design Token Direction

### 14.1 Primitive tokens

Set raw values first: grayscale, neutral backgrounds, spacing scale, radius scale, type scale.

### 14.2 Semantic tokens

Map meaning: `color.bg.page`, `color.bg.surface`, `color.text.primary`, `color.text.secondary`, `color.border.subtle`, `space.section`, `radius.card`, `text.heading.lg`.

### 14.3 Component tokens

UI components should call component tokens only. Examples: `card.bg`, `card.radius`, `sidebar.bg`, `table-row.padding`.

---

## 15. Suggested Token Starter Set

### Color

- `color.bg.page`
- `color.bg.surface`
- `color.bg.subtle`
- `color.text.primary`
- `color.text.secondary`
- `color.text.tertiary`
- `color.border.subtle`
- `color.nav.background`
- `color.nav.text`

### Typography

- `text.display.lg`
- `text.heading.xl`
- `text.heading.lg`
- `text.heading.md`
- `text.body.lg`
- `text.body.md`
- `text.body.sm`
- `text.caption`

### Spacing

- `space.1` through `space.12`
- `space.section`
- `space.card`
- `space.inline`

### Radius

- `radius.sm`
- `radius.md`
- `radius.lg`
- `radius.xl`

### Shadows

Use sparingly:

- `shadow.none`
- `shadow.soft`

---

## 16. Tailwind v4 Implementation Direction

- Use CSS variables as source of truth.
- Map semantic tokens into Tailwind theme via `@theme inline`.
- Let components consume component tokens only.
- Do not write raw hex values in components.
- Do not use arbitrary spacing values in components.
- Keep card styles centralized.

---

## 17. Final Style Summary

> Build a calm editorial interface where content leads, layout breathes, and premium feeling comes from restraint.

> Do not design a dashboard. Design a publication surface.
