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
    id: string;
    description: string | string[];
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// интерфейс описания товара
export interface IProductItem<T> {
    id: string;
    description: string | string[];
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
    email: string;
    phone: string;
    payment: string;
}

export interface IAppState {
    catalog: IProductItem[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}