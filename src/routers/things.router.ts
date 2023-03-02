import { Router } from 'express';
import { ThingsController } from '../controllers/things.controller.js';
import { ThingsMongooseRepo } from '../repository/things.mongoose.repo.js';

// eslint-disable-next-line new-cap
export const thingsRouter = Router();
// File Repo const repo = new ThingsFileRepo();
const repo = new ThingsMongooseRepo();
const controller = new ThingsController(repo);

thingsRouter.get('/', controller.getAll.bind(controller));
thingsRouter.get('/:id', controller.get.bind(controller));
thingsRouter.post('/', controller.post.bind(controller));
thingsRouter.patch('/:id', controller.patch.bind(controller));
thingsRouter.delete('/:id', controller.delete.bind(controller));
