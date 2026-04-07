import { IApi, IProduct, IProductsResponse, IOrderRequest, IOrderResponse } from '../../types';

export class LarekApi {
  constructor(private api: IApi) {}

  getProducts(): Promise<IProduct[]> {
    return this.api.get('/product/')
      .then(data => (data as IProductsResponse).items);
  }

  createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post('/order/', order)
      .then(data => data as IOrderResponse);
  }
}