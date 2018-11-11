import { product } from "./types";
import { GraphQLList } from "graphql";
import { MockStorage } from "../storage/MockStorage";
import { Storage } from "../storage/Storage";

const storage: Storage = new MockStorage();

export const productQuery = {
  type: GraphQLList(product),
  args: {},
  resolve: (root: any, {}) => storage.getProducts()
};
