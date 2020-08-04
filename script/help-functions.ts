import {ACTIONS, ITobacco} from "./types";
import {tobaccoBrands, unsorted} from "./hardcode";

export function afterTimeOut(func: Function, time = 50): void {
    window.setTimeout(() => {
        func();
    }, time)
}

export function addEvent(action: ACTIONS, elementId: string, func: Function): void {
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

export function updateWorkArrays(array: ITobacco[]) {
    const unsortedIndexes: number[] = [];
    array.forEach((it, i) => {
        // todo tea brands
        let found = false
        tobaccoBrands.forEach(brand => {
            if (it.title.indexOf(brand.title) !== -1) {
                brand.values.push(it);
                found = true;
            }
        })
        if (!found) unsortedIndexes.push(i)
    })

    unsortedIndexes.forEach(i => {
        unsorted.values.push(array[i]);
    })
}
