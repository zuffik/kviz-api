import './env';
import * as express from 'express';
import { routes } from "./routes";
import * as path from "path";
import * as multer from 'multer';
import { uploadFiles } from "./controllers/UploadController";
import * as cors from 'cors';
import * as jwt from 'express-jwt';
import * as _ from "lodash";
import { blacklist } from "./controllers/UserController";

const app = express();
const port = process.env.APP_PORT;

// Middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use('/docs', express.static(path.join(__dirname, '/../../docs/schema')));
app.use(jwt({
    secret: process.env.JWT_SECRET || ''
}).unless({
    path: ['/user/token', '/user/login', '/docs', '/graphql'],
    custom: req => _.includes(blacklist, req.header('Authorization'))
}));
app.use((err: any, req: any, res: any, next: any) => {
    if (err.name === 'UnauthorizedError') {
        res.status(err.status || 500).json(err);
    }
});
app.use(cors());

// Routes
const upload = multer({
    dest: path.join(__dirname, '/../../upload/')
});
app.post('/upload', upload.array('upload'), uploadFiles);

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
