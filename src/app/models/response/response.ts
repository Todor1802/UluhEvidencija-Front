import { ResponseStatus } from "./response-base";

export interface Response<T>{
    isSuccess: boolean;
    codes: string[];
    messages: string[];
    data: T;
    status:ResponseStatus;
}

export interface ResponseError{
    messages: string[];
    messageList: string[];
}
