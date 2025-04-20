import {Component, OnInit} from '@angular/core';
import {UnitMeasurent, Category, ProductFilter, PaginatedResponse, Product} from '../models/product';
import {ProductListCardComponent} from '../components/list/product-list-card.component';
import {MatDialog} from '@angular/material/dialog';
import {ProductNewComponent} from '../components/form/product-new.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {ProductFilterComponent} from "../components/filter/product-filter.component";
import {ProductEditComponent} from "../components/form/product-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {ProductService} from "../../../../../providers/services/catalog/product.service";
import {ProductListTableComponent} from "../components/list/product-list-table.component";
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-product-container',
    standalone: true,
    imports: [ProductListCardComponent,
        PaginationControlsComponent, ProductFilterComponent,ProductListTableComponent,CommonModule],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <app-product-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)"
                (eventChangeView)="onViewModeChange($event)">
            </app-product-filter>
            <app-product-list-card
                *ngIf="viewMode === 1"
                class="w-full"
                [products]="products"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-product-list-card>
            <app-product-list-table
                *ngIf="viewMode === 2"
                class="w-full"
                [products]="products"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-product-list-table>

            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>

        </div>
    `,
})
export class ProductContainersComponent implements OnInit {
    public error: string = '';
    public products: Product[] = [];
    public paginationEvent = new PaginationEvent();
    public productsFilters: ProductFilter;
    public areas: Category[] = [];
    public accoutingPlan: UnitMeasurent[] = [];
    public viewMode: number = 1;

    public unitMeasurement = new Product();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _productService: ProductService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog,

    ) {
    }

    ngOnInit() {
    }
    public onViewModeChange(viewMode: number) {
        this.viewMode = viewMode
    }
    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginationEvent = paginationEvent;
        this.mergeFilterAndPagination();
    }

    public eventFilter(productFilters: ProductFilter): void {
        this.productsFilters = productFilters;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.productsFilters,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getProduct(mergedData);
    }

    private getProduct(data?: any): void {
        this._productService.getWithQuery$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.products = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const productForm = this._matDialog.open(ProductNewComponent);
            productForm.componentInstance.title = 'Nuevo Producto' || null;

            productForm.afterClosed().subscribe((result: any) => {
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
        this._productService.add$(data).subscribe((response) => {
            if (response) {
                this.getProduct();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string): void {
        this._productService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const productForm = this._matDialog.open(ProductEditComponent);
            productForm.componentInstance.title = 'Editar Producto' || null;
            productForm.componentInstance.product = this.unitMeasurement;

            productForm.afterClosed().subscribe((result: any) => {
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

    private edit(UnitMeasurement: Product) {
        this._productService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getProduct();
            }
        });
    }

    public eventDelete(id: string) {
        this._confirmDialogService.confirmDelete(
            {
                // title: 'Confirmación Personalizada',
                // message: `¿Quieres proceder con esta acción ${}?`,
            }
        ).then(() => {
            this._productService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getProduct();
                }
            });
        }).catch(() => {
        });
    }
}
