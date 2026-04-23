import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';


interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        
        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
          
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
    }
}