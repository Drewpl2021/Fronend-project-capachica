import {Component, OnInit} from '@angular/core';
import {PaymentsType, PaymentsTypeFilter, PaginatedResponse} from '../models/payments-type';
import {PaymentsTypeListComponent} from '../components/list/payments-type-list.component';
import {MatDialog} from '@angular/material/dialog';
import {PaymentsTypeNewComponent} from '../components/form/payments-type-new.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {PaymentsTypeFilterComponent} from "../components/filter/payments-type-filter.component";
import {PaymentsTypeEditComponent} from "../components/form/payments-type-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {PaymentsTypeService} from "../../../../../providers/services/payments/PaymentsType.service";


@Component({
    selector: 'app-payments-type-container',
    standalone: true,
    imports: [PaymentsTypeListComponent,
        PaginationControlsComponent, PaymentsTypeFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-payments-type-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-payments-type-filter>

            <app-payments-type-list
                class="w-full"
                [paymentsTypes]="paymentsTypes"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-payments-type-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class PaymentsTypeContainersComponent implements OnInit {
    public error: string = '';
    public paymentsTypes: PaymentsType[] = [];
    public paginationEvent = new PaginationEvent();
    public paymentsTypeFilter: PaymentsTypeFilter;

    public paymentsType = new PaymentsType();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _paymentsTypeService: PaymentsTypeService,
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

    public eventFilter(paymentsTypeFilter: PaymentsTypeFilter): void {
        this.paymentsTypeFilter = paymentsTypeFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.paymentsTypeFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getPaymentType(mergedData);
    }

    private getPaymentType(data?: any): void {
        this._paymentsTypeService.getWithSearch$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.paymentsTypes = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const paymentTypeForm = this._matDialog.open(PaymentsTypeNewComponent);
            paymentTypeForm.componentInstance.title = 'Nuevo Tipo de Pago' || null;

            paymentTypeForm.afterClosed().subscribe((result: any) => {
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
        this._paymentsTypeService.add$(data).subscribe((response) => {
            if (response) {
                this.getPaymentType();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string): void {
        this._paymentsTypeService.getById$(id).subscribe((response) => {
            this.paymentsType = response;
            const paymentTypeForm = this._matDialog.open(PaymentsTypeEditComponent);
            paymentTypeForm.componentInstance.title = 'Editar Tipo de Pago' || null;
            paymentTypeForm.componentInstance.paymentsType = this.paymentsType;

            paymentTypeForm.afterClosed().subscribe((result: any) => {
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
            this._paymentsTypeService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getPaymentType();
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: PaymentsType) {
        this._paymentsTypeService.update$(this.paymentsType.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getPaymentType();
            }
        });
    }
}
