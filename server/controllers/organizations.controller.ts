import { Request, Response } from 'express';
import * as organizationsService from '../services/organizations.service';
import * as usersService from '../services/users.service';
import {isRequestAuthenticated} from '../middlewares/auth.middleware';
import {toPubliclyRendered} from './users.controller';
import * as eventsService from '../services/events.service';

function listAll(req: Request, res: Response) {
  organizationsService.findAll().then((organizations) => {
    res.send(organizations);
  }).catch(() => {
    res.sendStatus(500);
  });
}

function findOneById(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).send({ error: 'Organization id must be an integer' });
    return;
  }

  organizationsService.findById(id).then((organization) => {
    res.send(organization);
  }).catch((e) => {
    if (e === organizationsService.Errors.NOT_FOUND) {
      res.status(400).send({ error: e.message });
    } else {
      res.status(500).send({ error: e.message });
    }
  });

}

function createOne(req: Request, res: Response) {

  if (!isRequestAuthenticated(req)) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const b = req.body;

  if (b && b.name && b.description) {

    const owner = req.userInfo.userId;

    organizationsService.createOrganization(b.name, b.description, owner).then((org) => {

      res.status(201).send(org);

    }).catch((e) => {
        switch (e) {
          case organizationsService.Errors.INVALID_NAME_FORMAT:
          case organizationsService.Errors.UNKNOWN_USER:
          case organizationsService.Errors.DESCRIPTION_FORMAT:
            res.status(400).send({ error: e.message });
            break;
          case organizationsService.Errors.INTERNAL:
            res.status(500).send({ error: e.message });
            break;
        }
    });

  } else {
    res.status(400).send({ error: 'Missing one of: name, description'});
  }

}

function deleteOne(req: Request, res: Response) {

  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).send({ error: 'organization id must be an integer' });
    return;
  }

  organizationsService.deleteOrganization(id).then(() => {
    res.send({ success: 'Deleted' });
  }).catch((e) => {
    if (e === organizationsService.Errors.NOT_FOUND) {
      res.status(404).send({ error: e.message });
    } else {
      res.status(500).send({ error: e.message });
    }
  });

}

function listMembers(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).send({ error: 'organization id must be an integer' });
    return;
  }

  organizationsService.findOrganizationMembers(id).then((members) => {
    res.send(members);
  }).catch((e) => {
    if (e === organizationsService.Errors.NOT_FOUND) {
      res.status(404).send({ error: e.message });
    } else {
      res.status(500).send({ error: e.message });
    }
  });

}

function listEvents(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).send({ error: 'Organization id must be an integer' });
    return;
  }

  organizationsService.findOrganizationEvents(id).then((events) => {
    res.send(events);
  }).catch((e) => {
    if (e === organizationsService.Errors.NOT_FOUND) {
      res.status(404).send({ error: e.message });
    } else {
      res.status(500).send({ error: e.message });
    }
  });

}

function patchOne(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).send({ error: 'Organization id must be an integer' });
    return;
  }

  const b = req.body;

  if (b && (b.name || b.description)) {
    organizationsService.updateOrganization(id, {name: b.name, description: b.description})
    .then((organization) => {
      res.send(organization);
    }).catch((e) => {
        switch (e) {
          case organizationsService.Errors.NOT_FOUND:
            res.status(404).send({ error: e.message });
            break;
          case organizationsService.Errors.INVALID_NAME_FORMAT:
          case organizationsService.Errors.DESCRIPTION_FORMAT:
            res.status(400).send({ error: e.message });
            break;
          case organizationsService.Errors.INTERNAL:
            res.status(500).send({ error: e.message });
        }
    });
  } else {
    res.status(400).send({ error: 'Must specify at least one of: name, description' });
  }

}

function addMember(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).send({ error: 'Organization id must be an integer' });
    return;
  }

  if (req.body && req.body.email) {

    usersService.findByEmail(req.body.email).then((user) => {
      return organizationsService.addMember(id, user.id);
    }).then(() => {
      res.status(201).send({ success: 'Member created' });
    }).catch((e) => {
      switch (e) {
        case organizationsService.Errors.NOT_FOUND:
          res.status(400).send({ error: e.message });
          break;
        case organizationsService.Errors.UNKNOWN_USER:
        case organizationsService.Errors.ALREADY_MEMBER:
        case usersService.Errors.NOT_FOUND:
          res.status(400).send({ error: e.message });
          break;
        case organizationsService.Errors.INTERNAL:
        case usersService.Errors.INTERNAL:
          res.status(500).send({ error: e.message });
          break;
        default:
          console.error(e);
          res.status(500).send({ error: 'Internal server error' });
      }
    });

  } else {
    res.status(400).send({ error: 'Missing email value' });
  }

}

function deleteMember(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).send({ error: 'Organization id must be an integer' });
    return;
  }

  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    res.status(400).send({ error: 'Member id value must be an integer' });
    return;
  }

  organizationsService.deleteMember(id, userId).then((organizationRemoved) => {

    res.send({
      success: 'Member removed',
      organizationDeleted: organizationRemoved,
    });

  }).catch((e) => {
    switch (e) {
      case organizationsService.Errors.NOT_FOUND:
      case organizationsService.Errors.NOT_A_MEMBER:
        res.status(404).send({ error: e.message });
        break;
      case organizationsService.Errors.INTERNAL:
        res.status(500).send({ error: e.message });
        break;
    }
  });

}

function findMember(req: Request, res: Response) {
  const orgId = parseInt(req.params.id, 10);
  if (isNaN(orgId)) {
    res.status(400).send({ error: 'Organization id must be an integer' });
    return;
  }

  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    res.status(400).send({ error: 'Member id must be an integer' });
    return;
  }

  organizationsService.findMember(orgId, userId).then((member) => {
    res.send(toPubliclyRendered(member));
  }).catch((e) => {
      switch (e) {
        case organizationsService.Errors.NOT_FOUND:
        case organizationsService.Errors.NOT_A_MEMBER:
          res.status(404).send({ error: e.message });
          break;
        case organizationsService.Errors.INTERNAL:
          res.status(500).send({ error: e.message });
          break;
      }
  });

}

function updateEvent(req: Request, res: Response) {
  const id = parseInt(req.params.eventId, 10);

  if (isNaN(id)) {
    res.status(400).send({ error: 'Event id must be an integer' });
    return;
  }

  const b = req.body;
  if (b && (b.name || b.description)) {

    eventsService.updateEvent(id, { name: b.name, description: b.description })
      .then((event) => {
        res.send(event);
      }).catch((e) => {
      switch (e) {
        case eventsService.Errors.NOT_FOUND:
          res.status(404).send({ error: e.message });
          break;
        case eventsService.Errors.INVALID_DESCRIPTION:
        case eventsService.Errors.INVALID_NAME:
          res.status(400).send({ error: e.message });
          break;
        case eventsService.Errors.INTERNAL:
          res.status(500).send({ error: e.message });
      }
    });

  } else {
    res.status(400).send({ error: 'Missing one of: name, description' });
  }

}

function deleteEvent(req: Request, res: Response) {
  const id = parseInt(req.params.eventId, 10);

  if (isNaN(id)) {
    res.status(400).send({ error: 'Event id must be an integer' });
    return;
  }

  eventsService.deleteEvent(id).then(() => {
    res.send({ success: 'Event deleted' });
  }).catch((e) => {
    if (e === usersService.Errors.NOT_FOUND) {
      res.status(400).send({ error: e.message });
    } else {
      res.status(500).send({ error: e.message });
    }
  });

}

export default { listAll, findOneById, createOne, deleteOne, listMembers,
  listEvents, patchOne, addMember, deleteMember, findMember, patchEvent: updateEvent, deleteEvent };
