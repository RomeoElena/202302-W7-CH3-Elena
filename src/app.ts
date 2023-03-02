import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { thingsRouter } from './routers/things.router.js';
import { HTTPError } from './interfaces/interfaces.js';

export const app = express();

app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use((_req, _res, next) => {
  console.log('soy un middleware');
  next();
});
app.use('/things', thingsRouter);

app.get('/', (req, res) => {
  res.json({ things: '/things' });
});
app.get('/:id', (req, res) => {
  res.send('id' + req.params.id);
});
app.post('/', (req, res) => {
  console.log(req.body);
  res.send(req.body);
});
app.patch('/');
app.patch('/:id');
app.delete('/:id');

app.use(
  (error: HTTPError, _req: Request, res: Response, _next: NextFunction) => {
    console.log('soy el middleware de errores');
    const status = error.statusCode || 500;
    const statusMessage = error.statusMessage || 'Internal server error';
    res.json([
      {
        error: [
          {
            status,
            statusMessage,
          },
        ],
      },
    ]);
    console.log(status, statusMessage, error.message);
  }
);
