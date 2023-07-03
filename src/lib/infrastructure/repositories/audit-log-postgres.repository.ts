import { type AuditLog } from '../../domain/models/audit-log.ts';
import { type AuditLogRepository } from '../../domain/interfaces/audit-log.repository.ts';
import {knex} from '../../../db/knex-database-connection.ts';

export class AuditLogPostgresRepository implements AuditLogRepository {
  async create(auditLog: AuditLog): Promise<void> {
    await knex('audit-log').insert(auditLog)
  }
}
