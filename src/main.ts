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
import { CardCatalog } from './components/Views/CardCatalog';
import { CardPreview } from './components/Views/CardPreview';
import { CardBasket } from './components/Views/CardBasket';
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

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const basketView = new Basket(cloneTemplate(basketTemplate), events);
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit('card:toBasket') 
});
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
    onClick: () => {
        modal.close();
    }
});

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
events.on('preview:changed', () => {
    const item = catalog.getSelectedProduct();
    if (!item) return;

    const isPriceless = item.price === null;
    let buttonText = 'В корзину';
    if (isPriceless) {
        buttonText = 'Недоступно';
    } else if (cart.hasItem(item.id)) {
        buttonText = 'Удалить из корзины';
    }

    modal.render({
        content: cardPreview.render({
            ...item,
            image: CDN_URL + item.image,
            buttonText: buttonText,
            buttonDisabled: isPriceless, 
            description: item.description
        } as IProduct & { buttonText: string, buttonDisabled: boolean }) 
    });
});


// Изменение содержимого корзины 
events.on('basket:changed', () => {
    header.counter = cart.getItemsCount();
    basketView.render({
        items: cart.getItems().map((item, index) => {
            const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
                onClick: () => events.emit('basket:removeItem', item) 
            });
            card.index = index + 1; 
            return card.render(item);
        }),
        total: cart.getTotalPrice()
    });
});

// Обработка удаления из корзины 
events.on('basket:removeItem', (item: IProduct) => {
    cart.removeItem(item);
});

// Открытие корзины
events.on('basket:open', () => {
    modal.render({
        content: basketView.render() 
    });
});

// Изменение данных в формах
events.on('buyer:changed', () => {
    const data = buyer.getData(); 
    const errors = buyer.validate();
    order.render({
        payment: data.payment,
        address: data.address,
        valid: !errors.payment && !errors.address,
        errors: Object.values({ payment: errors.payment, address: errors.address })
                      .filter(Boolean)
                      .join('; ')
    });
    contacts.render({
        email: data.email,
        phone: data.phone,
        valid: !errors.email && !errors.phone,
        errors: Object.values({ email: errors.email, phone: errors.phone })
                      .filter(Boolean)
                      .join('; ')
    });
});

events.on('card:select', (item: IProduct) => {
    catalog.setSelectedProduct(item);
});

events.on('card:toBasket', () => {
    const item = catalog.getSelectedProduct();
    if (!item) return;
    if (cart.hasItem(item.id)) {
        cart.removeItem(item);
    } else {
        cart.addItem(item);
    }
    modal.close();
});

events.on(/^order\..*:change/, (data: { field: keyof IBuyer; value: string }) => {
    buyer.setData({ [data.field]: data.value });
});

events.on(/^contacts\..*:change/, (data: { field: keyof IBuyer; value: string }) => {
    buyer.setData({ [data.field]: data.value });
});

// Открытие первой формы заказа
events.on('order:open', () => {
    const data = buyer.getData();
    const errors = buyer.validate(); 

    modal.render({
        content: order.render({
            payment: data.payment,
            address: data.address,
            valid: !errors.payment && !errors.address,
            errors: Object.values({ payment: errors.payment, address: errors.address })
                          .filter(Boolean)
                          .join('; ')
        }),
    });
});

events.on('order:submit', () => {
    const data = buyer.getData(); 
    const errors = buyer.validate(); 

    modal.render({
        content: contacts.render({
            email: data.email, 
            phone: data.phone, 
            valid: !errors.email && !errors.phone,
            errors: Object.values({ email: errors.email, phone: errors.phone })
                          .filter(Boolean)
                          .join('; ')
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
            modal.render({
                content: success.render({
                    total: result.total
                })
            });
            cart.clear(); 
            buyer.clear(); 
        })
        .catch(err => console.error(err));
});

api.getProducts()
    .then((data) => {
        catalog.setProducts(data);
    })
    .catch((err) => {
        console.error('Ошибка загрузки данных:', err);
    });