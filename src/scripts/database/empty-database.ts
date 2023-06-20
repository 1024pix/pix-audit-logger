import { emptyAllTables, disconnect } from '../../db/knex-database-connection.ts';
import { logger } from '../../lib/infrastructure/logger.ts';

async function main(): Promise<void> {
  logger.info('Emptying all tables...');

  try {
    await emptyAllTables();
  } catch (error) {
    logger.error(error);
    process.exitCode = 1;
  } finally {
    await disconnect();
    logger.info('Done!');
  }
}

await main();
