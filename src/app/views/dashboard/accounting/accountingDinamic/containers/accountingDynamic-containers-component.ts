import {Component, OnInit} from '@angular/core';
import {AccountingPlan, Areas, accountingDynamic, accountingDynamicFilter, PaginatedResponse} from '../models/accountingDynamic';
import {AccountingDynamicListComponent} from '../components/list/accountingDynamic-list.component';
import {MatDialog} from '@angular/material/dialog';
import {AccountingDynamicNewComponent} from '../components/form/accountingDynamic-new.component';

import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {AccountingDynamicFilterComponent} from "../components/filter/accountingDynamic-filter.component";
import {AccountingDynamicEditComponent} from "../components/form/accountingDynamic-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {AccountingDynamicsService} from "../../../../../providers/services/accounting/accounting-dinamic.service";

@Component({
    selector: 'app-accounting-dynamic-container',
    standalone: true,
    imports: [AccountingDynamicListComponent,
        PaginationControlsComponent, AccountingDynamicFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <app-accounting-dynamic-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-accounting-dynamic-filter>

            <app-accounting-dynamic-list
                class="w-full"
                [dynamics]="dynamics"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-accounting-dynamic-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>

        </div>
    `,
})
export class AccountingDynamicContainersComponent implements OnInit {
    public error: string = '';
    public dynamics: accountingDynamic[] = [];
    public paginationEvent = new PaginationEvent();
    public accountingDynamicFilters: accountingDynamicFilter;
    public areas: Areas[] = [];
    public accoutingPlan: AccountingPlan[] = [];

    public unitMeasurement = new accountingDynamic();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _accountingDynamicService: AccountingDynamicsService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog,

    ) {
    }

    ngOnInit() {
    }

    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginationEvent = paginationEvent;
        this.mergeFilterAndPagination();
    }

    public eventFilter(accountingDynamicFilters: accountingDynamicFilter): void {
        this.accountingDynamicFilters = accountingDynamicFilters;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.accountingDynamicFilters,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getAccoutingDynamic(mergedData);
    }

    private getAccoutingDynamic(data?: any): void {
        this._accountingDynamicService.getWithQuery$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.dynamics = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }
    public eventNew($event: boolean): void {
        if ($event) {
            const accountingDynamicForm = this._matDialog.open(AccountingDynamicNewComponent);
            accountingDynamicForm.componentInstance.title = 'Nueva Cuenta Dinamica' || null;

            accountingDynamicForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    // Muestra la confirmación antes de guardar
                    this._confirmDialogService.confirmSave({})
                        .then(() => {
                            this.save(result);
                        })
                }
            });
        }
    }
    private save(data: Object) {
        this._accountingDynamicService.add$(data).subscribe((response) => {
            if (response) {
                this.getAccoutingDynamic();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string): void {
        this._accountingDynamicService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const accountingDynamicForm = this._matDialog.open(AccountingDynamicEditComponent);
            accountingDynamicForm.componentInstance.title = 'Editar Cuenta Dinamica' || null;
            accountingDynamicForm.componentInstance.unitMeasurement = this.unitMeasurement;

            accountingDynamicForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    // Muestra la confirmación antes de editar
                    this._confirmDialogService.confirmSave({})
                        .then(() => {
                            this.edit(result); // Si el usuario confirma, procede con la edición
                        })
                }
            });
        });
    }

    public eventDelete(id: string) {
        this._confirmDialogService.confirmDelete(
            {
                // title: 'Confirmación Personalizada',
                // message: `¿Quieres proceder con esta acción ${}?`,
            }
        ).then(() => {
            this._accountingDynamicService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getAccoutingDynamic();
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: accountingDynamic) {
        this._accountingDynamicService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getAccoutingDynamic();
            }
        });
    }
}
