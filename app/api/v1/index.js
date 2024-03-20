import { Router } from 'express';

import { router as todos } from './todos/routes.js';

// eslint-disable-next-line new-cap
export const router = Router();

router.use('/todos', todos);
