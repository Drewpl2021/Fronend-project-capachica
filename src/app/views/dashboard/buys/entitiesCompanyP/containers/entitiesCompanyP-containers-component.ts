import {Component, OnInit} from '@angular/core';
import {EntitiesCompanyP, EntitiesFilter, PaginatedResponse} from '../models/entitiesCompanyP';
import {EntitiesCompanyPListComponent} from '../components/list/entitiesCompanyP-list.component';
import {MatDialog} from '@angular/material/dialog';
import {EntitiesCompanyPNewComponent} from '../components/form/entitiesCompanyP-new.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {EntitiesCompanyPFilterComponent} from "../components/filter/entitiesCompanyP-filter.component";
import {EntitiesCompanyPEditComponent} from "../components/form/entitiesCompanyP-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {EntityService} from "../../../../../providers/services/client/Entitys.service";
import {EntityTypes} from "../../../sales/entitiesCompanyC/models/entitiesCompanyC";
import {EntityTypesService} from "../../../../../providers/services/client/entityTypes.service";
import {EntitysCompanyClientService} from "../../../../../providers/services/sales/EntitysCompany.service";

@Component({
    selector: 'app-entities-provider-container',
    standalone: true,
    imports: [EntitiesCompanyPListComponent,
        PaginationControlsComponent, EntitiesCompanyPFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <app-entities-provider-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-entities-provider-filter>
            <app-entities-provider-list
                class="w-full"
                [entities]="entities"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-entities-provider-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class EntitiesCompanyPContainersComponent implements OnInit {
    public error: string = '';
    public entities: EntitiesCompanyP[] = [];
    public paginationEvent = new PaginationEvent();
    public entitiesFilter: EntitiesFilter;
    public entityTypes: EntityTypes[] = [];
    public entityTypeIdCode01: string | null = null;
    public unitMeasurement = new EntitiesCompanyP();
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
                ? this.entityTypes.find((type: any) => type.code === "02")?.id || null
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
            const entitiesForm = this._matDialog.open(EntitiesCompanyPNewComponent);
            entitiesForm.componentInstance.title = 'Nueva Entidad' || null;

            entitiesForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    // Muestra la confirmación antes de guardar
                    this._confirmDialogService.confirmSave({})
                        .then(() => {
                            this.save(result); // Si el usuario confirma, procede con el guardado
                        })
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
            const entitiesForm = this._matDialog.open(EntitiesCompanyPEditComponent);
            entitiesForm.componentInstance.title = 'Editar Entidad' || null;
            entitiesForm.componentInstance.entitys = this.unitMeasurement;

            entitiesForm.afterClosed().subscribe((result: any) => {
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
            this._entityService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getEntities();
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: EntitiesCompanyP) {
        this._entityService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getEntities();
            }
        });
    }
}
