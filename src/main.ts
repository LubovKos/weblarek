import './scss/styles.scss';

import { Api } from './components/base/Api';
import { LarekApi } from './components/Models/LarekApi';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { Basket } from './components/Views/Basket';
import { Modal } from './components/Views/Modal';
import { Header } from './components/Views/Header';
import { Gallery } from './components/Views/Gallery';
import { CardCatalog, CardPreview, CardBasket } from './components/Views/Card';
import { IProduct, IBuyer } from './types';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { Success } from './components/Views/Success';
import { Order } from './components/Views/Order';
import { Contacts } from './components/Views/Contacts';


const events = new EventEmitter();
const api = new LarekApi(new Api(API_URL));

const catalog = new ProductCatalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));

let basketView: Basket;

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Изменение каталога
events.on('items:changed', () => {
    gallery.catalog = catalog.getProducts().map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item),
        });
        return card.render({
            ...item,
            image: CDN_URL + item.image,
        });
    });
});

// Изменение выбранного товара
events.on('preview:changed', (item: IProduct) => {
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
        onClick: () => events.emit('card:toBasket', item),
    });

    modal.render({
        content: card.render({
            ...item,
            image: CDN_URL + item.image,
            buttonText: cart.hasItem(item.id) ? 'Удалить из корзины' : 'В корзину',
            description: item.description
        } as IProduct & { buttonText: string }) 
    });
    // console.log(cart.hasItem(item.id));
});

// Изменение содержимого корзины 
events.on('basket:changed', () => {
    header.counter = cart.getItemsCount();
    
    if (basketView) {
        basketView.render({
            items: cart.getItems().map((item, index) => {
                const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
                    onClick: () => cart.removeItem(item),
                });
                card.index = index + 1;
                return card.render(item);
            }),
            total: cart.getTotalPrice(),
        });
    }
});

// Валидация форм 
events.on('formErrors:change', (errors: Partial<IBuyer>) => {
    const { payment, address, email, phone } = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({ payment, address }).filter(Boolean).join('; ');

    contacts.valid = !email && !phone;
    contacts.errors = Object.values({ phone, email }).filter(Boolean).join('; ');
});

events.on('card:select', (item: IProduct) => {
    catalog.setSelectedProduct(item);
});

events.on('card:toBasket', (item: IProduct) => {
    if (cart.hasItem(item.id)) {
        cart.removeItem(item);
    } else {
        cart.addItem(item);
    }
    modal.close();
});

// Открытие корзины
events.on('basket:open', () => {
    basketView = new Basket(cloneTemplate(basketTemplate), events);
    modal.render({
        content: basketView.render({
            items: cart.getItems().map((item, index) => {
                const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
                    onClick: () => cart.removeItem(item),
                });
                card.index = index + 1;
                return card.render(item);
            }),
            total: cart.getTotalPrice(),
        }),
    });
});

// Открытие первой формы заказа
const order = new Order(cloneTemplate(orderTemplate), events);
events.on('order:open', () => {
    modal.render({
        content: order.render({
            payment: null,
            address: '',
            valid: false,
            errors: [],
            total: cart.getTotalPrice() 
        } as Partial<IBuyer> & { total: number; valid: boolean; errors: string[] }), 
    });
});

events.on(/^order\..*:change/, (data: { field: keyof IBuyer; value: string }) => {
    buyer.setData({ [data.field]: data.value });
});

events.on(/^contacts\..*:change/, (data: { field: keyof IBuyer; value: string }) => {
    buyer.setData({ [data.field]: data.value });
});

const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            email: '',
            phone: '',
            valid: false,
            errors: [],
        }),
    });
});

events.on('contacts:submit', () => {
    const orderData = {
        ...buyer.getData(),
        total: cart.getTotalPrice(),
        items: cart.getItems().map(item => item.id)
    };

    api.createOrder(orderData)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    cart.clear();
                    buyer.clear();
                }
            });

            modal.render({
                content: success.render({
                    total: result.total
                })
            });
        })
        .catch(err => console.error(err));
});

events.on('modal:open', () => {
    gallery.locked = true;
});

events.on('modal:close', () => {
    gallery.locked = false;
});

api.getProducts()
    .then((data) => {
        catalog.setProducts(data);
    })
    .catch((err) => {
        console.error('Ошибка загрузки данных:', err);
    });