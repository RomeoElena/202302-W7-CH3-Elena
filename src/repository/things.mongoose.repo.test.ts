import { Thing } from '../entities/thing';
import { ThingModel } from './things.mongoose.model';
import { ThingsMongooseRepo } from './things.mongoose.repo';

jest.mock('./things.mongoose.model.js');

describe('Given ThingsMongoRepo repository', () => {
  const repo = new ThingsMongooseRepo();

  describe('When the repository is instanced', () => {
    test('Then, the repo should be instance of ThingsMongoRepo', () => {
      expect(repo).toBeInstanceOf(ThingsMongooseRepo);
    });
  });

  describe('When the query method is used', () => {
    beforeEach(async () => {
      (ThingModel.find as jest.Mock).mockResolvedValue([]);
    });

    test('Then the find method have been called', () => {
      repo.query();
      expect(ThingModel.find).toHaveBeenCalled();
    });
    test('Then the repo.query should return the mock value', async () => {
      const result = await repo.query();
      expect(result).toEqual([]);
    });
  });

  describe('When the queryId method is used', () => {
    test('Then if the findById method resolve value to an object, it should return the object', async () => {
      (ThingModel.findById as jest.Mock).mockResolvedValue({
        id: '1',
      });
      const result = await repo.queryId('1');
      expect(ThingModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    test('Then if the findById method resolve value to undefined, it should throw an Error', async () => {
      (ThingModel.findById as jest.Mock).mockResolvedValue(null);
      expect(async () => repo.queryId('')).rejects.toThrow();
    });
  });

  describe('When the search method is used', () => {
    test('Then if it has an mock query object, it should return find resolved value', async () => {
      (ThingModel.find as jest.Mock).mockResolvedValue([{ id: '1' }]);
      const mockQuery = { key: 'test', value: 'test' };
      const result = await repo.search(mockQuery);
      expect(result).toEqual([{ id: '1' }]);
    });
  });

  describe('When the create method is used', () => {
    test('Then if it has an object to create, it should return the created object', async () => {
      (ThingModel.create as jest.Mock).mockResolvedValue({ name: 'test' });

      const result = await repo.create({ name: 'test' });
      expect(ThingModel.create).toHaveBeenCalled();
      expect(result).toEqual({ name: 'test' });
    });
  });

  describe('When the update method is used', () => {
    const mockKnowledge = {
      id: '1',
      name: 'test',
    } as Partial<Thing>;

    test('Then if the findByIdAndUpdate method resolve value to an object, it should return the object', async () => {
      (ThingModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        name: 'test',
        id: '1',
      });
      const result = await repo.update(mockKnowledge);
      expect(ThingModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({ name: 'test', id: '1' });
    });

    test('Then if the findByIdAndUpdate method resolve value to undefined, it should throw an Error', async () => {
      (ThingModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      expect(async () => repo.update(mockKnowledge)).rejects.toThrow();
    });
  });

  describe('When the delete method is used', () => {
    beforeEach(async () => {
      (ThingModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});
    });

    test('Then if it has an object to delete with its ID, the findByIdAndDelete function should be called', async () => {
      await repo.destroy('1');
      expect(ThingModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then if the findByIdAndDelete method resolve value to undefined, it should throw an Error', async () => {
      (ThingModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      expect(async () => repo.destroy('')).rejects.toThrow();
    });
  });
});
