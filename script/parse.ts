import {DOCUMENT_SECTION, ITobacco} from "./types";

declare const XLS: { read(x: any, y: any): any }

// Создадим структуру описывающую колонки
enum DOC_COLUMNS {
    CODE = 'B',
    TITLE = 'D',
    PRICE = 'E',
    CREATE_DATE = 'C',
    ORGANIZATION_INFO = 'D',
    DOCUMENT_END = 'D',
}

// В НИЖНЕМ РЕГИСТРЕ ↓↓↓
enum DOC_ATTRIBUTE {
    SECTION_TEA_ATTRIBUTE = 'чай',
    SECTION_TOBACCO_ATTRIBUTE = 'табак',
    DOCUMENT_DATE_ATTRIBUTE = 'отчет создан:',
    DOCUMENT_END = 'итого:'
}

export function parseExcel(event: Event): Promise<{ tobacco: ITobacco[], tea: ITobacco[], documentDate: string }> {
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

            res(newParse(obj));

        };

        reader.readAsBinaryString(file);
    })
}

// Преобразовать объект полученный из exel файла к ITobacco структуре, разбитый на табак и чай
function newParse(obj: any): { tobacco: ITobacco[], tea: ITobacco[], documentDate: string } {
    const tea: ITobacco[] = [];
    const tobacco: ITobacco[] = [];
    let documentDate = '';
    let section = DOCUMENT_SECTION.HEADER
    let tmp = []
    const [start, end] = obj['!ref'].split(':').map(extractNumber)

    const getStringCellValue = (col: string, row: number): string => {
        return obj[col + row] ? obj[col + row]['w'] : '';
    }

    const getNumberCellValue = (col: string, row: number): number => {
        return obj[col + row] ? obj[col + row]['v'] : NaN;
    }

    for (let i = start; i <= end; i++) {
        const cellValue = getStringCellValue(DOC_COLUMNS.CODE, i)
        const newSection = checkSection(cellValue);

        if (newSection) {
            section = newSection;

            if (section === DOCUMENT_SECTION.TOBACCO) {
                tmp = tobacco
            }

            if (section === DOCUMENT_SECTION.TEA) {
                tmp = tea
            }
            continue;
        }

        if (section === DOCUMENT_SECTION.HEADER) {
            // достанем дату создания документа
            if (xxx(getStringCellValue(DOC_COLUMNS.CREATE_DATE, i), DOC_ATTRIBUTE.DOCUMENT_DATE_ATTRIBUTE)) {
                documentDate = String(getStringCellValue(DOC_COLUMNS.ORGANIZATION_INFO, i));
            }
        }

        if (xxx(getStringCellValue(DOC_COLUMNS.DOCUMENT_END, i), DOC_ATTRIBUTE.DOCUMENT_END)) {
            break;
        }

        const basePrice = getNumberCellValue(DOC_COLUMNS.PRICE, i)

        if (!basePrice) {
            continue;
        }

        tmp.push({
            title: prettyTitle(getStringCellValue(DOC_COLUMNS.TITLE, i)),
            basePrice,
            count: 1,
            totalPrice: 0,
            id: i,
            selected: false
        })

    }
    return {tea, tobacco, documentDate}
}

function prettyTitle(str: string): string {
    return str
        .replace(' \'', ' «')
        .replace(' "', ' «')
        .replace('\' ', '» ')
        .replace('" ', '» ')
}

// Сравнение строк без учета регистра
function xxx(val: string, enumVal: string): boolean {
    return String(val).toLowerCase() === enumVal;
}


function checkSection(cellValue: string): DOCUMENT_SECTION | null {
    if (xxx(cellValue, DOC_ATTRIBUTE.SECTION_TOBACCO_ATTRIBUTE)) {
        return DOCUMENT_SECTION.TOBACCO
    }

    if (xxx(cellValue, DOC_ATTRIBUTE.SECTION_TEA_ATTRIBUTE)) {
        return DOCUMENT_SECTION.TEA
    }

    return null;
}

function extractNumber(str: string): number {
    return Number(str.replace(/\D/, ''))
}
