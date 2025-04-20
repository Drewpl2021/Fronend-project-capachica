import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule,} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from "@angular/material/select";
import {CommonModule, JsonPipe} from "@angular/common";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SummaryDetail, SummaryDetailSon} from "../../models/payments";
import {PaymentsService} from "../../../../../../providers/services/payments/Payments.service";

@Component({
    selector: 'app-payments-summary-detail-list',
    standalone: true,
    imports: [FormsModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatSelectModule, JsonPipe, CommonModule, MatDatepickerModule],
    template: `
        <div class="p-6 bg-white shadow-lg rounded-lg border border-gray-200 text-center">
            <h1 class="text-3xl font-bold text-gray-900">{{ data.summary.transactionGroup }} - S/ {{ data.summary.totalAmount }}</h1>
            <div class="space-y-4 mt-4">
                @for (detail of summaryDetails; track detail.paymentMethodId; let idx = $index) {
                    <div class="border border-gray-300 rounded-lg shadow-md overflow-hidden">
                        <button class="w-full text-left px-4 py-3 bg-primary-600 text-white font-semibold flex justify-between items-center" (click)="toggleAccordion(idx, detail.paymentMethodId)">
                            <span>{{ detail.paymentMethodName }} - S/ {{ detail.totalAmount }}</span>
                            <span [ngClass]="accordionOpen[idx] ? 'rotate-180' : 'rotate-0'" class="transition-transform">⬇️
                    </span>
                        </button>
                        <div *ngIf="accordionOpen[idx]" class="p-4 bg-gray-100 text-gray-700">
                            <div *ngIf="summaryDetailSons[idx] && summaryDetailSons[idx].length > 0">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                    @for (det of summaryDetailSons[idx]; track det.id) {
                                        <div class="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                                            <p class="text-lg font-bold text-gray-900">{{ det.payment?.nameSocialReason }}</p>
                                            <p class="text-sm text-gray-600"><strong>N° Documento:</strong> {{ det.payment?.documentNumber }}</p>
                                            <p class="text-lg font-semibold text-green-600 mt-2">S/ {{ det.payment?.amount }}</p>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div *ngIf="summaryDetailSons[idx] && summaryDetailSons[idx].length === 0" class="text-gray-500 mt-2 text-center">
                                No hay detalles disponibles.
                            </div>
                        </div>

                    </div>
                }
            </div>
            <div class="mt-6">
                <button (click)="close()" class="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600">
                    Cerrar
                </button>
            </div>
        </div>
    `,
})
export class PaymentsSummaryDetailListComponent implements OnInit {
    @Input() title: string = '';
    public accordionOpen: boolean[] = [];
    public summaryDetails: SummaryDetail[] = [];
    public summaryDetailSons: SummaryDetailSon[] = [];

    constructor(
        public dialogRef: MatDialogRef<PaymentsSummaryDetailListComponent>,
        private _paymentsService: PaymentsService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.accordionOpen = new Array(this.summaryDetails.length).fill(false);

    }
    ngOnInit(): void {
        this.uploadData();
    }
    private uploadData() {
        if (!this.data?.summary || !this.data?.paymentsFilter) return;
        const params = {
            operationTypeId: this.data.summary.operationTypeId,
            storeId: this.data.paymentsFilter.storeId,
            startDate: this.data.paymentsFilter.startDate,
            endDate: this.data.paymentsFilter.endDate,
            transactionStatus: this.data.summary.transactionStatus
        };
        this._paymentsService.getWithSummaryDetail$(params).subscribe((data) => {
            this.summaryDetails = data || [];
            this.accordionOpen = new Array(this.summaryDetails.length).fill(false);
        });
    }
    private loadDetailsData(index: number, paymentMethodId: string) {
        if (!this.data?.summary || !this.data?.paymentsFilter || this.summaryDetailSons[index]) return;
        const params = {
            paymentMethodId: paymentMethodId,
            transactionStatus: this.data.summary.transactionStatus,
            storeId: this.data.paymentsFilter.storeId,
            startDate: this.data.paymentsFilter.startDate,
            endDate: this.data.paymentsFilter.endDate
        };
        this._paymentsService.getPaymentMethodDetails$(params).subscribe((data) => {
            this.summaryDetailSons[index] = data || [];
        });
    }
    toggleAccordion(index: number, paymentMethodId: string): void {
        this.accordionOpen[index] = !this.accordionOpen[index];

        if (this.accordionOpen[index] && !this.summaryDetailSons[index]) {
            this.loadDetailsData(index, paymentMethodId);
        }
    }
    close(): void {
        this.dialogRef.close();
    }
}
