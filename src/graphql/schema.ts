import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { product, user } from "./types";
import { productQuery } from "./queries";

export const schema = new GraphQLSchema({
  types: [user, product],
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      products: productQuery
    })
  })
});
