import {Component, OnInit} from '@angular/core';
import {Stores, StoresFilter, PaginatedResponse} from '../models/stores';
import {StoresListComponent} from '../components/list/stores-list.component';
import {MatDialog} from '@angular/material/dialog';
import {StoresNewComponent} from '../components/form/stores-new.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {StoresFilterComponent} from "../components/filter/stores-filter.component";
import {StoresEditComponent} from "../components/form/stores-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {StoresService} from "../../../../../providers/services/accounting/stores.service";
import {StoresNewGroupComponent} from "../components/form/stores-new-group.component";
import {SerialFlowsService} from "../../../../../providers/services/catalog/serial-flows.service";


@Component({
    selector: 'app-store-container',
    standalone: true,
    imports: [StoresListComponent,
        PaginationControlsComponent, StoresFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-store-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-store-filter>
            <app-store-list
                class="w-full"
                [stores]="stores"
                (eventGroup)="eventNewGroup($event)"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-store-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class StoresContainersComponent implements OnInit {
    public error: string = '';
    public stores: Stores[] = [];
    public paginationEvent = new PaginationEvent();
    public storeFilter: StoresFilter;


    public unitMeasurement = new Stores();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _storeService: StoresService,
        private _serialFlowsService: SerialFlowsService,
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

    public eventFilter(storeFilter: StoresFilter): void {
        this.storeFilter = storeFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.storeFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getStore(mergedData);
    }

    private getStore(data?: any): void {
        this._storeService.getWithQuery$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.stores = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const storeForm = this._matDialog.open(StoresNewComponent);
            storeForm.componentInstance.title = 'Nuevo Almacén' || null;

            storeForm.afterClosed().subscribe((result: any) => {
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
        this._storeService.add$(data).subscribe((response) => {
            if (response) {
                this.getStore();
            }
        }, (error) => {
        });
    }

    public eventNewGroup($event: string) {
        if ($event) {
            const storeForm = this._matDialog.open(StoresNewGroupComponent);
            storeForm.componentInstance.title = 'Nuevo Almacén' || null;
            storeForm.componentInstance.id = $event;

            // Suscríbete al emisor de datos sin cerrar el diálogo
            storeForm.componentInstance.payloadEmitter.subscribe((payload: any) => {
                // Muestra la confirmación antes de guardar
                this._confirmDialogService.confirmSave({})
                    .then(() => {
                        this.saves(payload); // Si el usuario confirma, procede con el guardado
                    })
            });
        }
    }


    private saves(data: Object) {
        this._serialFlowsService.add$(data).subscribe((response) => {
            if (response) {
                this.getStore();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string): void {
        this._storeService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const storeForm = this._matDialog.open(StoresEditComponent);
            storeForm.componentInstance.title = 'Editar Almacén' || null;
            storeForm.componentInstance.unitMeasurement = this.unitMeasurement;

            storeForm.afterClosed().subscribe((result: any) => {
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
            this._storeService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getStore();
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: Stores) {
        this._storeService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getStore();
            }
        });
    }
}
