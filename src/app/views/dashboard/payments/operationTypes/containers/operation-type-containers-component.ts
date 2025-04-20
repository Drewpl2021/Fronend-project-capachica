import {Component, OnInit} from '@angular/core';
import {OperationType, OperationTypeFilter, PaginatedResponse} from '../models/operation-type';
import {OperationTypeListComponent} from '../components/list/operation-type-list.component';
import {MatDialog} from '@angular/material/dialog';
import {OperationTypeNewComponent} from '../components/form/operation-type-new.component';

import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {OperationTypeFilterComponent} from "../components/filter/operation-type-filter.component";
import {OperationTypeEditComponent} from "../components/form/operation-type-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {OperationTypeService} from "../../../../../providers/services/payments/OperationType.service";


@Component({
    selector: 'app-operation-type-container',
    standalone: true,
    imports: [OperationTypeListComponent,
        PaginationControlsComponent, OperationTypeFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-operation-type-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-operation-type-filter>

            <app-operation-type-list
                class="w-full"
                [operationTypes]="operationTypes"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-operation-type-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class OperationTypeContainersComponent implements OnInit {
    public error: string = '';
    public operationTypes: OperationType[] = [];
    public paginationEvent = new PaginationEvent();
    public operationTypeFilter: OperationTypeFilter;

    public operationType = new OperationType();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _operationTypeService: OperationTypeService,
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

    public eventFilter(operationTypeFilter: OperationTypeFilter): void {
        this.operationTypeFilter = operationTypeFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.operationTypeFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getOperationType(mergedData);
    }

    private getOperationType(data?: any): void {
        this._operationTypeService.getWithSearch$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.operationTypes = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const operationTypeForm = this._matDialog.open(OperationTypeNewComponent);
            operationTypeForm.componentInstance.title = 'Nuevo Tipo de Operación' || null;

            operationTypeForm.afterClosed().subscribe((result: any) => {
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
        this._operationTypeService.add$(data).subscribe((response) => {
            if (response) {
                this.getOperationType();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string): void {
        this._operationTypeService.getById$(id).subscribe((response) => {
            this.operationType = response;
            const operationTypeForm = this._matDialog.open(OperationTypeEditComponent);
            operationTypeForm.componentInstance.title = 'Editar Tipo de Operación' || null;
            operationTypeForm.componentInstance.operationType = this.operationType;

            operationTypeForm.afterClosed().subscribe((result: any) => {
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

    public eventDelete(id: string) {
        this._confirmDialogService.confirmDelete(
            {
                // title: 'Confirmación Personalizada',
                // message: `¿Quieres proceder con esta acción ${}?`,
            }
        ).then(() => {
            this._operationTypeService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getOperationType();
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: OperationType) {
        this._operationTypeService.update$(this.operationType.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getOperationType();
            }
        });
    }
}
