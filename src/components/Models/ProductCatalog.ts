import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ProductCatalog {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    constructor(protected events: IEvents) {}

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('items:changed');
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find(item => item.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
        this.events.emit('preview:changed');
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}