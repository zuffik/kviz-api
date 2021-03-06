import * as graphqlHTTP from "express-graphql";
import { schema } from "./graphql/schema";
import { serveFile } from "./controllers/UploadController";
import { userLogin, userLogout } from "./controllers/UserController";

const gql = {schema};

const routes: {
    path: string,
    action: (...args: any[]) => any,
    method: 'GET' | 'POST' | 'HEAD' | 'PUT' | 'PATCH' | 'DELETE' | 'ALL'
}[] = [
    {
        path: '/graphql',
        action: (graphqlHTTP as (arg: any) => any)({
            ...gql,
            graphiql: true
        }),
        method: 'GET'
    },
    {
        path: '/graphql',
        action: (graphqlHTTP as (arg: any) => any)({
            ...gql,
            graphiql: false
        }),
        method: 'POST'
    },
    {
        path: '/upload/:file',
        method: 'GET',
        action: serveFile
    },
    {
        path: '/user/login',
        method: 'POST',
        action: userLogin
    },
    {
        path: '/user/logout',
        method: 'GET',
        action: userLogout
    }
];

routes.push({
    path: '/',
    action: (req, res) => res.json({routes, version: '1.0'}),
    method: 'GET'
});

export { routes };
