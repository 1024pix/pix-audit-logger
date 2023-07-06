import { CreateAuditLogUseCase } from './create-audit-log.usecase.ts';
import { auditLogPostgresRepository } from '../../infrastructure/repositories/audit-log-postgres.repository.ts';

const createAuditLogUseCase = new CreateAuditLogUseCase(auditLogPostgresRepository);

export {
  createAuditLogUseCase
};
