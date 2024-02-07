# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Базовый код
### Класс EventEmitter
Позволяет подписываться на события и уведомлять о наступлении события.
Класс имеет методы ```on``` ,  ```off``` ,  ```emit```  — для подписки на событие, отписки от события и уведомления о наступлении события соответственно.
Также есть методы  ```onAll``` и  ```offAll```  — для подписки на все события и сброса всех подписок.

### Абстрактный класс Component
Абстрактный класс для работы с DOM-элементами в дочерних компонентах.
Класс имеет методы:
 ```toggleClass``` - метод переключения класса
 ```setText``` - метод установки текстового содержимого
 ```setDisabled``` - метод смены состояние ```disabled```
 ```setHidden``` - метод для отображения элемента
 ```setVisible``` - метод для скрытия отображения элемента
 ```setImage``` - метод для установки изображения с альтернативным текстом 
 ```render``` - метод для возврата (отрисовки) элемента с переданными данными

### Класс Api
Класс для подключения к api проекта, имеет методы ```get```, ```post```

## Компоненты
### Классы Card, Basket, Form, Modal, Page, Success
Классы наследуются от абстрактного класса ```Component``` для отображения: 
- данных о товаре
- корзины
- форм
- модальных окон
- основной страницы
- окна с уведомлением об успешном заказе 

### Класс AppState
Класс для хранения данных корзины

### Класс LarekApi
Класс наследуются от класса ```Api``` для получения и отправки данных с api проекта

## Типизация базовых компонентов
```interface IEvents``` предоставлен в старотовом пакете

```
interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

interface IFormState {
    valid: boolean;
    errors: string[];
}

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

// интерфейс описания карточки товара
interface ICard<T> {
    id: string;
    description: string | string[];
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// интерфейс описания товара
interface IProductItem<T> {
    id: string;
    description: string | string[];
    image: string;
    title: string;
    category: string;
    price: number | null;
}

interface IModalData {
    content: HTMLElement;
}

// интерфейс описания формы заказа
interface IOrderForm {
    email: string;
    phone: string;
    payment: string;
}

interface IAppState {
    catalog: IProductItem[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}
```
