import { Request, Response } from 'express';
import * as usersService from '../services/users.service';
import { User } from '../models/user';
import {isRequestAuthenticated} from '../middlewares/auth.middleware';
import {Organization} from '../models/organization';

function listAll(req: Request, res: Response) {
  usersService.findAll().then((users) => {
    res.send(users.map(toPubliclyRendered));
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

      res.status(201).send(toPubliclyRendered(user));

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

function findOneById(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).send({ error: 'Invalid id' });
    return;
  }

  usersService.findById(id).then((user) => {
    if (isRequestAuthenticated(req) && req.userInfo.userId === id) {
      res.send(toPrivatelyRendered(user));
    } else {
      res.send(toPubliclyRendered(user));
    }
  }).catch((err) => {
    if (err === usersService.Errors.NOT_FOUND) {
      res.status(404).send({ error: err.message });
    } else {
      res.status(500).send({ error: err.message });
    }
  });

}

function patchOne(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).send({ error: 'Invalid id' });
    return;
  }

  const b = req.body;

  if (b !== undefined && (b.firstName || b.lastName || b.email || b.password)) {

    usersService.updateUser(id, {
      firstName: b.firstName,
      lastName: b.lastName,
      email: b.email,
      password: b.password,
    }).then((user) => {
      res.send(toPrivatelyRendered(user));
    }).catch((e) => {
      switch (e) {
        case usersService.Errors.FIRST_NAME_WRONG_FORMAT:
        case usersService.Errors.LAST_NAME_WRONG_FORMAT:
        case usersService.Errors.PASSWORD_TOO_SHORT:
        case usersService.Errors.PASSWORD_HASH:
        case usersService.Errors.EMAIL_WRONG_FORMAT:
        case usersService.Errors.ALREADY_EXISTS:
          res.status(400).send({ error: e.message });
          break;
        case usersService.Errors.NOT_FOUND:
          res.status(404).send({ error: e.message });
          break;
        case usersService.Errors.INTERNAL:
          res.status(500).send({ error: e.message });
      }
    });

  } else {
    res.status(400).send({ error: 'You must specify one of: firstName, lastName, email, password'});
  }

}

function deleteOne(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(500).send({ error: 'Invalid id' });
    return;
  }

  usersService.deleteUser(id).then(() => {

    res.status(204).send({ success: 'User deleted successfully' });

  }).catch((e) => {
    if (e === usersService.Errors.NOT_FOUND) {
      res.status(404).send({ error: e.message });
    } else {
      res.status(500).send({ error: e.message });
    }
  });

}

function listOrganizations(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).send({ error: 'User id must be an integer' });
    return;
  }

  usersService.fetchUserOrganizations(id).then((organizations) => {
    res.send(organizations.map(toCleanOrganization));
  }).catch((e) => {
    if (e === usersService.Errors.NOT_FOUND) {
      res.status(404).send({ error: e.message });
    } else {
      res.status(500).send({ error: e.message });
    }
  });

}

function toPubliclyRendered(user: User): object {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

function toCleanOrganization(organization: Organization) {
  return {
    id: organization.id,
    name: organization.name,
    description: organization.description,
  };
}

function toPrivatelyRendered(user: User): object {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
}

export default { listAll, createOne, findOneById, patchOne, deleteOne, listOrganizations };
export { toPubliclyRendered, toCleanOrganization, toPrivatelyRendered };
