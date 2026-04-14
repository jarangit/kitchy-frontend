# Report Feature v2: Time-Based Context Switching

## Philosophy
> หน้าเดียว เปลี่ยนช่วงเวลา แล้วข้อมูลเปลี่ยนตาม drill-down แบบ overlay

## Dependencies
- ADD: `react-day-picker` for calendar grid in Month mode

## NEW files (5)
- `components/time-segment-control.tsx` — [Today] [7 Days] [Month] pill toggle
- `components/revenue-card.tsx` — Hero card full-width, Revenue as the biggest number
- `components/metric-row.tsx` — 2 cards side-by-side: Orders + Avg/Order
- `components/calendar-view.tsx` — Calendar grid (react-day-picker) with dot hints, Month mode only
- `components/day-detail-dialog.tsx` — Dialog overlay showing daily snapshot on calendar day tap

## MODIFY files (6)
- `types/report.model.ts` — add ICalendarDay (date, revenue, orders)
- `types/report.dto.ts` — bring back DateRangePreset ("today" | "week" | "month"), add preset to IReportFilter
- `data/mock-report-data.ts` — generate data for 3 modes + calendar days array
- `services/report.ts` — accept filter with preset
- `hooks/useReportData.ts` — accept preset param again
- `pages/report-page.tsx` — rewrite with new component composition, state for preset + selectedDay

## DELETE files (1)
- `components/report-summary-cards.tsx` — replaced by revenue-card + metric-row

## KEEP (no changes)
- `components/top-products-list.tsx` — still used, just receives different data per mode
- Route in App.tsx — unchanged
- Sidebar — unchanged

## Layout per mode
- Today/7 Days: header → hero revenue → Orders+Avg row → Top 3 products
- Month: header → hero revenue → Orders+Avg row → Calendar grid (replaces top products)
- Day drill-down: Dialog overlay with date, revenue, orders, avg, top 3

## Implementation order
1. Install react-day-picker
2. Update types (model + dto)
3. Update mock data
4. Update service + hook
5. Create time-segment-control
6. Create revenue-card
7. Create metric-row
8. Create calendar-view
9. Create day-detail-dialog
10. Delete report-summary-cards
11. Update top-products-list (add title prop)
12. Rewrite report-page
13. Build test
