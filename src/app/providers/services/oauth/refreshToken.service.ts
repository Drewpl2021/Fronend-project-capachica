import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {END_POINTS, EntityDataService, IResponse} from '../../utils';

@Injectable({ providedIn: 'root' })
export class RefreshTokenService extends EntityDataService<IResponse> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, END_POINTS.oauth.refresh);
    }
}
