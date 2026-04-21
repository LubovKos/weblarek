import { Component } from '../base/Component';

interface IGalleryData {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
    protected _catalogElement: HTMLElement;
    protected _wrapper: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._catalogElement = container;
        this._wrapper = document.querySelector('.page__wrapper') as HTMLElement;
    }

    set catalog(items: HTMLElement[]) {
        this._catalogElement.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}