import { formatNumber} from "../utils/utils";
import {FormErrors, IAppState, IProductItem, IOrder, IOrderForm} from "../types";
import {EventEmitter, IEvents} from "../components/base/events";
import {Model} from "./base/Model";

export type CatalogChangeEvent = {
    catalog: ProductItem[]
};

export class ProductItem extends Model<IProductItem> {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export class AppState extends Model<IAppState>{
    basket: string[];
    catalog: ProductItem[];
    loading: boolean;
    order: IOrder = {
        email: '', 
        phone: '',
        payment: '',
        adress: '',
        total: 0,
        items: [] 
    } ;
    preview: string | null;
    formErrors: FormErrors = {};


    // toggleOrderedLot(id: string, isIncluded: boolean) {
    //     if (isIncluded) {
    //         this.order.items = _.uniq([...this.order.items, id]);
    //     } else {
    //         this.order.items = _.without(this.order.items, id);
    //     }
    // }

    clearBasket() {
        this.order = {
            email: '', 
            phone: '',
            payment: '',
            adress: '',
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

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.order.adress) {
            errors.phone = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    
}