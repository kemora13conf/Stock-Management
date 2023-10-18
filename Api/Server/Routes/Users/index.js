import { Router } from 'express'
import { userById, updateTheme } from './Controller.js'
import { signinRequired } from '../Auth/Controller.js';

const router = new Router();

// Decalaring the params
router.param('userId', userById)

// update theme and language for the current user
router.put('/:userId/update-theme', signinRequired, updateTheme)


export default router;