import {Component} from "../base/Component";
import {ensureAllElements} from "../../utils/utils";

export type TabActions = {
    onClick: (tab: string) => void
}

export interface ICardBasket {
    title: string;
    price: number;
    button: HTMLButtonElement;
};


export class CardBasket extends Component<ICardBasket> {
    // protected _buttons: HTMLButtonElement[];

    // constructor(container: HTMLElement, actions?: TabActions) {
    //     super(container);

    //     this._buttons = ensureAllElements<HTMLButtonElement>('.button', container);

    //     this._buttons.forEach(button => {
    //         button.addEventListener('click', () => {
    //             actions?.onClick?.(button.name);
    //         });
    //     })
    // }

    // set selected(name: string) {
    //     this._buttons.forEach(button => {
    //         this.toggleClass(button, 'tabs__item_active', button.name === name);
    //         this.setDisabled(button, button.name === name)
    //     });
    // }

    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;

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