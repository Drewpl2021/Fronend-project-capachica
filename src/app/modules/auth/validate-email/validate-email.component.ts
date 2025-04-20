import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import {I18nPluralPipe, NgIf} from "@angular/common";
import {AuthService} from "../../../core/auth/auth.service";
import { finalize, Subject, takeUntil, takeWhile, tap, timer } from 'rxjs';

@Component({
    selector     : 'auth-confirmation-required',
    templateUrl  : './validate-email.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports: [RouterLink, NgIf, I18nPluralPipe],
})
export class AuthValidateEmailComponent implements OnInit, OnDestroy {
    countdown: number = 12;
    countdownMapping: { [key: string]: string } = {
        '=1': '# segundo',
        'other': '# segundos',
    };
    token: string | null = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private route: ActivatedRoute,
                private _authService: AuthService,
                private _router: Router
    )
    {}

    ngOnInit(): void {
        // Obtén el token desde los parámetros de la URL
        this.route.queryParamMap.subscribe(params => {
            this.token = params.get('token');

            // Si el token existe, envíalo automáticamente al servicio
            if (this.token) {
                this.sendToken(this.token);
            }
        });

        // Inicia la cuenta regresiva y redirige al final
        timer(1000, 1000)
            .pipe(
                tap(() => this.countdown--),
                takeWhile(() => this.countdown > 0),
                finalize(() => {
                    this._router.navigate(['sign-in']); // Cambia la ruta si es necesario
                }),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe();
    }

    sendToken(token: string): void {
        this._authService.getValidateemail(token).subscribe({
            next: (response: string) => console.log('Respuesta del servidor:', response),
            error: (error) => console.error('Error al enviar el token:', error)
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
