import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogRef} from '@angular/material/dialog';
import {Payment} from "../../models/payment";

import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";

@Component({
    selector: 'app-payment-new',
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
                <div class="text-lg font-medium">Nuevo Módulo Padre</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon
                        class="text-current"
                        [svgIcon]="'heroicons_outline:x-mark'"
                    ></mat-icon>
                </button>
            </div>

            <!-- Compose form -->
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto"
                  [formGroup]="parentModuleForm">
                <mat-form-field>
                    <mat-label>Módulo Padre</mat-label>
                    <input type="text" matInput [formControlName]="'code'"/>
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Icono</mat-label>
                    <input type="Number" matInput [formControlName]="'total'"/>
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Orden</mat-label>
                    <input type="Number" matInput [formControlName]="'bi'"/>
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Url</mat-label>
                    <input type="Number" matInput [formControlName]="'igv'"/>
                </mat-form-field>

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
                            [disabled]="parentModuleForm.invalid"
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
export class PaymentEditComponent implements OnInit {
    @Input() title: string = '';
    @Input() parentModule = new Payment();
    abcForms: any;
    parentModuleForm = new FormGroup({
        code: new FormControl('', [Validators.required]),
        total: new FormControl('', [Validators.required]),
        bi: new FormControl('', [Validators.required,]),
        igv: new FormControl('', [Validators.required,]),


    });

    constructor(
        private _matDialog: MatDialogRef<PaymentEditComponent>
    ) {
    }

    ngOnInit() {
        this.abcForms = abcForms;
        // @ts-ignore
        this.parentModuleForm.patchValue(this.parentModule);
    }

    public saveForm(): void {
        if (this.parentModuleForm.valid) {
            this._matDialog.close(this.parentModuleForm.value);
        }
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }
}
