import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import * as tokensService from '../services/tokens.service';

function generateToken(req: Request, res: Response) {
  const b = req.body;

  if (b !== undefined && b.email !== undefined && b.password !== undefined) {

    authService.authenticate(b.email, b.password)
      .then((user) => tokensService.createTokenFor(user))
      .then(({ token}) => {

        return res.send({ success: 'Authenticated', token });

      }).catch((e) => {

        switch (e) {
          case authService.Errors.INVALID_PASSWORD:
          case authService.Errors.UNKNOWN_EMAIL:
          case tokensService.Errors.TOKEN_SIGNING:
            res.status(401).send({ error: 'Invalid email/password combination' });
            break;
          case authService.Errors.INTERNAL:
            res.status(500).send({ error: e.message });
            break;
        }

    });

  } else {
    res.status(400).send({ error: 'Missing one of: email, password' });
  }

}

export default { generateToken };
