import * as dotenv from 'dotenv';
import { Knex } from 'knex';

dotenv.config();

type BooleanType = 'true' | 'false';
type KnexConfig = {
  development: Knex.Config;
  production: Knex.Config;
  test: Knex.Config;
};

const knexConfigs: KnexConfig = {
  development: _localPostgresEnv(process.env.DATABASE_URL as string, process.env.KNEX_ASYNC_STACKTRACE_ENABLED as BooleanType),

  test: _localPostgresEnv(process.env.TEST_DATABASE_URL as string, process.env.KNEX_ASYNC_STACKTRACE_ENABLED as BooleanType),

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: parseInt(process.env.DATABASE_CONNECTION_POOL_MIN_SIZE as string, 10) || 1,
      max: parseInt(process.env.DATABASE_CONNECTION_POOL_MAX_SIZE as string, 10) || 4,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
    asyncStackTraces: process.env.KNEX_ASYNC_STACKTRACE_ENABLED !== 'false',
  },
};

export { knexConfigs };

function _localPostgresEnv(databaseUrl: string, knexAsyncStacktraceEnabled: BooleanType): Knex.Config {
  return {
    client: 'postgresql',
    connection: databaseUrl,
    pool: {
      min: 1,
      max: 4,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
    asyncStackTraces: knexAsyncStacktraceEnabled !== 'false',
  };
}
