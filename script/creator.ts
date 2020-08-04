import {ITobacco, ITobaccoBrand} from "./types";
// todo По хорошему и его передавать парамтром
import {buyList} from "./global-variables";

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
