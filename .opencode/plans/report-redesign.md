# Report Feature Redesign: Daily Snapshot

## Philosophy
> เจ้าของร้านอยากรู้เลข 1-2 ตัวไหนที่สุด ตอนปิดร้าน -- แล้วทำแค่นั้นก่อน

From "analytics dashboard" → "quick business check"
Target: owner sees everything in 10-20 seconds

## DELETE (4 component files + recharts)
- components/report-date-filter.tsx -- no date filter needed, today only
- components/revenue-chart.tsx -- no bar chart
- components/order-type-chart.tsx -- no donut chart
- components/payment-method-chart.tsx -- no donut chart
- `npm uninstall recharts` -- removes ~150KB from bundle

## SIMPLIFY (6 files)
- types/report.model.ts -- keep only IReportSummary (3 numbers) + ITopProduct
- types/report.dto.ts -- remove DateRangePreset complexity, just storeId
- data/mock-report-data.ts -- generate today only + top 3 products
- hooks/useReportData.ts -- no preset param, hardcode today
- components/report-summary-cards.tsx -- 3 cards only (Revenue, Orders, Avg), no % change
- components/top-products-list.tsx -- top 3, simple list, no progress bars
- pages/report-page.tsx -- Daily Snapshot layout: header + 3 cards + top 3

## KEEP (no changes)
- services/report.ts -- same mock wrapper pattern
- App.tsx route -- /store/:id/report
- sidebar.tsx -- Report icon

## Implementation Order
1. Delete 4 unused component files
2. Uninstall recharts
3. Simplify types
4. Simplify mock data
5. Simplify hook
6. Simplify report-summary-cards
7. Simplify top-products-list
8. Simplify report-page
9. Build test
