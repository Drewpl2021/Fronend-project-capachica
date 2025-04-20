import {Component, OnInit} from '@angular/core';
import {Prices, PricesFilter, PaginatedResponse} from '../models/prices';
import {PricesListComponent} from '../components/list/prices-list.component';
import {MatDialog} from '@angular/material/dialog';
import {PricesNewComponent} from '../components/form/prices-new.component';

import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {PricesFilterComponent} from "../components/filter/prices-filter.component";
import {PricesEditComponent} from "../components/form/prices-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {PricesService} from "../../../../../providers/services/sales/prices.service";


@Component({
    selector: 'app-price-container',
    standalone: true,
    imports: [PricesListComponent,
        PaginationControlsComponent, PricesFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-price-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-price-filter>

            <app-price-list
                class="w-full"
                [prices]="prices"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-price-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class PricesContainersComponent implements OnInit {
    public error: string = '';
    public prices: Prices[] = [];
    public paginationEvent = new PaginationEvent();
    public pricesFilter: PricesFilter;

    public unitMeasurement = new Prices();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _pricesService: PricesService,
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

    public eventFilter(pricesFilter: PricesFilter): void {
        this.pricesFilter = pricesFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.pricesFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getPrecios(mergedData);
    }

    private getPrecios(data?: any): void {
        this._pricesService.getWithSearch$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.prices = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const pricesForm = this._matDialog.open(PricesNewComponent);
            pricesForm.componentInstance.title = 'Nuevo Precio' || null;

            pricesForm.afterClosed().subscribe((result: any) => {
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
        this._pricesService.add$(data).subscribe((response) => {
            if (response) {
                this.getPrecios();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string): void {
        this._pricesService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const pricesForm = this._matDialog.open(PricesEditComponent);
            pricesForm.componentInstance.title = 'Editar Precio' || null;
            pricesForm.componentInstance.unitMeasurement = this.unitMeasurement;

            pricesForm.afterClosed().subscribe((result: any) => {
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
            this._pricesService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getPrecios();
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: Prices) {
        this._pricesService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getPrecios();
            }
        });
    }
}
