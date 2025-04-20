import {Component, OnInit} from '@angular/core';
import {PurchasesFilter, PaginatedResponse, Purchases} from '../models/purchases';
import {PurchasesListComponent} from '../components/list/purchases-list.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {PurchasesFilterComponent} from "../components/filter/purchases-filter.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PurchasesService} from "../../../../../providers/services/buys/purchases.service";
import {SaleFilter} from "../../../sales/sales/models/sales";
import {format} from "date-fns";

@Component({
    selector: 'app-purchases-container',
    standalone: true,
    imports: [PurchasesListComponent, PaginationControlsComponent, PurchasesFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <app-purchases-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-purchases-filter>
            <app-purchases-list
                class="w-full"
                [purchases]="purchases"
                (eventEdit)="eventEdits($event)"
                (eventDelete)="eventDelete($event)"
            ></app-purchases-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class PurchasesContainersComponent implements OnInit {
    public error: string = '';
    public purchases: Purchases[] = [];
    public paginationEvent = new PaginationEvent();
    public purchasesFilter: PurchasesFilter;
    public unitMeasurement = new Purchases();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;
    private firstLoad = true;

    constructor(
        private _purchasesService: PurchasesService,
        private _confirmDialogService: ConfirmDialogService,
        private router: Router,
        private route: ActivatedRoute
    ) {
    }
    ngOnInit() {
    }
    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginationEvent = paginationEvent;
        this.mergeFilterAndPagination();
    }
    public eventFilter(saleFilter: SaleFilter): void {
        this.purchasesFilter = saleFilter;
        this.firstLoad = false;
        this.mergeFilterAndPagination();
    }
    private mergeFilterAndPagination(): void {
        const today = format(new Date(), 'yyyy-MM-dd');

        const mergedData = {
            ...this.purchasesFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size,
            ...(this.firstLoad ? { startDate: today, endDate: today } : {}) // 🔥 Solo en la primera carga
        };

        this.getPurchases(mergedData);
    }
    private getPurchases(data?: any): void {
        this._purchasesService.getWithFilter$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.purchases = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }
    public eventNew($event: boolean): void {
        if ($event) {
            this.router.navigate(['new-puchases'], { relativeTo: this.route }).then((success) => {
            });
        }
    }
    public eventEdits(id: string): void {
        if (id) {
            this.router.navigate([`edit-purchases/${id}`], { relativeTo: this.route }).then((success) => {
            });
        }
    }
    public eventDelete(id: string) {
        this._confirmDialogService.confirmDelete(
            {
            }
        ).then(() => {
            this._purchasesService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getPurchases();
                }
            });
        }).catch(() => {
        });
    }
}
