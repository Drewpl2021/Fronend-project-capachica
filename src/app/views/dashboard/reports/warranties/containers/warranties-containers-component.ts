import {Component, OnInit} from '@angular/core';
import {PaginatedResponse, Warrinties, WarrintiesFilter} from '../models/warrinties';
import {WarrantiesListComponent} from '../components/list/warranties-list.component';
import {MatDialog} from '@angular/material/dialog';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {WarrantiesFilterComponent} from "../components/filter/warranties-filter.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {WarrantiesService} from "../../../../../providers/services/reports/Warranties.service";


@Component({
    selector: 'app-warrinties-container',
    standalone: true,
    imports: [WarrantiesListComponent,
        PaginationControlsComponent, WarrantiesFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <app-warrinties-filter
                (eventFilter)="eventFilter($event)">
            </app-warrinties-filter>
            <app-warrinties-list
                class="w-full"
                [warrinties]="warrinties"
            ></app-warrinties-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class WarrantiesContainersComponent implements OnInit {
    public error: string = '';
    public warrinties: Warrinties[] = [];
    public paginationEvent = new PaginationEvent();
    public warrintiesFilter: WarrintiesFilter;

    public unitMeasurement = new Warrinties();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _warrantiesService: WarrantiesService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog
    ) {
    }

    ngOnInit() {
    }

    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginationEvent = paginationEvent;
        this.mergeFilterAndPagination();
    }

    public eventFilter(warrintiesFilter1: WarrintiesFilter): void {
        this.warrintiesFilter = warrintiesFilter1;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.warrintiesFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getWarrinties(mergedData);
    }

    private getWarrinties(data?: any): void {
        this._warrantiesService.getWithSearch$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.warrinties = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }
}
