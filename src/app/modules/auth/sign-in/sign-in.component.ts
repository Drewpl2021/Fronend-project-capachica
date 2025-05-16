import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { OauthService } from '../../../providers/services';
import {ReservasService} from "../../../providers/services/product/Reservas.service";
import {Observable, of} from "rxjs";
interface Detalle {
    emprendedor_service_id: string;  // acá podés poner un ID fijo o generado (no está en tu data)
    cantidad: number;
    lugar: string;                    // lo saco del titulo o podés agregarlo
    igv: number;
    bi: number;
    total: number;
}


@Component({
    selector: 'auth-login',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        RouterLink,
        FuseAlertComponent,
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
    ],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;
    carrito: any[] = [];
    reserva: any = null;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _oauthService: OauthService,
        private _reservasService: ReservasService,

    ) {
        const carritoStr = this._activatedRoute.snapshot.queryParamMap.get('carrito');
        if (carritoStr) {
            try {
                this.carrito = JSON.parse(decodeURIComponent(carritoStr));
                console.log('Carrito recibido:', this.carrito);
                this.generarReserva();
            } catch (e) {
                console.error('Error parsing carrito JSON:', e);
            }
        }
    }
    generarReserva() {
        const igvRate = 0.18;  // IGV 18%

        // Mapear los detalles
        const details = this.carrito.map(item => {
            const bi = item.precio * item.cantidad / (1 + igvRate);
            const igv = bi * igvRate;
            const total = item.precio * item.cantidad;

            return {
                emprendedor_service_id: item.id,  // usás el id que ya viene
                cantidad: item.cantidad,
                lugar: 'Capachica',                // fijo
                bi: +bi.toFixed(2),
                igv: +igv.toFixed(2),
                total: +total.toFixed(2),
            };
        });

        // Calcular totales
        const total = details.reduce((acc, d) => acc + d.total, 0);
        const bi = total / (1 + igvRate);
        const igv = total - bi;

        this.reserva = {
            code: 'RES-1',
            total: +total.toFixed(2),
            bi: +bi.toFixed(2),
            igv: +igv.toFixed(2),
            details
        };

        console.log('Reserva generada:', this.reserva);
    }
    guardarReserva(): Observable<any> {
        if (!this.reserva) {
            console.warn('No hay reserva para guardar');
            return of(null); // importá 'of' de rxjs para retornar un observable vacío
        }

        return this._reservasService.addreser$(this.reserva);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    goBack() {
        window.location.href = 'http://localhost:4201/';
    }

    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            username: [
                '',
                [Validators.required],
            ],
            password: ['', Validators.required],
            rememberMe: [''],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    signIn(): void {
        if (this.signInForm.invalid) {
            return;
        }
        this.signInForm.disable();
        this.showAlert = false;

        this._oauthService.authenticate(this.signInForm.value).subscribe({
            next: (response) => {
                const roles: string[] = response.data.roles;

                if (roles.includes('usuario')) {
                    const token = response.data.token;
                    localStorage.setItem('authToken', token);  // Guardar token

                    // Guardar reserva y esperar a que termine para redirigir
                    this.guardarReserva().subscribe({
                        next: () => {
                            window.location.href = `http://localhost:4201/?token=${token}`;
                        },
                        error: (err) => {
                            console.error('Error guardando reserva:', err);
                            // Podés mostrar alerta o permitir continuar igual
                            window.location.href = `http://localhost:4201/?token=${token}`;
                        }
                    });

                } else if (roles.includes('admin') || roles.includes('admin_familia')) {
                    localStorage.setItem('authToken', response.data.token);

                    this.guardarReserva().subscribe({
                        next: () => {
                            const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/homeScreen';
                            this._router.navigateByUrl(redirectURL);
                        },
                        error: (err) => {
                            console.error('Error guardando reserva:', err);
                            const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/homeScreen';
                            this._router.navigateByUrl(redirectURL);
                        }
                    });

                } else {
                    this.alert = { type: 'error', message: 'Rol no autorizado' };
                    this.showAlert = true;
                    this.signInForm.enable();
                    this.signInNgForm.resetForm();
                    return;
                }
            },
            error: () => {
                this.signInForm.enable();
                this.signInNgForm.resetForm();
                this.alert = { type: 'error', message: 'Contraseña o correo incorrecto' };
                this.showAlert = true;
            }
        });
    }


}
