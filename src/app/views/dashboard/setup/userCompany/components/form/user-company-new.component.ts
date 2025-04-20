import { Component, Input, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { abcForms } from '../../../../../../../environments/generals';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-user-company-new',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    template: `
       <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <!-- Header -->
            <div class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium">Nuevo Usuario</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon
                        class="text-current"
                        [svgIcon]="'heroicons_outline:x-mark'"
                    ></mat-icon>
                </button>
            </div>

            <!-- Compose form -->
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto"
                [formGroup]="userForm">
                <mat-form-field>
                    <mat-label>Usuario</mat-label>
                    <input type="text" matInput [formControlName]="'username'" />
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Correo Electrónico</mat-label>
                    <input type="email" matInput [formControlName]="'email'" />
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Nombres</mat-label>
                    <input type="text" matInput [formControlName]="'firstName'" />
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Apellidos</mat-label>
                    <input type="text" matInput [formControlName]="'lastName'" />
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Contraseña</mat-label>
                    <input type="password" matInput [formControlName]="'password'" />
                </mat-form-field>

                <!-- Actions -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <div class="flex space-x-2 items-center mt-4 sm:mt-0">
                        <button class="ml-auto sm:ml-0"
                            [color]="'warn'"
                            mat-stroked-button
                            (click)="cancelForm()">
                            Cancelar
                        </button>
                        <button
                            class="ml-auto sm:ml-0"
                            [color]="'primary'"
                            [disabled]="userForm.invalid"
                            mat-stroked-button
                            (click)="saveForm()">
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class UserCompanyNewComponent implements OnInit {
    //public userForm: FormGroup;
    @Input() title: string = '';

    abcForms: any;
    userForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        firstName: new FormControl('', [ Validators.required,]),
        lastName: new FormControl('', [ Validators.required,]),
        password: new FormControl('', [ Validators.required,]),
        roles:new FormControl(['User'], [ Validators.required,]),

    });

    constructor(
        private _matDialog: MatDialogRef<UserCompanyNewComponent>
    ) {}

    ngOnInit() {
        this.abcForms = abcForms;
    }

    public saveForm(): void {
        if (this.userForm.valid) {
          this._matDialog.close(this.userForm.value);
        }
    }

    public cancelForm(): void {
      this._matDialog.close('');
    }
}
