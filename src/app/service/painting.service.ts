import { Injectable } from '@angular/core';
import { BaseApiService } from './baseApiService/base-api-service.service';
import { Painting } from '../models/painting';
import { HttpClient } from '@angular/common/http';
import { CachingService } from './caching/caching.service';
import { DeepCloneService } from './deepClone/deep-clone.service';

@Injectable({
  providedIn: 'root'
})
export class PaintingService extends BaseApiService<Painting> {
  constructor(http: HttpClient, cachingService: CachingService, deepCloneService?: DeepCloneService) {
    super('painting', http, cachingService, deepCloneService);
  }
}
