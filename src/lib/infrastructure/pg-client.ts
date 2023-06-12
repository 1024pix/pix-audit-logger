import pg from 'pg';

const { Client } = pg;

export default class PgClient {
  private client: pg.Client;

  constructor(databaseUrl: string) {
    this.client = new Client({ connectionString: databaseUrl, connectionTimeoutMillis: 10000 });
  }

  end(): Promise<void> {
    return this.client.end();
  }

  queryAndLog(query: string | pg.QueryConfig): Promise<any> {
    console.log(`query: ${query}`);
    return this.client.query(query).then((result: any) => {
      const { command, rowCount, rows } = result;
      console.log(`result: command ${command} (rowCount ${rowCount}) = ${JSON.stringify(rows)}`);
      return result;
    });
  }

  static async createClient(databaseUrl: string): Promise<PgClient> {
    const instance = new PgClient(databaseUrl);

    try {
      await instance.client.connect();
    } catch (error) {
      console.error('Database error', error);
    }

    return instance;
  }
}
