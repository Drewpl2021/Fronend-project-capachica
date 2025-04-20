import {Component, OnInit} from '@angular/core';
import {TypeAffectation, TypeAffectationFilter, PaginatedResponse} from '../models/type-affectation';
import {TypeAffectationListComponent} from '../components/list/type-affectation-list.component';
import {MatDialog} from '@angular/material/dialog';
import {TypeAffectationNewComponent} from '../components/form/type-affectation-new.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {TypeAffectationFilterComponent} from "../components/filter/type-affectation-filter.component";
import {TypeAffectationEditComponent} from "../components/form/type-affectation-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {TypeAffectationService} from "../../../../../providers/services/accounting/type-afectation.service";

@Component({
    selector: 'app-type-affectation-container',
    standalone: true,
    imports: [TypeAffectationListComponent,
        PaginationControlsComponent, TypeAffectationFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">

            <app-type-affectation-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-type-affectation-filter>

            <app-type-affectation-list
                class="w-full"
                [type_affectation]="type_affectation"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-type-affectation-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class TypeAffectationContainersComponent implements OnInit {
    public error: string = '';
    public type_affectation: TypeAffectation[] = [];
    public paginationEvent = new PaginationEvent();
    public affectationFilter: TypeAffectationFilter;

    public unitMeasurement = new TypeAffectation();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _affectationService: TypeAffectationService,
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

    public eventFilter(affectationFilter: TypeAffectationFilter): void {
        this.affectationFilter = affectationFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.affectationFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getAffectation(mergedData);
    }

    private getAffectation(data?: any): void {
        this._affectationService.getWithSearch$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.type_affectation = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const affectationForm = this._matDialog.open(TypeAffectationNewComponent);
            affectationForm.componentInstance.title = 'Nuevo Tipo de Afectación' || null;

            affectationForm.afterClosed().subscribe((result: any) => {
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
        this._affectationService.add$(data).subscribe((response) => {
            if (response) {
                this.getAffectation();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string): void {
        this._affectationService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const affectationForm = this._matDialog.open(TypeAffectationEditComponent);
            affectationForm.componentInstance.title = 'Editar Tipo de Afectación' || null;
            affectationForm.componentInstance.unitMeasurement = this.unitMeasurement;

            affectationForm.afterClosed().subscribe((result: any) => {
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
            this._affectationService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getAffectation();
                }
            });
        }).catch(() => {
        });
    }

    private edit(UnitMeasurement: TypeAffectation) {
        this._affectationService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getAffectation();
            }
        });
    }
}
