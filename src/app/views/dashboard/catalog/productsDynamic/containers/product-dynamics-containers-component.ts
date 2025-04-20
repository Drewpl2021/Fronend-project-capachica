import {Component, OnInit} from '@angular/core';
import {ProductDynamic, ProductDynamicFilter, PaginatedResponse, Stores} from '../models/product-dynamics';
import {ProductDynamicsListComponent} from '../components/list/product-dynamics-list.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {ProductDynamicsFilterComponent} from "../components/filter/product-dynamics-filter.component";
import {ProductDynamicService} from "../../../../../providers/services/catalog/product-dynamic.service";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";

@Component({
    selector: 'app-product-dunamics-container',
    standalone: true,
    imports: [ProductDynamicsListComponent,
        PaginationControlsComponent, ProductDynamicsFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <app-product-dynamics-filter
                (eventFilter)="eventFilter($event)">
            </app-product-dynamics-filter>
            <app-product-dynamics-list
                class="w-full"
                [productDynamics]="productDynamics"
                (eventEdit)="eventEdit()"
            ></app-product-dynamics-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class ProductDynamicsContainersComponent implements OnInit {
    public error: string = '';
    public productDynamics: ProductDynamic[] = [];
    public stores: Stores[] = [];
    public paginationEvent = new PaginationEvent();
    public productDynamicsFilter: ProductDynamicFilter = {};
    public unitMeasurement = new ProductDynamic();
    public paginatedResponse: PaginatedResponse = {
        content: [],
        totalPages: 0,
        currentPage: 0,
        totalElements: 0
    };
    public size: number = 10;

    constructor(
        private _productDynamicsService: ProductDynamicService,
        private _confirmDialogService: ConfirmDialogService,

    ) {
    }

    ngOnInit() {
        this.getProductDynamics();
    }

    public eventFilter(filter: any): void {
        this.productDynamicsFilter = filter;

        const storeId = filter.storeId;
        if (storeId) {
            this.getProductDynamics(storeId);
        } else {
            this.getProductDynamics();
        }
    }

    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginatedResponse.currentPage = paginationEvent.page;
        this.size = paginationEvent.size;
        this.getProductDynamics();
    }

    private getProductDynamics(storeId?: string): void {
        if (storeId) {
            this._productDynamicsService.getListStores$(storeId).subscribe(
                (response: any) => {
                    this.productDynamics = response || [];
                },
            );
        } else {
            const params = {
                ...this.productDynamicsFilter,
                page: this.paginatedResponse.currentPage || 0,
                size: this.size,
            };

            this._productDynamicsService.getWithQuery$(params).subscribe(
                (response) => {
                    this.paginatedResponse = response;
                    this.productDynamics = response.content || [];
                },
            );
        }
    }

    public eventEdit(): void {
        const updatedProductDynamics: ProductDynamic[] = [...this.productDynamics];

        this._confirmDialogService.confirmSave({})
            .then(() => {
                this.edit(updatedProductDynamics); // Si el usuario confirma, procede con la edición
            })
            .catch(() => {
                this.getProductDynamics();
            });
    }


    private edit(unitMeasurements: ProductDynamic[]): void {
        this._productDynamicsService.updateAll$(unitMeasurements).subscribe(
            (response) => {
                if (response) {
                    this.getProductDynamics();
                }
            },
        );
    }
}
