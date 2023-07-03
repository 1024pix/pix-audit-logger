import { Server, type ServerOptions } from '@hapi/hapi';

import { config } from './config';

const { port } = config;

const createServer = async (): Promise<Server> => {
  const server: Server = createBareServer();

  return server;
};

const createBareServer = function (): Server {
  const serverConfiguration: ServerOptions = {
    compression: false,
    debug: { request: false, log: false },
    routes: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['X-Requested-With'],
      },
      response: {
        emptyStatusCode: 204,
      },
    },
    port,
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true,
    },
  };

  return new Server(serverConfiguration);
};

export { createServer };
