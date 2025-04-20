import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule, JsonPipe} from '@angular/common';

@Component({
    selector: 'app-sales-cancel-lotes',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule, JsonPipe, CommonModule],
    template: `
        <div class="flex flex-col">
            <div class="flex flex-col items-center justify-center h-16 pr-3 sm:pr-5 pl-6 sm:pl-8" style="color: black; height: 100%; text-align: center;">
                <div class="font-medium font-bold mt-6" style="font-size: 22px">
                    <p>Lotes del Producto</p>
                </div>
                <h1 class="font-semibold mt-2" style="color: gray; font-size: 16px">{{ data.productName }}</h1>
            </div>
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="salesForm">
                <div *ngIf="lotesSeleccionados.length > 0" class="mt-6 p-4 border border-gray-300 rounded-lg">
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">Lotes Seleccionados</h3>
                    <table class="min-w-full divide-y divide-gray-200 border">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Fabricación</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Caducidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let lote of lotesSeleccionados; let i = index" [formGroup]="lote" class="border-b hover:bg-gray-50">
                                <td class="px-4 py-3">
                                    <input type="text" formControlName="lotCode" class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-1.5 sm:text-sm" placeholder="Código"/>
                                </td>
                                <td class="px-4 py-3">
                                    <input type="number" formControlName="amount" class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-1.5 sm:text-sm" [attr.max]="lote.get('cantidadMax')?.value" [attr.min]="1" (input)="validateQuantity(lote)" placeholder="Cantidad"/>
                                </td>
                                <td class="px-4 py-3">
                                    <input formControlName="manufactureDateFormatted" class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-1.5 sm:text-sm"/>
                                </td>
                                <td class="px-4 py-3">
                                    <input formControlName="expirationDateFormatted" class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-1.5 sm:text-sm"/>
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
export class SalesCancelLotesComponent implements OnInit {
    salesForm: FormGroup;
    storeId: string;
    productId: string;
    lotesSeleccionados: FormGroup[] = [];

    constructor(
        private fb: FormBuilder,
        private _matDialog: MatDialogRef<SalesCancelLotesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,) {
        this.storeId = data.storeId || '';
        this.productId = data.productId || '';
        this.lotesSeleccionados = data.lotes.map(lote => this.fb.group({
                id: [lote.id],
                lotCode: [lote.lotCode, Validators.required],
                amount: [lote.amount, [Validators.required, Validators.min(1)]],
                manufactureDate: [lote.manufactureDate, Validators.required],
                expirationDate: [lote.expirationDate, Validators.required],
                manufactureDateFormatted: [this.formatDate(lote.manufactureDate)],
                expirationDateFormatted: [this.formatDate(lote.expirationDate)],}));
        this.salesForm = this.fb.group({lotes: this.fb.array(this.lotesSeleccionados)});
    }
    get lotes(): FormArray {
        return this.salesForm.get('lotes') as FormArray;
    }
    ngOnInit(): void {
    }
    cancelForm(): void {
        this._matDialog.close();
    }
    formatDate(fecha: string | Date): string {
        if (!fecha) {return 'No disponible';}
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const dateObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
        const dia = dateObj.getUTCDate();
        const mes = meses[dateObj.getUTCMonth()];
        const año = dateObj.getUTCFullYear();
        const fechaFormateada = `${dia} de ${mes} del ${año}`;
        return fechaFormateada;}
    validateQuantity(lote: FormGroup) {
        const maxCantidad = lote.get('cantidadMax')?.value;
        let cantidad = lote.get('amount')?.value;
        if (cantidad > maxCantidad) {
            lote.get('amount')?.setValue(maxCantidad);} else if (cantidad < 1) {
            lote.get('amount')?.setValue(1);}
    }
}
