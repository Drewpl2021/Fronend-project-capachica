import {HttpEventType, HttpInterceptorFn} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {inject} from "@angular/core";
import {catchError, switchMap, tap, throwError} from "rxjs";
import {RefreshTokenService} from "../../services/oauth/refreshToken.service";
import {OauthService} from "../../services";
import {Router} from "@angular/router";

// import {inject} from "@angular/core";

let refreshAttempts = 0;
export const toastInterceptor: HttpInterceptorFn = (req, next) => {
    const toastr = inject(ToastrService);
    const refreshTokenService = inject(RefreshTokenService);
    const oauthService = inject(OauthService);
    // const authStoreService= inject(AuthStoreService);

    const _router = inject(Router);

    return next(req).pipe(
        tap(event => {
            if (event.type === HttpEventType.Response) {
                if (event.status >= 200 && event.status < 300) {
                    toastr.success(`${event.body['message'] ?? 'En hora buena'}`, 'Correcto');
                } else if (event.status >= 300 && event.status < 400) {
                    toastr.info(`${event.body['message'] ?? 'Ten mucho cuidado'}`, 'Atención');
                }
            }
        }),
        catchError(err => {
            if (err.status === 401 && refreshAttempts < 2) {
                refreshAttempts = refreshAttempts + 1;
                return refreshTokenService.add$({ refreshToken: localStorage.getItem('refreshToken') }).pipe(
                    switchMap(r => {
                        oauthService.setAccessToken(r['access_token']);
                        oauthService.setRefreshToken(r['refresh_token']);

                        // Clonar la solicitud original y agregar el nuevo token de acceso
                        const clonedRequest = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                            }
                        });

                        // Reintentar la solicitud con el nuevo token
                        return next(clonedRequest);
                    }),
                    catchError(refreshError => {
                        // Manejo de errores al intentar actualizar el token
                        let errorMessage = 'Error al actualizar el token';
                        if (refreshError.error && refreshError.error.message) {
                            errorMessage = refreshError.error.message;
                        }
                        toastr.error(errorMessage, 'Error Grave');
                        localStorage.clear();
                        _router.navigate(['/sign-in']);

                        return throwError(refreshError);
                    })
                );
            } else {
                // 🔴 Si el error NO es 401 o ya intentó refrescar, redirigir al login
                //localStorage.clear();
                //_router.navigate(['/sign-in']);
            }

            let errorMessage = 'Error desconocido';
            const responseObject: any = {};
            responseObject.error = err;

            if (typeof responseObject === 'object' && err !== null) {
                if (responseObject.error?.error?.error === 'Unauthorized') {
                    errorMessage = 'No tienes permisos para realizar esta acción';
                }
            }

            if (err.error) {
                if (typeof err.error['message'] === 'object' && err.error['message'] !== null) {
                    const firstKey = Object.keys(err.error['message'])[0];
                    errorMessage = err.error['message'][firstKey][0];
                } else if (Array.isArray(err.error['message'])) {
                    errorMessage = err.error['message'][0];
                } else if (typeof err.error['message'] === 'string') {
                    errorMessage = err.error['message'];
                }
            }

            if (err.status >= 400 && err.status < 500) {
                toastr.error(errorMessage, 'Error');
            } else if (err.status >= 500) {
                toastr.error(errorMessage, 'Error Grave');
            }

            return throwError(err);
        })
    );

};


//
// import { Injectable, Injector } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { ToastrService } from 'ngx-toastr';
//
//
// @Injectable()
// export class ToastInterceptor implements HttpInterceptor {
//     constructor(private toast: ToastrService) {}
//
//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//
//         if (req.url.includes('api')) {
//             // Mostrar el alerta
//             alertService.show('nombreAlerta');
//         }
//
//         return next.handle(req);
//     }
// }

