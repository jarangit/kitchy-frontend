# Feature: report

Report owns the reporting UI, time-segment presets, monthly breakdown views, and the report service.

## Scope

- Report overview (summary metrics, revenue cards, top products, payment breakdown)
- Time-segment control (day/month)
- Monthly calendar + table breakdown
- Report service + mock data

A Report is an analytical summary for a Store over a chosen time range, distinct from the Transaction list.

## Routes

- `/store/:id/report`
- `/store/:id/settings/report` — served by `store/components/settings/section-report.tsx`

## Structure

```
src/features/report/
├── components/
│   ├── report-context-card.tsx, revenue-card.tsx, metric-row.tsx
│   ├── time-segment-control.tsx
│   ├── month-report-calendar.tsx, month-report-chart.tsx
│   ├── month-report-panel.tsx, month-report-table.tsx
│   └── day-detail-dialog.tsx
├── data/             # mock-report-data.ts
├── hooks/            # useReportData.ts
├── pages/            # report.tsx
├── services/         # report.ts
└── types/            # report.dto.ts, report.model.ts
```

## Key files

- `pages/report.tsx` — the report screen
- `hooks/useReportData.ts` — report data queries/selectors
- `services/report.ts` — report API calls
- `data/mock-report-data.ts` — generated sample data
- `src/features/store/components/settings/section-report.tsx` — the settings control-panel section that embeds this feature

## Notes

- **Gotcha:** non-demo mode still returns generated mock data, not a real API response. This is a known drift item.