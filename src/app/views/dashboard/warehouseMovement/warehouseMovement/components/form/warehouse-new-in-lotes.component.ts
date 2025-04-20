import {ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule, JsonPipe} from '@angular/common';
import {LotsService} from "../../../../../../providers/services/warehouseMovement/lots.service";
import {Lots} from "../../models/warehouse";

@Component({
    selector: 'app-warehouse-new-in-lotes',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule, JsonPipe, CommonModule],
    template: `
        <div class="flex flex-col">
            <div
                class="flex flex-col items-center justify-center h-16 pr-3 sm:pr-5 pl-6 sm:pl-8"
                style="color: black; height: 100%; text-align: center;">
                <div class="font-medium font-bold mt-6" style="font-size: 22px">
                    <p>Lotes del Producto</p>
                </div>
                <h1 class="font-semibold mt-2" style="color: gray; font-size: 16px">{{ data.productName }}</h1>
            </div>
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="categoryForm">
                <div class="overflow-x-auto max-h-96">
                    <table class="min-w-full divide-y divide-gray-200 border">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Fabricación</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Caducidad</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let lote of lost; let i = index" class="border-b hover:bg-gray-50">
                                <td class="px-4 py-3 text-center text-sm font-semibold text-gray-700">{{ i + 1 }}</td>
                                <td class="px-4 py-3">{{ lote.lotCode }}</td>
                                <td class="px-4 py-3">{{ lote.remainingAmount }}</td>
                                <td class="px-4 py-3">{{ lote.manufactureDateFormatted }}</td>
                                <td class="px-4 py-3">{{ lote.expirationDateFormatted }}</td>
                                <td class="px-4 py-3 text-center">
                                    <button type="button" class="rounded-full p-1" (click)="agregarLote(lote)">
                                        <mat-icon color="primary">add</mat-icon>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div *ngIf="lotesSeleccionados.length > 0" class="mt-6 p-4 border border-gray-300 rounded-lg">
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">Lotes Seleccionados</h3>
                    <table class="min-w-full divide-y divide-gray-200 border">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Fabricación</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Caducidad</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let lote of lotesSeleccionados; let i = index" [formGroup]="lote" class="border-b hover:bg-gray-50">
                                <td class="px-4 py-3">
                                    <input type="text" formControlName="lotCode" class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-1.5 sm:text-sm" placeholder="Código"/>
                                </td>
                                <td class="px-4 py-3">
                                    <input type="number" formControlName="amount" class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-1.5 sm:text-sm"
                                        [attr.max]="lote.get('cantidadMax')?.value" [attr.min]="1" (input)="validarCantidad(lote)" placeholder="Cantidad"/>
                                </td>
                                <td class="px-4 py-3">
                                    <input formControlName="manufactureDateFormatted" class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-1.5 sm:text-sm"/>
                                </td>
                                <td class="px-4 py-3">
                                    <input formControlName="expirationDateFormatted" class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-1.5 sm:text-sm"/>
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <mat-icon color="warn" (click)="eliminarLoteSeleccionado(i)">delete</mat-icon>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <div class="flex space-x-2 items-center mt-4 sm:mt-0">
                        <button class="ml-auto sm:ml-0" color="warn" mat-stroked-button (click)="cancelForm()">Cancelar</button>
                        <button
                            class="ml-auto sm:ml-0"
                            color="primary"
                            [disabled]="categoryForm.invalid"
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
export class WarehouseNewInLotesComponent implements OnInit {
    categoryForm: FormGroup;
    lost: Lots[] = [];
    storeId: string;
    productId: string;
    selectedPresentation: string;
    nuevoLoteForm: FormGroup;
    lotesSeleccionados: FormGroup[] = [];

    constructor(
        private fb: FormBuilder,
        private _matDialog: MatDialogRef<WarehouseNewInLotesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _lotsService: LotsService,
        private cdr: ChangeDetectorRef
    ) {
        this.storeId = data.storeId || '';
        this.productId = data.productId || '';
        this.selectedPresentation = data.selectedPresentation || '';
        this.lotesSeleccionados = data.lotes.map(lote => this.fb.group({
                id: [lote.id],
                lotCode: [lote.lotCode, Validators.required],
                amount: [lote.amount, [Validators.required, Validators.min(1)]],
                manufactureDate: [lote.manufactureDate, Validators.required],
                expirationDate: [lote.expirationDate, Validators.required],
                manufactureDateFormatted: [this.formatFecha(lote.manufactureDate)],
                expirationDateFormatted: [this.formatFecha(lote.expirationDate)],}));
        this.categoryForm = this.fb.group({lotes: this.fb.array(this.lotesSeleccionados)});
    }
    get lotes(): FormArray {
        return this.categoryForm.get('lotes') as FormArray;
    }
    ngOnInit(): void {
        this.CargarDatos();
    }
    private CargarDatos() {
        const params = {
            productId: this.productId,
            storeId: this.storeId,
            selectedPresentation: this.selectedPresentation,
        };
        this._lotsService.getWithSeries$(params).subscribe(
            (data) => {
                this.lost = data?.map(item => ({
                    id: item.id,
                    lotCode: item.lotCode, // Código del lote
                    amount: item.amount, // Cantidad
                    manufactureDate: item.manufactureDate,
                    remainingAmount: item.remainingAmount,
                    expirationDate: item.expirationDate,
                    manufactureDateFormatted: this.formatFecha(item.manufactureDate),
                    expirationDateFormatted: this.formatFecha(item.expirationDate),
                })) || [];
                if (this.lost.length > 0) {
                    this.actualizarLotesDesdeDB(this.lost);}
                this.cdr.detectChanges();
            },
        );
    }
    private actualizarLotesDesdeDB(lotesDB: any[]): void {
        this.lotes.clear();
        lotesDB.forEach((lote) => {
            this.lotes.push(this.fb.group({
                lotCode: [lote.lotCode || '', Validators.required],
                amount: [lote.amount || 1, [Validators.required, Validators.min(1)]],
                manufactureDate: [lote.manufactureDate || 'No disponible'],
                expirationDate: [lote.expirationDate || 'No disponible'],
            }));
        });
        this.categoryForm.setControl('lotes', this.lotes);
    }
    eliminarLoteSeleccionado(index: number) {
        const lotesArray = this.categoryForm.get('lotes') as FormArray;
        if (lotesArray && lotesArray.length > index) {
            lotesArray.removeAt(index);
        }
        if (this.lotesSeleccionados && this.lotesSeleccionados.length > index) {
            this.lotesSeleccionados.splice(index, 1);
        }
        this.cdr.detectChanges();
    }

    agregarLote(lote: any) {
        const maxCantidad = lote.amount || 1;
        const nuevoLote = this.fb.group({
            lotSaleId: lote.id || '',
            lotCode: [lote.lotCode || '', Validators.required],
            cantidadMax: [maxCantidad],
            amount: [1, [Validators.required, Validators.min(1), Validators.max(maxCantidad)]],
            manufactureDate: [lote.manufactureDate || '', Validators.required],
            expirationDate: [lote.expirationDate || '', Validators.required],
            manufactureDateFormatted: [lote.manufactureDateFormatted || '', Validators.required],
            expirationDateFormatted: [lote.expirationDateFormatted || '', Validators.required],});
        this.lotesSeleccionados.push(nuevoLote);
        this.nuevoLoteForm.patchValue({
            lotCode: lote.lotCode || '',
            amount: 1,
            manufactureDate: lote.manufactureDate || '',
            expirationDate: lote.expirationDate || '',
        });
        this.cdr.detectChanges();
    }
    saveForm(): void {
        if (this.categoryForm.valid) {
            const lotesFinales = this.lotesSeleccionados
                .map(lote => lote.value)
                .filter(lote => lote.lotCode && lote.amount > 0);
            this._matDialog.close(lotesFinales);
        }
    }
    cancelForm(): void {
        this._matDialog.close();
    }
    formatFecha(fecha: string | Date): string {
        if (!fecha) {return 'No disponible';}
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const dateObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
        const dia = dateObj.getUTCDate();
        const mes = meses[dateObj.getUTCMonth()];
        const año = dateObj.getUTCFullYear();
        const fechaFormateada = `${dia} de ${mes} del ${año}`;
        return fechaFormateada;}
    validarCantidad(lote: FormGroup) {
        const maxCantidad = lote.get('cantidadMax')?.value;
        let cantidad = lote.get('amount')?.value;
        if (cantidad > maxCantidad) {
            lote.get('amount')?.setValue(maxCantidad);} else if (cantidad < 1) {
            lote.get('amount')?.setValue(1);}
    }
}
