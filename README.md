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
### Класс EventEmitter implements IEvents
Позволяет подписываться на события и уведомлять о наступлении события.
Класс имеет методы ```on``` ,  ```off``` ,  ```emit```  — для подписки на событие, отписки от события и уведомления о наступлении события соответственно.
Также есть методы  ```onAll``` и  ```offAll```  — для подписки на все события и сброса всех подписок.

### Абстрактный класс Component
Абстрактный класс для работы с DOM-элементами в дочерних компонентах.
Конструктор принимает для чтения HTMLElement:
```protected constructor(protected readonly container: HTMLElement)```
Класс имеет методы:
    ```toggleClass(element: HTMLElement, className: string, force?: boolean)``` - метод переключения класса
    ```protected setText(element: HTMLElement, value: unknown)``` - метод установки текстового содержимого
    ```setDisabled(element: HTMLElement, state: boolean)``` - метод смены состояние ```disabled```
    ```protected setHidden(element: HTMLElement)``` - метод для отображения элемента
    ```protected setVisible(element: HTMLElement)``` - метод для скрытия отображения элемента
    ```protected setImage(element: HTMLImageElement, src: string, alt?: string)``` - метод для установки изображения с альтернативным текстом
    ```render(data?: Partial<T>): HTMLElement``` - метод для возврата (отрисовки) элемента с переданными данными

### Класс Api
Класс для подключения к api проекта, имеет методы ```get```, ```post```. Принимает в конструкторе строку базового url для обращения к api и объект дополнительных параметров метода ```fetch```.

## Компоненты
### Класс Card extends Component<ICard>
Класс наследуется от абстрактного класса ```Component``` для отображения данных о товаре.
Класс содержит защищенные поля с DOM-элементами (заголовок, изображение, описание, кнопка), в конструкторе происходит инициализация карточки товара. Имеет методы ```get``` и ```set``` для получения/установки id, заголовка, описания, изображения. 

### Класс Basket extends Component
Класс наследуется от абстрактного класса ```Component``` для отображения корзины. Класс содержит защищенные поля с DOM-элементами (сумма заказа, список товаров, кнопка), в конструкторе происходит инициализация карточки корзины. Имеет методы ```get``` и ```set``` для установки итоговой стоимости, заполнения списка корзины, для разблокировки кнопки.


### Класс Form<T> extends Component<IFormState> 
Класс наследуется от абстрактного класса ```Component``` для отображения форм приложения. Класс содержит защищенные поля с DOM-элементами (ошибки и кнопка сабмит), констируктор принимает DOM-элемент формы и события, происходит инициализация формы, включая добавление слушателей на инпут и на сабмит, предотврающий стандартное поведени. 
Имеет методы: 
    ```protected onInputChange(field: keyof T, value: string)```, принимающий поле и значение, внутри которого назначается слушатель на изменение поля, пердоставляющий информацию об изменненом поле и его значении 
    ```set valid(value: boolean)``` и ```set errors(value: string)``` для отключения кнопки подтверждения и вывода ошибки
    ```render(state: Partial<T> & IFormState)```, принимающий состояние формы и возвращающий форму с учетом полученных данных.   

### Класс Modal extends Component<IModalData>
Классы наследуется от абстрактного класса ```Component``` для отображения модальных окон. Класс содержит защищенные поля с DOM-элементами (элемент модального окна и кнопка закрытия). Конструктор принимает принимает DOM-элемент модалки и события, поисходит инициализация модального окна, включая добавление слушаетелей на кнопку закрытия, на контейнер (вызывающие закрытие) и слушатель на контент модалки, предоврающий дальнейшее всплытие клика.
Имеет методы:
    ```set content(value: HTMLElement)``` - устанавливает принимаемое значение в модальное окно
    ```open()``` - открывает моальное окно, генерирует событие открытия модального окна
    ```close()``` - закрывает модальное окно, гнерирует событие закрытия модального окна
    ```render(data: IModalData): HTMLElement ``` - принимает данные модального окна (DOM-элемент), вызывает родительский метод для отрисовки элемента и метод открытия и возвращает DOM-элемент.

### Класс Page extends Component<IPage>
Класс наследуется от абстрактного класса ```Component``` для отображения основной страницы приложения.

### Класс Success extends Component
Класс наследуется от абстрактного класса ```Component``` для отображения окна с уведомлением об успешном оформлении заказа.  






### Класс AppState implements IAppState
Класс для хранения данных приложения: корзины, каталога, заказа. Содержит методы загрузки/очистки данных корзины, добавления/удаления товара из корзины, метод валидации оформления заказа

### Класс LarekApi extends Api implements ILarekApi
Класс наследуются от класса ```Api``` для получения и отправки данных с api проекта. Принимает в конструкторе строку базового url для обращения к api и объект дополнительных параметров метода ```fetch```. Методы класса ```get```и ```post``` возвращают объект с данными, полученными с api.

## Типизация базовых компонентов
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