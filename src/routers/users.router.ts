import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { UsersMongooseRepo } from '../repository/users.mongoose.repo.js';

// eslint-disable-next-line new-cap
export const usersRouter = Router();
// File Repo const repo = new ThingsFileRepo();
const repo = new UsersMongooseRepo();
const controller = new UsersController(repo);

usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
