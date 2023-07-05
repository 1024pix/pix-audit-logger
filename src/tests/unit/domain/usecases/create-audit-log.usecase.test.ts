import { describe, expect, jest, test } from '@jest/globals';
import { AuditLog } from '../../../../lib/domain/models/audit-log.ts';
import { CreateAuditLogUseCase } from '../../../../lib/domain/usecases/create-audit-log.usecase.ts';
import { type AuditLogRepository } from '../../../../lib/domain/interfaces/audit-log-repository.ts';

describe('Unit | UseCases | Create audit log', () => {
  describe('when an audit log is created', function () {
    test('returns an audit log', async () => {
      // given
      const auditLog = new AuditLog({
        targetUserId: '2',
        userId: '3',
        action: 'ANONYMIZATION',
        occurredAt: new Date('2023-07-05'),
        role: 'SUPPORT',
        client: 'PIX_ADMIN',
      });

      const auditLogRepository: AuditLogRepository = {
        create: jest.fn<AuditLogRepository['create']>(async () =>  {})
      };

      const createAuditLog = new CreateAuditLogUseCase(auditLogRepository);

      // when
      await createAuditLog.execute(auditLog);

      // then
      expect(auditLogRepository.create).toBeCalledWith(auditLog);
    });
  });
})
