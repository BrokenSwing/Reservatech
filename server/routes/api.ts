import { Router } from 'express';

import eventsController from '../controllers/events.controller';
import organizationsController from '../controllers/organizations.controller';
import usersController from '../controllers/users.controller';
import authController from '../controllers/auth.controller';

import { authenticated, resourceOwned } from '../middlewares/auth.middleware';

export function apiRoutes(): Router {

  const router = Router();

  // AUTH API //

  router.post('/auth', authController.generateToken);

  // EVENTS API //

  router.get('/events', eventsController.listAll);
  router.post('/events', eventsController.createOne);

  router.get('/events/:id', eventsController.findOnyById);

  // USERS API //

  router.get('/users', usersController.listAll);
  router.post('/users', usersController.createOne);

  router.get('/users/:id', authenticated(false), usersController.findOneById);
  router.patch('/users/:id', authenticated(), resourceOwned(), usersController.patchOne);
  router.delete('/users/:id', authenticated(), resourceOwned(), usersController.deleteOne);

  // ORGANIZATIONS API //

  router.get('/organizations', organizationsController.listAll);
  router.post('/organizations', authenticated(), organizationsController.createOne);

  router.get('/organizations/:id', organizationsController.findOneById);
  router.delete('/organizations/:id', organizationsController.deleteOne);

  router.get('/organizations/:id/members', organizationsController.listMembers);

  return router;
}
