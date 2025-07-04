import {Component, OnInit} from '@angular/core';
import {PaymentListComponent} from '../components/list/payment-list.component';
import {MatDialog} from '@angular/material/dialog';
import {PaymentNewComponent} from '../components/form/payment-new.component';

import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {PaymentFilterComponent} from "../components/filter/payment-filter.component";
import {PaymentEditComponent} from "../components/form/payment-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import { PaginatedResponse, Payment, PaymentFilter } from '../models/payment';
import { PaymentService } from 'app/providers/services/sales/payment.service';


@Component({
    selector: 'app-payment-container',
    standalone: true,
    imports: [PaymentListComponent,
        PaginationControlsComponent, PaymentFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-payment-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-payment-filter>

            <app-payment-list
                class="w-full"
                [categories]="categories"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-payment-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class PaymentContainersComponent implements OnInit {
    public error: string = '';
    public categories: Payment[] = [];
    public paginationEvent = new PaginationEvent();
    public categoryFilter: PaymentFilter;
    public unitMeasurement = new Payment();

    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _categoryService: PaymentService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog
    ) {
    }

    ngOnInit() {
        // this.getCategories();
    }

    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginationEvent = paginationEvent;
        this.mergeFilterAndPagination();
    }

    public eventFilter(categoryFilter: PaymentFilter): void {
        this.categoryFilter = categoryFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.categoryFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getCategories(mergedData);
    }

    private getCategories(data?: any): void {
        this._categoryService.getWithQuery$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.categories = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const categoryForm = this._matDialog.open(PaymentNewComponent);
            categoryForm.componentInstance.title = 'Nueva Categoria' || null;

            categoryForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    // Muestra la confirmación antes de guardar
                    this._confirmDialogService.confirmSave({})
                        .then(() => {
                            this.save(result); // Si el usuario confirma, procede con el guardado
                        })
                }
            });
        }
    }

    private save(data: Object) {
        this._categoryService.add$(data).subscribe((response) => {
            if (response) {
                this.getCategories();
            }
        }, (error) => {
        });
    }
    private currentEditingUnitMeasurement!: Payment;
    public eventEdit(id: string): void {
        this._categoryService.getById$(id).subscribe((response) => {
            console.log('Respuesta backend:', response);
            this.currentEditingUnitMeasurement = response;

            const categoryForm = this._matDialog.open(PaymentEditComponent);
            const dialogComp = categoryForm.componentInstance as PaymentEditComponent;
            (categoryForm.componentInstance as PaymentEditComponent).title = 'Editar Pago';
            (categoryForm.componentInstance as PaymentEditComponent).parentModule = response;


            categoryForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this._confirmDialogService.confirmSave({})
                        .then(() => {
                            this.edit(result);
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
            this._categoryService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getCategories();
                }
            });
        }).catch(() => {
        });
    }

    private edit(updatedData: Payment) {
        this._categoryService.update$(this.currentEditingUnitMeasurement.id, updatedData)
            .subscribe((response) => {
                if (response) {
                    this.getCategories();
                }
            });
    }
}
