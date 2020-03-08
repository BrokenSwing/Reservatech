import { Request, Response } from 'express';
import * as eventsService from '../services/events.service';
import * as moment from 'moment';
import {isRequestAuthenticated} from '../middlewares/auth.middleware';

function listAll(req: Request, res: Response) {
  eventsService.findAll().then((events) => {
    res.send(events);
  }).catch(() => {
    res.sendStatus(500);
  });
}

function findOnyById(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);

  eventsService.findById(id).then((event) => {
    res.send(event);
  }).catch((e) => {
    if (e === eventsService.Errors.NOT_FOUND) {
      res.status(404).send({ error: e.message });
    } else {
      res.status(500).send({ error: e.message });
    }
  });

}

function createOne(req: Request, res: Response)   {
  const b = req.body;

  if (b && b.name && b.description && b.beginning && b.end && b.maxParticipants && b.organization) {

    const beginAt = new Date(b.beginning);
    if (isNaN(beginAt.getTime())) {
      res.status(400).send({ error: 'Invalid beginning date' });
      return;
    }

    const endAt = new Date(b.end);
    if (isNaN(endAt.getTime())) {
      res.status(400).send({ error: 'Invalid end date '});
      return;
    }

    if (moment(beginAt).isAfter(endAt)) {
      res.status(400).send({ error: 'Beginning date must be before end date' });
      return;
    }

    const maxP = parseInt(b.maxParticipants, 10);
    if (isNaN(maxP)) {
      res.status(400).send({ error: 'maxParticipants must be an integer' });
      return;
    }

    const organizationId = parseInt(b.organization, 10);
    if (isNaN(organizationId)) {
      res.status(400).send({ error: 'organization must be an integer' });
      return;
    }

    eventsService.createEvent(b.name, b.description, beginAt, endAt, maxP, organizationId).then((event) => {
      res.status(201).send(event);
    }).catch((e) => {
      switch (e) {
        case eventsService.Errors.INVALID_NAME:
        case eventsService.Errors.INVALID_DATE_ORDER:
        case eventsService.Errors.UNKNOWN_ORGANIZATION:
        case eventsService.Errors.INVALID_MAX_PARTICIPANTS:
          res.status(400).send({ error: e.message });
          break;
        case eventsService.Errors.INTERNAL:
          res.status(500).send({ error: e.message });
          break;
      }
    });

  } else {
    res.status(400).send({ error: 'Missing one of: name, description, beginning, end, maxParticipants, organization' });
  }

}

function addParticipant(req: Request, res: Response) {
  const eventId = parseInt(req.params.eventId, 10);

  if (isNaN(eventId)) {
    res.status(400).send({ error: 'Event id must be an integer' });
    return;
  }

  if (isRequestAuthenticated(req)) {

    eventsService.addParticipant(eventId, req.userInfo.userId).then((event) => {

      res.status(201).send(event);

    }).catch((e) => {
      switch (e) {
        case eventsService.Errors.NOT_FOUND:
          res.status(404).send({ error: e.message });
          break;
        case eventsService.Errors.UNKNOWN_USER:
        case eventsService.Errors.FULL:
        case eventsService.Errors.ALREADY_PARTICIPANT:
          res.status(400).send({ error: e.message });
          break;
        case eventsService.Errors.INTERNAL:
          res.status(500).send({ error: e.message });
      }
    });

  } else {
    res.sendStatus(401);
  }

}

function listAllParticipants(req: Request, res: Response) {
  const eventId = parseInt(req.params.eventId, 10);

  if (isNaN(eventId)) {
    res.status(400).send({ error: 'Event id must be an integer' });
    return;
  }

  eventsService.findAllParticipants(eventId).then((event) => {

    res.send(event);

  }).catch((e) => {
    switch (e) {
      case eventsService.Errors.NOT_FOUND:
        res.status(404).send({ error: e.message });
        break;
      case eventsService.Errors.INTERNAL:
        res.status(500).send({ error: e.message });
    }
  });

}

function removeParticipant(req: Request, res: Response) {
  const eventId = parseInt(req.params.eventId, 10);

  if (isNaN(eventId)) {
    res.status(400).send({ error: 'Event id must be an integer' });
    return;
  }

  if (isRequestAuthenticated(req)) {

    eventsService.removeParticipant(eventId, req.userInfo.userId).then(() => {

      res.status(201).send({ success: 'Participation removed' });

    }).catch((e) => {
      switch (e) {
        case eventsService.Errors.NOT_FOUND:
          res.status(404).send({ error: e.message });
          break;
        case eventsService.Errors.NOT_PARTICIPATING:
          res.status(400).send({ error: e.message });
          break;
        case eventsService.Errors.INTERNAL:
          res.status(500).send({ error: e.message });
      }
    });

  } else {
    res.sendStatus(401);
  }
}

export default { listAll, findOnyById, createOne, addParticipant, listAllParticipants, removeParticipant };
