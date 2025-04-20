import {Component, OnInit} from '@angular/core';
import {Category, CategoryFilter, PaginatedResponse} from '../models/warehouse';
import {PurchasesListComponent} from '../components/list/warehouse-list.component';
import {MatDialog} from '@angular/material/dialog';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {WarehouseFilterComponent} from "../components/filter/warehouse-filter.component";
import {WarehouseEditComponent} from "../components/form/warehouse-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {CategoryService} from "../../../../../providers/services/catalog/category.service";
import {ActivatedRoute, Router} from "@angular/router";
import {WarehouseService} from "../../../../../providers/services/warehouseMovement/warehouse.service";
import {SaleFilter} from "../../../sales/sales/models/sales";
import {format} from "date-fns";


@Component({
    selector: 'app-warehouse-container',
    standalone: true,
    imports: [PurchasesListComponent,
        PaginationControlsComponent, WarehouseFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-warehouse-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-warehouse-filter>

            <app-warehouse-list
                class="w-full"
                [categories]="categories"
                (eventEdit)="eventEdits($event)"
                (eventDelete)="eventDelete($event)"
            ></app-warehouse-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class WarehouseContainersComponent implements OnInit {
    public error: string = '';
    public categories: Category[] = [];
    public paginationEvent = new PaginationEvent();
    public categoryFilter: CategoryFilter;

    public unitMeasurement = new Category();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;
    private firstLoad = true;

    constructor(
        private _categoryService: WarehouseService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        // this.getCategories();
    }

    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginationEvent = paginationEvent;
        this.mergeFilterAndPagination();
    }

    public eventFilter(saleFilter: SaleFilter): void {
        this.categoryFilter = saleFilter;
        this.firstLoad = false;
        this.mergeFilterAndPagination();
    }
    private mergeFilterAndPagination(): void {
        const today = format(new Date(), 'yyyy-MM-dd');

        const mergedData = {
            ...this.categoryFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size,
            ...(this.firstLoad ? { startDate: today, endDate: today } : {}) // 🔥 Solo en la primera carga
        };

        this.getCategories(mergedData);
    }

    private getCategories(data?: any): void {
        this._categoryService.getWithFilter$(data).subscribe(
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
            // Navega usando el contexto de la ruta actual
            this.router.navigate(['nueva-categoria'], { relativeTo: this.route }).then((success) => {
                if (success) {

                } else {

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

    public eventEdits(id: string): void {
        if (id) {
            this.router.navigate([`editar-categoria/${id}`], { relativeTo: this.route }).then((success) => {
            });
        }
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

    private edit(UnitMeasurement: Category) {
        this._categoryService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getCategories();
            }
        });
    }
}
