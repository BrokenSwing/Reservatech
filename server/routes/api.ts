import { Router } from 'express';

import eventsController from '../controllers/events.controller';
import organizationsController from '../controllers/organizations.controller';
import usersController from '../controllers/users.controller';
import authController from '../controllers/auth.controller';

import { authenticated, resourceOwned, isOrganizationMember } from '../middlewares/auth.middleware';
import {bodyKeyExtractor} from '../utils/extractors';

export function apiRoutes(): Router {

  const router = Router();

  // AUTH API //

  router.post('/auth', authController.generateToken);

  // EVENTS API //

  const eventsRouter = Router();
  eventsRouter.route('/')
    .get(eventsController.listAll)
    .post(authenticated(), isOrganizationMember(bodyKeyExtractor('organization')), eventsController.createOne);

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

  usersRouter.get('/:id/organizations', usersController.listOrganizations);

  // ORGANIZATIONS API //

  const organizationsRouter = Router();

  organizationsRouter.route('/')
    .get(organizationsController.listAll)
    .post(authenticated(), organizationsController.createOne);

  organizationsRouter.route('/:id')
    .get(organizationsController.findOneById)
    .delete(authenticated(), isOrganizationMember(), organizationsController.deleteOne)
    .patch(authenticated(), isOrganizationMember(), organizationsController.patchOne);

  organizationsRouter.route('/:id/members')
    .get(organizationsController.listMembers)
    .post(authenticated(), isOrganizationMember(), organizationsController.addMember);

  organizationsRouter.route('/:id/members/:userId')
    .get(organizationsController.findMember)
    .delete(authenticated(), isOrganizationMember(), organizationsController.deleteMember);

  organizationsRouter.get('/:id/events', organizationsController.listEvents);
  organizationsRouter.route('/:id/events/:eventId')
    .patch(authenticated(), isOrganizationMember(), organizationsController.patchEvent)
    .delete(authenticated(), isOrganizationMember(), organizationsController.deleteEvent);

  organizationsRouter.route('/:id/events/:eventId/participants')
    .post(authenticated(), eventsController.addParticipant)
    .delete(authenticated(), eventsController.removeParticipant)
    .get(eventsController.listAllParticipants);

  // ROUTERS MOUNTING //

  router.use('/events', eventsRouter);
  router.use('/users', usersRouter);
  router.use('/organizations', organizationsRouter);

  return router;
}
