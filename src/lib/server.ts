import { Server } from '@hapi/hapi';

import { config } from './config.ts';
import { ROUTES } from './routes.ts';

const { port } = config;

export class HapiServer {
  private readonly _server: Server

  constructor() {
    this._server = new Server({
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
    })
   this._server.route(ROUTES);
  }

  get server(): Server {
    return this._server
  }

  async start(): Promise<void> {
    await this._server.start()
  }

  async stop(): Promise<void> {
    await this._server.stop()
  }

}
