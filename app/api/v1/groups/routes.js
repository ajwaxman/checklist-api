import { Router } from 'express';

import * as controller from './controller.js';
import { router as todosRouter } from './../todos/routes.js';

// eslint-disable-next-line new-cap
export const router = Router();

/*
 * /api/groups POST      - CREATE
 * /api/groups GET       - READ ALL
 * /api/groups/:id GET   - READ ONE
 * /api/groups/:id PUT   - UPDATE
 * /api/groups/:id DELETE- DELETE
 */

router.route('/').post(controller.create).get(controller.all);

router.param('id', controller.id);

router
  .route('/:id')
  .get(controller.read)
  .put(controller.update)
  .delete(controller.remove);

router.use('/:groupId/users', todosRouter);
