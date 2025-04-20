import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import { Profitability, ProfitabilitySummary} from '../../models/profitability';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
@Component({
    selector: 'app-profitability-list',
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
        DatePipe
    ],
    template: `
        <br>
        <div class="table-container">
            <table class="custom-table">
                <thead>
                <tr class="bg-primary-600 text-white">
                    <th class="w-1/9 table-head text-center border-r">#</th>
                    <th class="w-1/9 table-header text-center border-r">Serie</th>
                    <th class="w-1/9 table-header text-center border-r">N. Comprobante</th>
                    <th class="w-1/9 table-header text-center border-r">P. Compra</th>
                    <th class="w-1/9 table-header text-center border-r">P. Venta</th>
                    <th class="w-1/9 table-header text-center border-r">Ganancia/U</th>
                    <th class="w-1/9 table-header text-center border-r">Cantidad</th>
                    <th class="w-1/9 table-header text-center border-r">Total Compra</th>
                    <th class="w-1/9 table-header text-center border-r">Total Venta</th>
                    <th class="w-1/9 table-header text-center border-r">Ganancia</th>
                    <th class="w-1/9 table-header text-center border-r">% Rentabilidad</th>
                </tr>
                </thead>
                <tbody class="bg-white">
                    @for (profitability of profitabilities; track profitability.id; let idx = $index) {
                        <tr class="hover:bg-gray-100">
                            <td class="w-1/9 p-2 text-center border-b">{{ idx + 1 }}</td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ profitability.warehouseMovementDetail?.warehouseMovement?.series }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ profitability.warehouseMovementDetail?.warehouseMovement?.number }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ profitability.purchasePrice }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ profitability.salePrice }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ profitability.profitPerUnit }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ profitability.quantity }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ profitability.totalPricePurchase }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ profitability.totalPriceSale }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ profitability.totalProfit }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ profitability.profitabilityPercentage }}
                            </td>
                        </tr>
                    } @empty {
                        <tr>
                            <td colspan="11" class="text-center">Sin Contenido</td>
                        </tr>
                    }
                </tbody>

                <!-- 🔥 Resumen ubicado correctamente en el \`tfoot\` -->
                <tfoot *ngIf="profitabilitySummaries as summary">
                <tr class="bg-gray-200 font-bold text-center">
                    <td colspan="6">📊 Resumen de Rentabilidad</td>
                    <td>{{ summary.quantity_total }}</td>
                    <td>S/ {{ summary.total_price_purchase_total }}</td>
                    <td>S/ {{ summary.total_price_sale_total }}</td>
                    <td>S/ {{ summary.total_profit_total }}</td>
                    <td>{{ summary.profitability_percentage_avg }}%</td>
                </tr>
                </tfoot>
            </table>
        </div>

        <br>
    `,
})
export class ProfitabilityListComponent implements OnInit {
    abcForms: any;
    @Input() profitabilities: Profitability[] = [];
    @Input() profitabilitySummaries: ProfitabilitySummary = {} as ProfitabilitySummary;
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();
    constructor() {
    }
    ngOnInit() {
        this.abcForms = abcForms;
    }

}
