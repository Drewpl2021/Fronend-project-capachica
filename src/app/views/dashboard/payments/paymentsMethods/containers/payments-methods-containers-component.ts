import {Component, OnInit} from '@angular/core';
import {PaymentMethods, PaymentMethodsFilter, PaginatedResponse} from '../models/payments-methods';
import {PaymentsMethodsListComponent} from '../components/list/payments-methods-list.component';
import {MatDialog} from '@angular/material/dialog';
import {PaymentsMethodsNewComponent} from '../components/form/payments-methods-new.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {PaymentsMethodsFilterComponent} from "../components/filter/payments-methods-filter.component";
import {PaymentsMethodsEditComponent} from "../components/form/payments-methods-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {PaymentsMethodsService} from "../../../../../providers/services/payments/PaymentsMethods.service";


@Component({
    selector: 'app-payments-methods-container',
    standalone: true,
    imports: [PaymentsMethodsListComponent,
        PaginationControlsComponent, PaymentsMethodsFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-payments-methods-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-payments-methods-filter>

            <app-payments-methods-list
                class="w-full"
                [paymentMethods]="paymentMethods"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-payments-methods-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class PaymentsMethodsContainersComponent implements OnInit {
    public error: string = '';
    public paymentMethods: PaymentMethods[] = [];
    public paginationEvent = new PaginationEvent();
    public paymentMethodsFilter: PaymentMethodsFilter;

    public unitMeasurement = new PaymentMethods();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _paymentsMethodsService: PaymentsMethodsService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog
    ) {
    }

    ngOnInit() {
    }

    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginationEvent = paginationEvent;
        this.mergeFilterAndPagination();
    }

    public eventFilter(paymentMethodsFilter: PaymentMethodsFilter): void {
        this.paymentMethodsFilter = paymentMethodsFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.paymentMethodsFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getPaymentsMethods(mergedData);
    }

    private getPaymentsMethods(data?: any): void {
        this._paymentsMethodsService.getWithSearch$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.paymentMethods = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const paymentsMethodsForm = this._matDialog.open(PaymentsMethodsNewComponent);
            paymentsMethodsForm.componentInstance.title = 'Nuevo Método de Pago' || null;

            paymentsMethodsForm.afterClosed().subscribe((result: any) => {
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
        this._paymentsMethodsService.add$(data).subscribe((response) => {
            if (response) {
                this.getPaymentsMethods();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string): void {
        this._paymentsMethodsService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const paymentsMethodsForm = this._matDialog.open(PaymentsMethodsEditComponent);
            paymentsMethodsForm.componentInstance.title = 'Editar Método de Pago' || null;
            paymentsMethodsForm.componentInstance.unitMeasurement = this.unitMeasurement;

            paymentsMethodsForm.afterClosed().subscribe((result: any) => {
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
            this._paymentsMethodsService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getPaymentsMethods();
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: PaymentMethods) {
        this._paymentsMethodsService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getPaymentsMethods();
            }
        });
    }
}
