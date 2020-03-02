import { Request, Response } from 'express';
import * as organizationsService from '../services/organizations.service';
import {isRequestAuthenticated} from '../middlewares/auth.middleware';

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

  // TODO: check if user is a member

  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).send({ error: 'organization id must be an integer' });
    return;
  }

  organizationsService.deleteOrganization(id).then(() => {
    res.status(404).send({ success: 'Deleted' });
  }).catch((e) => {
    if (e === organizationsService.Errors.NOT_FOUND) {
      res.status(404).send({ error: e.message });
    } else {
      res.status(500).send({ error: e.message });
    }
  });

}

export default { listAll, findOneById, createOne, deleteOne };
