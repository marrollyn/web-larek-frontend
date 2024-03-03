import _ from 'lodash';
import {
	FormErrors,
	IAppState,
	IProductItem,
	IOrder,
	IOrderForm,
	IOrderContactForm,
} from '../types';
import { Model } from './base/Model';

export class ProductItem extends Model<IProductItem> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export type CatalogChangeEvent = {
	catalog: ProductItem[];
};

export class AppState extends Model<IAppState> {
	basket: [];
	catalog: ProductItem[];
	loading: boolean;
	order: IOrder = {
		email: '',
		phone: '',
		payment: '',
		address: '',
		total: 0,
		items: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	toggleOrderedLot(id: string, isIncluded: boolean) {
		if (isIncluded) {
			this.order.items = _.uniq([...this.order.items, id]);
		} else {
			this.order.items = _.without(this.order.items, id);
		}
	}

	getCount(): number {
		return this.order.items.length;
	}

	clearBasket() {
		this.order = {
			email: '',
			phone: '',
			payment: '',
			address: '',
			total: 0,
			items: [],
		};
	}

	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	setCatalog(items: IProductItem[]) {
		this.catalog = items.map((item) => new ProductItem(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: ProductItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setContactsField(field: keyof IOrderContactForm, value: string) {
		this.order[field] = value;

		if (this.validateContactOrder()) {
			this.events.emit('orderContact:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать тип оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors.firstStep:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	validateContactOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors.secondStep:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	getProduct(): IProductItem[] {
		return this.catalog.filter((item) => this.order.items.includes(item.id));
	}

	clearOrderOpenFields() {
		this.order.address = '';
		this.order.payment = '';
	}
}
