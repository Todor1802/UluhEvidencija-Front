import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {  Inject, Injectable } from "@angular/core";
import { catchError, finalize, map, Observable, of, throwError } from "rxjs";
import { Response } from "../../models/response/response";
import { CachingService } from "../caching/caching.service";
import { DeepCloneService } from "../deepClone/deep-clone.service";

@Injectable({ providedIn: 'root' })
export class BaseApiService<T extends { id: number }> {
  private apiUrl: string = 'http://localhost:5131'; // Default Development API URL
  private apiVersion: string = '/v1'; // Default API version

  public readonly cacheKey: string;
  public dataStore: T[] = [];
  private readonly baseUrl!: string;

  clearData() {
    this.dataStore = [];
  }
  constructor(
    @Inject('modelName')
    private modelName: string,
    private http: HttpClient,
    private cachingService: CachingService,
    private _deepCloneService?: DeepCloneService
  ) {
    this.baseUrl = `${this.apiUrl}${this.apiVersion}/${this.modelName}`;
    this.cacheKey = `crud-${this.modelName}`;
    this.cachingService.registerService(this);
  }

  getById(id: number): Observable<T> {
    const cached = this.dataStore.find(item => item.id === id);
    if (cached) {
      return of(this._deepCloneService?.deepClone(cached));
    }
    return this.http.get<Response<T>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (response.isSuccess)
          return response.data;
        throw response.messages;
      }),
      catchError((err: HttpErrorResponse) =>
        throwError(() => this.getErrorMessages(err))
      )
    );
  }

  getAll(refreshCache = false): Observable<T[]> {
    if (!refreshCache && this.dataStore.length > 0) {
      return of(this._deepCloneService?.deepClone(this.dataStore));
    } return this.http.get<Response<T[]>>(this.baseUrl).pipe(
      map(response => {
        if (response.isSuccess) {
          this.dataStore = this._deepCloneService?.deepClone(response.data);
          return this.dataStore;
        }
        throw response.messages;
      }),
      catchError((err: HttpErrorResponse) =>
        throwError(() => this.getErrorMessages(err))
      )
    );
  }

  update(item: T): Observable<T> {
    return this.http.put<Response<T>>(`${this.baseUrl}`, item).pipe(
      finalize(() => {
        this.dataStore = [];
      }),
      map(response => {
        if (response.isSuccess) {
          return response.data;
        }
        throw response.messages;
      }),
      catchError((err: HttpErrorResponse) =>
        throwError(() => this.getErrorMessages(err))
      )
    );
  }

  insert(item: T): Observable<T> {
    return this.http.post<Response<T>>(this.baseUrl, item).pipe(
      finalize(() => {
        this.dataStore = [];
      }),
      map(response => {
        if (response.isSuccess) {
          return response.data;
        }
        throw response.messages;
      }),
      catchError((err: HttpErrorResponse) =>
        throwError(() => this.getErrorMessages(err))
      )
    );
  }

  delete(id: number): Observable<T> {
    return this.http.delete<Response<T>>(`${this.baseUrl}/${id}`).pipe(
      finalize(() => {
        this.dataStore = [];
      }),
      map(response => {
        if (response.isSuccess) return response.data;
        throw response.messages;
      }),
      catchError((err: HttpErrorResponse) =>
        throwError(() => this.getErrorMessages(err))
      )
    );
  }

  protected getErrorMessages(err: HttpErrorResponse) {
    if (err.status == 400) {
      return Object.keys(err.error)
        .map(k => err.error[k]).flat();
    }
    else if (err.status == 401) {
      return ['Session end'];
    }
    else if (err.status == 409) {
      return err.error.messages;
    }
    else if (err.status == 403) {
      return ['You are unauthorized'];
    }
    return err?.error?.messages ?? ['tos.greška'];
  }
}
