import {parseExcel} from "./parse";
import {collapseAllBrandCards, updatePopupContent} from "./tmp";


window.setTimeout(() => {
    // Если нажали не на пп, скрыть его
    document.body.addEventListener('mousedown', e => {
        let closePP = true
        e.path.forEach(it => {
            if (it.id === 'popup') {
                closePP = false;
            }
        })
        if (closePP) {
            document.getElementById('popup').className = ''
        }
    })

    // на esc тоже закроем
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.getElementById('popup').className = ''
        }
    })

    // и на скролл
    document.addEventListener('scroll', e => {
            document.getElementById('popup').className = ''
    })

    // Выбрали файл
    document.getElementById('input-file').addEventListener('change', e => {
        parseExcel(e.target.files[0]);
    })

    // Нажали на то что должно открывать пп
    document.getElementById('price-container').addEventListener('click', () => {
        window.setTimeout(() => {
            updatePopupContent();
        }, 50)
    })

    document.getElementById('button-collapse').addEventListener('click', () => {
        collapseAllBrandCards();
    })

}, 50)
