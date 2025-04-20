import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import { PriceDetail } from '../../models/price-details';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-price-details-list',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        DatePipe,
        MatTooltipModule
    ],
    template: `
        <br>
        <div class="table-container">
            <table class="custom-table">
                <thead>
                <tr class="bg-primary-600 text-white">
                    <th class="w-1/9 table-head text-center border-r">#</th>
                    <th class="w-1/9 table-header text-center border-r">Categoria</th>
                    <th class="w-1/9 table-header text-center border-r">Código</th>
                    <th class="w-1/9 table-header text-center border-r">Nombre</th>
                    <th class="w-1/9 table-header text-center border-r">Descripción</th>
                    <th class="w-1/9 table-header text-center border-r">Marca</th>
                    <th class="w-1/9 table-header text-center border-r">Unidad de Medida</th>
                    <th class="w-1/9 table-header text-center border-r">Factor</th>
                    <th class="w-1/9 table-header text-center border-r">Precio Unitario</th>
                </tr>
                </thead>
                <tbody class="bg-white">
                    @for (detail of priceDetails; track detail.id; let idx = $index) {
                        <tr class="hover:bg-gray-100">
                            <td class="w-1/9 p-2 text-center border-b">
                                {{ idx + 1 }}
                            </td>

                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ detail.categoryName }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ detail.productCode }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ detail.productName }}
                            </td>
                            <td class="w-1/9 p-2 text-start border-b text-sm">
                                {{ detail.productDescription }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ detail.productBrand }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ detail.unitMeasurementName }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ detail.factor }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <input
                                    type="number"
                                    [(ngModel)]="detail.unitPrice"
                                    class="w-full text-center border-none outline-none bg-transparent"
                                    (change)="onUnitPriceChange(detail)"
                                />
                            </td>

                        </tr>

                    } @empty {
                        <tr>
                            <td colspan="9" class="text-center">
                                Sin Contenido
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
            <div class="flex flex-col  sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                <div class="flex space-x-2 items-center mt-4 sm:mt-0">
                    <button class="ml-auto sm:ml-0" color="primary" mat-stroked-button (click)="saveChanges()" [disabled]="!hasChanges">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
        <br>
    `,
})
export class PriceDetailsListComponent implements OnInit, OnChanges {
    abcForms: any;
    @Input() priceDetails: PriceDetail[] = [];
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();
    @Output() saveEvent = new EventEmitter<any[]>();
    @Input() priceId: string | null = null;
    private originalDetail: PriceDetail[] = [];
    public hasChanges: boolean = false;
    constructor() {}

    ngOnInit() {
        this.abcForms = abcForms;


    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['priceDetails'] && changes['priceDetails'].currentValue) {


            // Solo asignar si el array tiene datos
            if (changes['priceDetails'].currentValue.length > 0) {
                this.originalDetail = JSON.parse(JSON.stringify(changes['priceDetails'].currentValue));

            } else {

            }
        }

        if (changes['priceId'] && !changes['priceId'].firstChange) {

        }

        // Solo ejecutar onUnitPriceChange si los datos han llegado
        if (this.priceDetails && this.priceDetails.length > 0) {
            setTimeout(() => {
                this.onUnitPriceChange(this.priceDetails[0]); // Verifica el primer elemento como prueba
            });
        }
    }
    onUnitPriceChange(PriceDetail: any): void {
        if (!PriceDetail) {
            console.warn('PriceDetail es undefined o null, no se puede procesar.');
            return;
        }



        if (!this.priceDetails || !this.originalDetail || this.priceDetails.length !== this.originalDetail.length) {
            console.warn('Los datos de priceDetails u originalDetail no están bien sincronizados.');
            return;
        }

        this.hasChanges = this.priceDetails.some((PriceDetail, index) => {
            const original = this.originalDetail[index];

            if (!original) {
                console.warn(`El índice ${index} en originalDetail es undefined.`);
                return false;
            }

            return PriceDetail.unitPrice !== original.unitPrice;
        });
    }


    saveChanges(): void {
        // Comparar el estado actual con el original para identificar los cambios
        const changedData = this.priceDetails.filter((PriceDetail, index) => {
            const original = this.originalDetail[index];
            return original.unitPrice !== PriceDetail.unitPrice; // Detecta cambios en el precio unitario
        });

        // Formatear solo los datos que cambiaron
        const formattedData = changedData.map((PriceDetail) => ({
            priceId: this.priceId || null,
            productAccountingDynamicId: PriceDetail.productAccountingDynamicId,
            productPresentationId: PriceDetail.productPresentationId,
            priceDetailId: PriceDetail.priceDetailId || null,
            unitPrice: PriceDetail.unitPrice,
            active: true,
        }));


        this.saveEvent.emit(formattedData); // Emitir solo los datos cambiados

        // Reiniciar el estado de cambios
        this.originalDetail = JSON.parse(JSON.stringify(this.priceDetails));
        this.hasChanges = false; // Reinicia el estado de cambios
    }
}
