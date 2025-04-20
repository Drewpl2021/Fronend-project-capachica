import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { END_POINTS, IResponse } from '../../utils';

@Injectable({ providedIn: 'root' })
export class UbigeoSunatService {
    constructor(private httpClient: HttpClient) {}

    /**
     * Obtener la lista de departamentos
     * @returns Observable con los departamentos
     */
    getDepartments(): Observable<any[]> {
        return this.httpClient.get<any[]>(`${END_POINTS.setup.ubigeoSunat}/departments`);
    }

    getProvinces(departmentCode: string): Observable<any[]> {
        return this.httpClient.get<any[]>(`${END_POINTS.setup.ubigeoSunat}/provinces?codDepSunat=${departmentCode}`);
    }

    getUbigeos(provinceCode: string): Observable<any[]> {
        return this.httpClient.get<any[]>(`${END_POINTS.setup.ubigeoSunat}/ubigeos?codProvSunat=${provinceCode}`);
    }
}
