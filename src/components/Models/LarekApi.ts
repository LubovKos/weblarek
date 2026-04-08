import { IApi, IProduct, IProductsResponse, IOrderRequest, IOrderResponse } from '../../types';

export class LarekApi {
  constructor(private api: IApi) {}

  getProducts(): Promise<IProduct[]> { 
    return this.api.get<IProductsResponse>('/product/')
      .then(response => response.items);
  }

  createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order);
  }
}