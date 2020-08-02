const tobaccoBrands = [
    {
        title: 'A&E',
        values: []
    },
    {
        title: 'Al Fakher',
        values: []
    },
    {
        title: 'Azure Black',
        values: []
    },
    {
        title: 'Bonche',
        values: []
    },
    {
        title: 'D-gastro',
        values: []
    },
    {
        title: 'Duft',
        values: []
    },
    {
        title: 'Satyr',
        values: []
    },
    {
        title: 'Serbetli',
        values: []
    },
    {
        title: 'Smoke Angel',
        values: []
    },
    {
        title: 'Spectrum',
        values: []
    },
    {
        title: 'Дэйли Хука',
        values: []
    },
    {
        title: 'Inferno',
        values: []
    },
    {
        title: 'М18',
        values: []
    },
    {
        title: 'Burn',
        values: []
    },
    {
        title: 'Ветер Северный',
        values: []
    },
    {
        title: 'Black Burn',
        values: []
    },
    {
        title: 'BlackBurn',
        values: []
    },
    {
        title: 'Burn BLACK',
        values: []
    },
    {
        title: 'Element',
        values: []
    },
    {
        title: 'Элемент',
        values: []
    },
    {
        title: 'Malaysian',
        values: []
    },
    {
        title: 'Must Have Undercoal',
        values: []
    },
    {
        title: 'Sebero',
        values: []
    },
    {
        title: 'Адалия',
        values: []
    },
    {
        title: 'Афзал',
        values: []
    },
    {
        title: 'Дарк Сайд',
        values: []
    },
    {
        title: 'Зомо',
        values: []
    },
    {
        title: 'Кисмет',
        values: []
    },
    {
        title: 'Кобра',
        values: []
    },
    {
        title: 'Мэтт Пир Тобакко',
        values: []
    },
    {
        title: 'Нахла',
        values: []
    },
    {
        title: 'Икс',
        values: []
    },
    {
        title: 'СПЕКТРУМ',
        values: []
    },
    {
        title: 'Сатир',
        values: []
    },
    {
        title: 'Табабка',
        values: []
    },
    {
        title: 'Chabacco',
        values: []
    },
    {
        title: 'Blaze',
        values: []
    },
    {
        title: 'BRUSKO',
        values: []
    },
    {
        title: 'Cobra',
        values: []
    },
    {
        title: 'B3',
        values: []
    },
]

// todo сделать рабочим (не считается сумма, количество. Не отображается выбранные позиции в шапке бренда)
const unsorted = {
    title: 'Без категории>',
    values: []
}

// const teaBrands = [
//     {
//         title: 'Chabacco',
//         values: []
//     },
//     {
//         title: 'Blaze',
//         values: []
//     },
//     {
//         title: 'BRUSKO',
//         values: []
//     },
//     {
//         title: 'Malaysian Mix by Danger',
//         values: []
//     },
//     {
//         title: 'Cobra',
//         values: []
//     },
// ]

window.setTimeout(() => {
    document.body.addEventListener('click', e => {
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

    document.getElementById('input-file').addEventListener('change', e => {
        parseExcel(e.target.files[0]);
    })

    document.getElementById('price-container').addEventListener('click', () => {
        window.setTimeout(() => {
            show_pp();
        }, 50)
    })

}, 50)
const buyList = [];
let totalPrice = 0

function parseExcel(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = e.target.result;
        const workbook = XLS.read(data, {
            type: 'binary'
        });

        // workbook.SheetNames => здесь массив имен таблиц
        // workbook.Sheets => здесь хэш таблиц по именам
        // Берем первую таблицу
        const obj = workbook.Sheets[workbook.SheetNames[0]];
        const result = []

        // Опытным путем было установлено что ячейка E это цена, в D это название
        // Находим цену, сопостовляем с названием, и кот василий
        Object.keys(obj)
            // Фильтруем по ячейка E (цена) и чтобы там было число
            .filter(it => it.indexOf('E') !== -1 && typeof obj[it]['v'] === 'number')
            .forEach(it => {
                // Сохраним ключ названия
                const titleKey = it.replace('E', 'D');
                const title = obj[titleKey]['v']
                const basePrice = obj[it]['v']
                result.push({title, basePrice, amount: 1, totalPrice: basePrice})
            })
        sortToBrands(result);
    };

    reader.readAsBinaryString(file);
}

function show_pp() {
    document.getElementById('positions').innerHTML = '';

    buyList.forEach((it, i) => {
        const wrapper = document.createElement('div')
        const title = document.createElement('span')
        title.innerText = it.title
        const price = document.createElement('span')
        price.innerText = it.totalPrice
        const amount = getChangeCounter(it, i)
        const removeBtn = document.createElement('img')
        removeBtn.src = 'assets/trash-solid.svg'
        removeBtn.width = 16
        removeBtn.addEventListener('click', () => remove(it))

        wrapper.appendChild(title);
        wrapper.appendChild(price);
        wrapper.appendChild(amount);
        wrapper.appendChild(removeBtn);

        document.getElementById('positions').appendChild(wrapper)
        document.getElementById('popup').className = 'show-pp';
    })
}

function sortToBrands(arr) {
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
    fill(tobaccoBrands);
    fill([unsorted])
}

function fill(arr) {
    arr.forEach((it, i) => {
        it.id = i;
        createBrandTable(it, i);
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
    brandTitle.addEventListener('click', () => {
        obj.hide = !obj.hide
        brandTable.className = obj.hide ? 'collapsed' : 'brand_table';
        brandTitle.className = obj.hide ? 'collapsed-title' : 'brand_title';
    })

    obj.values.forEach((it) => {
        brandTable.appendChild(getNewRow(it, obj))
    })

    brandGroup.appendChild(brandTitle);
    brandGroup.appendChild(brandTable);

    document.getElementById('content').appendChild(brandGroup);
}

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
        }
        changeCounters(brandObj.id, brandObj.count)
        changeTotalPrice()
        changeAllPositions();
    })

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    return tr;

}

function changeTotalPrice() {
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
    document.getElementById('total-price').innerText = `Ориентировочная сумма: ${totalPrice}`
    document.getElementById('popup_top_total-price').innerText = `Итого: ${totalPrice}`
}

function changeCounters() {
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
}

function changeAllPositions() {
    let res = 0;
    tobaccoBrands.forEach(it => {
        res += it.count || 0
    })
    document.getElementById('popup_top_count').innerText = `Товаров: ${res}`
}

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

function changeAmount(obj, add, i) {
    if (add) {
        obj.amount++
    } else {
        if (obj.amount === 1) {
            return;
        }
        obj.amount--
    }
    changeTotalPrice()
    document.getElementById(`add_count-${i}`).innerText = `${obj.amount}`
}

function remove(obj) {
    obj.selected = false
    obj.count = 1;
    document.getElementById('content').innerHTML = ''
    fill(tobaccoBrands);
    const i = buyList.indexOf(obj)
    buyList.splice(i, 1)
    changeTotalPrice()
    show_pp();
    changeCounters();
    changeAllPositions();
}

function copy() {
    const result = [];
    buyList.forEach(it => {
        result.push({
            title: it.title,
            amount: it.amount,
        });
    })
    console.log('copy', result)
}
