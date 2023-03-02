import { Response, Request, NextFunction } from 'express';
import { Repo } from '../repository/repo.interface.js';
import { User } from '../entities/user.js';
import createDebug from 'debug';
import { HTTPError } from '../interfaces/interfaces.js';
import { Auth, PayloadToken } from '../services/auth.js';
const debug = createDebug('W6:app');

export class UsersController {
  constructor(public repo: Repo<User>) {
    debug('Instantiated at class UsersController');
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register:post');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'unauthorized', 'Invalid Email or Password');
      req.body.passwd = await Auth.hash(req.body.passwd);
      const data = await this.repo.create(req.body);
      console.log(data);
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login:post');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or Password');
      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      if (!data.length)
        throw new HTTPError(401, 'unauthorized', 'Email not found');
      if (!(await Auth.compare(req.body.passwd, data[0].passwd)))
        throw new HTTPError(401, 'unauthorized', 'Password not found');
      const payload: PayloadToken = {
        email: data[0].email,
        role: 'admin',
      };
      const token = Auth.createJWT(payload);
      console.log(data);
      resp.status(202);
      resp.json({
        token,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Llegan datos usuarios en el body
//     Search by email
//     Si lo tengo -> crear el token
//     Send el token
//     Si no lo tengo
//     Send Error
