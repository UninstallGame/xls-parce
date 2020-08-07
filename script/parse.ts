import {ITobacco} from "./types";

declare const XLS: { read(x: any, y: any): any }

export function parseExcel(event: Event): Promise<ITobacco[]> {
    return new Promise(res => {
        // @ts-ignore
        if (!event.target && !event.target.files.length) {
            return;
        }
        // @ts-ignore
        const file = event.target.files[0]
        const reader = new FileReader();

        reader.onload = function (e) {
            // @ts-ignore
            const data = e.target.result;
            const workbook = XLS.read(data, {
                type: 'binary'
            });

            // workbook.SheetNames => здесь массив имен таблиц
            // workbook.Sheets => здесь хэш таблиц по именам
            // Берем первую таблицу
            const obj = workbook.Sheets[workbook.SheetNames[0]];
            const result: ITobacco[] = []

            // Опытным путем было установлено что ячейка E это цена, в D это название
            // Находим цену, сопостовляем с названием, и кот василий
            Object.keys(obj)
                // Фильтруем по ячейка E (цена) и чтобы там было число
                .filter(it => it.indexOf('E') !== -1 && typeof obj[it]['v'] === 'number')
                .forEach((it, i) => {
                    // Сохраним ключ названия
                    const titleKey = it.replace('E', 'D');
                    const title = obj[titleKey]['v']
                    const basePrice = obj[it]['v']
                    result.push({title, basePrice, count: 1, totalPrice: basePrice, id: i, selected: false})
                })
            res(result);
        };

        reader.readAsBinaryString(file);
    })
}
