import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import { routes } from './routes';
import logger from './logger';

const port = process.env.PORT ?? 3000;

export const initializeServer = async () => {
  const server = Hapi.server({
    port,
    host: '0.0.0.0',
    routes: { cors: true },
  });

  server.route(routes);

  server.ext('onRequest', (request, h) => {
    logger.info({
      event: 'request_received',
      requestId: request.info.id,
      method: request.method,
      path: request.path,
      payload: request.payload,
      headers: request.headers,
      timestamp: new Date().toISOString(),
    });
    return h.continue;
  });

  server.events.on('response', (request) => {
    const { response } = request;

    const statusCode = Boom.isBoom(response) ? response.output.statusCode : response.statusCode;

    logger.info({
      event: 'request_completed',
      requestId: request.info.id,
      method: request.method,
      path: request.path,
      statusCode,
      timestamp: new Date().toISOString(),
    });
  });

  await server.initialize();
  return server;
};

export const startServer = async () => {
  const server = await initializeServer();
  await server.start();
  logger.info(`Server running on ${server.info.uri}`);
};

if (require.main === module) {
  startServer().catch((err) => {
    logger.error(err);
    process.exit(1);
  });
}
