import * as dotenv from 'dotenv';
import * as express from 'express';
import {routes} from "./routes";

dotenv.load();
const app = express();
const port = process.env.APP_PORT;

routes.map(route => {
  switch (route.method) {
    case 'GET':
      app.get(route.path, route.action);
      break;
    case 'POST':
      app.post(route.path, route.action);
      break;
    case 'PUT':
      app.put(route.path, route.action);
      break;
    case 'PATCH':
      app.patch(route.path, route.action);
      break;
    case 'DELETE':
      app.delete(route.path, route.action);
      break;
    case 'HEAD':
      app.head(route.path, route.action);
      break;
    case 'ALL':
      app.all(route.path, route.action);
      break;
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!\nPress Ctrl+C to exit.`));
