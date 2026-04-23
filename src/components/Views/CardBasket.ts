import { ensureElement } from '../../utils/utils';
import { Card } from './Card';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}
export class CardBasket extends Card {
    protected _index: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container); 
        
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }
}