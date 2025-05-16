import {NgIf} from '@angular/common';
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Router, RouterLink} from '@angular/router';
import {fuseAnimations} from '@fuse/animations';
import {FuseAlertComponent, FuseAlertType} from '@fuse/components/alert';
import {AuthService} from 'app/core/auth/auth.service';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [RouterLink, NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signUpForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signUpForm = this._formBuilder.group({
                username: ['ismail.garcilazo', Validators.required],
                email: ['ismail.garcilazo@gmail.com', [Validators.required, Validators.email]],
                name: ['Ismail Perz', Validators.required],
                last_name: ['Garcilazo de la Vega', Validators.required],
                //ruc: ['20100000000', Validators.required],
                //companyName: ['Empresa Registrada desde el sustema', Validators.required],
                password: ['12345', Validators.required],
                c_password: ['12345', Validators.required],
                //address: ['Av. Los Incas 123', Validators.required],
                //roles: [["User"]],
            },
        );
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void {
        // Si el formulario es inválido, no hacer nada
        if (this.signUpForm.invalid) {
            return;
        }

        // Habilitar el formulario por seguridad
        this.signUpForm.enable();

        // Llamar al servicio para registrar
        this._authService.signUp(this.signUpForm.value).subscribe({
            next: (response) => {
                // Registro exitoso -> ir al login directamente o a donde prefieras
                this._router.navigateByUrl('/sign-in'); // <-- cambia '/sign-in' si quieres otro destino
            },
            error: (error) => {
                // En caso de error vuelve a habilitar el formulario
                this.signUpForm.enable();

                // Opcional: mostrar alerta o error
                console.error('Error en registro:', error);
            }
        });
    }

}
