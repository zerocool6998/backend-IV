# Downloads Failing / Storage Creds

## Symptoms
- `/ready` returns `503`
- Download-link issuance fails despite valid entitlements

## Queries
```sql
select channel, outcome, deny_reason, product_id, product_file_id, created_at
from download_link_events
where identity_key = $1
order by created_at desc
limit 50;
```

## Immediate Checks
- Verify `STORAGE_ENDPOINT`, `STORAGE_BUCKET`, and credentials
- Confirm the storage healthcheck object exists if `STORAGE_HEALTHCHECK_KEY` is set
- Confirm uploaded objects are present and private

## Escalate
- Escalate if signed URLs are generated but storage `HEAD` requests fail for known objects
