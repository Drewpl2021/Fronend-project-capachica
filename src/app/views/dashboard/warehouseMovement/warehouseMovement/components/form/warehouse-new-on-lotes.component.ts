import {Component, Inject, Input, OnInit} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule, JsonPipe} from '@angular/common';

@Component({
    selector: 'app-warehouse-new-on-lotes',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        JsonPipe,
        CommonModule
    ],
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
                <div class="flex items-center justify-end mb-4">
                    <button
                        type="button"
                        class="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                        (click)="addLote()">
                        Añadir Lote
                    </button>
                </div>
                <div class="overflow-x-auto max-h-96">
                    <table class="min-w-full divide-y divide-gray-200 border">
                        <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
                            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Fabricación</th>
                            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Caducidad</th>
                            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                        </tr>
                        </thead>
                        <tbody formArrayName="lotes" class="bg-white divide-y divide-gray-200">
                        <tr
                            *ngFor="let lote of lotes.controls; let i = index"
                            [formGroupName]="i"
                            class="border-b hover:bg-gray-50">
                            <td class="px-4 py-3 text-center text-sm font-semibold text-gray-700">{{ i + 1 }}</td>
                            <td class="px-4 py-3">
                                <input
                                    type="text"
                                    class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    formControlName="codigo"
                                    placeholder="Código"/>
                            </td>
                            <td class="px-4 py-3">
                                <input
                                    type="number"
                                    class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-right"
                                    formControlName="cantidad"
                                    placeholder="Cantidad"/>
                            </td>
                            <td class="px-4 py-3">
                                <input
                                    type="date"
                                    class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    formControlName="fechaFabricacion"/>
                            </td>
                            <td class="px-4 py-3">
                                <input
                                    type="date"
                                    class="w-full border border-gray-300 rounded-md shadow-sm px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    formControlName="fechaCaducidad"/>
                            </td>
                            <td class="px-4 py-3 text-center">
                                <button
                                    type="button"
                                    (click)="eliminarLote(i)"
                                    aria-label="Eliminar">
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
                        <button
                            class="ml-auto sm:ml-0"
                            color="primary"
                            [disabled]="categoryForm.invalid"
                            mat-stroked-button
                            (click)="saveForm()"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>

    `,
})
export class WarehouseNewOnLotesComponent implements OnInit {
    categoryForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private _matDialog: MatDialogRef<WarehouseNewOnLotesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any

    ) {
        // Inicializa el formulario con los lotes existentes o un array vacío
        this.categoryForm = this.fb.group({
            lotes: this.fb.array(this.createLotesArray(data.lotes || [])),
        });


    }

    get lotes(): FormArray {
        return this.categoryForm.get('lotes') as FormArray;
    }

    ngOnInit(): void {
        // Si no hay lotes, añade uno inicial
        if (this.lotes.length === 0) {
            this.addLote();
        }
        this.inicializarLotes();
    }

    private createLotesArray(lotes: any[]): FormGroup[] {
        return lotes.map((lote) =>
            this.fb.group({
                codigo: [lote.codigo || '', Validators.required],
                cantidad: [lote.cantidad || 1, [Validators.required, Validators.min(1)]],
                fechaFabricacion: [lote.fechaFabricacion || '', Validators.required],
                fechaCaducidad: [lote.fechaCaducidad || '', Validators.required],
            })
        );
    }
    private inicializarLotes(): void {
        const cantidad = 1; // La cantidad enviada desde el componente padre
        const lotesActuales = this.data.lotes || [];

        // Limpia cualquier inicialización previa
        this.lotes.clear();

        // Cargar lotes existentes si los hay
        lotesActuales.forEach((lote: any) => {
            this.lotes.push(this.fb.group({
                codigo: [lote.codigo, Validators.required],
                cantidad: [lote.cantidad, [Validators.required, Validators.min(1)]],
                fechaFabricacion: [lote.fechaFabricacion, Validators.required],
                fechaCaducidad: [lote.fechaCaducidad, Validators.required],
            }));
        });

        // Añade filas vacías hasta completar la cantidad requerida
        for (let i = lotesActuales.length; i < cantidad; i++) {
            this.lotes.push(this.fb.group({
                codigo: ['', Validators.required],
                cantidad: [1, [Validators.required, Validators.min(1)]],
                fechaFabricacion: ['', Validators.required],
                fechaCaducidad: ['', Validators.required],
            }));
        }
    }

    addLote(): void {
        const loteGroup = this.fb.group({
            codigo: ['', Validators.required],
            cantidad: [1, [Validators.required, Validators.min(1)]],
            fechaFabricacion: ['', Validators.required],
            fechaCaducidad: ['', Validators.required],
        });
        this.lotes.push(loteGroup);
    }


    eliminarLote(index: number): void {
        this.lotes.removeAt(index);
    }
    saveForm(): void {
        if (this.categoryForm.valid) {
            this._matDialog.close(this.categoryForm.value.lotes); // Devuelve los lotes
        }
    }
    cancelForm(): void {
        this._matDialog.close();
    }
}
