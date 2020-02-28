import { Router } from 'express';

import eventsController from '../controllers/events.controller';
import organizationsController from '../controllers/organizations.controller';
import usersController from '../controllers/users.controller';

export function apiRoutes(): Router {

  const router = Router();

  // EVENTS API //

  router.get('/events', eventsController.listAll);

  // USERS API //

  router.get('/users', usersController.listAll);
  router.post('/users', usersController.createOne);
  router.get('/users/:id', usersController.findOneById);

  // ORGANIZATIONS API //

  router.get('/organizations', organizationsController.listAll);

  return router;
}
