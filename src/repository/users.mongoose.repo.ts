import { User } from '../entities/user.js';
import { HTTPError } from '../interfaces/interfaces.js';
import { Repo } from './repo.interface';
import createDebug from 'debug';
import { UserModel } from './users.mongoose.model.js';
const debug = createDebug('w6:app');

export class UsersMongooseRepo implements Repo<User> {
  constructor() {
    debug('Instantiate');
  }

  async query(): Promise<User[]> {
    debug('query');
    return [];
  }

  async queryId(id: string): Promise<User> {
    debug('queryID');
    const data = await UserModel.findById(id);
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in queryId');
    return data;
  }

  async search(query: { key: string; value: unknown }) {
    debug('search');
    const data = await UserModel.find({ [query.key]: query.value });
    return data;
  }

  async create(info: Partial<User>): Promise<User> {
    debug('create');
    const data = await UserModel.create(info);
    return data;
  }

  async update(info: Partial<User>): Promise<User> {
    debug('update');
    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data)
      throw new HTTPError(404, 'Id not found', 'Id not found in update');
    return data;
  }

  async destroy(id: string): Promise<void> {
    debug('destroy');
    const data = await UserModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: Id not found'
      );
  }
}
