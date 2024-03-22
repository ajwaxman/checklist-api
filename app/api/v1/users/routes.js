import { Router } from 'express';

import * as controller from './controller.js';
import { auth } from './../auth.js';

// eslint-disable-next-line new-cap
export const router = Router();

/*
 * /api/users POST      - CREATE
 * /api/users GET       - READ ALL
 * /api/users/:id GET   - READ ONE
 * /api/users/:id PUT   - UPDATE
 * /api/users/:id DELETE- DELETE
 */

router.route('/signup').post(controller.signup);
router.route('/signin').post(controller.signin);

router.route('/').get(controller.all);

router.param('id', controller.id);

router
  .route('/:id')
  .get(auth, controller.read)
  .put(auth, controller.update)
  .delete(auth, controller.remove);
