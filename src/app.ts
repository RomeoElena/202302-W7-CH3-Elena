import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { thingsRouter } from './routers/things.router.js';
import createDebug from 'debug';
import { CustomError } from './interfaces/interfaces.js';
import { usersRouter } from './routers/users.router.js';

const debug = createDebug('w6:app');

export const app = express();
app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static('public'));

app.use((_req, _resp, next) => {
  debug('Soy un middleware');
  next();
});

// Modo más organizado de hacerlo
// Ejemplo para una ruta

app.use('/things', thingsRouter);
app.use('/users', usersRouter);

// Modo más simple de hacerlo
// Ejemplo para la ruta home

app.get('/', (_req, resp) => {
  resp.json({
    info: '/Esta es una prueba',
    endpoints: {
      things: '/things',
    },
  });
});
app.get('/:id', (req, resp) => {
  resp.send('Hola ' + req.params.id);
});
app.post('/', (req, resp) => {
  req.body.id = 12;
  resp.send(req.body);
});
app.patch('/:id');
app.delete('/:id');

app.use(
  (error: CustomError, _req: Request, resp: Response, _next: NextFunction) => {
    debug('Soy el middleware de errores');
    const status = error.statusCode || 500;
    const statusMessage = error.statusMessage || 'Internal server error';
    resp.status(status);
    resp.json({
      error: [
        {
          status,
          statusMessage,
        },
      ],
    });
    debug(status, statusMessage, error.message);
  }
);
