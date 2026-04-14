# Report Feature Implementation Plan

## Overview
Create a full-featured Report page for store owners to view sales analytics, order summaries, product performance, and payment breakdowns. Uses mock data initially, with service layer ready to swap to real API.

## Dependencies
- Install `recharts` for chart components

## New Files

### 1. Types
- `src/features/report/types/report.model.ts` — IReportSummary, IDailySales, IOrderTypeBreakdown, IPaymentMethodBreakdown, ITopProduct, IReportData
- `src/features/report/types/report.dto.ts` — DateRangePreset, IReportFilter

### 2. Mock Data
- `src/features/report/data/mock-report-data.ts` — Realistic mock data generator for 30 days of sales with Thai menu items

### 3. Service Layer
- `src/features/report/services/report.ts` — getReportData(filter) returns mock data, structured to swap to API later

### 4. Hook
- `src/features/report/hooks/useReportData.ts` — React Query hook wrapping service, takes filter params

### 5. Components
- `src/features/report/components/report-date-filter.tsx` — Date range selector (Today/Week/Month/Custom presets)
- `src/features/report/components/report-summary-cards.tsx` — 4 stat cards (revenue, orders, avg order value, cancelled) with % change
- `src/features/report/components/revenue-chart.tsx` — Line/Bar chart for daily revenue trend
- `src/features/report/components/order-type-chart.tsx` — Donut chart for DINE_IN/TOGO/DELIVERY breakdown
- `src/features/report/components/payment-method-chart.tsx` — Donut chart for CASH/QR breakdown
- `src/features/report/components/top-products-list.tsx` — Ranked list of top 10 selling products

### 6. Page
- `src/features/report/pages/report-page.tsx` — Main report page composing all components

## Modified Files

### 7. Router
- `src/app/App.tsx` — Add route `/store/:id/report` pointing to ReportPage

### 8. Sidebar
- `src/shared/components/layout/sidebar.tsx` — Add "Report" nav item with LuBarChart3 icon, positioned between History and KDS

## Implementation Order
1. Install recharts
2. Create types (model + dto)
3. Create mock data
4. Create service layer
5. Create hook
6. Create components (summary cards → revenue chart → donut charts → top products → date filter)
7. Create report-page.tsx
8. Add route + sidebar menu
9. Test build

## Design Guidelines
- Follow existing design token system (Layer 2 semantic tokens for feature components)
- Use Card component from shared/components/ui/card.tsx
- Match stat card pattern from store-dashboard.tsx
- Currency: Thai Baht (฿), locale th-TH
- Responsive: 2-col on mobile, 4-col on desktop for stat cards
- Charts use monochrome palette matching the design system (--color-primary, --color-text-secondary)
