import {Component, OnInit} from '@angular/core';
import {UnitMeasurent, Category, ProductFilter, PaginatedResponse, Product} from '../models/product';
import {BarCodeListCardComponent} from '../components/list/barCode-list-card.component';
import {MatDialog} from '@angular/material/dialog';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {BarCodeFilterComponent} from "../components/filter/barCode-filter.component";
import {BarCodePrintComponent} from "../components/form/barCode-print.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {ProductService} from "../../../../../providers/services/catalog/product.service";
import {NgIf} from "@angular/common";
import {BarCodeListTableComponent} from "../components/list/barCode-list-table.component";
import {ProductDynamicService} from "../../../../../providers/services/catalog/product-dynamic.service";

@Component({
    selector: 'app-bar-code-container',
    standalone: true,
    imports: [BarCodeListCardComponent,
        PaginationControlsComponent, NgIf, BarCodeListCardComponent,BarCodeFilterComponent,BarCodeListTableComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <app-bar-code-filter
                (eventFilter)="eventFilter($event)"
                (eventChangeView)="onViewModeChange($event)">
            </app-bar-code-filter>
            <app-bar-code-list-card
                *ngIf="viewMode === 1"
                class="w-full"
                [products]="products"
            ></app-bar-code-list-card>
            <app-bar-code-list-table
                *ngIf="viewMode === 2"
                class="w-full"
                [products]="products"
            ></app-bar-code-list-table>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>

        </div>
    `,
})
export class BarCodeContainersComponent implements OnInit {
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
        private _productService: ProductDynamicService,
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
        this._productService.getWithSearch$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.products = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

}
