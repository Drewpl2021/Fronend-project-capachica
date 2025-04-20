import {Component, OnInit} from '@angular/core';
import {Entities, EntitiesFilter, PaginatedResponse} from '../models/entities';
import {EntitiesListComponent} from '../components/list/entities-list.component';
import {MatDialog} from '@angular/material/dialog';
import {EntitiesNewComponent} from '../components/form/entities-new.component';

import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {EntitiesFilterComponent} from "../components/filter/entities-filter.component";
import {EntitiesEditComponent} from "../components/form/entities-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {EntityService} from "../../../../../providers/services/client/Entitys.service";


@Component({
    selector: 'app-entities-container',
    standalone: true,
    imports: [EntitiesListComponent,
        PaginationControlsComponent, EntitiesFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-entities-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-entities-filter>

            <app-entities-list
                class="w-full"
                [entities]="entities"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-entities-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class EntitiesContainersComponent implements OnInit {
    public error: string = '';
    public entities: Entities[] = [];
    public paginationEvent = new PaginationEvent();
    public entitiesFilter: EntitiesFilter;

    public unitMeasurement = new Entities();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _entityService: EntityService,
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

    public eventFilter(entitiesFilter: EntitiesFilter): void {
        this.entitiesFilter = entitiesFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.entitiesFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getEntities(mergedData);
    }

    private getEntities(data?: any): void {
        this._entityService.getWithSearch$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.entities = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const entitiesForm = this._matDialog.open(EntitiesNewComponent);
            entitiesForm.componentInstance.title = 'Nueva Entidad' || null;

            entitiesForm.afterClosed().subscribe((result: any) => {
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
        this._entityService.add$(data).subscribe((response) => {
            if (response) {
                this.getEntities();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string): void {
        this._entityService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const entitiesForm = this._matDialog.open(EntitiesEditComponent);
            entitiesForm.componentInstance.title = 'Editar Entidad' || null;
            entitiesForm.componentInstance.entitys = this.unitMeasurement;

            entitiesForm.afterClosed().subscribe((result: any) => {
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
            this._entityService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getEntities();
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: Entities) {
        this._entityService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getEntities();
            }
        });
    }
}
