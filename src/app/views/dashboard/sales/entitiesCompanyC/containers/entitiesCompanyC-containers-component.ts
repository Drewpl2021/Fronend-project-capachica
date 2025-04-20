import {Component, OnInit} from '@angular/core';
import {DocumentTypes, EntitiesCompanyC, EntitiesFilter, EntityTypes, PaginatedResponse} from '../models/entitiesCompanyC';
import {EntitiesCompanyCListComponent} from '../components/list/entitiesCompanyC-list.component';
import {MatDialog} from '@angular/material/dialog';
import {EntitiesCompanyCNewComponent} from '../components/form/entitiesCompanyC-new.component';

import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {EntitiesCompanyCFilterComponent} from "../components/filter/entitiesCompanyC-filter.component";
import {EntitiesCompanyCEditComponent} from "../components/form/entitiesCompanyC-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {EntityService} from "../../../../../providers/services/client/Entitys.service";
import {EntityTypesService} from "../../../../../providers/services/client/entityTypes.service";
import {DocumentTypesService} from "../../../../../providers/services/client/DocumentTypes.service";
import {EntitysCompanyClientService} from "../../../../../providers/services/sales/EntitysCompany.service";


@Component({
    selector: 'app-entities-client-container',
    standalone: true,
    imports: [EntitiesCompanyCListComponent,
        PaginationControlsComponent, EntitiesCompanyCFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-entities-client-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-entities-client-filter>

            <app-entities-client-list
                class="w-full"
                [entities]="entities"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-entities-client-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class EntitiesCompanyCContainersComponent implements OnInit {
    public error: string = '';
    public entities: EntitiesCompanyC[] = [];
    public paginationEvent = new PaginationEvent();
    public entitiesFilter: EntitiesFilter;
    public entityTypes: EntityTypes[] = [];
    public entityTypeIdCode01: string | null = null;

    public unitMeasurement = new EntitiesCompanyC();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _entitysCompanyClientService: EntitysCompanyClientService,
        private _entityService: EntityService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog,
        private _entityTypesService: EntityTypesService,
    ) {}

    ngOnInit() {
        this.CargarDatos();
    }
    private CargarDatos() {
        this._entityTypesService.getWithSearch$().subscribe((data) => {
            this.entityTypes = Array.isArray(data?.content) ? data.content : [];
            this.entityTypeIdCode01 = this.entityTypes.length > 0
                ? this.entityTypes.find((type: any) => type.code === "01")?.id || null
                : null;
            if (this.entityTypeIdCode01) {
                this.mergeFilterAndPagination();
            }
        });
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
        if (!this.entityTypeIdCode01) {
            return;
        }

        const mergedData = {
            ...this.entitiesFilter,
            page: this.paginationEvent?.page || 0,
            size: this.paginationEvent?.size || 20,
            entityTypeId: this.entityTypeIdCode01
        };

        this.getEntities(mergedData);
    }

    private getEntities(data?: any): void {
        this._entitysCompanyClientService.getWithSearch$(data).subscribe(
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
            const entitiesForm = this._matDialog.open(EntitiesCompanyCNewComponent);
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
            const entitiesForm = this._matDialog.open(EntitiesCompanyCEditComponent);
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

    private edit(UnitMeasurement: EntitiesCompanyC) {
        this._entityService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getEntities();
            }
        });
    }
}
