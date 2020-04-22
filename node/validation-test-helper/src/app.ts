import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import usersApi from './api/users';

const port = process.env.PORT || 3001;
const app = express();

export const appConfigPromise = (async () => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use('/api/users', usersApi);

  app.listen(port, () => {
    console.log(`server api started in http://localhost:${port}`);
  });
})();

export default app;