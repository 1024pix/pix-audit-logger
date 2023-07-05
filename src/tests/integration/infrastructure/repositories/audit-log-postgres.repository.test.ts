import { afterEach, describe, expect, test } from '@jest/globals';
import { AuditLog } from '../../../../lib/domain/models/audit-log.ts';
import { auditLogPostgresRepository } from '../../../../lib/infrastructure/repositories/audit-log-postgres.repository.ts';
import { knex } from '../../../../db/knex-database-connection.ts';

describe('Integration | Infrastructure | Repositories | AuditLogPostgresRepository', () => {

  afterEach(async() => {
    await knex('audit-log').truncate();
  })

  describe('create', () => {
    test('creates new audit log', async () => {
      // given
      const auditLog = new AuditLog({
        occurredAt: new Date ('2021-06-19T15:28:18.000Z'),
        action: 'ANONYMIZATION',
        userId: '1',
        targetUserId: '2',
        client: 'PIX_ADMIN',
        role: 'SUPER_ADMIN',
      });

      // when
      await auditLogPostgresRepository.create(auditLog);

      // then
      const result = await knex('audit-log').first();
      const expectedResult = new AuditLog({
        id: '1',
        occurredAt: new Date('2021-06-19T15:28:18.000Z'),
        action: 'ANONYMIZATION',
        userId: '1',
        targetUserId: '2',
        client: 'PIX_ADMIN',
        role: 'SUPER_ADMIN',
        createdAt: result.createdAt
      });
      expect(result).toEqual(expectedResult);
    })
  })
})
