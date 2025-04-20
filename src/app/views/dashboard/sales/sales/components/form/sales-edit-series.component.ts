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
    selector: 'app-sales-edit-series',
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
                            </tr>
                        </thead>
                        <tbody formArrayName="series" class="bg-white divide-y divide-gray-200">
                            <tr *ngFor="let serie of series.controls; let i = index" [formGroupName]="i">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ i + 1 }}</td>
                                <td class="px-6 py-4 whitespace-nowrap flex items-center">
                                    <input type="text" class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" formControlName="seriesCode"/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <div class="flex space-x-2 items-center mt-4 sm:mt-0">
                        <button class="ml-auto sm:ml-0 bg-primary-600 text-white" mat-stroked-button (click)="cancelForm()">Regresar</button>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class SalesEditSeriesComponent implements OnInit {
    salesForm: FormGroup;
    quantity: number;
    storeId: string;
    productId: string;

    constructor(
        private fb: FormBuilder,
        private _matDialog: MatDialogRef<SalesEditSeriesComponent>,
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
    }
    private initializeSeries(series: any[]): void {
        const formArray = this.series;
        formArray.clear();
        if (series.length > 0) {
            series.forEach(serie => {
                formArray.push(this.fb.group({
                    id: [serie.id || ''],
                    seriesCode: [serie.seriesCode || '', Validators.required]
                }));
            });
        } else {
            for (let i = 0; i < this.quantity; i++) {
                formArray.push(this.fb.group({
                    id: [''],
                    seriesCode: ['', Validators.required]
                }));
            }
        }
    }
    cancelForm(): void {
        this._matDialog.close();
    }
}

