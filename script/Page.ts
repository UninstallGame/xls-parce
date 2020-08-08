import {getElement} from "./help-functions";
import {getBrandTable, getChangeCounter, getH2} from "./creator";

import {buyList, teaBrands, tobaccoBrands, unsorted} from "./global-variables";
import {IBuyList, ITobacco, ITobaccoBrand} from "./types";

export class Page {
    get buyList(): IBuyList[] {
        return buyList
    }

    get totalCount(): number {
        return this._totalCount;
    }

    set totalCount(value: number) {
        this._totalCount = value;
        getElement('popup_top_count').innerText = `Товаров: ${value}`
    }

    get totalPrice(): number {
        return this._totalPrice;
    }

    set totalPrice(value: number) {
        this._totalPrice = value;
        getElement('total-price').innerText = `Итого: ~${value}`
        getElement('popup_top_total-price').innerText = `Итого: ~${value} ₽`
    }

    // Общая стоимость
    private _totalPrice: number = 0;
    // Общий счетчик
    private _totalCount: number = 0;
    // Для сворачивания всех брендов
    private hide = true
    // Загружен ли прайс
    private init = false

    constructor() {
    }

    // Добавить доставку
    public addDelivery(id: number) {
        buyList.push(<IBuyList>{
            count: 1,
            title: `+ Доставка - ${id === 1 ? 'Иркутская, 26' : '120й промквартал, 54Б'}`,
            disableCounter: true,
        });
        this.updatePopupContent();
    }

    // Добавить кастомное поле с инпутом
    public addCustomField() {
        buyList.push(<IBuyList>{
            count: 1,
            isEdit: true
        });
        this.updatePopupContent();
    }

    // Обновить все данные попапа
    public updatePopupContent() {
        this.updateTotalCount();
        getElement('positions').innerHTML = '';
        buyList.forEach((it, i) => {
            const table = document.createElement('table');
            table.id = 'popup-table'
            const tr = document.createElement('tr');
            tr.style.backgroundColor = 'white'
            if (buyList.length !== i + 1) {
                tr.style.borderBottom = '1px solid #cbcaca'
            }

            let td1;

            if (it.isEdit) {
                td1 = document.createElement('td')
                const input = document.createElement('input')
                input.className = 'popup-input'
                input.value = it.title || '';
                input.addEventListener('change', (e) => {
                    // @ts-ignore
                    it.title = e.target.value;
                })
                td1.appendChild(input)
            } else {
                td1 = document.createElement('td')
                td1.innerText = it.title
            }

            td1.className = 'popup-table-title'

            const td2 = document.createElement('td')
            if (it.basePrice) {
                td2.innerText = it.basePrice + ' ₽'
            }
            td2.className = 'popup-table-price'

            const td3 = document.createElement('td')
            const amount = getChangeCounter(it, i, () => this.updateTotalPrice())
            td3.className = 'popup-table-counter'

            if (!it.disableCounter) {
                td3.appendChild(amount)
            }

            const td4 = document.createElement('td')

            const removeBtn = document.createElement('img');
            removeBtn.src = 'assets/trash-solid.svg'
            removeBtn.width = 16
            removeBtn.className = 'cursor-pointer'
            removeBtn.addEventListener('click', () => this.remove(it))

            td4.appendChild(removeBtn)


            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);

            table.appendChild(tr)

            getElement('positions').appendChild(table)
        })
        getElement('popup').className = 'show-pp';
    }

    // Скопировать
    public getBuyList() {
        return buyList
    }

    // Обновить все данные страницы
    public updatePage() {
        const fillTobaccoBrand = (it: ITobaccoBrand) => {
            this.add(getBrandTable(it, () => this.updateCollapseAllButtonText(), () => this.onBuyClick()))
        }

        getElement('content').innerHTML = '';
        this.add(getH2('Табак'));
        tobaccoBrands.forEach(fillTobaccoBrand);
        this.add(getH2('Чай'));
        teaBrands.forEach(fillTobaccoBrand);
        this.add(getH2('Не вышло'));
        fillTobaccoBrand(unsorted);
        this.init = true;
    }

    // Переключить состояние видимости таблиц брендов
    public toggleVisibleAllBrandCards() {
        if (!this.init) {
            return
        }
        tobaccoBrands.forEach(it => {
            it.hide = this.hide
        })

        teaBrands.forEach(it => {
            it.hide = this.hide
        })

        unsorted.hide = this.hide
        this.updatePage();
        this.updateCollapseAllButtonText();
        this.updateCounters();
    }

    // Добавить в главный контейнер
    private add(element: HTMLElement): void {
        getElement('content').appendChild(element);
    }

    // По нажатию на шапку таблицы ↓ (обновить текст на кнопке сворачиввания)
    private updateCollapseAllButtonText() {
        if (tobaccoBrands.find((it: any) => it.hide === true) || teaBrands.find((it: any) => it.hide === true) || unsorted.hide === true) {
            this.hide = false
            getElement('button-collapse').innerText = 'Развернуть все'
            return
        }
        getElement('button-collapse').innerText = 'Свернуть все'
        this.hide = true
    }

    // По нажатию на "купить" в таблице ↓
    private onBuyClick() {
        this.updateCounters()
        this.updateTotalPrice()
        this.updateTotalCount();
    }

    // Обновление счетчиков в шапке таблицы
    private updateCounters() {
        tobaccoBrands.forEach(it => {
            it.count = 0
            it.values.forEach(item => {
                if (item.selected) {
                    it.count++
                }

            })
            const element = getElement(`count-${it.id}`)
            if (!it.count) {
                element.innerText = ''
                return;
            }
            element.innerText = `Выбрано: ${it.count}`
            element.style.color = '#28a745'
            element.style.fontWeight = '500'
        })

        unsorted.values.forEach((it: any) => {
            unsorted.count = 0
            if (it.selected) {
                unsorted.count++
            }
            const elementUnsorted = getElement(`count-unsorted`)
            if (!unsorted.count) {
                elementUnsorted.innerText = ''
                return;
            }
            elementUnsorted.innerText = `Выбрано: ${unsorted.count}`
            elementUnsorted.style.color = '#28a745'
            elementUnsorted.style.fontWeight = '500'
        })
    }

    // Обновить цену
    private updateTotalPrice() {
        let result = 0
        buyList.forEach(it => {
            if (it.basePrice && it.count) {
                result += it.basePrice * it.count
            }
        })
        this.totalPrice = result;
    }

    // Обновить общее количество выбранных товаров
    private updateTotalCount() {
        this.totalCount = buyList.length
    }

    // Удалить позицию из корзины
    private remove(obj: ITobacco) {
        obj.selected = false
        obj.count = 1;
        const i = buyList.indexOf(obj)
        buyList.splice(i, 1)
        this.updatePopupContent();
        this.updateTotalPrice();
        this.updatePage();
    }
}
