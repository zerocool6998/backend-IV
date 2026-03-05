import type { Pool } from "pg";
import type { AuditLogRow } from "../types.js";

type Queryable = Pick<Pool, "query">;

export async function appendAuditLog(
  pool: Queryable,
  input: {
    actorUserId?: string;
    entityType: string;
    entityId: string;
    action: string;
    metadata?: Record<string, unknown>;
  }
): Promise<AuditLogRow> {
  const result = await pool.query<AuditLogRow>(
    `insert into audit_logs (actor_user_id, entity_type, entity_id, action, metadata)
      values ($1, $2, $3, $4, $5)
      returning *`,
    [
      input.actorUserId ?? null,
      input.entityType,
      input.entityId,
      input.action,
      JSON.stringify(input.metadata ?? {})
    ]
  );

  return result.rows[0]!;
}
