import _ from "lodash";
import { formatNumber} from "../utils/utils";
import {FormErrors, IAppState, IProductItem, IOrder, IOrderForm} from "../types";
import {EventEmitter, IEvents} from "../components/base/events";
import {Model} from "./base/Model";


export class ProductItem extends Model<IProductItem> {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export type CatalogChangeEvent = {
    catalog: ProductItem[]
};

export class AppState extends Model<IAppState>{
    basket: [];
    catalog: ProductItem[];
    loading: boolean;
    order: IOrder = {
        email: '', 
        phone: '',
        payment: '',
        address: '',
        total: 0,
        items: [] 
    } ;
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
            items: []
        }
    };
    

    getTotal() {
        return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
    }

    setCatalog(items: IProductItem[]) {
        this.catalog = items.map(item => new ProductItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: ProductItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        console.log('field in AppData', field, value)

        if (this.validateOrder(field, value)) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder(field: keyof IOrderForm, value: string) {
        const errors: typeof this.formErrors = {};
        console.log('order:', this.order)
        if (!this.order.email && !this.isValidValue(field, value)) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать тип оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        console.log('validationOrder', errors)

        this.formErrors = errors;
        if(field === 'address' || field === 'payment') {
            this.events.emit('formErrors.firstStep:change', this.formErrors);
        } else {
            this.events.emit('formErrors.secondStep:change', this.formErrors);
        }
        
        return Object.keys(errors).length === 0;
    }

    isValidValue(fieldName: keyof IOrderForm, value:string) {
        if(fieldName === 'email') {
            // value.test(/@./)
            return true
        }
    }

    getProduct(): IProductItem[] {
        return this.catalog
            .filter(item => this.order.items.includes(item.id))
    }

}