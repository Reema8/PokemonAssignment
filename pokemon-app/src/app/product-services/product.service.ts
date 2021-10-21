import { Injectable } from '@angular/core';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productArray = [];
  constructor() { }

  setProduct(product: Item ) {
    this.productArray.push(product);
  }

  getProductArray() {
    return this.productArray;
  }
}
