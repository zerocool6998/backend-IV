# Entitlements Missing After Payment

## Symptoms
- User paid successfully but `GET /me/library` is missing a purchased product

## Queries
```sql
select o.id, o.status, o.user_id, o.guest_email, o.checkout_session_id,
       p.id as payment_id, p.status as payment_status
from orders o
left join payments p on p.order_id = o.id
where o.checkout_session_id = $1;
```

```sql
select id, user_id, product_id, first_order_id, last_order_id, status, revoked_reason,
       granted_at, updated_at, revoked_at
from entitlements
where user_id = $1 or last_order_id = $2
order by updated_at desc;
```

```sql
select order_id, expires_at, created_at
from download_tokens
where token_hash = $1;
```

## Immediate Checks
- Confirm the webhook normalized to `payment_succeeded`
- Confirm the order is account-owned before expecting `/me/library`
- For guest orders, verify a `download_tokens` row exists instead

## Escalate
- Escalate if `payment_succeeded` is recorded but entitlement upserts are absent in the same time window
