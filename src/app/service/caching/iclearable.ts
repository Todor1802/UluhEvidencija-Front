export interface IClearable{
    dataStore: any;
    cacheKey: string;

    clearData(): void;
}