import {Component, OnInit} from '@angular/core';
import {PriceDetail, PriceDetailFilter, PaginatedResponse} from '../models/price-details';
import {PriceDetailsListComponent} from '../components/list/price-details-list.component';
import {MatDialog} from '@angular/material/dialog';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {PriceDetailsFilterComponent} from "../components/filter/price-details-filter.component";
import {PriceDetailsEditComponent} from "../components/form/price-details-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {PricesDetailsService} from "../../../../../providers/services/sales/prices-details.service";
import {CommonModule} from "@angular/common";


@Component({
    selector: 'app-price-details-container',
    standalone: true,
    imports: [
        PriceDetailsListComponent,
        PaginationControlsComponent,
        PriceDetailsFilterComponent,
        CommonModule],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-price-details-filter
                (eventFilter)="eventFilter($event)"
                (eventVisualize)="visualizePriceDetail($event)">
            </app-price-details-filter>

            <ng-container *ngIf="showTable">
                <app-price-details-list
                    class="w-full"
                    [priceDetails]="priceDetails"
                    [priceId]="priceId"
                    (eventEdit)="eventEdit($event)"
                    (eventDelete)="eventDelete($event)"
                    (saveEvent)="onSaveChanges($event)">
                </app-price-details-list>

                <pagination-controls
                    [totalItems]="paginatedResponse.totalElements"
                    [itemsPerPage]="size"
                    [currentPage]="paginatedResponse.currentPage"
                    (paginationChange)="paginationChange($event)">
                </pagination-controls>
            </ng-container>
        </div>
    `,
})
export class PriceDetailsContainersComponent implements OnInit {
    public error: string = '';
    public priceDetails: PriceDetail[] = [];
    public paginationEvent = new PaginationEvent();
    public priceDetailFilter: PriceDetailFilter;
    public showTable: boolean = false; // Inicialmente la tabla no se muestra
    private currentFilters: any = {}; // Guardará los últimos filtros utilizados
    public priceId: string | null = null;
    public unitMeasurement = new PriceDetail();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    public size = 10;
    public refreshKey: number = 0; // Clave para forzar el refresco

    constructor(
        private _pricesDetailsService: PricesDetailsService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog
    ) {
    }

    ngOnInit() {
    }

    public paginationChange(paginationEvent: PaginationEvent): void {
        const totalPages = Math.ceil(this.paginatedResponse.totalElements / this.size);

        if (paginationEvent.page >= totalPages) {
            console.warn('Intentando acceder a una página fuera de rango.');
            return; // No hagas nada si la página está fuera de rango
        }
        this.currentFilters.page = paginationEvent.page;
        this.currentFilters.size = paginationEvent.size;
        this.getPriceDetail(this.currentFilters);
    }


    public eventFilter(detailFilter: PriceDetailFilter): void {
        this.priceDetailFilter = detailFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const totalPages = Math.ceil(this.paginatedResponse.totalElements / this.size);

        if (this.paginationEvent.page >= totalPages) {
            console.warn('Intentando acceder a una página fuera de rango.');
            return;
        }

        const mergedData = {
            ...this.currentFilters,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size,
        };

        this.visualizePriceDetail(mergedData);
    }

    private getPriceDetail(filters: any = {}): void {
        const params = {
            storeId: filters.storeId || '',
            categoryId: filters.categoryId || '',
            priceId: filters.priceId || '',
            searchTerm: filters.searchTerm || '',
            page: filters.page ?? (this.paginatedResponse.currentPage || 0),
            size: filters.size || this.size,
        };

        this._pricesDetailsService.getWithSearchs$(params).subscribe(
            (response) => {
                if (response && response.content) {
                    this.paginatedResponse = {
                        content: response.content,
                        totalPages: Math.ceil(response.totalElements / this.size), // Calcula las páginas totales
                        currentPage: response.currentPage,
                        totalElements: response.totalElements,
                    };
                    this.priceDetails = response.content;
                    this.showTable = true; // Muestra la tabla si hay datos
                } else {
                    this.paginatedResponse = {
                        content: [],
                        totalPages: 0,
                        currentPage: 0,
                        totalElements: 0,
                    };
                    this.priceDetails = [];
                    this.showTable = false; // Oculta la tabla si no hay datos
                }
            },
        );
    }



    public visualizePriceDetail(filters: any): void {
        // Actualiza los filtros actuales
        this.currentFilters = {
            ...this.currentFilters,
            ...filters,
        };
        this.priceId = this.currentFilters.priceId || null;

        // Si no hay `priceId`, no cargues datos
        if (!this.priceId) {
            console.warn('No se ha seleccionado un priceId.');
            this.priceDetails = [];
            this.showTable = false;
            return;
        }

        this.paginatedResponse.currentPage = this.currentFilters.page || 0;


        this.getPriceDetail(this.currentFilters);
        this.showTable = true;
    }




    public onSaveChanges(data: any[]): void {

        this._confirmDialogService.confirmSave({

        })
            .then(() => {
                // Si el usuario confirma, realiza la acción de guardado
                this._pricesDetailsService.addBulk$(data).subscribe(
                    (response) => {
                    },

                );
            })
            .catch(() => {
                this.getPriceDetail(this.currentFilters);
            });
    }


    public eventEdit(id: string) {
        this._pricesDetailsService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const priceDetailForm = this._matDialog.open(PriceDetailsEditComponent);
            priceDetailForm.componentInstance.title = 'Editar Precio Detalle' || null;
            priceDetailForm.componentInstance.unitMeasurement = this.unitMeasurement;

            priceDetailForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.edit(result);
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
            this._pricesDetailsService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getPriceDetail(this.currentFilters);
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: PriceDetail) {
        this._pricesDetailsService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getPriceDetail(this.currentFilters);
            }
        });
    }
}
