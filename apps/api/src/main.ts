/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import { createServer } from 'http';
import { dockerEngine } from '@vk8sp/engine';
import { serve, setup } from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';

const app = express();
const server = createServer(app);
// const io = new Server(server);

// app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/docs', serve, setup(swaggerDocument));

(async () => {
  await dockerEngine.initializeDocker();
  const port = process.env.port || 3333;
  server.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
  });
  server.on('error', console.error);
})();
