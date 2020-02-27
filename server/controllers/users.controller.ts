import { Request, Response } from 'express';
import * as usersService from '../services/users.service';

function listAll(req: Request, res: Response) {
  usersService.findAll().then((users) => {
    res.send(users);
  }).catch(() => {
    res.send(500);
  });
}

export default { listAll };
