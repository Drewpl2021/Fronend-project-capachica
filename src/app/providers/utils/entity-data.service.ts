import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IResponse} from "./response";

export class EntityDataService<T> {

    constructor(
        protected httpClient: HttpClient,
        protected endPoint: string,
    ) {
    }

    public getAll$(): Observable<T> {
        return this.httpClient.get<T>(this.endPoint);
    }
    public getAllToken$(): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/token`);
    }
    public getAllsAccesTocken$(): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/acces-token`);
    }
    public getAllsStore$(): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/store`);
    }
    public getByCode$(params: { code: string }): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/code`, { params });
    }

    public getAlls$(page: number = 0, size: number = 1000): Observable<T> {
        const params = {
            page: page.toString(),
            size: size.toString(),
        };
        return this.httpClient.get<T>(this.endPoint, { params });
    }

    public getAlls$$(params?: any): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}`, { params: params });
    }

    public getWithQuery$(params?: any): Observable<T> {
        return this.httpClient.get<T>(this.endPoint, {params: params});
    }

    public getListType$(type: string, params?: any): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/type/${type}`, { params: params });
    }


    public getTree$(params?: any): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/tree`, { params: params });
    }

    public getListStores$(id: string): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/store/${id}`, );
    }

    public getWithSearch$(params?: any): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/search`, { params: params });
    }
    public getWithSummary$(params?: any): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/summary`, { params: params });
    }
    public getWithSummaryDetail$(params?: any): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/summary/payment-methods`, { params: params });
    }
    public getPaymentMethodDetails$(params?: any): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/details/payment-methods`, { params: params });
    }
    public getWithTotalCost$(params?: any): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/total-cost`, { params: params });
    }
    public getWithSeries$(params?: any): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/available`, { params: params });
    }
    public getWithSearchs$(params?: any): Observable<T> {
        const url = `${this.endPoint}/search`;
        return this.httpClient.get<T>(url, { params });
    }
    public getWithActive$(params?: any): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/active`, );
    }
    public getWithAll$(params?: any): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/all`, );
    }
    public getWithFilter$(params?: any): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/filter`, { params: params });
    }
    public getWithFilt$(params?: any): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/find`, { params: params });
    }
    public findEntity$(documentNumber: string, idEntityType: string): Observable<T> {
        const params = { documentNumber, idEntityType };
        return this.httpClient.get<T>(`${this.endPoint}/find`, { params });
    }

    public getById$(id: string): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/${id}`);
    }
    public getByPaymentTypeId$(id: string): Observable<T> {
        return this.httpClient.get<T>(`${this.endPoint}/by-payment-type/${id}`);
    }

    public add$(entity: any): Observable<T> {
        return this.httpClient.post<T>(this.endPoint, entity);
    }


    public addBulk$(entity: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/bulk`, entity);
    }

    public update$(id: string, entity: any): Observable<T> {
        return this.httpClient.put<T>(`${this.endPoint}/${id}`, entity);
    }

    public updateAll$(entity: any): Observable<T> {
        return this.httpClient.put<T>(`${this.endPoint}/all`, entity);
    }

    public updateObject$(entity: any): Observable<T> {
        return this.httpClient.put<T>(`${this.endPoint}`, entity);
    }

    public delete$(id: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.endPoint}/${id}`);
    }

    public postFile$(formData: FormData): Observable<any> {
        return this.httpClient.post(`${this.endPoint}/import`, formData, {responseType: 'json'});
    }

    public getFileById$(params?: any): Observable<any> {
        return this.httpClient.get(`${this.endPoint}/pdf`, { params, responseType: 'blob' });
    }


    public putFile$(id: number, data: object): Observable<any> {
        return this.httpClient.put(`${this.endPoint}/${id}`, data);
    }

    public updateFile$(id: number, data: object): Observable<any> {
        return this.httpClient.put<T>(`${this.endPoint}/${id}`, data);
    }
}
