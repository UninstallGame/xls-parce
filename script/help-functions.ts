import {ACTIONS, ITobacco, ITobaccoBrand} from "./types";
import {teaBrands, tobaccoBrands, unsorted} from "./global-variables";

export function afterTimeOut(func: Function, time = 50): void {
    window.setTimeout(() => {
        func();
    }, time)
}

export function addEvent(action: ACTIONS, elementId: string, func: (x: Event) => void): void {
    const element = getElement(elementId)
    element.addEventListener(action, e => func(e));
}

export function getElement(elementId: string): HTMLElement {
    const element = document.getElementById(elementId)
    if (!element) {
        throw new Error(`element с id: ${elementId} не найден`)
    }
    return element;
}

export function updateWorkArrays(data: { tobacco: ITobacco[], tea: ITobacco[], documentDate: string }) {

    const xxx = (brands: ITobaccoBrand[]): (it: ITobacco) => void => {
        return (it) => {
            let found = false
            brands.forEach((brand: any) => {
                if (it.title.indexOf(brand.title) !== -1) {
                    brand.values.push(it);
                    found = true;
                }
            })
            if (!found) unsorted.values.push(it)
        }
    }

    data.tobacco.forEach(xxx(tobaccoBrands))
    data.tea.forEach(xxx(teaBrands))
}
