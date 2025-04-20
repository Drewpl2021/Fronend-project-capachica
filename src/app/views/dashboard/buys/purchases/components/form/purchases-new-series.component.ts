import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from "@angular/material/select";
import {CommonModule, JsonPipe} from "@angular/common";

@Component({
    selector: 'app-purchases-new-series',
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
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="purchasesForm">
                <div class="flex items-center mb-4">
                    <label for="cantidad" class="font-bold text-gray-700 mr-2" style="font-size: 14px">CANTIDAD:</label>
                    <input id="cantidad" type="number" class="border border-gray-300 rounded-lg px-2 py-1 text-center focus:ring-blue-500 focus:border-blue-500 sm:text-sm" style="width: 200px; margin-left: 100px" [value]="quantity" readonly/>
                </div>
                <div class="flex items-center space-x-2 mb-4">
                    <input type="text" placeholder="Inicio Serie" formControlName="initialSeries" class="flex-grow border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-2"/>
                    <button type="button" class="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1" (click)="generateSeries()">
                        Generar
                    </button>
                </div>
                <div class="overflow-x-auto max-h-96">
                    <table class="min-w-full divide-y divide-gray-200 border">
                        <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serie</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                        </tr>
                        </thead>
                        <tbody formArrayName="series" class="bg-white divide-y divide-gray-200">
                        <tr *ngFor="let serie of series.controls; let i = index" [formGroupName]="i">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ i + 1 }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <input type="text" class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" formControlName="serie"/>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <button type="button" (click)="deleteSeries(i)" aria-label="Eliminar">
                                    <mat-icon color="warn" class="ml-4">delete</mat-icon>
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <div class="flex space-x-2 items-center mt-4 sm:mt-0">
                        <button class="ml-auto sm:ml-0" color="warn" mat-stroked-button (click)="cancelForm()">Cancelar</button>
                        <button class="ml-auto sm:ml-0" color="primary" [disabled]="purchasesForm.invalid" mat-stroked-button (click)="saveForm()">
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class PurchasesNewSeriesComponent implements OnInit {
    purchasesForm: FormGroup;
    quantity: number;
    constructor(
        private fb: FormBuilder,
        private _matDialog: MatDialogRef<PurchasesNewSeriesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.quantity = data.quantity || 0;
        this.purchasesForm = this.fb.group({
            initialSeries: [''],
            series: this.fb.array(this.createSeriesArray(data.series || []) ),
        });
    }
    ngOnInit(): void {
        if (this.series.length === 0) {
            this.initializeSeries();
        }
    }
    get series(): FormArray {
        return this.purchasesForm.get('series') as FormArray;
    }
    private createSeriesArray(series: any[]): FormGroup[] {
        return series.map((serie) =>
            this.fb.group({
                serie: [serie.serie || '', Validators.required],
            })
        );
    }
    initializeSeries(): void {
        for (let i = 0; i < this.quantity; i++) {
            this.series.push(this.fb.group({ serie: ['', Validators.required] }));
        }
    }
    deleteSeries(index: number): void {
        this.series.removeAt(index);
    }
    generateSeries(): void {
        const initialSeries = this.purchasesForm.get('initialSeries')?.value || '';
        if (initialSeries) {
            const match = initialSeries.match(/^(\D*?)(\d+)$/);
            if (match) {
                const prefix = match[1];
                let currentNumber = parseInt(match[2], 10);

                for (let i = 0; i < this.series.length; i++) {
                    const seriesValue = `${prefix}${currentNumber}`;
                    this.series.at(i).patchValue({ serie: seriesValue });
                    currentNumber++;
                }
            }
        }
    }
    saveForm(): void {
        if (this.purchasesForm.valid) {
            this._matDialog.close(this.series.value);
        }
    }
    cancelForm(): void {
        this._matDialog.close();
    }
}

