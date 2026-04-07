import './scss/styles.scss';

import { Api } from './components/base/Api';
import { LarekApi } from './components/Models/LarekApi';
import { ProductCatalog } from './components/Models/ProductCatalog';

import { apiProducts } from './utils/data';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

const catalog = new ProductCatalog();
catalog.setProducts(apiProducts.items);

console.log('Каталог товаров:', catalog.getProducts());
console.log('Товар по id:', catalog.getProductById(apiProducts.items[0].id));

const cart = new Cart();

cart.addItem(apiProducts.items[0]);
cart.addItem(apiProducts.items[1]);

console.log('Товары в корзине:', cart.getItems());
console.log('Количество:', cart.getItemsCount());
console.log('Сумма:', cart.getTotalPrice());

cart.removeItem(apiProducts.items[0]);
console.log('После удаления:', cart.getItems());

console.log('Есть ли товар:', cart.hasItem(apiProducts.items[1].id));

cart.clear();
console.log('После очистки:', cart.getItems());

const buyer = new Buyer();

buyer.setData({
  email: 'test@test.com',
  phone: '1234567890'
});

console.log('Данные покупателя:', buyer.getData());
console.log('Ошибки валидации:', buyer.validate());

buyer.setData({
  payment: 'online',
  address: 'Москва'
});

console.log('Ошибки после заполнения:', buyer.validate());

buyer.clear();
console.log('После очистки:', buyer.getData());



const api = new Api(import.meta.env.VITE_API_ORIGIN);
const larekApi = new LarekApi(api);
const catalog2 = new ProductCatalog();
console.log(import.meta.env.VITE_API_ORIGIN);

larekApi.getProducts()
  .then((products) => {
    catalog2.setProducts(products);

    console.log('Товары с сервера:', catalog2.getProducts());
  })
  .catch((err) => {
    console.error('Ошибка загрузки товаров:', err);
  });
