import { type AuditLog } from '../models/audit-log';

export interface AuditLogRepository {
  create: (auditLog: AuditLog) => Promise<void>
}
