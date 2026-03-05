# Unknown Checkout Correlation

## Symptoms
- Webhooks are marked `ignored`
- `processing_result.reason = unknown_correlation`

## Queries
```sql
select id, provider, provider_event_id, status, processing_result, last_error, received_at, processed_at
from webhook_events
where provider = $1 and provider_event_id = $2;
```

```sql
select o.id, o.status, o.user_id, o.guest_email, o.checkout_session_id,
       p.id as payment_id, p.status as payment_status
from orders o
left join payments p on p.order_id = o.id
where o.checkout_session_id = $1;
```

## Immediate Checks
- Confirm provider metadata includes `checkout_session_id`
- Confirm `checkout_sessions.provider_session_id` matches the provider payload fallback id

## Escalate
- Escalate if correlation fails for newly created checkout sessions across a provider
