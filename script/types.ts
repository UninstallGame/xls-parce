export enum ACTIONS {
    CLICK = 'click',
    CHANGE = 'change',
    SCROLL = 'scroll',
    MOUSEDOWN = 'mousedown',
    KEYDOWN = 'keydown'
}

export interface ITobaccoBrand {
    id: number | string;
    title: string,
    count: number,
    hide: boolean,
    values: ITobacco[]
}

export interface ITobacco {
    id: number | string;
    title: string;
    basePrice: number;
    count: number;
    totalPrice: number;
    selected: boolean;
}

export interface IBuyList extends ITobacco {
    disableCounter?: boolean;
}
