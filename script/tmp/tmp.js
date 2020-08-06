import {tobaccoBrands, unsorted} from "../global-variables";

let hide = true
let init = false;
const buyList = [];
let totalPrice = 0


// V Обновить контент в попапе
export function updatePopupContent() {
    document.getElementById('positions').innerHTML = '';
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
        const amount = getChangeCounter(it, i)
        td3.className = 'popup-table-counter'

        if (!it.disableCounter) {
            td3.appendChild(amount)
        }

        const td4 = document.createElement('td')

        const removeBtn = document.createElement('img');
        removeBtn.src = 'assets/trash-solid.svg'
        removeBtn.width = 16
        removeBtn.className = 'cursor-pointer'
        removeBtn.addEventListener('click', () => remove(it))

        td4.appendChild(removeBtn)


        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        table.appendChild(tr)

        document.getElementById('positions').appendChild(table)
    })
    document.getElementById('popup').className = 'show-pp';
}

// Разобрать все по брендам
export function sortToBrands(arr) {
    const unsortedIndexes = [];
    arr.forEach((it, i) => {
        let finded = false
        tobaccoBrands.forEach(brand => {
            if (it.title.indexOf(brand.title) !== -1) {
                brand.values.push(it);
                finded = true;
            }
        })
        if (!finded) unsortedIndexes.push(i)
    })

    unsortedIndexes.forEach(i => {
        unsorted.values.push(arr[i]);
    })
    updateAllTables();
}

function updateAllTables() {
    document.getElementById('content').innerHTML = ''
    fill(tobaccoBrands);
    fill([unsorted], 'unsorted')
    init = true;
}

// Заполнить таблицу
function fill(arr, id) {
    arr.forEach((it, i) => {
        it.id = id ? id : i
        createBrandTable(it, it.id);
    })
}

function createBrandTable(obj, i) {

    const brandGroup = document.createElement('div');
    brandGroup.className = 'brand-group';

    const brandNameSpan = document.createElement('span');

    const brandCountSpan = document.createElement('span');
    brandCountSpan.id = `count-${i}`

    const brandTable = document.createElement('table');
    brandTable.className = 'brand_table';

    const brandTitle = document.createElement('div');
    brandTitle.className = 'brand_title';
    brandTitle.id = `brand_title-${i}`;
    brandNameSpan.innerText = obj.title;
    brandNameSpan.id = `name-${i}`;
    brandTitle.appendChild(brandNameSpan)
    brandTitle.appendChild(brandCountSpan)

    brandTable.className = obj.hide ? 'collapsed' : 'brand_table';
    brandTitle.className = obj.hide ? 'collapsed-title' : 'brand_title';

    brandTitle.addEventListener('click', () => {
        obj.hide = !obj.hide
        brandTable.className = obj.hide ? 'collapsed' : 'brand_table';
        brandTitle.className = obj.hide ? 'collapsed-title' : 'brand_title';
        updateCollapseAllButtonText();
    })

    obj.values.forEach((it) => {
        brandTable.appendChild(getNewRow(it, obj))
    })

    brandGroup.appendChild(brandTitle);
    brandGroup.appendChild(brandTable);

    document.getElementById('content').appendChild(brandGroup);
}

// Получить 1 строку таблицы
function getNewRow(obj, brandObj) {
    const tr = document.createElement('tr')
    const td1 = document.createElement('td')
    td1.className = 'title'
    td1.innerText = obj.title;

    const td2 = document.createElement('td')
    td2.innerText = obj.basePrice + ' ₽'
    td2.className = 'price'

    const td3 = document.createElement('td')
    td3.innerText = 'Купить'
    td3.id = 'buy'

    if (obj.selected) {
        td3.innerText = 'В корзине'
        td1.id = 'buy-on'
        td2.id = 'buy-on'
        td3.id = 'buy-on'
    }

    td3.addEventListener('click', () => {
        if (obj.selected) {
            td3.innerText = 'Купить'
            const i = buyList.indexOf(obj)
            buyList.splice(i, 1)
            td1.id = ''
            td2.id = ''
            td3.id = 'buy'
            obj.selected = false
            brandObj.count -= 1
        } else {
            buyList.push(obj)
            td3.innerText = 'В корзине'
            td1.id = 'buy-on'
            td2.id = 'buy-on'
            td3.id = 'buy-on'
            obj.selected = true
            if (!brandObj.count) brandObj.count = 0
            brandObj.count += 1
            console.log('bra', brandObj)
        }
        updateCounters(brandObj.id, brandObj.count)
        updateTotalPrice()
        updateAllPositions();
    })

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    return tr;

}

// Обновить общую стоймость
function updateTotalPrice() {
    totalPrice = 0
    tobaccoBrands.forEach(it => {
        if (!it.count) {
            return
        }

        it.values.forEach(item => {
            if (!item.selected) {
                return
            }

            item.totalPrice = item.basePrice * item.amount
            totalPrice += item.totalPrice;
        })
    })

    unsorted.values.forEach(it => {
        if (it.selected) {
            it.totalPrice = it.basePrice * it.amount
            totalPrice += it.totalPrice;
        }
    })
    document.getElementById('total-price').innerText = `Итого: ~${totalPrice}`
    document.getElementById('popup_top_total-price').innerText = `Итого: ~${totalPrice} ₽`
}

// Обновить количество выбранного
function updateCounters() {
    tobaccoBrands.forEach(it => {
        it.count = 0
        it.values.forEach(item => {
            if (item.selected) {
                it.count++
            }

        })
        const element = document.getElementById(`count-${it.id}`)
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
        const elementUnsorted = document.getElementById(`count-unsorted`)
        if (!unsorted.count) {
            elementUnsorted.innerText = ''
            return;
        }
        elementUnsorted.innerText = `Выбрано: ${unsorted.count}`
        elementUnsorted.style.color = '#28a745'
        elementUnsorted.style.fontWeight = '500'
    })
}

// V Обновить количество выбранных позиций в пп
function updateAllPositions() {
    let res = 0;
    tobaccoBrands.forEach(it => {
        res += it.count || 0
    })
    res += unsorted.count || 0
    console.log(unsorted)
    document.getElementById('popup_top_count').innerText = `Товаров: ${res}`
}

// V Взять крутилку количества
function getChangeCounter(obj, i) {
    const result = document.createElement('div')
    result.className = 'add';

    const minus = document.createElement('div')
    minus.className = 'add_minus'
    minus.innerText = '-'
    minus.addEventListener('click', () => changeAmount(obj, false, i))

    const count = document.createElement('div')
    count.id = `add_count-${i}`
    count.className = 'add_count';
    count.innerText = obj.amount || 1

    const plus = document.createElement('div')
    plus.className = 'add_plus'
    plus.innerText = '+'
    plus.addEventListener('click', () => changeAmount(obj, true, i))

    result.appendChild(minus)
    result.appendChild(count)
    result.appendChild(plus)

    return result;
}

// V Работает в паре с крутилкой. Меняет количество позиций
function changeAmount(obj, add, i) {
    if (add) {
        obj.amount++
    } else {
        if (obj.amount === 1) {
            return;
        }
        obj.amount--
    }
    updateTotalPrice()
    document.getElementById(`add_count-${i}`).innerText = `${obj.amount}`
}

export function collapseAllBrandCards() {
    updateAllTables();
    updateCollapseAllButtonText();
    updateCounters();
}

function updateCollapseAllButtonText() {
    if (tobaccoBrands.some(it => it.hide === true) || unsorted.hide === true) {
        hide = false
        document.getElementById('button-collapse').innerText = 'Развернуть все'
        return
    }
    document.getElementById('button-collapse').innerText = 'Свернуть все'
    hide = true

}
