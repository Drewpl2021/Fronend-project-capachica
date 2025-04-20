import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogRef} from '@angular/material/dialog';
import {PaymentMethods, PaymentsType} from "../../models/payments-methods";

import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {PaymentsTypeService} from "../../../../../../providers/services/payments/PaymentsType.service";

@Component({
    selector: 'app-payments-methods-new',
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
                <div class="text-lg font-medium">Editar Metodo de Pago</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon
                        class="text-current"
                        [svgIcon]="'heroicons_outline:x-mark'"
                    ></mat-icon>
                </button>
            </div>

            <!-- Compose form -->
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="paymentsMethodsForm">
                <mat-form-field>
                    <mat-label>Nombre</mat-label>
                    <input type="text" matInput formControlName="name"/>
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Código</mat-label>
                    <input type="text" matInput formControlName="code"/>
                </mat-form-field>


                <mat-form-field appearance="fill" class="form-field">
                    <mat-label>Metodo de Pago</mat-label>
                    <mat-select formControlName="paymentType">
                        <mat-option *ngFor="let paymentsType of paymentsTypes" [value]="paymentsType.id">
                            {{ paymentsType.name }}
                        </mat-option>
                    </mat-select>
                </mat-form-field>


                <mat-slide-toggle formControlName="state" color="primary">Estado</mat-slide-toggle>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <div class="flex space-x-2 items-center mt-4 sm:mt-0">
                        <button class="ml-auto sm:ml-0" color="warn" mat-stroked-button (click)="cancelForm()">
                            Cancelar
                        </button>
                        <button class="ml-auto sm:ml-0" color="primary" [disabled]="paymentsMethodsForm.invalid"
                                mat-stroked-button (click)="saveForm()">
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class PaymentsMethodsEditComponent implements OnInit {
    @Input() title: string = '';
    @Input() unitMeasurement = new PaymentMethods();
    abcForms: any;
    paymentsTypes: PaymentsType[] = [];

    paymentsMethodsForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        code: new FormControl('', [Validators.required]),
        state: new FormControl(false, [Validators.required]),
        paymentType: new FormControl('', [Validators.required]),
    });

    constructor(
        private _matDialog: MatDialogRef<PaymentsMethodsEditComponent>,
        private paymentsTypeService: PaymentsTypeService,
    ) {
    }

    ngOnInit() {
        this.abcForms = abcForms;
        this.CargarDatos()
        this.loadFormData();
    }

    private CargarDatos() {
        this.paymentsTypeService.getWithSearch$().subscribe((data) => {
            this.paymentsTypes = data?.content || [];
        });
    }
    private loadFormData(): void {
        if (this.unitMeasurement) {
            this.paymentsMethodsForm.patchValue({
                name: this.unitMeasurement.name,
                code: this.unitMeasurement.code,
                paymentType: this.unitMeasurement.paymentType.id, // Usamos solo el ID
                state: this.unitMeasurement.state,
            });
        }
    }
    public saveForm(): void {
        if (this.paymentsMethodsForm.valid) {
            const formData = {
                name: this.paymentsMethodsForm.get('name')?.value,
                code: this.paymentsMethodsForm.get('code')?.value,
                paymentType: {
                    id: this.paymentsMethodsForm.get('paymentType')?.value, // Usamos el ID de paymentType
                },
                state: this.paymentsMethodsForm.get('state')?.value,
            };
            this._matDialog.close(formData);  // Enviamos los datos del formulario
        }
    }


    public cancelForm(): void {
        this._matDialog.close('');
    }
}
