import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DeepCloneService {
    constructor() { }

    deepClone(any : any){
        return JSON.parse(JSON.stringify(any)) ;
    }
}