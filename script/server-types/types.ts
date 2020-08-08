export declare type UserId = string;

export enum DATA_PROTOCOL_TYPE {
    AUTH = 'auth',
    CURSOR = 'cursor',
    USER_JOIN = 'user_join',
    BUY_LIST = 'buy-list',
}

export interface IAuthData {
    userId: number;
}

export declare type Data = IAuthData | any;

export interface IDataProtocolRequest {
    type: DATA_PROTOCOL_TYPE,
    data: Data;
}

export interface IDataProtocolAnswer {
    type: DATA_PROTOCOL_TYPE,
    data: Data;
    from: UserId;
}
