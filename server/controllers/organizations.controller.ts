import { Request, Response } from 'express';
import * as organizationsService from '../services/organizations.service';

function listAll(req: Request, res: Response) {
  organizationsService.findAll().then((organizations) => {
    res.send(organizations);
  }).catch(() => {
    res.sendStatus(500);
  });
}

export default { listAll };
