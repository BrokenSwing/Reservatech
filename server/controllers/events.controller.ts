import { Request, Response } from 'express';
import * as eventsService from '../services/events.service';

function listAll(req: Request, res: Response) {
  eventsService.findAll().then((events) => {
    res.send(events);
  }).catch(() => {
    res.sendStatus(500);
  });
}

export default { listAll };
