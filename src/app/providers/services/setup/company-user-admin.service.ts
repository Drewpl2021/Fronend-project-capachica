import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { END_POINTS, EntityDataService, IResponse } from '../../utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompanyUserAdminService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, END_POINTS.setup.companyuseradmin);
    }

    /**
     * Obtener los datos de un CompanyUser por ID
     * @param companyUserId - ID del CompanyUser
     * @returns Observable con el objeto CompanyUser
     */




}
