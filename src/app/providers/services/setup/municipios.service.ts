import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {END_POINTS, EntityDataService} from '../../utils';
import {Observable} from "rxjs";


@Injectable({providedIn: 'root'})
export class MunicipiosService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, END_POINTS.setup.municipalidad);
    }

    public getAllModulesSelectedByRoleIdAndParentModuleId$(roleId: string, parentModuleId: string): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/modules-selected/roleId/${roleId}/parentModuleId/${parentModuleId}`);
    }
    public getMenu$(): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/menu`);
    }

}
