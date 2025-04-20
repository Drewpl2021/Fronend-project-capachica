import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {END_POINTS, EntityDataService} from '../../utils';
import {Observable} from 'rxjs';
import {Company} from "../../../views/dashboard/setup/company/models/company";

@Injectable({providedIn: 'root'})
export class CompanyService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, END_POINTS.setup.company);
    }

    /**
     * Obtener los datos de una empresa por ID
     * @param companyId - ID de la empresa
     * @returns Observable con los datos de la empresa
     */
    public getCompanyAccessToken(): Observable<any> {
        return this.httpClient.get<Company>(`${this.endPoint}/token`);
    }

}
