import { ServerRoute } from '@hapi/hapi';
import { itemRoutes } from './item.routes';

export const routes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/ping',
    handler: () => ({ ok: true }),
  },
  ...itemRoutes,
];
