import {Component, OnInit} from '@angular/core';
import {Company, CompanyFilter, PaginatedResponse} from '../models/company';
import {CompanyListComponent} from '../components/list/company-list.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {CompanyFilterComponent} from "../components/filter/company-filter.component";
import {CompanyService} from "../../../../../providers/services/setup/company.service";

@Component({
    selector: 'app-list-company-container',
    standalone: true,
    imports: [CompanyListComponent, PaginationControlsComponent, CompanyFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <app-company-filter
                (eventFilter)="eventFilter($event)">
            </app-company-filter>
            <app-company-list class="w-full"
                [company]="company">
            </app-company-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)">
            </pagination-controls>
        </div>
    `,
})
export class CompanyContainersComponent implements OnInit {
    public error: string = '';
    public company: Company[] = [];
    public paginationEvent = new PaginationEvent();
    public companyFilter: CompanyFilter;
    public unitMeasurement = new Company();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _companyService: CompanyService,
    ) {}
    ngOnInit() {
    }
    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginationEvent = paginationEvent;
        this.mergeFilterAndPagination();
    }
    public eventFilter(companyFilter: CompanyFilter): void {
        this.companyFilter = companyFilter;
        this.mergeFilterAndPagination();
    }
    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.companyFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getCompany(mergedData);
    }
    private getCompany(data?: any): void {
        this._companyService.getWithQuery$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.company = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }
}
