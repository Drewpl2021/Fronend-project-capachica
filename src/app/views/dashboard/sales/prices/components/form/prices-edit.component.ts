import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogRef} from '@angular/material/dialog';
import {Prices} from "../../models/prices";

import {DateAdapter, MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {Stores} from "../../../../accounting/stores/models/stores";
import {StoresService} from "../../../../../../providers/services/accounting/stores.service";

@Component({
    selector: 'app-price-new',
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
        MatDatepickerModule,
    ],
    template: `
        <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <!-- Header -->
            <div
                class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium">Editar Precio</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon
                        class="text-current"
                        [svgIcon]="'heroicons_outline:x-mark'"
                    ></mat-icon>
                </button>
            </div>

            <!-- Compose form -->
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="pricesForm">
                <div class="flex space-x-4">
                    <mat-form-field class="flex-1">
                        <mat-label>Nombre</mat-label>
                        <input type="text" matInput formControlName="name"/>
                    </mat-form-field>
                    <mat-form-field appearance="fill" class="form-field">
                        <mat-label>Almacén</mat-label>
                        <mat-select [formControl]="pricesForm.get('store.id')">
                            <mat-option *ngFor="let store of stores" [value]="store.id">
                                {{ store.name }}
                            </mat-option>
                        </mat-select>
                    </mat-form-field>

                </div>


                <div class="flex space-x-4">
                    <mat-form-field class="w-full" style="flex: 1;">
                        <mat-label>Fecha de Inicio</mat-label>
                        <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                        <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                        <mat-datepicker #startPicker></mat-datepicker>
                    </mat-form-field>

                    <mat-form-field class="w-full" style="flex: 1;">
                        <mat-label>Fecha de Vigencia</mat-label>
                        <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                        <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                        <mat-datepicker #endPicker></mat-datepicker>
                    </mat-form-field>
                </div>


                <!-- Descripción -->
                <mat-form-field appearance="fill" class="w-full">
                    <mat-label>Descripción</mat-label>
                    <textarea matInput formControlName="description" placeholder="Descripción del Almacén"></textarea>
                </mat-form-field>

                <mat-slide-toggle formControlName="state" color="primary">Estado</mat-slide-toggle>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <div class="flex space-x-2 items-center mt-4 sm:mt-0">
                        <button class="ml-auto sm:ml-0" color="warn" mat-stroked-button (click)="cancelForm()">
                            Cancelar
                        </button>
                        <button class="ml-auto sm:ml-0" color="primary" [disabled]="pricesForm.invalid"
                                mat-stroked-button (click)="saveForm()">
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class PricesEditComponent implements OnInit {
    @Input() title: string = '';
    @Input() unitMeasurement = new Prices();
    abcForms: any;
    stores: Stores[] = [];
    pricesForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        store: new FormGroup({id: new FormControl('', [Validators.required]),}),
        startDate: new FormControl(this.formatDate(new Date()), [Validators.required]),
        endDate: new FormControl(this.formatDate(new Date()), [Validators.required]),
        description: new FormControl(''), // Campo opcional
        state: new FormControl(true, [Validators.required]),
    });

    constructor(
        private _matDialog: MatDialogRef<PricesEditComponent>,
        private _storesService: StoresService,
        private cdr: ChangeDetectorRef,
        private dateAdapter: DateAdapter<Date>,

    ) {this.dateAdapter.setLocale('es-ES');
    }

    ngOnInit() {
        this.abcForms = abcForms;
        this.pricesForm.patchValue(this.unitMeasurement);
        this.CargarDatos();
    }

    private CargarDatos() {
        this._storesService.getWithQuery$().subscribe((data) => {
            this.stores = data?.content || [];
            this.cdr.detectChanges();
        });
    }

    public saveForm(): void {
        if (this.pricesForm.valid) {
            const formValues = this.pricesForm.value;
            const formattedData = {
                ...formValues,
                store: {id: formValues.store.id || formValues.store},
                startDate: this.formatDate(new Date(formValues.startDate)),
                endDate: this.formatDate(new Date(formValues.endDate))
            };
            this._matDialog.close(formattedData);
        }
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }
    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }
}
