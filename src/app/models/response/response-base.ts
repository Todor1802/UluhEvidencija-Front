export interface ResponseBase<T> {
    status: ResponseStatus;
    data: T;
    messages: ResponseMessage[]
}

export enum ResponseStatus {
    Success = 'Success',
    Warning = 'Warning',
    Error = 'Error',
    NoContent = 'NoContent',
    Conflict = 'Conflict'
}

export interface ResponseMessage {
    code: string;
    value: string;
}