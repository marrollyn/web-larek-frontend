import {Component} from "./base/Component";
import {IProductItem, ICard} from "../types";
import {bem, createElement, ensureElement, formatNumber} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

// export interface ICard<T> {
//     title: string;
//     description?: string | string[];
//     image: string;
//     status: T;
// }

export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    //protected _id: string;
    protected _category?: HTMLElement;
    protected _price?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    // set id(value: string) {
    //     this.container.dataset.id = value;
    // }

    // get id(): string {
    //     return this.container.dataset.id || '';
    // }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }

    set price(value: number | null) {
        if (!value) {
            this.setText(this._price, "Бесценно");
            //this.setDisabled(this._button, HTMLButtonElement)
        } else this.setText(this._price, value)  + 'синапсов';
    }

    get price(): string {
        return this._price.textContent;
    }

    set category(value: string) {
        this.setText(this._title, value);
    }

    get category(): string {
        return this._title.textContent;
    }
}