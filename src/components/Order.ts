import {Form} from "./common/Forms";
import {IOrderForm} from "../types";
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
            this.onInputChange('payment', 'card');
            // event.preventDefault();
            // console.log(`${this.container.name}.${this.button_card.name}:change`)
            // this.events.emit(`${this.container.name}.${this.button_card.name}:change`);
        })
        
        this.button_cash.addEventListener('click', (event: Event) => {
            this.onInputChange('payment', 'cash');
            // event.preventDefault();
            // console.log(`${this.container.name}.${this.button_cash.name}:change`)
            // this.events.emit(`${this.container.name}.${this.button_cash.name}:change`);
        })

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