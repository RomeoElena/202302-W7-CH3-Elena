import { Request, Response } from 'express';
import { User } from '../entities/user';
import { Repo } from '../repository/repo.interface';
import { UsersController } from './users.controller';
import { Auth } from '../services/auth.js';

jest.mock('../services/auth.js');

describe('Given register method from UsersController', () => {
  const mockRepo = {
    create: jest.fn(),
    search: jest.fn(),
  } as unknown as Repo<User>;
  const controller = new UsersController(mockRepo);

  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  describe('When there are not password in the body', () => {
    const req = {
      body: {
        email: 'test',
      },
    } as Request;
    test('Then next it should has been called ', async () => {
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When there are not email in the body', () => {
    const req = {
      body: {
        passwd: 'test',
      },
    } as Request;
    test('Then next it should has been called ', async () => {
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When there are not email and not password in the body', () => {
    const req = {
      body: {},
    } as Request;
    test('Then next it should has been called ', async () => {
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When everything is ok', () => {
    const req = {
      body: {
        email: 'test',
        passwd: 'test',
      },
    } as Request;
    test('Then json it should has been called ', async () => {
      await controller.register(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
  });
});

describe('Given login method from UsersController', () => {
  const mockRepo = {
    create: jest.fn(),
    search: jest.fn(),
  } as unknown as Repo<User>;

  const controller = new UsersController(mockRepo);

  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;
  const req = {
    body: {
      email: 'test',
      passwd: 'test',
    },
  } as Request;

  const next = jest.fn();

  Auth.compare = jest.fn().mockRejectedValue(true);
  describe('When All is ok', () => {
    (mockRepo.search as jest.Mock).mockRejectedValue(['test']);
    test('Then json it should be called', async () => {
      await controller.login(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
  });
});
