import {Form} from "./common/Forms";
import {IOrderForm, IOrderContactForm} from "../types";
import {EventEmitter, IEvents} from "../components/base/events";
import {ensureElement} from "../utils/utils";

export class Order extends Form<IOrderForm> {
    button_cash: HTMLButtonElement;
    button_card: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.button_cash = container.querySelector('[name="cash"]');
        this.button_card = container.querySelector('[name="card"]');

        this.button_card.addEventListener('click', (event: Event) => {
            //let payment = 'online';
            this.onInputChange('payment', 'card');
            this.toggleOrderButton(this.button_card, this.button_cash);
            // this.button_card.classList.add('button_alt-active');
            // if(this.button_cash.classList.contains('button_alt-active')) {
            //     this.button_cash.classList.remove('button_alt-active');
            // };
            // event.preventDefault();
            // console.log(`${this.container.name}.${this.button_card.name}:change`)
            // this.events.emit(`${this.container.name}.${this.button_card.name}:change`);
        })
        
        this.button_cash.addEventListener('click', (event: Event) => {
            //let payment = 'offline';
            this.onInputChange('payment', 'cash');
            this.toggleOrderButton(this.button_cash, this.button_card);
            // this.button_cash.classList.add('button_alt-active');
            // if(this.button_card.classList.contains('button_alt-active')) {
            //     this.button_card.classList.remove('button_alt-active');
            // };
            // event.preventDefault();
            // console.log(`${this.container.name}.${this.button_cash.name}:change`)
            // this.events.emit(`${this.container.name}.${this.button_cash.name}:change`);
        })
    }

    toggleOrderButton (buttonOn:HTMLButtonElement, buttonOff:HTMLButtonElement) {
        buttonOn.classList.add('button_alt-active');
        if(buttonOff.classList.contains('button_alt-active')) {
            buttonOff.classList.remove('button_alt-active');
        };
    }


    // set phone(value: string) {
    //     (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    // }

    // set email(value: string) {
    //     (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    // }

    // set payment (payment: string) {
    //     this.payment = payment;
    // }
}

export class OrderSubmit extends Form<IOrderContactForm> {
    protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._email = this.container.elements.namedItem(
			'email'
		) as HTMLInputElement;
        this._phone = this.container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

}