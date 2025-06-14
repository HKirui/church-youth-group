import * as functions from 'firebase-functions';
import * as express from 'express';
import next from 'next';
import { join } from 'path';

const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev,
  conf: {
    distDir: join(__dirname, '../../.next'), // 👈 VERY IMPORTANT: .next is in root
  },
});

const handle = app.getRequestHandler();
const server = express.default();

app.prepare().then(() => {
  server.all('*', (req, res) => {
    return handle(req, res);
  });
});

export const nextApp = functions.https.onRequest(server);
