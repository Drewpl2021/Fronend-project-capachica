import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import {I18nPluralPipe, NgIf} from "@angular/common";
import {finalize, Subject, takeUntil, takeWhile, tap, timer} from "rxjs";
import {OauthService} from "../../../providers/services";
import {LogoutService} from "../../../providers/services/setup/logout.service";

@Component({
    selector     : 'auth-confirmation-forgot',
    templateUrl  : './confirmation-forgot.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports: [RouterLink, I18nPluralPipe, NgIf],
})
export class AuthConfirmationForgotComponent implements OnInit, OnDestroy{
    countdown: number = 12;
    countdownMapping: { [key: string]: string } = {
        '=1': '# segundo',
        'other': '# segundos',
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _oauthService: OauthService,
        private _logoutService: LogoutService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            this._logoutService.add$({ refreshToken }).subscribe(console.log);
            localStorage.removeItem('refreshToken');
        }
        this._oauthService.signOut();
        timer(1000, 1000)
            .pipe(
                tap(() => this.countdown--),
                takeWhile(() => this.countdown > 0),
                finalize(() => {
                    this._router.navigate(['sign-in']);
                }),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        // Limpia todas las suscripciones activas
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
