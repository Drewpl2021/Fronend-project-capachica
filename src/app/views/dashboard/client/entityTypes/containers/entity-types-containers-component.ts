import {Component, OnInit} from '@angular/core';
import {EntityTypes, EntityTypesFilter, PaginatedResponse} from '../models/entity-types';
import {EntityTypesListComponent} from '../components/list/entity-types-list.component';
import {MatDialog} from '@angular/material/dialog';
import {EntityTypesNewComponent} from '../components/form/entity-types-new.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {EntityTypesFilterComponent} from "../components/filter/entity-types-filter.component";
import {EntityTypesEditComponent} from "../components/form/entity-types-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {EntityTypesService} from "../../../../../providers/services/client/entityTypes.service";


@Component({
    selector: 'app-entities-type-container',
    standalone: true,
    imports: [EntityTypesListComponent,
        PaginationControlsComponent, EntityTypesFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-entity-types-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-entity-types-filter>

            <app-entity-types-list
                class="w-full"
                [entityTypes]="entityTypes"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-entity-types-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class EntityTypesContainersComponent implements OnInit {
    public error: string = '';
    public entityTypes: EntityTypes[] = [];
    public paginationEvent = new PaginationEvent();
    public entityTypesFilter: EntityTypesFilter;

    public unitMeasurement = new EntityTypes();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _entityTypesService: EntityTypesService,
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

    public eventFilter(entityTypesFilter: EntityTypesFilter): void {
        this.entityTypesFilter = entityTypesFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.entityTypesFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getEntityTypes(mergedData);
    }

    private getEntityTypes(data?: any): void {
        this._entityTypesService.getWithSearch$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.entityTypes = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const entityTypesForm = this._matDialog.open(EntityTypesNewComponent);
            entityTypesForm.componentInstance.title = 'Nuevo Tipo de Entidad' || null;

            entityTypesForm.afterClosed().subscribe((result: any) => {
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
        this._entityTypesService.add$(data).subscribe((response) => {
            if (response) {
                this.getEntityTypes();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string): void {
        this._entityTypesService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const entityTypesForm = this._matDialog.open(EntityTypesEditComponent);
            entityTypesForm.componentInstance.title = 'Editar Tipo de Entidad' || null;
            entityTypesForm.componentInstance.unitMeasurement = this.unitMeasurement;

            entityTypesForm.afterClosed().subscribe((result: any) => {
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
            this._entityTypesService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getEntityTypes();
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: EntityTypes) {
        this._entityTypesService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getEntityTypes();
            }
        });
    }
}
