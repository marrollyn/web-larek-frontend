import {Component} from "./base/Component";
import {IProductItem, ICard} from "../types";
import {bem, createElement, ensureElement, formatNumber} from "../utils/utils";
import {Model} from "./base/Model";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProductItem> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _description?: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._description = container.querySelector(`.${blockName}__text`);
        
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set price(value: number | null) {
        if (!value) {
            this.setText(this._price, 'Бесценно');
            this.setDisabled(this._button, true);
            this.setText(this._button, 'Недоступно к покупе');
        } else this.setText(this._price, value + ' синапсов')  ;
    }

    get price(): string {
        return this._price.textContent;
    }

    set category(value: string) {
        this.setText(this._category, value);
    }

    get category(): string {
        return this._title.textContent;
    }
}

export class CardProduct extends Card {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;
    protected _id: string;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(blockName, container, actions);

        // this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        // this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        // this._button = container.querySelector(`.${blockName}__button`);
        //this._description = container.querySelector(`.${blockName}__text`);
        // this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
        // this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        
        // if (actions?.onClick) {
        //     if (this._button) {
        //         this._button.addEventListener('click', actions.onClick);
        //     } else {
        //         container.addEventListener('click', actions.onClick);
        //     }
        // }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    // set title(value: string) {
    //     this.setText(this._title, value);
    // }

    // get title(): string {
    //     return this._title.textContent || '';
    // }

    // set image(value: string) {
    //     this.setImage(this._image, value, this.title)
    // }

    set description(value: string) {
        this.setText(this._description, value);
    }

    // set price(value: number | null) {
    //     if (!value) {
    //         this.setText(this._price, 'Бесценно');
    //         this._button.setAttribute('disabled', 'disabled');
    //     } else this.setText(this._price, value + ' синапсов')  ;
    // }

    // get price(): string {
    //     return this._price.textContent;
    // }

    // set category(value: string) {
    //     this.setText(this._category, value);
    // }

    // get category(): string {
    //     return this._title.textContent;
    // }

    // set disableButton (price: number | null) {
    // //this._button.setAttribute('disabled', 'disabled');
    //     //this._button.setAttribute('disabled', 'true')
    //     if (this._price.textContent === 'Бесценно'){
    //         this.setDisabled(this._button, true);
    //         this.setText(this._button, 'Недоступно к покупе');
    //     }
        
    // }

    sold(_button: HTMLButtonElement) {
        this.setText(this._button, 'В корзине');
        this._button.setAttribute('disabled', 'disabled');
    }
}


export interface ICardBasket {
    title: string;
    price: number;
    button: HTMLButtonElement;
    index: number;
};


export class CardBasket extends Component<ICardBasket> {

    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _index: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    // get title(): string {
    //     return this._title.textContent || '';
    // }

    set price(value: number) {
        this.setText(this._price, value + ' синапсов')  ;
    }

    set index(value: number) {
        this.setText(this._index, value);
    }

    // get price(): string {
    //     return this._price.textContent;
    // }
}