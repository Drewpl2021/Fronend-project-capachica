import {Component, OnInit} from '@angular/core';
import {Sale, SaleFilter, PaginatedResponse} from '../models/sales';
import {SalesListComponent} from '../components/list/sales-list.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {SalesFilterComponent} from "../components/filter/sales-filter.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SalesService} from "../../../../../providers/services/sales/sales.service";
import {format} from "date-fns";

@Component({
    selector: 'app-sales-container',
    standalone: true,
    imports: [SalesListComponent, PaginationControlsComponent, SalesFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <app-sales-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-sales-filter>
            <app-sales-list
                class="w-full"
                [sales]="sales"
                (eventEdit)="eventEdits($event)"
                (eventCancel)="eventCancel($event)"
                (eventDelete)="eventDelete($event)"
            ></app-sales-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class SalesContainersComponent implements OnInit {
    public error: string = '';
    public sales: Sale[] = [];
    public paginationEvent = new PaginationEvent();
    public saleFilter: SaleFilter;
    public unitMeasurement = new Sale();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;
    private firstLoad = true;

    constructor(
        private _salesService: SalesService,
        private _confirmDialogService: ConfirmDialogService,
        private router: Router,
        private route: ActivatedRoute
    ) {}
    ngOnInit() {
    }
    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginationEvent = paginationEvent;
        this.mergeFilterAndPagination();
    }
    public eventFilter(saleFilter: SaleFilter): void {
        this.saleFilter = saleFilter;
        this.firstLoad = false;
        this.mergeFilterAndPagination();
    }
    private mergeFilterAndPagination(): void {
        const today = format(new Date(), 'yyyy-MM-dd');

        const mergedData = {
            ...this.saleFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size,
            ...(this.firstLoad ? { startDate: today, endDate: today } : {}) // 🔥 Solo en la primera carga
        };

        this.getSales(mergedData);
    }
    private getSales(data?: any): void {
        this._salesService.getWithFilter$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.sales = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }
    public eventNew($event: boolean): void {
        if ($event) {
            this.router.navigate(['new-sales'], { relativeTo: this.route }).then((success) => {

            });
        }
    }
    public eventEdits(id: string): void {
        if (id) {
            this.router.navigate([`edit-sales/${id}`], { relativeTo: this.route }).then((success) => {
            });
        }
    }
    public eventCancel(id: string): void {
        if (id) {
            this.router.navigate([`cancel-sales/${id}`], { relativeTo: this.route }).then((success) => {
            });
        }
    }
    public eventDelete(id: string) {
        this._confirmDialogService.confirmDelete(
            {
            }
        ).then(() => {
            this._salesService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getSales();
                }
            });
        }).catch(() => {
        });
    }
}
