import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {END_POINTS, EntityDataService, IResponse} from '../../utils';
import {Observable} from "rxjs";


@Injectable({ providedIn: 'root' })
export class ParentModuleService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, END_POINTS.setup.parentModule);
    }
    public getAllNotPaginate(): Observable<any> {
        return this.httpClient.get<IResponse>(`${this.endPoint}/list`);
    }
    public getAllDetailModuleList(): Observable<any> {
        return this.httpClient.get<IResponse>(`${this.endPoint}/list-detail-module-list`);
    }

}
