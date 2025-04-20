import {Component, OnInit} from '@angular/core';
import {TypeDocument, TypeDocumentFilter, PaginatedResponse} from '../models/type-document';
import {TypeDocumentListComponent} from '../components/list/type-document-list.component';
import {MatDialog} from '@angular/material/dialog';
import {TypeDocumentNewComponent} from '../components/form/type-document-new.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {TypeDocumentFilterComponent} from "../components/filter/type-document-filter.component";
import {TypeDocumentEditComponent} from "../components/form/type-document-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {TypeDocumentService} from "../../../../../providers/services/accounting/type-document.service";

@Component({
    selector: 'app-type-document-container',
    standalone: true,
    imports: [TypeDocumentListComponent,
        PaginationControlsComponent, TypeDocumentFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-type-document-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-type-document-filter>

            <app-type-document-list
                class="w-full"
                [type_document]="type_document"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-type-document-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class TypeDocumentContainersComponent implements OnInit {
    public error: string = '';
    public type_document: TypeDocument[] = [];
    public paginationEvent = new PaginationEvent();
    public documentFilter: TypeDocumentFilter;

    public unitMeasurement = new TypeDocument();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _documentService: TypeDocumentService,
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

    public eventFilter(documentFilter: TypeDocumentFilter): void {
        this.documentFilter = documentFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.documentFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getDocument(mergedData);
    }

    private getDocument(data?: any): void {
        this._documentService.getWithSearch$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.type_document = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const documentyForm = this._matDialog.open(TypeDocumentNewComponent);
            documentyForm.componentInstance.title = 'Nuevo Tipo de Documento' || null;

            documentyForm.afterClosed().subscribe((result: any) => {
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
        this._documentService.add$(data).subscribe((response) => {
            if (response) {
                this.getDocument();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string): void {
        this._documentService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const documentyForm = this._matDialog.open(TypeDocumentEditComponent);
            documentyForm.componentInstance.title = 'Editar Tipo de Documento' || null;
            documentyForm.componentInstance.unitMeasurement = this.unitMeasurement;

            documentyForm.afterClosed().subscribe((result: any) => {
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
            this._documentService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getDocument();
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: TypeDocument) {
        this._documentService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getDocument();
            }
        });
    }
}
