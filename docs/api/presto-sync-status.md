# Presto Sync Status (Optional Backend Endpoint)

## When to implement

If the backend **returns immediately** from `POST /integrations/presto/sync/*` and runs sync in the background, the frontend's `isPending` state only lasts for the HTTP round-trip (1–2 seconds). Users could click sync again while the real sync is still running.

In that case, add a sync status endpoint so the frontend can show "sync in progress" for the full duration.

## Recommended endpoint

```
GET /api/v1/integrations/presto/sync/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "syncInProgress": true,
    "currentStep": "roster" | "schedule" | "stats" | "all" | null,
    "startedAt": "2026-02-19T20:00:00.000Z"
  }
}
```

- `syncInProgress`: `true` while any sync job is running.
- `currentStep`: Which sync type is running (if known).
- `startedAt`: When the current sync started.

## Frontend integration

When this endpoint exists, the frontend can:

1. Poll `GET /integrations/presto/sync/status` every 2–3 seconds while `syncInProgress` is true.
2. Show the sync banner until the backend reports `syncInProgress: false`.
3. Keep sync buttons disabled during that time.

## When not needed

If the backend **waits for the full sync** before responding (synchronous), `isPending` already covers the full duration. The frontend shows the sync banner for the whole request, and no status endpoint is required.
