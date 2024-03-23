import { Router } from 'express';

import * as controller from './controller.js';
import { auth, me, limit } from './../auth.js';

// eslint-disable-next-line new-cap
export const router = Router();

/*
 * /api/users POST      - CREATE
 * /api/users GET       - READ ALL
 * /api/users/:id GET   - READ ONE
 * /api/users/:id PUT   - UPDATE
 * /api/users/:id DELETE- DELETE
 */

router.route('/signup').post(limit, controller.signup);
router.route('/signin').post(limit, controller.signin);

router.route('/').get(controller.all);

router.param('id', controller.id);

router
  .route('/:id')
  .get(auth, me, controller.read)
  .put(auth, me, controller.update)
  .delete(auth, me, controller.remove);
