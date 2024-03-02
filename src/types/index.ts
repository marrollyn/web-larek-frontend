export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

// интерфейс описания карточки товара
export interface ICard<T> {
    image: string;
    title: string;
    category: string;
    price: number | null;
    
}

// интерфейс описания товара
export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IModalData {
    content: HTMLElement;
}

// интерфейс описания формы заказа
export interface IOrderForm {
    payment: string;
    address: string;
}
export interface IOrderContactForm {
    email: string;
    phone: string;
}

export interface IOrder { 
    email: string; 
    phone: string; 
    payment: string;
    address: string;
    total: number;
    items: string[]; 
} 

// export interface IOrder extends IOrderForm {
//     items: string[]
// }

export interface IAppState {
    catalog: IProductItem[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}

export interface ILarekApi {
    getProductList: () => Promise<IProductItem[]>;
    getProductItem: (id: string) => Promise<IProductItem>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export interface ISuccess {
    total: number;
}

export interface ISuccessActions {
    onClick: () => void;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;