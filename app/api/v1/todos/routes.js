import { Router } from 'express';

import * as controller from './controller.js';

// eslint-disable-next-line new-cap
export const router = Router({ mergeParams: true });

/*
 * /api/todos POST      - CREATE
 * /api/todos GET       - READ ALL
 * /api/todos/:id GET   - READ ONE
 * /api/todos/:id PUT   - UPDATE
 * /api/todos/:id DELETE- DELETE
 */

router.route('/').post(controller.create).get(controller.all);

router.param('id', controller.id);

router
  .route('/:id')
  .get(controller.read)
  .put(controller.update)
  .delete(controller.remove);
