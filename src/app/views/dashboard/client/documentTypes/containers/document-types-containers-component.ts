import {Component, OnInit} from '@angular/core';
import {DocumentTypes, DocumentTypesFilter, PaginatedResponse} from '../models/document-types';
import {DocumentTypesListComponent} from '../components/list/document-types-list.component';
import {MatDialog} from '@angular/material/dialog';
import {DocumentTypesNewComponent} from '../components/form/document-types-new.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {DocumentTypesFilterComponent} from "../components/filter/document-types-filter.component";
import {DocumentTypesEditComponent} from "../components/form/document-types-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {DocumentTypesService} from "../../../../../providers/services/client/DocumentTypes.service";

@Component({
    selector: 'app-document-types-container',
    standalone: true,
    imports: [DocumentTypesListComponent,
        PaginationControlsComponent, DocumentTypesFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-document-types-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-document-types-filter>

            <app-document-types-list
                class="w-full"
                [documentTypes]="documentTypes"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-document-types-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class DocumentTypesContainersComponent implements OnInit {
    public error: string = '';
    public documentTypes: DocumentTypes[] = [];
    public paginationEvent = new PaginationEvent();
    public documentTypesFilter: DocumentTypesFilter;

    public unitMeasurement = new DocumentTypes();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _documentTypesFilterService: DocumentTypesService,
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

    public eventFilter(documentTypesFilter: DocumentTypesFilter): void {
        this.documentTypesFilter = documentTypesFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.documentTypesFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getDocumentTypes(mergedData);
    }

    private getDocumentTypes(data?: any): void {
        this._documentTypesFilterService.getWithSearch$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.documentTypes = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const documentTypesForm = this._matDialog.open(DocumentTypesNewComponent);
            documentTypesForm.componentInstance.title = 'Nuevo Tipo de Documento' || null;

            documentTypesForm.afterClosed().subscribe((result: any) => {
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
        this._documentTypesFilterService.add$(data).subscribe((response) => {
            if (response) {
                this.getDocumentTypes();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string): void {
        this._documentTypesFilterService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const documentTypesForm = this._matDialog.open(DocumentTypesEditComponent);
            documentTypesForm.componentInstance.title = 'Editar Tipo de Documento' || null;
            documentTypesForm.componentInstance.unitMeasurement = this.unitMeasurement;

            documentTypesForm.afterClosed().subscribe((result: any) => {
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
            this._documentTypesFilterService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getDocumentTypes();
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: DocumentTypes) {
        this._documentTypesFilterService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getDocumentTypes();
            }
        });
    }
}
