import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._image = container.querySelector('.card__image') || undefined;
        this._category = container.querySelector('.card__category') || undefined;
        this._button = container.querySelector('.card__button') || undefined;

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
        if (this._button && value === null) {
            this._button.disabled = true;
            this._button.textContent = 'Недоступно';
        }
    }

    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, value, this.title);
    }
}

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            const categoryClass = categoryMap[value as keyof typeof categoryMap] || categoryMap['другое'];
            this._category.className = `card__category ${categoryClass}`;
        }
    }
}

export class CardCatalog extends Card {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);
    }
}

export class CardPreview extends Card {
    protected _button: HTMLButtonElement; 
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set buttonText(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
}
}

export class CardBasket extends Card {
    protected _index: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }
}