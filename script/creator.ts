import {ICoords, ITobacco, ITobaccoBrand} from "./types";
// todo По хорошему и его передавать парамтром
import {buyList} from "./global-variables";
import {getElement} from "./help-functions";

/**
 * Функция создания таблицы
 * @param tobaccoBrand ITobaccoBrand
 * @param onBrandClick по нажатию на шапку таблицы
 * @param onBuyClick по нажатию на купить
 */
export function getBrandTable(tobaccoBrand: ITobaccoBrand, onBrandClick: () => void, onBuyClick: () => void): HTMLElement {

    const brandGroup = document.createElement('div');
    brandGroup.className = 'brand-group';

    const brandNameSpan = document.createElement('span');

    const brandCountSpan = document.createElement('span');
    brandCountSpan.id = `count-${tobaccoBrand.id}`

    const brandTable = document.createElement('table');
    brandTable.className = 'brand_table';

    const brandTitle = document.createElement('div');
    brandTitle.className = 'brand_title';
    brandTitle.id = `brand_title-${tobaccoBrand.id}`;
    brandNameSpan.innerText = tobaccoBrand.title;
    brandNameSpan.id = `name-${tobaccoBrand.id}`;
    brandTitle.appendChild(brandNameSpan)
    brandTitle.appendChild(brandCountSpan)

    brandTable.className = tobaccoBrand.hide ? 'collapsed' : 'brand_table';
    brandTitle.className = tobaccoBrand.hide ? 'collapsed-title' : 'brand_title';

    brandTitle.addEventListener('click', () => {
        tobaccoBrand.hide = !tobaccoBrand.hide
        brandTable.className = tobaccoBrand.hide ? 'collapsed' : 'brand_table';
        brandTitle.className = tobaccoBrand.hide ? 'collapsed-title' : 'brand_title';
        onBrandClick();
    })

    tobaccoBrand.values.forEach((tobacco) => {
        brandTable.appendChild(getNewRow(tobacco, tobaccoBrand, onBuyClick))
    })

    brandGroup.appendChild(brandTitle);
    brandGroup.appendChild(brandTable);

    return brandGroup;
}

export function getChangeCounter(obj: ITobacco, i: number, func: Function) {
    const result = document.createElement('div')
    result.className = 'add';

    const minus = document.createElement('div')
    minus.className = 'add_minus'
    minus.innerText = '-'
    minus.addEventListener('click', () => changeAmount(obj, false, i, func))

    const count = document.createElement('div')
    count.id = `add_count-${i}`
    count.className = 'add_count';
    count.innerText = obj.count.toString() || '1'

    const plus = document.createElement('div')
    plus.className = 'add_plus'
    plus.innerText = '+'
    plus.addEventListener('click', () => changeAmount(obj, true, i, func))

    result.appendChild(minus)
    result.appendChild(count)
    result.appendChild(plus)

    return result;
}

function changeAmount(obj: ITobacco, add: boolean, i: number, func: Function) {
    if (add) {
        obj.count++
    } else {
        if (obj.count === 1) {
            return;
        }
        obj.count--
    }
    getElement(`add_count-${i}`).innerText = `${obj.count}`
    func();
}

function getNewRow(tobacco: ITobacco, tobaccoBrand: ITobaccoBrand, onBuyClick: () => void) {
    const tr = document.createElement('tr')
    const td1 = document.createElement('td')
    td1.className = 'title'
    td1.innerText = tobacco.title;

    const td2 = document.createElement('td')
    td2.innerText = tobacco.basePrice + ' ₽'
    td2.className = 'price'

    const td3 = document.createElement('td')
    td3.innerText = 'Купить'
    td3.id = 'buy'

    if (tobacco.selected) {
        td3.innerText = 'В корзине'
        td1.id = 'buy-on'
        td2.id = 'buy-on'
        td3.id = 'buy-on'
    }

    td3.addEventListener('click', () => {
        if (tobacco.selected) {
            td3.innerText = 'Купить'
            const i = buyList.indexOf(tobacco)
            buyList.splice(i, 1)
            td1.id = ''
            td2.id = ''
            td3.id = 'buy'
            tobaccoBrand.count -= 1
        } else {
            buyList.push(tobacco)
            td3.innerText = 'В корзине'
            td1.id = 'buy-on'
            td2.id = 'buy-on'
            td3.id = 'buy-on'
            if (!tobaccoBrand.count) tobaccoBrand.count = 0
            tobaccoBrand.count += 1
        }
        tobacco.selected = !tobacco.selected
        onBuyClick();
    })

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    return tr;
}

export function getH2(str: string): HTMLElement {
    const h2 = document.createElement('h2')
    h2.innerText = str;
    return h2
}

export function createGhostCursor(id: string): HTMLElement {
    const cursor = document.createElement('div')
    cursor.className = 'ghost-cursor'
    cursor.id = id;
    cursor.innerText = id;
    document.body.appendChild(cursor)
    return cursor
}

let old: ICoords = {x: 0, y: 0};

export function ghostCursorMove(id: string, pos: { x: number, y: number }) {
    const element = getElement(id)

    const diff = {
        x: pos.x - old.x,
        y: pos.y - old.y
    }

    console.log(pos, old, diff);

    element.style.left = old.x + diff.x + 'px'
    element.style.top = old.y + diff.y + 'px'


    // if (pos.x > old.x) {
    //     element.style.left = old.x + diff.x + 'px'
    // } else {
    //     element.style.left = old.x - diff.x + 'px'
    // }
    //
    // if (pos.y > old.y) {
    //     element.style.top = old.x + diff.y + 'px'
    // } else {
    //     element.style.top = old.x - diff.y + 'px'
    // }
    old = pos;
}


