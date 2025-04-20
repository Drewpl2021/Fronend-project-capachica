import {Component, OnInit} from '@angular/core';
import {Payments, PaymentsFilter, PaginatedResponse, Summary} from '../models/payments';
import {PaymentsListTableComponent} from '../components/list/payments-list-table.component';
import {MatDialog} from '@angular/material/dialog';
import {PaymentsNewComponent} from '../components/form/payments-new.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {PaymentsFilterComponent} from "../components/filter/payments-filter.component";
import {PaymentsEditComponent} from "../components/form/payments-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {PaymentsService} from "../../../../../providers/services/payments/Payments.service";
import {format} from "date-fns";
import { firstValueFrom } from 'rxjs';
import {SerialFlows} from "../../../sales/sales/models/sales";
import {SerialFlowsService} from "../../../../../providers/services/catalog/serial-flows.service";


@Component({
    selector: 'app-payments-container',
    standalone: true,
    imports: [PaymentsListTableComponent,
        PaginationControlsComponent, PaymentsFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-payments-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-payments-filter>
            <app-payments-list-table
                class="w-full"
                [payments]="payments"
                [summaries]="summaries"
                [paymentsFilter]="paymentsFilter"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-payments-list-table>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class PaymentsContainersComponent implements OnInit {
    public error: string = '';
    public payments: Payments[] = [];
    public summaries: Summary[] = [];
    public serialFlows: SerialFlows[] = [];
    public paginationEvent = new PaginationEvent();
    public paymentsFilter: PaymentsFilter;
    private firstLoad = true;
    public unitMeasurement = new Payments();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _paymentsService: PaymentsService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog,
        private _serialFlowsService: SerialFlowsService,

    ) {
    }

    ngOnInit() {
        // this.getPayments();
    }

    private async uploadData(): Promise<void> {
        try {
            const data = await firstValueFrom(this._serialFlowsService.getAll$());
            this.serialFlows = data?.content || [];
            const storeId = this.serialFlows.length > 0 ? this.serialFlows[0].store?.id : null;
            if (storeId) {
                this.paymentsFilter = { ...this.paymentsFilter, storeId }; // Guardamos el storeId
            }
        } catch (error) {
            console.error('Error obteniendo Store ID:', error);
        }
    }


    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginationEvent = paginationEvent;
        this.mergeFilterAndPagination();
    }

    public eventFilter(paymentsFilter: PaymentsFilter): void {
        this.paymentsFilter = paymentsFilter;
        this.firstLoad = false;
        this.mergeFilterAndPagination();
        this.mergeFilterWithoutPagination();
    }

    private async mergeFilterAndPagination(): Promise<void> {
        const today = format(new Date(), 'yyyy-MM-dd');
        if (!this.paymentsFilter?.storeId) {
            await this.uploadData();
        }
        const mergedData = {
            ...this.paymentsFilter,
            page: this.paginationEvent.page ?? 0,
            size: this.paginationEvent.size ?? this.size,
            ...(this.firstLoad ? { startDate: today, endDate: today } : {})
        };
        this.getPayments(mergedData);
    }
    private async mergeFilterWithoutPagination(): Promise<void> {
        const today = format(new Date(), 'yyyy-MM-dd');

        // Si `storeId` aún no está definido, lo obtenemos primero
        if (!this.paymentsFilter?.storeId) {
            await this.uploadData();
        }

        const mergedData = {
            ...this.paymentsFilter,
            ...(this.firstLoad ? { startDate: today, endDate: today } : {})
        };
        this.getPaymentsSummary(mergedData);
    }

    private getPayments(data?: any): void {
        this._paymentsService.getWithFilter$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.payments = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );

    }
    private getPaymentsSummary(data?: any): void {
        this._paymentsService.getWithSummary$(data).subscribe((data) => {
                this.summaries = data|| [];
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const paymentsForm = this._matDialog.open(PaymentsNewComponent);
            paymentsForm.componentInstance.title = 'Nuevo Pago' || null;

            paymentsForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    // Muestra la confirmación antes de guardar
                    this._confirmDialogService.confirmSave({})
                        .then(() => {
                            this.save(result); // Si el usuario confirma, procede con el guardado
                        });
                }
            });
        }
    }


    private save(data: Object) {
        this._paymentsService.add$(data).subscribe((response) => {
            if (response) {
                this.getPayments();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string): void {
        this._paymentsService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const paymentsForm = this._matDialog.open(PaymentsEditComponent);
            paymentsForm.componentInstance.title = 'Editar Pago' || null;
            paymentsForm.componentInstance.payments = this.unitMeasurement;

            paymentsForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    // Muestra la confirmación antes de editar
                    this._confirmDialogService.confirmSave({})
                        .then(() => {
                            this.edit(result); // Si el usuario confirma, procede con la edición
                        });
                }
            });
        });
    }

    public eventDelete(id: string) {
        this._confirmDialogService.confirmDelete(
            {
                // title: 'Confirmación Personalizada',
                // message: `¿Quieres proceder con esta acción ${}?`,
            }
        ).then(() => {
            this._paymentsService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getPayments();
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: Payments) {
        this._paymentsService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getPayments();
            }
        });
    }

}
