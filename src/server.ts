import * as dotenv from 'dotenv';
import * as express from 'express';
import { routes } from "./routes";
import * as path from "path";

dotenv.load();

const app = express();
const port = process.env.APP_PORT;

app.use('/docs', express.static(path.join(__dirname, '/../docs/schema')));

const handle = (route: any, req: any, res: any) => {
    try {
        route.action(req, res);
    } catch (e) {
        res.status(500);
        res.send(e.message);
    }
};

routes.map(route => {
    switch (route.method) {
        case 'GET':
            app.get(route.path, handle.bind(undefined, route));
            break;
        case 'POST':
            app.post(route.path, handle.bind(undefined, route));
            break;
        case 'PUT':
            app.put(route.path, handle.bind(undefined, route));
            break;
        case 'PATCH':
            app.patch(route.path, handle.bind(undefined, route));
            break;
        case 'DELETE':
            app.delete(route.path, handle.bind(undefined, route));
            break;
        case 'HEAD':
            app.head(route.path, handle.bind(undefined, route));
            break;
        case 'ALL':
            app.all(route.path, handle.bind(undefined, route));
            break;
    }
});

app.listen(port, () => console.log(`App listening on port ${port}!\nPress Ctrl+C to exit.`));
