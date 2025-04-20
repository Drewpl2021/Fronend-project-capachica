import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from "@angular/material/select";
import {CommonModule, JsonPipe} from "@angular/common";
import {SeriesService} from "../../../../../../providers/services/warehouseMovement/series.service";

@Component({
    selector: 'app-sales-new-series',
    standalone: true,
    imports: [FormsModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatSelectModule, JsonPipe, CommonModule],
    template: `
        <div class="flex flex-col ">
            <div class="flex flex-col items-center justify-center h-16 pr-3 sm:pr-5 pl-6 sm:pl-8" style="color: black; height: 100%; text-align: center;">
                <div class="font-medium font-bold mt-6" style="font-size: 22px">
                    <p>Series del Producto</p>
                </div>
                <h1 class="font-semibold mt-2" style="color: gray; font-size: 16px">{{ data.productName }}</h1>
            </div>
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="salesForm">
                <div class="flex items-center mb-4">
                    <label for="cantidad" class="font-bold text-gray-700 mr-2" style="font-size: 14px">CANTIDAD:</label>
                    <input id="cantidad" type="number" class="border border-gray-300 rounded-lg px-2 py-1 text-center focus:ring-blue-500 focus:border-blue-500 sm:text-sm" style="width: 200px; margin-left: 100px" [value]="quantity" readonly/>
                </div>
                <div class="overflow-x-auto max-h-96">
                    <table class="min-w-full divide-y divide-gray-200 border">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serie</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opciones</th>
                            </tr>
                        </thead>
                        <tbody formArrayName="series" class="bg-white divide-y divide-gray-200">
                        <tr *ngFor="let serie of series.controls; let i = index" [formGroupName]="i">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ i + 1 }}</td>
                            <td class="px-6 py-4 whitespace-nowrap flex items-center">
                                <input type="text" class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" style="padding-left: 10px;" formControlName="seriesCode" (input)="onSerieChange(i); checkFormValidity()"/>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <select (change)="onSelectSeries($event.target.value, i)" class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    <option disabled selected>SELECCIONE UNA OPCIÓN</option>
                                    <option *ngIf="!seriesOptions[i] || seriesOptions[i].length === 0" disabled>No hay opciones disponibles</option>
                                    <option *ngFor="let option of getFilteredOptions(i)" [value]="option.seriesCode">
                                        {{ option.seriesCode }}
                                    </option>
                                </select>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <div class="flex space-x-2 items-center mt-4 sm:mt-0">
                        <button class="ml-auto sm:ml-0" color="warn" mat-stroked-button (click)="cancelForm()">Cancelar</button>
                        <button class="ml-auto sm:ml-0" color="primary" mat-stroked-button (click)="saveForm()" [disabled]="!isFormValid">Guardar</button>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class SalesNewSeriesComponent implements OnInit {
    salesForm: FormGroup;
    quantity: number;
    storeId: string;
    productId: string;
    isFormValid: boolean = false;
    seriesOptions: { [key: number]: { id: string, seriesCode: string }[] } = {};

    constructor(
        private fb: FormBuilder,
        private _matDialog: MatDialogRef<SalesNewSeriesComponent>,
        private _seriesService: SeriesService,
        private cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.quantity = data.quantity || 0;
        this.storeId = data.storeId || '';
        this.productId = data.productId || '';
        this.salesForm = this.fb.group({
            series: this.fb.array([])
        });
        this.initializeSeries(data.series || []);
    }
    get series(): FormArray {
        return this.salesForm.get('series') as FormArray;
    }
    ngOnInit(): void {
        this.series.controls.forEach((control, index) => {
            control.get('seriesCode')?.valueChanges.subscribe(value => {
                if (value.length > 2) {
                    this.uploadData(value, index);
                } else {
                    this.seriesOptions[index] = [];
                }
                this.checkFormValidity();
            });
        });
    }
    getFilteredOptions(index: number) {
        const selectedValues = this.series.controls.map(control => control.get('seriesCode')?.value).filter(value => value);
        return this.seriesOptions[index]?.filter(option => !selectedValues.includes(option.seriesCode)) || [];
    }
    checkFormValidity() {
        this.isFormValid = this.series.controls.every(control => control.get('seriesCode')?.value?.trim() !== '');
    }
    onSerieChange(index: number) {
        const value = this.series.at(index).get('seriesCode')?.value;
        if (value.length > 2) {
            this.uploadData(value, index);
        } else {
            this.seriesOptions[index] = [];
            this.cdr.detectChanges();
        }
    }
    onSelectSeries(selectedValue: string, index: number) {
        const selectedOption = this.seriesOptions[index]?.find(option => option.seriesCode === selectedValue);
        if (selectedOption) {
            this.series.at(index).patchValue({
                id: selectedOption.id,
                seriesCode: selectedOption.seriesCode
            });
            this.seriesOptions[index] = [];
            this.cdr.detectChanges();
        }
    }
    private uploadData(seriesCodePattern: string, index: number) {
        const params = {
            productId: this.productId,
            storeId: this.storeId,
            seriesCodePattern: seriesCodePattern
        };
        this._seriesService.getWithSeries$(params).subscribe((data) => {
            this.seriesOptions[index] = data?.map(item => ({
                id: item.id,
                seriesCode: item.seriesCode
            })) || [];
            this.cdr.detectChanges();
        });
    }
    private initializeSeries(series: any[]): void {
        const formArray = this.series;
        formArray.clear(); // Limpia el array antes de llenarlo
        if (series.length > 0) {
            series.forEach(serie => {
                formArray.push(this.fb.group({
                    id: [serie.id || ''],  // Ahora incluye ID
                    seriesCode: [serie.seriesCode || '', Validators.required]
                }));
            });
        } else {
            for (let i = 0; i < this.quantity; i++) {
                formArray.push(this.fb.group({
                    id: [''],  // ID inicial vacío
                    seriesCode: ['', Validators.required]
                }));
            }
        }
    }
    saveForm(): void {
        if (this.salesForm.valid) {
            const result = this.series.value.map((serie: any) => ({
                serieSaleId: serie.id,
                seriesCode: serie.seriesCode
            }));
            this._matDialog.close(result);
        }
    }
    cancelForm(): void {
        this._matDialog.close();
    }
}

