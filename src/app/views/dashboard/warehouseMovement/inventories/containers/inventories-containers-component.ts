import {Component, OnInit} from '@angular/core';
import {Inventory, InventoryFilter, PaginatedResponse, TotalCost} from '../models/inventories';
import {InventoriesListComponent} from '../components/list/inventories-list.component';
import {MatDialog} from '@angular/material/dialog';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {InventoriesFilterComponent} from "../components/filter/inventories-filter.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {InventoriesService} from "../../../../../providers/services/warehouseMovement/inventories.service";
import {ProfitabilityListComponent} from "../../../reports/profitability/components/list/profitability-list.component";

@Component({
    selector: 'app-inventories-container',
    standalone: true,
    imports: [InventoriesListComponent,
        PaginationControlsComponent, InventoriesFilterComponent, ProfitabilityListComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <app-inventory-filter
                (eventFilter)="eventFilter($event)"
                (filterEvent)="onFilterEvent($event)">
            </app-inventory-filter>
            <app-inventory-list
                class="w-full"
                [inventories]="inventories"
                (eventDelete)="eventDelete($event)"
                [profitabilitySummaries]="profitabilitySummaries"
            ></app-inventory-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class InventoriesContainersComponent implements OnInit {
    public error: string = '';
    public inventories: Inventory[] = [];
    public paginationEvent = new PaginationEvent();
    public inventoryFilter: InventoryFilter;
    public profitabilitySummaries: TotalCost = {} as TotalCost;
    public unitMeasurement = new Inventory();
    public paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    public size: number = 20;

    constructor(
        private _inventoriesService: InventoriesService,
        private _confirmDialogService: ConfirmDialogService,
    ) {}
    ngOnInit() {}
    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginationEvent = paginationEvent;
        this.mergeFilterAndPagination();
    }
    public eventFilter(inventoryFilter: InventoryFilter): void {
        this.inventoryFilter = inventoryFilter;
        this.mergeFilterAndPagination();
    }
    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.inventoryFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getInventory(mergedData);
    }
    private getInventory(data?: any): void {
        this._inventoriesService.getAllInventory$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.inventories = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
        this._inventoriesService.getWithTotalCost$(data).subscribe((response) => {
            if (response) {
                this.profitabilitySummaries = {
                    ...response
                } as TotalCost;
            }
        });
    }
    onFilterEvent(filter: { storeId: string | null, productId: string | null }): void {

        const data: any = {
            page: 0,
            size: this.size,
        };
        if (filter.storeId) {
            data.storeId = filter.storeId;
        }
        if (filter.productId) {
            data.productId = filter.productId;
        }
        this.getInventory(data);
    }
    public eventDelete(id: string) {
        this._confirmDialogService.confirmDelete({}).then(() => {
            this._inventoriesService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getInventory();
                }
            });
        }).catch(() => {
        });
    }
}
