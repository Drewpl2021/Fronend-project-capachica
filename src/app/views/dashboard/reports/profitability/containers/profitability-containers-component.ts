import {Component, OnInit} from '@angular/core';
import {Profitability, PaginatedResponse, ProfitabilitySummary, ProfitabilityFilter} from '../models/profitability';
import {ProfitabilityListComponent} from '../components/list/profitability-list.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {ProfitabilityFilterComponent} from "../components/filter/profitability-filter.component";
import {ProfitabilityService} from "../../../../../providers/services/reports/profitability.service";
import {format} from "date-fns";

@Component({
    selector: 'app-profitability-container',
    standalone: true,
    imports: [ProfitabilityListComponent,
        PaginationControlsComponent, ProfitabilityFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-profitability-filter
                (eventFilter)="eventFilter($event)">
            </app-profitability-filter>

            <app-profitability-list
                class="w-full"
                [profitabilities]="profitabilities"
                [profitabilitySummaries]="profitabilitySummaries"
            ></app-profitability-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class ProfitabilityContainersComponent implements OnInit {
    public error: string = '';
    public profitabilities: Profitability[] = [];
    public profitabilitySummaries: ProfitabilitySummary = {} as ProfitabilitySummary;
    public paginationEvent = new PaginationEvent();
    public profitabilityFilter: ProfitabilityFilter;
    public unitMeasurement = new Profitability();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;
    private firstLoad = true;

    constructor(
        private _profitabilityService: ProfitabilityService,
    ) {}
    ngOnInit() {
    }

    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginationEvent = paginationEvent;
        this.mergeFilterAndPagination();
    }

    public eventFilter(profitabilityFilter: ProfitabilityFilter): void {
        this.profitabilityFilter = profitabilityFilter;
        this.firstLoad = false; // 🔥 Después de filtrar, ya no se usa startDate/endDate por defecto
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const today = format(new Date(), 'yyyy-MM-dd');
        const mergedData = {
            ...this.profitabilityFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size,
            ...(this.firstLoad ? {startDate: today, endDate: today} : {}) // 🔥 Solo en la primera carga
        };
        const dateFilter = {
            startDate: this.firstLoad ? today : this.profitabilityFilter?.startDate,
            endDate: this.firstLoad ? today : this.profitabilityFilter?.endDate
        };
        this.getProfitability(mergedData, dateFilter);
    }
    private getProfitability(mergedData?: any, dateFilter?: any): void {
        this._profitabilityService.getWithSearch$(mergedData).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.profitabilities = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
        this._profitabilityService.getWithSummary$(dateFilter).subscribe((response) => {
            if (response) {
                this.profitabilitySummaries = {
                    ...response
                } as ProfitabilitySummary;
            }
        });
    }
}
