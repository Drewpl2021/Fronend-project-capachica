import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogRef} from '@angular/material/dialog';
import {Stores} from "../../models/stores";

import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";

@Component({
    selector: 'app-store-new',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        NgForOf,
    ],
    template: `
        <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <!-- Header -->
            <div
                class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium">Editar Almacén</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon
                        class="text-current"
                        [svgIcon]="'heroicons_outline:x-mark'"
                    ></mat-icon>
                </button>
            </div>

            <!-- Compose form -->
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="storeForm">
                <mat-form-field>
                    <mat-label>Nombre</mat-label>
                    <input type="text" matInput formControlName="name"/>
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Código</mat-label>
                    <input type="text" matInput formControlName="code"/>
                </mat-form-field>
                <mat-form-field appearance="fill" class="w-full">
                    <mat-label>Descripción</mat-label>
                    <textarea matInput formControlName="description" placeholder="Descripción del Almacén"></textarea>
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Dirección</mat-label>
                    <input type="text" matInput formControlName="address"/>
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Numero de Celular</mat-label>
                    <input type="text" matInput formControlName="phone"/>
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Email</mat-label>
                    <input type="text" matInput formControlName="email"/>
                </mat-form-field>
                <mat-slide-toggle formControlName="state" color="primary">Estado</mat-slide-toggle>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <div class="flex space-x-2 items-center mt-4 sm:mt-0">
                        <button class="ml-auto sm:ml-0" color="warn" mat-stroked-button (click)="cancelForm()">
                            Cancelar
                        </button>
                        <button class="ml-auto sm:ml-0" color="primary" [disabled]="storeForm.invalid"
                                mat-stroked-button (click)="saveForm()">
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class StoresEditComponent implements OnInit {
    @Input() title: string = '';
    @Input() unitMeasurement = new Stores();
    abcForms: any;
    storeForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        code: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        state: new FormControl(false, [Validators.required]),
    });

    constructor(
        private _matDialog: MatDialogRef<StoresEditComponent>
    ) {
    }

    ngOnInit() {
        this.abcForms = abcForms;
        this.storeForm.patchValue(this.unitMeasurement);

    }

    public saveForm(): void {
        if (this.storeForm.valid) {
            this._matDialog.close(this.storeForm.value);
        }
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }
}
