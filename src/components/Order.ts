import { Form } from './common/Forms';
import { IOrderForm, IOrderContactForm } from '../types';
import { IEvents } from '../components/base/events';

export class Order extends Form<IOrderForm> {
	button_cash: HTMLButtonElement;
	button_card: HTMLButtonElement;
	address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.button_cash = container.querySelector('[name="cash"]');
		this.button_card = container.querySelector('[name="card"]');
		this.address = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;

		this.button_card.addEventListener('click', (event: Event) => {
			this.onInputChange('payment', 'card');
			this.toggleOrderButton(this.button_card, this.button_cash);
		});

		this.button_cash.addEventListener('click', (event: Event) => {
			this.onInputChange('payment', 'cash');
			this.toggleOrderButton(this.button_cash, this.button_card);
		});
	}

	toggleOrderButton(buttonOn: HTMLButtonElement, buttonOff: HTMLButtonElement) {
		buttonOn.classList.add('button_alt-active');
		if (buttonOff.classList.contains('button_alt-active')) {
			buttonOff.classList.remove('button_alt-active');
		}
	}

	clearOrderOpenFields() {
		this.button_cash.classList.remove('button_alt-active');
		this.button_card.classList.remove('button_alt-active');
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			'';
	}
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
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
