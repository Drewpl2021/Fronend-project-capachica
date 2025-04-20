import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import {Payments, PaymentsFilter, Summary} from '../../models/payments';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import {MatDialog} from "@angular/material/dialog";
import {PaymentsSummaryDetailListComponent} from "./payments-summary-detail-list.component";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-payments-list-table',
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
        <div class="table-container">
            <table class="custom-table">
                <thead>
                <tr class="bg-primary-600 text-white">
                    <th class="w-1/9 table-head text-center border-r">#</th>
                    <th class="w-1/9 table-header text-center border-r">T. Oper.</th>
                    <th class="w-1/9 table-header text-center border-r">Razon Social</th>
                    <th class="w-1/9 table-header text-center border-r">N° de Doc.</th>
                    <th class="w-1/9 table-header text-center border-r">Serie R.</th>
                    <th class="w-1/9 table-header text-center border-r">N° R.</th>
                    <th class="w-1/9 table-header text-center border-r">Serie</th>
                    <th class="w-1/9 table-header text-center border-r">N° Pago</th>
                    <th class="w-1/9 table-header text-center border-r">Monto</th>
                    <th class="w-1/9 table-header text-center border-r">Fecha Creación</th>
                    <th class="w-1/9 table-header text-center border-r">Acciones</th>
                </tr>
                </thead>
                <tbody class="bg-white">
                    @for (payment of payments; track payment.id; let idx = $index) {
                        <tr class="hover:bg-gray-100">
                            <td class="w-1/9 p-2 text-center border-b">
                                {{ idx + 1 }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ payment.operationType?.name }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ payment.nameSocialReason }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ payment.documentNumber }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ payment.relatedSeries }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ payment.relatedNumber }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ payment.series }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ payment.paymentNumber }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ payment.amount }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ payment.createdAt | date:'dd/MM/yyyy HH:mm:ss' }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="flex justify-center space-x-3">
                                    <mat-icon
                                        matTooltip="Editar Pago"
                                        matTooltipClass="tooltip-amber"
                                        matTooltipPosition="above"
                                        [matTooltipDisabled]
                                        class="text-amber-400 hover:text-amber-500 cursor-pointer"
                                        (click)="goEdit(payment.id)">edit
                                    </mat-icon>
                                    <mat-icon
                                        matTooltip="Eliminar Pago"
                                        matTooltipClass="tooltip-red"
                                        matTooltipPosition="above"
                                        [matTooltipDisabled]
                                        class="text-rose-500 hover:text-rose-600 cursor-pointer"
                                        (click)="goDelete(payment.id)">delete_sweep
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
            </table>
        </div>
        <br>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            @for (summary of summaries; track summary.name; let idx = $index) {
                <div class="bg-white shadow-lg rounded-lg border border-gray-200 text-center cursor-pointer hover:shadow-xl transition"
                     (click)="openModal(summary)">
                    <h2 class="text-xl font-semibold text-gray-900 mt-2">{{ summary.name }}</h2>
                    <p class="text-sm text-gray-600 mt-1"><strong>Grupo:</strong> {{ summary.transactionGroup }}</p>
                    <p class="text-lg font-bold text-green-600 mt-2">S/ {{ summary.totalAmount }}</p>
                </div>
            }
        </div>

    `,
})
export class PaymentsListTableComponent implements OnInit {
    abcForms: any;
    @Input() payments: Payments[] = [];
    @Input() summaries: Summary[] = [];
    @Input() paymentsFilter : PaymentsFilter[] = [];
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();
    constructor(
        private _matDialog: MatDialog
    ) {}

    ngOnInit() {
        this.abcForms = abcForms;
    }
    public goEdit(id: string) {
        this.eventEdit.emit(id);
    }
    public goDelete(id:string) {
        this.eventDelete.emit(id);
    }
    public openModal(summary: any): void {
        const dialogRef = this._matDialog.open(PaymentsSummaryDetailListComponent, {
            width: '600px',
            data: {
                summary: summary, // Enviamos el objeto `summary`
                paymentsFilter: this.paymentsFilter // Enviamos `paymentsFilter`
            }
        });
    }

}
