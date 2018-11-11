import { Product } from "kafer-module";

export interface Storage {
  getProducts(): Product[];
}
