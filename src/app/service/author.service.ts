import { Injectable } from '@angular/core';
import { BaseApiService } from './baseApiService/base-api-service.service';
import { Author } from '../models/author';
import { HttpClient } from '@angular/common/http';
import { CachingService } from './caching/caching.service';
import { DeepCloneService } from './deepClone/deep-clone.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorService extends BaseApiService<Author> {
  constructor(http: HttpClient, cachingService: CachingService, deepCloneService?: DeepCloneService) {
    super('author', http, cachingService, deepCloneService);
  }
}
