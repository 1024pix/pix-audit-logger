import * as dotenv from 'dotenv';

dotenv.config();

import { logger } from '../../lib/infrastructure/logger.ts';
import { PGSQL_DUPLICATE_DATABASE_ERROR } from '../../lib/domain/errors.ts';
import PgClient from '../../lib/infrastructure/pg-client.ts';

(async () => {
  const dbUrl = (process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL) as string;
  const url = new URL(dbUrl);
  const dbNameToCreate = url.pathname.slice(1);
  let client: PgClient;

  url.pathname = '/postgres';

  try {
    client = await PgClient.createClient(url.href);
    await client.queryAndLog(`CREATE DATABASE ${dbNameToCreate};`);
    logger.info('Database created');
  } catch (error: any) {
    if (error.code === PGSQL_DUPLICATE_DATABASE_ERROR) {
      logger.info(`Database ${dbNameToCreate} already created`);
    } else {
      logger.error(error);
    }

    process.exitCode = 1;
  } finally {
    // @ts-ignore
    await client.end();
  }
})();
