
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import { Card } from './Card';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class CardCatalog extends Card {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
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
