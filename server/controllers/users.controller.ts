import { Request, Response } from 'express';
import * as usersService from '../services/users.service';

function listAll(req: Request, res: Response) {
  usersService.findAll().then((users) => {
    res.send(users);
  }).catch(() => {
    res.send(500);
  });
}

function createOne(req: Request, res: Response) {

  const b = req.body;

  if (
    b !== undefined &&
    b.firstName !== undefined &&
    b.lastName !== undefined &&
    b.email !== undefined &&
    b.password !== undefined
  ) {

    usersService.createUser(b.firstName, b.lastName, b.email, b.password).then((user) => {

      res.status(201).send(user);

    }).catch((e) => {
      switch (e) {
        case usersService.Errors.PASSWORD_HASH:
        case usersService.Errors.FIRST_NAME_WRONG_FORMAT:
        case usersService.Errors.LAST_NAME_WRONG_FORMAT:
        case usersService.Errors.EMAIL_WRONG_FORMAT:
        case usersService.Errors.PASSWORD_TOO_SHORT:
        case usersService.Errors.ALREADY_EXISTS:
          res.status(400).send({ error: e.message });
          break;
        case usersService.Errors.INTERNAL:
          res.status(500).send({ error: e.message });
          break;
      }
    });

  } else {
    res.status(400).send({ error: 'Missing one of : firstName, lastName, email, password'});
  }

}

export default { listAll, createOne };
