import { Router } from 'express';

import eventsController from '../controllers/events.controller';
import organizationsController from '../controllers/organizations.controller';
import usersController from '../controllers/users.controller';
import authController from '../controllers/auth.controller';

import { authenticated, resourceOwned, isOrganizationMember } from '../middlewares/auth.middleware';

export function apiRoutes(): Router {

  const router = Router();

  // AUTH API //

  router.post('/auth', authController.generateToken);

  // EVENTS API //

  const eventsRouter = Router();
  eventsRouter.get('/', eventsController.listAll);
  eventsRouter.post('/', eventsController.createOne);

  eventsRouter.get('/:id', eventsController.findOnyById);

  // USERS API //

  const usersRouter = Router();

  usersRouter.route('/')
    .get(usersController.listAll)
    .post(usersController.createOne);

  usersRouter.route('/:id')
    .get(authenticated(false), usersController.findOneById)
    .patch(authenticated(), resourceOwned(), usersController.patchOne)
    .delete(authenticated(), resourceOwned(), usersController.deleteOne);

  // ORGANIZATIONS API //

  const organizationsRouter = Router();

  organizationsRouter.route('/')
    .get(organizationsController.listAll)
    .post(authenticated(), organizationsController.createOne);

  organizationsRouter.route('/:id')
    .get(organizationsController.findOneById)
    .delete(authenticated(), isOrganizationMember(), organizationsController.deleteOne);

  organizationsRouter.get('/:id/members', organizationsController.listMembers);

  // ROUTERS MOUNTING //

  router.use('/events', eventsRouter);
  router.use('/users', usersRouter);
  router.use('/organizations', organizationsRouter);

  return router;
}
