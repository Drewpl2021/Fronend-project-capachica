import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogRef} from '@angular/material/dialog';
import {AccountingPlan, Areas, accountingDynamic} from "../../models/accountingDynamic";

import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {AreaService} from "../../../../../../providers/services/accounting/area.service";
import {AccoutingPlanService} from "../../../../../../providers/services/accounting/accounting-plan.service";

@Component({
    selector: 'app-accounting-dynamic-new',
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
        <div class="container">
            <!-- Header -->
            <div class="header flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="title">Editar Dinámica Contable</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon class="text-current" [svgIcon]="'heroicons_outline:x-mark'"></mat-icon>
                </button>
            </div>

            <!-- Formulario -->
            <form class="form" [formGroup]="dynamicsForm">
                <!-- Primera fila -->
                <div class="form-row">
                    <mat-form-field appearance="fill" class="form-field">
                        <mat-label>Nombre</mat-label>
                        <input type="text" matInput formControlName="name" />
                    </mat-form-field>

                    <mat-form-field appearance="fill" class="form-field">
                        <mat-label>Código</mat-label>
                        <input type="text" matInput formControlName="code" />
                    </mat-form-field>
                </div>

                <!-- Segunda fila -->
                <div class="form-row">
                    <mat-form-field appearance="fill" class="form-field">
                        <mat-label>Porcentaje IGV</mat-label>
                        <input type="number" matInput formControlName="percentageIgv" />
                    </mat-form-field>

                    <mat-form-field appearance="fill" class="form-field">
                        <mat-label>Descripción</mat-label>
                        <textarea matInput formControlName="description"></textarea>
                    </mat-form-field>
                </div>
                <mat-slide-toggle formControlName="status" color="primary">Estado</mat-slide-toggle>

                <button type="button" mat-raised-button color="primary" (click)="addAccountingDynamic()">
                    Añadir Detalle
                </button>
                <div class="dynamic-header">
                    <div>#</div>
                    <div style="margin-left: 55px">Código</div>
                    <div style="margin-left: 140px">Área*</div>
                    <div style="margin-left: 120px">Plan Contable*</div>
                    <div style="margin-left: 60px">Plan Contable Detalle*</div>
                </div>

                <!-- Filas dinámicas -->
                <div formArrayName="accountingDynamicsDetails">
                    <div *ngFor="let detail of accountingDynamicsDetails.controls; let i = index" [formGroupName]="i" class="dynamic-row">
                        <div><b>{{ i + 1 }}</b></div>
                        <mat-form-field appearance="fill" class="form-field">
                            <input type="text" matInput formControlName="codigo" />
                        </mat-form-field>
                        <mat-form-field appearance="fill" class="form-field">
                            <mat-select formControlName="area">
                                <mat-option *ngFor="let area of areas" [value]="area.id">{{ area.name }}</mat-option>
                            </mat-select>
                        </mat-form-field>
                        <mat-form-field appearance="fill" class="form-field">
                            <mat-select formControlName="accountingPlan">
                                <mat-option *ngFor="let plan of accoutingPlan" [value]="plan.id">{{ plan.name }}</mat-option>
                            </mat-select>
                        </mat-form-field>
                        <mat-form-field appearance="fill" class="form-field">
                            <mat-select formControlName="subAccountingPlan">
                                <mat-option *ngFor="let plan of accoutingPlan" [value]="plan.id">{{ plan.name }}</mat-option>
                            </mat-select>
                        </mat-form-field>
                        <button type="button" mat-icon-button color="warn" (click)="removeAccountingDynamic(i)">
                            <mat-icon>delete</mat-icon>
                        </button>
                    </div>
                </div>
                <div class="actions">
                    <button type="button" mat-stroked-button color="warn" (click)="cancelForm()">Cancelar</button>
                    <button type="button" mat-raised-button color="primary" [disabled]="dynamicsForm.invalid" (click)="saveForm()">
                        Guardar
                    </button>
                </div>
            </form>
        </div>

    `,
})
export class AccountingDynamicEditComponent implements OnInit {
    @Input() title: string = '';
    @Input() unitMeasurement = new accountingDynamic();
    areas: Areas[] = [];
    accoutingPlan: AccountingPlan[] = [];

    abcForms: any;
    dynamicsForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        code: new FormControl('', [Validators.required]),
        percentageIgv: new FormControl(18, [Validators.required]),
        description: new FormControl('', [Validators.required]),
        status: new FormControl(true, [Validators.required]),
        accountingDynamicsDetails: new FormArray([]) // FormArray para las dinámicas contables
    });


    constructor(
        private _matDialog: MatDialogRef<AccountingDynamicEditComponent>,
        private areaService: AreaService,
        private accoutingPlanService: AccoutingPlanService,
    ) {
    }

    ngOnInit() {
        this.abcForms = abcForms;
        this.initializeForm();
        this.CargarDatos();
        this.loadAccountingDynamicsDetails();
    }

    private initializeForm(): void {
        this.dynamicsForm.patchValue({
            name: this.unitMeasurement.name,
            code: this.unitMeasurement.code,
            percentageIgv: this.unitMeasurement.percentageIgv || 18,
            description: this.unitMeasurement.description,
            status: this.unitMeasurement.status ?? true
        });
    }

    private CargarDatos(): void {
        this.areaService.getAll$().subscribe({
            next: (data) => (this.areas = data),
            error: (err) => console.error('Error al obtener las áreas:', err)
        });
        this.accoutingPlanService.getAll$().subscribe({
            next: (data) => (this.accoutingPlan = data),
            error: (err) => console.error('Error al obtener los planes de cuentas:', err)
        });
    }
    public addAccountingDynamic(): void  {
        this.accountingDynamicsDetails.push(this.createAccountingDynamic());
    }

    get accountingDynamicsDetails(): FormArray {
        return this.dynamicsForm.get('accountingDynamicsDetails') as FormArray;
    }

    public createAccountingDynamic(detail?: any): FormGroup {
        return new FormGroup({
            id: new FormControl(detail?.id || ''),
            codigo: new FormControl(detail?.code || '', Validators.required), // Recupera el valor del código
            area: new FormControl(detail?.area?.id || '', Validators.required),
            accountingPlan: new FormControl(detail?.accountingPlan?.id || '', Validators.required),
            subAccountingPlan: new FormControl(detail?.subAccountingPlan?.id || '', Validators.required)
        });
    }


    public loadAccountingDynamicsDetails(): void {
        const details = this.unitMeasurement.accountingDynamicsDetails || [];
        details.forEach(detail => {
            this.accountingDynamicsDetails.push(this.createAccountingDynamic(detail));
        });
    }

    public removeAccountingDynamic(index: number): void {
        this.accountingDynamicsDetails.removeAt(index);
    }

    public saveForm(): void {
        if (this.dynamicsForm.valid) {
            const formValues = this.dynamicsForm.value;
            const payload = {
                name: formValues.name,
                code: formValues.code,
                percentageIgv: formValues.percentageIgv,
                description: formValues.description,
                status: formValues.status,
                accountingDynamicsDetails: formValues.accountingDynamicsDetails.map((detail: any) => ({
                    id: detail.id,
                    code: formValues.code,
                    status: formValues.status,
                    accountingPlan: { id: detail.accountingPlan },
                    subAccountingPlan: { id: detail.subAccountingPlan },
                    area: { id: detail.area }
                }))
            };
            this._matDialog.close(payload);
        }
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }
}
