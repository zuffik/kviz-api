import { Storage } from "./Storage";
import { Product } from "kafer-module";

export class MockStorage implements Storage {
  getProducts(): Product[] {
    return [
      {
        id: 1,
        name: "irure sunt duis duis nisi",
        price: 11.8949,
        quantity: 62
      },
      {
        id: 2,
        name: "incididunt aute amet mollit ullamco",
        price: 33.4985,
        quantity: 46
      },
      {
        id: 3,
        name: "aute eu tempor aliquip ipsum",
        price: 10.3383,
        quantity: 9
      },
      {
        id: 4,
        name: "adipisicing nulla Lorem est sunt",
        price: 50.418,
        quantity: 80
      },
      {
        id: 5,
        name: "laborum excepteur do proident dolore",
        price: 82.93,
        quantity: 34
      },
      {
        id: 6,
        name: "nulla sit officia qui anim",
        price: 69.2448,
        quantity: 97
      },
      {
        id: 7,
        name: "velit sunt cupidatat dolore quis",
        price: 17.4135,
        quantity: 24
      },
      {
        id: 8,
        name: "sint officia ex aliqua veniam",
        price: 10.4728,
        quantity: 100
      }
    ];
  }

}
