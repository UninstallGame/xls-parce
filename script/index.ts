import {addEvent, afterTimeOut, getElement, updateWorkArrays} from "./help-functions";

// @ts-ignore
import {parseExcel} from "./parse";
import {Page} from "./Page";
import {createGhostCursor, ghostCursorMove} from "./creator";
import {ACTIONS, IBuyList, ICoords} from "./types";
import {DATA_PROTOCOL_TYPE, IDataProtocolAnswer, IDataProtocolRequest} from "./server-types/types";

let page = new Page();
let mouseMoveIntervalId: number;
let old: ICoords = {x: 0, y: 0};

document.addEventListener("DOMContentLoaded", () => {
    console.log('DOMContentLoaded')
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

    createGhostCursor('meow1213')

    document.addEventListener('mousemove', e => {
        // if (mouseMoveIntervalId) {
        //     return
        // }
        // mouseMoveIntervalId = window.setTimeout(() => {
        const {x, y} = e
        if (Math.abs(x - old.x) < 50 || Math.abs(y - old.y) < 50) {
            return
        }
        // sendPositionCursor({x, y})
        ghostCursorMove('meow1213', {x, y})
        // mouseMoveIntervalId = 0;
        old = {x, y}
        // }, 500)
    })

    // Выбрали файл
    addEvent(ACTIONS.CHANGE, 'input-file', async (e: Event) => {
        const result = await parseExcel(e);
        updateWorkArrays(result);
        page.updatePage();
        getElement('document-time').innerText = `Дата документа: ${result.documentDate}`
    });

    // Нажали на то что должно открывать пп
    addEvent(ACTIONS.CLICK, 'price-container', () => {
        afterTimeOut(() => page.updatePopupContent());
    })
    // Свернуть все
    addEvent(ACTIONS.CLICK, 'button-collapse', () => page.toggleVisibleAllBrandCards())
    // Доставка 1
    addEvent(ACTIONS.CLICK, 'delivery-1', () => page.addDelivery(1))
    // Доставка 2
    addEvent(ACTIONS.CLICK, 'delivery-2', () => page.addDelivery(2))
    // Скопировать в буфер обмена
    addEvent(ACTIONS.CLICK, 'button-copy', () => sendBuyList(page.buyList));
    // Добавить свое поле
    addEvent(ACTIONS.CLICK, 'button-add', () => page.addCustomField())

    // @ts-ignore
    const socket = io("http://192.168.1.206:3000/");
    console.log(socket)

    socket.on("message", function (data: IDataProtocolAnswer) {
        if (data.type === DATA_PROTOCOL_TYPE.USER_JOIN) {
            createGhostCursor(data.from)
        }
        if (data.type === DATA_PROTOCOL_TYPE.CURSOR) {
            ghostCursorMove(data.from, data.data)
        }
        console.log(data);
    });

    function sendBuyList(copyList: IBuyList[]) {
        const req: IDataProtocolRequest = {
            type: DATA_PROTOCOL_TYPE.BUY_LIST,
            data: copyList
        }
        socket.emit("message", req);
    }

    function sendPositionCursor(pos: { x: number, y: number }) {
        const req: IDataProtocolRequest = {
            type: DATA_PROTOCOL_TYPE.CURSOR,
            data: pos,
        }
        socket.emit("message", req);
    }
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
