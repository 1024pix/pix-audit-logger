import * as dotenv from 'dotenv';

dotenv.config();

import { logger } from '../../lib/infrastructure/logger.ts';
import { PGSQL_NON_EXISTENT_DATABASE_ERROR } from '../../lib/domain/errors.ts';
import PgClient from '../../lib/infrastructure/pg-client.ts'

function preventDatabaseDropOnScalingoPlatform() {
  if (_isPlatformScalingo()) {
    logger.error('Database will not be dropped, as it would require to recreate the addon');
    process.exitCode = 1;
  }
}

(async () => {
  preventDatabaseDropOnScalingoPlatform();

  const dbUrl = (process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL) as string;
  const url = new URL(dbUrl);
  const dbNameToDelete = url.pathname.slice(1);
  let client: PgClient;

  url.pathname = '/postgres';

  try {
    client = await PgClient.createClient(url.href);
    await client.queryAndLog(`DROP DATABASE ${dbNameToDelete}${_withForceOption()};`);
    logger.info('Database dropped');
  } catch (error: any) {
    if (error.code === PGSQL_NON_EXISTENT_DATABASE_ERROR) {
      logger.info(`Database ${dbNameToDelete} does not exist`);
    } else {
      logger.error(error);
    }

    process.exitCode = 1;
  } finally {
    // @ts-ignore
    await client.end();
  }
})();

function _isPlatformScalingo(): boolean {
  return Boolean(process.env.CONTAINER);
}

function _withForceOption(): string {
  return process.env.FORCE_DROP_DATABASE === 'true' ? ' WITH (FORCE)' : '';
}
