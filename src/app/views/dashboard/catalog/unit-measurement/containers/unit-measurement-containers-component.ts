import {Component, OnInit} from '@angular/core';
import {PaginatedResponse, UnitMeasurement, UnitMeasurementFilter} from '../models/unit-measurement';
import {UnitMeasurementListComponent} from '../components/list/unit-measurement-list.component';
import {MatDialog} from '@angular/material/dialog';
import {UnitMeasurementNewComponent} from '../components/form/unit-measurement-new.component';

import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {UnitMeasurementFilterComponent} from "../components/filter/unit-measurement-filter.component";
import {UnitMeasurementEditComponent} from "../components/form/unit-measurement-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {UnitMeasurementService} from "../../../../../providers/services/catalog/unit-measurement.service";


@Component({
    selector: 'app-unit-measurement-container',
    standalone: true,
    imports: [UnitMeasurementListComponent,
        PaginationControlsComponent, UnitMeasurementFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

                <app-unit-measurement-filter
                    (eventFilter)="eventFilter($event)"
                    (eventNew)="eventNew($event)">
                </app-unit-measurement-filter>

            <app-unit-measurement-list
                class="w-full"
                [unitMeasurements]="unitMeasurements"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-unit-measurement-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class UnitMeasurementContainersComponent implements OnInit {
    public error: string = '';
    public unitMeasurements: UnitMeasurement[] = [];
    public paginationEvent = new PaginationEvent();
    public UnitMeasurementFilter: UnitMeasurementFilter;

    public unitMeasurement = new UnitMeasurement();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _unitMeasurementService: UnitMeasurementService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog
    ) {
    }

    ngOnInit() {
        // this.getUnitMeasurements();
    }

    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginationEvent = paginationEvent;
        this.mergeFilterAndPagination();
    }

    public eventFilter(UnitMeasurementFilter: UnitMeasurementFilter): void {
        this.UnitMeasurementFilter = UnitMeasurementFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.UnitMeasurementFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getUnitMeasurements(mergedData);
    }

    private getUnitMeasurements(data?: any): void {
        this._unitMeasurementService.getWithQuery$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.unitMeasurements = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const unitMeasurementForm = this._matDialog.open(UnitMeasurementNewComponent);
            unitMeasurementForm.componentInstance.title = 'Nuevo Unidad de Medida' || null;

            unitMeasurementForm.afterClosed().subscribe((result: any) => {
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
        this._unitMeasurementService.add$(data).subscribe((response) => {
            if (response) {
                this.getUnitMeasurements();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string): void {
        this._unitMeasurementService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const unitMeasurementForm = this._matDialog.open(UnitMeasurementEditComponent);
            unitMeasurementForm.componentInstance.title = 'Editar Unidad de Medida' || null;
            unitMeasurementForm.componentInstance.unitMeasurement = this.unitMeasurement;

            unitMeasurementForm.afterClosed().subscribe((result: any) => {
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
            this._unitMeasurementService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getUnitMeasurements();
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: UnitMeasurement) {
        this._unitMeasurementService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getUnitMeasurements();
            }
        });
    }
}
