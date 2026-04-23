import { Form } from './Form';
import { IBuyer } from '../../types';
import { IEvents } from '../base/Events';
import { ensureAllElements } from '../../utils/utils';

export class Order extends Form<IBuyer> {
    protected _buttons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

        this._buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('order.payment:change', { field: 'payment', value: button.name });
            });
        });
    }

    set payment(name: string) {
        this._buttons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === name);
        });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}