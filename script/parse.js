import {sortToBrands} from './tmp'

export function parseExcel(file) {
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
