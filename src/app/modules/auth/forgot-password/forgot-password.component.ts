import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {Router, RouterLink} from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector     : 'auth-forgot-password',
    templateUrl  : './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports      : [NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, RouterLink],
})
export class AuthForgotPasswordComponent implements OnInit {
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;


    forgotPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;

    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private router: Router
    )
    {
    }
    ngOnInit(): void
    {
        // Create the form
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    sendResetLink(): void {
        if (this.forgotPasswordForm.invalid) {
            return;
        }
        this.forgotPasswordForm.disable();
        const email = this.forgotPasswordForm.get('email').value;
        this._authService.forgotPassword(email).subscribe({
            next: (response: string) => {
                this.router.navigate(['/confirmation-forgot']);
            },
            error: (error) => {
                console.error('Error al enviar el enlace de restablecimiento:', error);
                this.forgotPasswordForm.enable();
            },
        });
    }

}
