import {HapiServer} from './server.ts';
import {logger} from './infrastructure/logger.ts';
import { config } from './config.ts';


const hapiServer: HapiServer = new HapiServer()

try {
  await hapiServer.start();
  logger.info(`Server started on http://localhost:${config.port}`);
} catch (error: unknown) {
  logger.error(`Error when launching server : `)
  logger.error(error)
  await hapiServer.stop()
}
