import { Thing } from '../entities/thing';
import { HTTPError } from '../interfaces/interfaces.js';
import { Repo } from './repo.interface';
import { ThingModel } from './things.mongoose.model.js';
import createDebug from 'debug';
const debug = createDebug('w6:app');

export class ThingsMongooseRepo implements Repo<Thing> {
  constructor() {
    debug('Instantiate');
  }

  async query(): Promise<Thing[]> {
    debug('query');
    const data = await ThingModel.find();
    return data;
  }

  async queryId(id: string): Promise<Thing> {
    debug('queryID');
    const data = await ThingModel.findById(id);
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in queryId');
    return data;
  }

  async search(query: { key: string; value: unknown }) {
    debug('search');
    const data = await ThingModel.find({ [query.key]: query.value });
    return data;
  }

  async create(info: Partial<Thing>): Promise<Thing> {
    debug('create');
    const data = await ThingModel.create(info);
    return data;
  }

  async update(info: Partial<Thing>): Promise<Thing> {
    debug('update');
    const data = await ThingModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data)
      throw new HTTPError(404, 'Id not found', 'Id not found in update');
    return data;
  }

  async destroy(id: string): Promise<void> {
    debug('destroy');
    const data = await ThingModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: Id not found'
      );
  }
}
