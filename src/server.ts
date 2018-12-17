import './env';
import * as express from 'express';
import { routes } from "./routes";
import * as path from "path";
import * as multer from 'multer';
import { uploadFiles } from "./controllers/UploadController";
import * as cors from 'cors';
import * as jwt from 'express-jwt';
import { blacklist } from "./controllers/UserController";
import * as _ from "lodash";
import * as crypto from "crypto";
import * as mime from 'mime-to-extensions';

const app = express();
const port = process.env.APP_PORT;

// Middlewares
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use('/docs', express.static(path.join(__dirname, '/../../docs/schema')));
app.use(jwt({
    secret: process.env.JWT_SECRET || '',
    isRevoked: (req, payload, done) => {
        done(undefined, _.includes(blacklist, req.header('Authorization') || ''));
    }
}).unless({
    path: ['/user/token', '/user/login', '/docs', '/graphql', /\/upload.*/],
}));
app.use((err: any, req: any, res: any, next: any) => {
    res.status(err.status || 500).json({
        error: true,
        ...err
    });
});
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload/');
    },
    filename: (req, file, cb) => {
        crypto.pseudoRandomBytes(16, (err, raw) => {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});
const upload = multer({storage});

// Routes
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
