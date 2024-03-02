import './scss/styles.scss';

import {LarekApi} from "./components/WebLarekApi";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, CatalogChangeEvent, ProductItem} from "./components/AppData";
import {Page} from "./components/Page";
//import {Auction, AuctionItem, BidItem, CatalogItem, Card} from "./components/Card";
import {Card, CardProduct, CardBasket, ICardBasket} from "./components/Card";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";
import {IOrderForm, IOrderContactForm} from "./types";
import {Order, OrderSubmit} from "./components/Order";
import {Success} from "./components/common/Success";

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
//const auctionTemplate = ensureElement<HTMLTemplateElement>('#auction');
//const bidsTemplate = ensureElement<HTMLTemplateElement>('#bids');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket'); 
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
//const tabsTemplate = ensureElement<HTMLTemplateElement>('#tabs');
//const soldTemplate = ensureElement<HTMLTemplateElement>('#sold');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderSubmitTemplate = ensureElement<HTMLTemplateElement>('#contacts');;

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
//const bids = new Basket(cloneTemplate(bidsTemplate), events);
const orderSubmit = new OrderSubmit (cloneTemplate(orderSubmitTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
// const tabs = new Tabs(cloneTemplate(tabsTemplate), {
//     onClick: (name) => {
//         if (name === 'closed') events.emit('basket:open');
//         else events.emit('bids:open');
//     }
// });
const order = new Order(cloneTemplate(orderTemplate), events);
// const contacts = new OrderSubmit(cloneTemplate(contactsTemplate), events)
// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        // const CatalogItem = new Card(cloneTemplate(cardCatalogTemplate), {
        //     onClick: () => events.emit('card:select', item)
        // });
        const CatalogItem = new Card('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });//карточка каталога, с функцией открыть(нажатие на саму карточку)
        return CatalogItem.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price
        });
    });

   //page.counter = appData.getClosedLots().length;
});



// Изменилось состояние валидации формы
// events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
//     const { email, phone, address } = errors;
//     order.valid = !email && !phone && !address;
//     order.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
// });


events.on('formErrors.firstStep:change', (errors: Partial<IOrderForm>) => {
    const { address, payment } = errors;
    console.log('errors: ',errors)
    order.valid = !address && !payment;
    order.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
});


events.on('formErrors.secondStep:change', (errors: Partial<IOrderContactForm>) => {
    const { email, phone } = errors;
    console.log('errors: ',errors)
    orderSubmit.valid = !email && !phone;
    orderSubmit.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

events.on('order.payment:change', (data: { field: keyof IOrderForm, value: string }) => {
    appData.order.payment = data.value
})

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
});
events.on(/^orderSubmit\..*:change/, (data: { field: keyof IOrderContactForm, value: string }) => {
    appData.setContactsField(data.field, data.value);
});

// Открыть форму заказа
events.on('order:open', () => {
    appData.order.total = appData.getTotal();
    modal.render({
        content: order.render({
            payment: '',
            address: '',
            valid: false,
            errors: []
        })
        
    });
});

events.on('order:submit', () => {
    modal.render({
        content: orderSubmit.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
        
    });
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
    api.orderProducts(appData.order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    appData.clearBasket();
                    events.emit('auction:changed');
                }
            });

            modal.render({
                content: success.render({})
            });
        })
        .catch(err => {
            console.error(err);
        });
});

// Открыть активные лоты
// events.on('bids:open', () => {
//     modal.render({
//         content: createElement<HTMLElement>('div', {}, [
//             tabs.render({
//                 selected: 'active'
//             }),
//             bids.render()
//         ])
//     });
// });


// Изменения в лоте, но лучше все пересчитать
// events.on('auction:changed', () => {
//     page.counter = appData.getClosedLots().length;
//     bids.items = appData.getActiveLots().map(item => {
//         const card = new BidItem(cloneTemplate(cardBasketTemplate), {
//             onClick: () => events.emit('preview:changed', item)
//         });
//         return card.render({
//             title: item.title,
//             image: item.image,
//             status: {
//                 amount: item.price,
//                 status: item.isMyBid
//             }
//         });
//     });
//     let total = 0;
//     basket.items = appData.getClosedLots().map(item => {
//         const card = new BidItem(cloneTemplate(soldTemplate), {
//             onClick: (event) => {
//                 const checkbox = event.target as HTMLInputElement;
//                 appData.toggleOrderedLot(item.id, checkbox.checked);
//                 basket.total = appData.getTotal();
//                 basket.selected = appData.order.items;
//             }
//         });
//         return card.render({
//             title: item.title,
//             image: item.image,
//             status: {
//                 amount: item.price,
//                 status: item.isMyBid
//             }
//         });
//     });
//     basket.selected = appData.order.items;
//     basket.total = total;
// })

// Открыть лот
events.on('card:select', (item: ProductItem) => {
    appData.setPreview(item);
});

//Открыть выбранный продукт
events.on('preview:changed', (item: ProductItem) => {
    const showItem = new CardProduct('card', cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            events.emit('product:buy', item);
            console.log('sold')
            //showItem.sold;
            //item.button.setText('В корзине');
            // modal.render({
            //     content: showItem.render({
            //         title: item.title,
            //         image: item.image,
            //         category: item.category,
            //         price: item.price,
            //         description: item.description,
            //         id: item.id,
            //     }), 
            // });
        }
    });

    return modal.render({
        content: showItem.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price,
            description: item.description,
            id: item.id,
        })
    });
});


// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем лоты с сервера
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });


// Изменения в корзине - добавление товара в корзину
events.on('product:buy', (item: ProductItem) => {
    console.log('basket:changed')
    appData.toggleOrderedLot(item.id, true);
    page.counter = appData.getCount();
    modal.close();
    //basket.items
    // modal.render({
    //     content: showItem.render({
    //         showItem.set.sold
    //     })
    // });
})
//     page.counter = appData.getClosedLots().length;
//     bids.items = appData.getActiveLots().map(item => {
//         const card = new BidItem(cloneTemplate(cardBasketTemplate), {
//             onClick: () => events.emit('preview:changed', item)
//         });
//         return card.render({
//             title: item.title,
//             image: item.image,
//             status: {
//                 amount: item.price,
//                 status: item.isMyBid
//             }
//         });
//     });
//     let total = 0;
//     basket.items = appData.getClosedLots().map(item => {
//         const card = new BidItem(cloneTemplate(soldTemplate), {
//             onClick: (event) => {
//                 const checkbox = event.target as HTMLInputElement;
//                 appData.toggleOrderedLot(item.id, checkbox.checked);
//                 basket.total = appData.getTotal();
//                 basket.selected = appData.order.items;
//             }
//         });
//         return card.render({
//             title: item.title,
//             image: item.image,
//             status: {
//                 amount: item.price,
//                 status: item.isMyBid
//             }
//         });
//     });
//     basket.selected = appData.order.items;
//     basket.total = total;
// })

// Открыть корзину
events.on('basket:open', () => {
    let basketItemIndex:number = 0;
    basket.items = appData.getProduct().map(item => {
        basketItemIndex = basketItemIndex + 1;
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('item:delete', item)
        });
        
        return card.render({
            title: item.title,
            price: item.price,
            index:  basketItemIndex,
        });
    })
    basket.total = appData.getTotal();
    modal.render({
        content: basket.render()
    });
});

events.on('item:delete', (item: ProductItem) => {
    let basketItemIndex:number = 0;
    appData.toggleOrderedLot(item.id, false);
    basket.items = appData.getProduct().map(item => {
        basketItemIndex = basketItemIndex + 1;
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('item:delete', item)
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: basketItemIndex,
        });
    })
    basket.total = appData.getTotal();
    modal.render({
        content: basket.render()
    });
});

