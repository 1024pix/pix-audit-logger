import { emptyAllTables, disconnect } from '../../db/knex-database-connection.ts';
import { logger } from '../../lib/infrastructure/logger.ts';

async function main() {
  logger.info('Emptying all tables...');
  await emptyAllTables();
  logger.info('Done!');
}

(async () => {
  try {
    await main();
  } catch (error) {
    logger.error(error);
    process.exitCode = 1;
  } finally {
    await disconnect();
  }
})();
