import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {END_POINTS, EntityDataService, IResponse} from '../../utils';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class UsersService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, END_POINTS.setup.users);
    }


    public updateStateUserId$(idUser: string): Observable<any> {
        return this.httpClient.get<any>(`auth/usuario/${idUser}`);
    }

    public getUserTreeByUserId$(idUser: number): Observable<any> {
        return this.httpClient.get<any>(`usuario-gerarquia?usuario_id=${idUser}`);
    }

    public getAll$(): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/search`);
    }

    public getByCompany$(): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/company`);
    }

    public postCompany(data: any): Observable<IResponse> {
        return this.httpClient.post<IResponse>(`${this.endPoint}/createToken`, data);
    }


}


