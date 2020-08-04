import {addEvent, afterTimeOut, getElement, updateWorkArrays} from "./help-functions";
import {ACTIONS} from "./types";

// @ts-ignore
import {parseExcel} from "./parse";
// @ts-ignore
import {collapseAllBrandCards, updatePopupContent, addDelivery, copy, addCustom} from "./tmp";
import {Page} from "./Page";
import {teaBrands, tobaccoBrands, unsorted} from "./hardcode";

let page = new Page();

afterTimeOut(() => {
    // Если нажали не на пп, скрыть его
    document.addEventListener(ACTIONS.MOUSEDOWN, e => {
        // @ts-ignore
        let found = findIdInElements(e.path, 'popup')
        if (!found) {
            getElement('popup').className = ''
        }
    })

    // на esc тоже закроем
    document.addEventListener(ACTIONS.KEYDOWN, e => {
        if (e.key === 'Escape') {
            getElement('popup').className = ''
        }
    })

    // и на скролл
    document.addEventListener(ACTIONS.SCROLL, () => {
        getElement('popup').className = ''
    })

    // Выбрали файл
    addEvent(ACTIONS.CHANGE, 'input-file', async (e: any) => {
        const result = await parseExcel(e);
        updateWorkArrays(result);
        page.updatePage();
    });

    // Нажали на то что должно открывать пп
    addEvent(ACTIONS.CLICK, 'price-container', () => {
        afterTimeOut(updatePopupContent);
    })
    // Свернуть все
    addEvent(ACTIONS.CLICK, 'button-collapse', collapseAllBrandCards)
    // Доставка 1
    addEvent(ACTIONS.CLICK, 'delivery-1', () => addDelivery(1))
    // Доставка 2
    addEvent(ACTIONS.CLICK, 'delivery-2', () => addDelivery(2))
    // Скопировать в буфер обмена
    addEvent(ACTIONS.CLICK, 'button-copy', copy);
    // Добавить свое поле
    addEvent(ACTIONS.CLICK, ' button-add', addCustom)
})

function findIdInElements(elements: HTMLElement[], id: string) {
    let result = false;
    elements.forEach(it => {
        if (it.id === id) {
            result = true;
        }
    })
    return result;
}
