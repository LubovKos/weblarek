import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import { Card } from './Card';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class CardPreview extends Card {
    protected _button: HTMLButtonElement; 
    protected _description: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);

        if (actions?.onClick) { 
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set buttonText(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
    }

    set buttonDisabled(state: boolean) {
        if (this._button) {
            this._button.disabled = state;
        }
    }
    
    set category(value: string) {
        this._category.textContent = value;
        const categoryClass = categoryMap[value as keyof typeof categoryMap] || categoryMap['другое'];
        this._category.className = `card__category ${categoryClass}`;
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }  
}
