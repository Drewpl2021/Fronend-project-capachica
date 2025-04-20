import {Component, OnInit} from '@angular/core';
import {Services, ServicesFilter, PaginatedResponse} from '../models/services';
import {ServicesListComponent} from '../components/list/services-list.component';
import {MatDialog} from '@angular/material/dialog';
import {ServicesNewComponent} from '../components/form/services-new.component';

import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {ServicesFilterComponent} from "../components/filter/services-filter.component";
import {ServicesEditComponent} from "../components/form/services-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {ServicesService} from "../../../../../providers/services/client/Services.service";


@Component({
    selector: 'app-service-container',
    standalone: true,
    imports: [ServicesListComponent,
        PaginationControlsComponent, ServicesFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-services-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-services-filter>

            <app-services-list
                class="w-full"
                [services]="services"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-services-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class ServicesContainersComponent implements OnInit {
    public error: string = '';
    public services: Services[] = [];
    public paginationEvent = new PaginationEvent();
    public servicesFilter: ServicesFilter;

    public unitMeasurement = new Services();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _servicesService: ServicesService,
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

    public eventFilter(servicesFilter: ServicesFilter): void {
        this.servicesFilter = servicesFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.servicesFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getServices(mergedData);
    }

    private getServices(data?: any): void {
        this._servicesService.getWithSearch$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.services = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const servicesForm = this._matDialog.open(ServicesNewComponent);
            servicesForm.componentInstance.title = 'Nuevo Servicio' || null;

            servicesForm.afterClosed().subscribe((result: any) => {
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
        this._servicesService.add$(data).subscribe((response) => {
            if (response) {
                this.getServices();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string): void {
        this._servicesService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const servicesForm = this._matDialog.open(ServicesEditComponent);
            servicesForm.componentInstance.title = 'Editar Servicios' || null;
            servicesForm.componentInstance.unitMeasurement = this.unitMeasurement;

            servicesForm.afterClosed().subscribe((result: any) => {
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
            this._servicesService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getServices();
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: Services) {
        this._servicesService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getServices();
            }
        });
    }
}
