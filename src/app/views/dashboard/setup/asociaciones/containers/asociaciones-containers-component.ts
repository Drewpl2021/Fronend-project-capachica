import {Component, OnInit} from '@angular/core';
import {Asociaciones, AsociacionesFilter, PaginatedResponse} from '../models/asociaciones';
import {AsociacionesListComponent} from '../components/list/asociaciones-list.component';
import {MatDialog} from '@angular/material/dialog';
import {AsociacionesNewComponent} from '../components/form/asociaciones-new.component';

import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {AsociacionesFilterComponent} from "../components/filter/asociaciones-filter.component";
import {AsociacionesEditComponent} from "../components/form/asociaciones-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {CategoryService} from "../../../../../providers/services/catalog/category.service";
import {AsociacionesService} from "../../../../../providers/services/setup/asociaciones.service";
import {AsociacionescrearService} from "../../../../../providers/services/setup/asociacionescrear.service";


@Component({
    selector: 'app-category-container',
    standalone: true,
    imports: [AsociacionesListComponent,
        PaginationControlsComponent, AsociacionesFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-category-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-category-filter>

            <app-category-list
                class="w-full"
                [categories]="asociaciones"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-category-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class AsociacionesContainersComponent implements OnInit {
    public error: string = '';
    public asociaciones: Asociaciones[] = [];
    public paginationEvent = new PaginationEvent();
    public categoryFilter: AsociacionesFilter;

    public unitMeasurement = new Asociaciones();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _categoryService: AsociacionesService,
        private _asociacionescrearService: AsociacionescrearService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog
    ) {
    }

    ngOnInit() {
        // this.getCategories();
    }

    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginationEvent = paginationEvent;
        this.mergeFilterAndPagination();
    }

    public eventFilter(categoryFilter: AsociacionesFilter): void {
        this.categoryFilter = categoryFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.categoryFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getCategories(mergedData);
    }

    private getCategories(data?: any): void {
        this._categoryService.getWithQuery$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.asociaciones = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const categoryForm = this._matDialog.open(AsociacionesNewComponent);
            categoryForm.componentInstance.title = 'Nueva Categoria' || null;

            categoryForm.afterClosed().subscribe((result: any) => {
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
        this._asociacionescrearService.add$(data).subscribe((response) => {
            if (response) {
                this.getCategories();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string): void {
        this._asociacionescrearService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response.content;
            const categoryForm = this._matDialog.open(AsociacionesEditComponent);
            categoryForm.componentInstance.title = 'Editar Categoría' || null;
            categoryForm.componentInstance.unitMeasurement = this.unitMeasurement;

            categoryForm.afterClosed().subscribe((result: any) => {
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
            this._asociacionescrearService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getCategories();
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: Asociaciones) {
        this._asociacionescrearService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getCategories();
            }
        });
    }
}
