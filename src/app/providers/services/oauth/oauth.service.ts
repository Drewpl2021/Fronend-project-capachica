import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {END_POINTS, IResponse} from '../../utils';
import {shareReplay, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class OauthService {
    private _authenticated: boolean = false;

    constructor(private http: HttpClient) {
    }

    setAccessToken(token: string): void {
        localStorage.setItem('accessToken', token);
    }

    setRefreshToken(refreshToken: string): void {
        localStorage.setItem('refreshToken', refreshToken);
    }

    getSccessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    getRefreshToken(): string {
        return localStorage.getItem('refreshToken') ?? '';
    }

    public authenticate(credentials: any): Observable<IResponse> {
        if (this._authenticated) {
            return throwError(() => new Error('Product is already logged in.'));
        }
        return this.http
            .post<IResponse>(END_POINTS.oauth.login, credentials)
            .pipe(tap(this.setSession.bind(this)), shareReplay());
    }

    private setSession(response: any) {
        if (response?.data?.token) {
            this.setAccessToken(response.data.token);
            this.setRefreshToken(response.data.token);
            this._authenticated = true;
            return of(response);
        }
    }

    private notAutorized() {
        localStorage.clear();
    }

    public signOut(): Observable<any> {
        this._authenticated = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return of(true);
    }

    check(): Observable<boolean> {
        const token = this.getSccessToken();

        if (this._authenticated) {
            return of(true);
        }

        if (!token) {
            return of(false);
        }

        this._authenticated = true;
        return of(true);
    }


}
