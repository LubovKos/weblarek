import { Component } from '../base/Component';
import { createElement, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IBasketData {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketData> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        this._button.addEventListener('click', () => {
            this.events.emit('order:open');
        });

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length > 0) {
            this._list.replaceChildren(...items);
            this._button.disabled = false; 
        } else {
            this._list.replaceChildren(createElement('p', {
                textContent: 'Корзина пуста'
            }));
            this._button.disabled = true; 
        }
    }

    set total(total: number) {
        this._total.textContent = `${total} синапсов`;
    }
}