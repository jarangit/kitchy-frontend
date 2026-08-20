# Feature: station

Station owns station CRUD, the station settings UI, and the station detail page.

## Scope

- Station create/update/delete
- Station settings screen
- Station detail page
- Station card/table/list UI

A Station is a preparation area within a Store that receives work for specific Products. A Store has many Stations. Use **Station** for the entity, not "Kitchen".

## Routes

- `/store/:id/settings/stations` — settings screen (wired into the store settings shell)
- `/store/:storeId/station/:id` — station detail

## Structure

```
src/features/station/
├── components/       # add-up-station.tsx, station-table.tsx, station-card.tsx, station-list.tsx
├── hooks/            # useStation.ts
├── pages/            # settings-stations.tsx, [station].tsx
├── services/         # station.ts
└── types/            # station.dto.ts, station.model.ts
```

## Key files

- `pages/settings-stations.tsx` — settings CRUD page
- `pages/[station].tsx` — station detail route
- `hooks/useStation.ts` — station queries/mutations
- `services/station.ts` — station API calls

## Notes

- The settings page lives in this feature even though it renders inside the `store` settings shell.
- Station selection on KDS/POS affects the visible work queue — keep context synchronized via `useStoreContextSync()`.