# Webhook Failing Signature Verification

## Symptoms
- Incoming webhook requests return `400`
- Logs show `invalid_signature`

## Queries
```sql
select id, provider, provider_event_id, status, processing_result, last_error, received_at, processed_at
from webhook_events
where provider = $1 and provider_event_id = $2;
```

## Immediate Checks
- Confirm `STRIPE_WEBHOOK_SECRET` or `PADDLE_WEBHOOK_SECRET` matches the provider dashboard
- Confirm reverse proxies are not rewriting the raw body
- Confirm the expected signature header is present

## Escalate
- Escalate if signatures fail across all events after a secret rotation
