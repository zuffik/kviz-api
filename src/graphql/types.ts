import { GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export const product = new GraphQLObjectType({
  name: 'Product',
  description: 'A product',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLInt),
      description: 'Product ID'
    },
    name: {
      type: GraphQLNonNull(GraphQLString),
      description: 'Product name'
    },
    price: {
      type: GraphQLFloat
    },
    quantity: {
      type: GraphQLInt
    }
  })
});

export const user = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLInt),
      description: 'User ID'
    },
    email: {
      type: GraphQLNonNull(GraphQLString),
      description: 'User email'
    },
  })
});
