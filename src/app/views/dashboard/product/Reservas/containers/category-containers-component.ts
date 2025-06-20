import {Component, OnInit} from '@angular/core';
import {Category, CategoryFilter, PaginatedResponse} from '../models/./category';
import {CategoryListComponent} from '../components/list/category-list.component';
import {MatDialog} from '@angular/material/dialog';
import {CategoryNewComponent} from '../components/form/category-new.component';

import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {CategoryFilterComponent} from "../components/filter/category-filter.component";
import {CategoryEditComponent} from "../components/form/category-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {CategoryService} from "../../../../../providers/services/catalog/category.service";
import {ReservasService} from "../../../../../providers/services/product/Reservas.service";


@Component({
    selector: 'app-category-container',
    standalone: true,
    imports: [CategoryListComponent,
        PaginationControlsComponent, CategoryFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-category-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-category-filter>

            <app-category-list
                class="w-full"
                [categories]="categories"
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
export class CategoryContainersComponent implements OnInit {
    public error: string = '';
    public categories: Category[] = [];
    public paginationEvent = new PaginationEvent();
    public categoryFilter: CategoryFilter;

    public unitMeasurement = new Category();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _categoryService: ReservasService,
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

    public eventFilter(categoryFilter: CategoryFilter): void {
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
                this.categories = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const categoryForm = this._matDialog.open(CategoryNewComponent);
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
        this._categoryService.add$(data).subscribe((response) => {
            if (response) {
                this.getCategories();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string): void {
        this._categoryService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const categoryForm = this._matDialog.open(CategoryEditComponent);
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
            this._categoryService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getCategories();
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: Category) {
        this._categoryService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getCategories();
            }
        });
    }
}
