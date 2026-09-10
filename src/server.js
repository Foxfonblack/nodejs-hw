import net from 'node:net';

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const PORT = process.env.PORT || 3000;

const bootstrap = async () => {
  await connectMongoDB();

  const app = express();

  app.use(logger);
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ credentials: true, origin: true }));

  // TEMP diagnostic: which outbound channels does this host allow?
  app.get('/_netcheck', async (req, res) => {
    const targets = [
      ['gmail:465', 'smtp.gmail.com', 465],
      ['gmail:587', 'smtp.gmail.com', 587],
      ['brevo:587', 'smtp-relay.brevo.com', 587],
      ['brevo:2525', 'smtp-relay.brevo.com', 2525],
      ['brevoApi:443', 'api.brevo.com', 443],
      ['resendApi:443', 'api.resend.com', 443],
    ];
    const test = ([label, host, port]) =>
      new Promise((resolve) => {
        const started = Date.now();
        const sock = net.connect({ host, port, family: 4 });
        sock.setTimeout(8000);
        const done = (result) => {
          sock.destroy();
          resolve(`${label}=${result}(${Date.now() - started}ms)`);
        };
        sock.on('connect', () => done('OPEN'));
        sock.on('timeout', () => done('TIMEOUT'));
        sock.on('error', (e) => done(e.code || 'ERR'));
      });
    const results = await Promise.all(targets.map(test));
    res.json({ results });
  });

  app.use(authRoutes);
  app.use(userRoutes);
  app.use(notesRoutes);

  app.use(notFoundHandler);

  app.use(errors());
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap();
