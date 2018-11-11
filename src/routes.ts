import * as graphqlHTTP from "express-graphql";
import { login } from "./controllers/user";
import { schema } from "./graphql/schema";

const gql = {schema};

export const routes: {
  path: string,
  action: (...args: any[]) => any,
  method: 'GET' | 'POST' | 'HEAD' | 'PUT' | 'PATCH' | 'DELETE' | 'ALL'
}[] = [
  {
    path: '/login',
    action: login,
    method: 'POST'
  },
  {
    path: '/graphql',
    // TODO: find out problem with TS
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
  }
];
