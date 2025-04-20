import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import {Inventory, TotalCost} from '../../models/inventories';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import {ProfitabilitySummary} from "../../../../reports/profitability/models/profitability";
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
    selector: 'app-inventory-list',
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
                    <th class="w-1/9 table-header text-center border-r">Almacén</th>
                    <th class="w-1/9 table-header text-center border-r">Producto</th>
                    <th class="w-1/9 table-header text-center border-r">Tipo de Operación</th>
                    <th class="w-1/9 table-header text-center border-r">Cantidad Entrante</th>
                    <th class="w-1/9 table-header text-center border-r">Cantidad saliente</th>
                    <th class="w-1/9 table-header text-center border-r">Cantidad Disponible</th>
                    <th class="w-1/9 table-header text-center border-r">Cantidad Reservada</th>
                    <th class="w-1/9 table-header text-center border-r">Costo Por Unidad</th>
                    <th class="w-1/9 table-header text-center border-r">Coste Total</th>
                    <!--<th class="w-1/9 table-header text-center border-r">Fecha Creación</th>
                    <th class="w-1/9 table-header text-center border-r">Fecha Actualización</th>-->
                    <th class="w-1/9 table-header text-center border-r">Acciones</th>
                </tr>
                </thead>
                <tbody class="bg-white">
                    @for (inventory of inventories; track inventory.id; let idx = $index) {
                        <tr class="hover:bg-gray-100">
                            <td class="w-1/9 p-2 text-center border-b">
                                {{ idx + 1 }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ inventory.store?.name }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ inventory.product?.name }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ translateOperationType(inventory.operationType) }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ inventory.incomingQuantity }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ inventory.outgoingQuantity }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ inventory.availableQuantity }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ inventory.reservedQuantity }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ inventory.unitCost }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ inventory.totalCost }}
                            </td>

                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="flex justify-center space-x-3">
                                    <mat-icon
                                        matTooltip="Eliminar Inventario"
                                        matTooltipPosition="above"
                                        (click)="goDelete(inventory.id)"
                                        class="text-rose-500 hover:text-rose-600 cursor-pointer">
                                        delete_sweep
                                    </mat-icon>
                                </div>
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
                <tfoot *ngIf="profitabilitySummaries as summary">
                <tr class="bg-gray-200 font-bold text-center">
                    <td colspan="9">📊 Resumen de Costo Total</td>
                    <td>S/ {{ summary.totalCost }}</td>
                    <td></td>

                </tr>
                </tfoot>
            </table>
        </div>
        <br>
    `,
})
export class InventoriesListComponent implements OnInit {
    abcForms: any;
    @Input() inventories: Inventory[] = [];
    @Output() eventEdit = new EventEmitter<string>();
    @Input() profitabilitySummaries: TotalCost = {} as TotalCost;
    @Output() eventDelete = new EventEmitter<string>();
    constructor() {}

    translations: { [key: string]: string } = {
        INCOMING: 'Entrada',
        OUTGOING: 'Salida',
        TRANSFER: 'Transferencia',
    };

    ngOnInit() {
        this.abcForms = abcForms;
    }

    public goDelete(id:string) {
        this.eventDelete.emit(id);
    }

    translateOperationType(type: string): string {
        return this.translations[type] || type; // Devuelve la traducción o el valor original si no hay traducción
    }
}
