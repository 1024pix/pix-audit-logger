import Knex from 'knex';
import pg from 'pg';
import _ from 'lodash';

import { logger } from '../lib/infrastructure/logger';
import { config } from '../lib/config';
import { knexConfigs } from './knexfile';

const types = pg.types;

/*
By default, node-postgres casts a DATE value (PostgreSQL type) as a Date Object (JS type).
But, when dealing with dates with no time (such as birthdate for example), we want to
deal with a 'YYYY-MM-DD' string.
*/
types.setTypeParser(types.builtins.DATE, (value) => value);

const { environment } = config;
const knexConfig = knexConfigs[environment];
const configuredKnex = Knex(knexConfig);
const databaseName = configuredKnex.client.database();
const dbSpecificQueries = {
  listTablesQuery:
    'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_catalog = ?',
  emptyTableQuery: 'TRUNCATE ',
};

/* QueryBuilder Extension */
try {
  Knex.QueryBuilder.extend('whereInArray', function (column, values) {
    return this.where(column, configuredKnex.raw('any(?)', [values]));
  });
} catch (error) {
  if ((error as Error).message !== "Can't extend QueryBuilder with existing method ('whereInArray').") {
    logger.error(error);
  }
}
/* -------------------- */

async function disconnect(): Promise<void> {
  return configuredKnex.destroy();
}

async function emptyAllTables(): Promise<any> {
  const tableNames = await _listAllTableNames();
  const tablesToDelete = _.without(
    tableNames,
    'knex_migrations',
    'knex_migrations_lock',
    'view-active-organization-learners'
  );
  const tables = _.map(tablesToDelete, (tableToDelete) => `"${tableToDelete}"`).join();
  const query = dbSpecificQueries.emptyTableQuery;

  return configuredKnex.raw(`${query}${tables}`);
}

export { configuredKnex as knex, disconnect, emptyAllTables };

async function _listAllTableNames(): Promise<string[]> {
  const bindings = [databaseName];
  const resultSet = await configuredKnex.raw(dbSpecificQueries.listTablesQuery, bindings);
  const rows = resultSet.rows;

  return _.map(rows, 'table_name');
}
