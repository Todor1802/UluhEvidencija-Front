import { Injectable } from '@angular/core';
import { IClearable } from './iclearable';

@Injectable({
    providedIn: 'root'
})
export class CachingService {
    private services: IClearable[] = [];

    constructor() {

    }

    clearAllData(): void {
        for (let service of this.services) {
            service.clearData();
        }
    }

    clearAllExcept(keys: string[]): void{
        for (let service of this.services) {
            if (!keys.includes(service.cacheKey))
                service.clearData();
        }
    }

    clearData(keys: string[]): void {
        for (let service of this.services) {
            if (keys.includes(service.cacheKey))
                service.clearData();
        }
    }

    registerService(service: IClearable) {
        if (this.services.indexOf(service) < 0)
            this.services.push(service);
    }
}