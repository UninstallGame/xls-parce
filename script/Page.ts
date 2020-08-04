import {getElement} from "./help-functions";
import {ITobaccoBrand} from "./types";
import {getBrandTable} from "./creator";
import {teaBrands, tobaccoBrands, unsorted} from "./hardcode";

export class Page {
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

    constructor() {
    }

    public updatePage() {
        getElement('content').innerHTML = '';
        tobaccoBrands.forEach(it => this.add(getBrandTable(it, this.updateCollapseAllButtonText, this.onBuyClick)));
        teaBrands.forEach(it => this.add(getBrandTable(it, this.updateCollapseAllButtonText, this.onBuyClick)));
        this.add(getBrandTable(unsorted, this.updateCollapseAllButtonText, this.onBuyClick));
    }

    // Добавить в главный контейнер
    private add(element: HTMLElement): void {
        getElement('content').appendChild(element);
    }

    // По нажатию на шапку таблицы ↓
    private updateCollapseAllButtonText() {
        console.log(tobaccoBrands)
        if (tobaccoBrands.some(it => !it.hide) || teaBrands.some(it => !it.hide) || !unsorted.hide) {
            getElement('button-collapse').innerText = 'Развернуть все'
            return
        }
        getElement('button-collapse').innerText = 'Свернуть все'
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

        unsorted.values.forEach(it => {
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

    // Обновить общую стоимость
    private updateTotalPrice() {
        let result = 0
        tobaccoBrands.forEach(it => {
            if (!it.count) {
                return
            }

            it.values.forEach(item => {
                if (!item.selected) {
                    return
                }

                item.totalPrice = item.basePrice * item.count
                result += item.totalPrice;
            })
        })

        unsorted.values.forEach(it => {
            if (it.selected) {
                it.totalPrice = it.basePrice * it.count
                result += it.totalPrice;
            }
        })

        this.totalPrice = result;
    }

    // Обновить общее количество выбранных товаров
    private updateTotalCount() {
        let result = 0;
        tobaccoBrands.forEach(it => {
            result += it.count || 0
        })
        result += unsorted.count || 0
        this.totalCount = result
    }

}
