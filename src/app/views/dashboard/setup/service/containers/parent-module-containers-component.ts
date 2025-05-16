import {Component, OnInit} from '@angular/core';
import {PaginatedResponse, Service, ServiceFilter,} from '../models/parent-module';
import {ParentModuleListComponent} from '../components/lists/parent-module-list.component';
import {MatDialog} from '@angular/material/dialog';
import {ParentModuleNewComponent} from '../components/form/parent-module-new.component';
import {ParentModuleService} from "../../../../../providers/services/setup/parent-module.service";
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {ParentModuleFilterComponent} from "../components/filter/parent-module-filter.component";
import {ParentModuleEditComponent} from "../components/form/parent-module-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {ServicioService} from "../../../../../providers/services/setup/servicio.service";

@Component({
    selector: 'app-parent-module-container',
    standalone: true,
    imports: [ParentModuleListComponent,
        PaginationControlsComponent, ParentModuleFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <div class="flex flex-col  md:min-w-160 max-h-screen -m-6">
                <app-parent-module-filter
                    (eventFilter)="eventFilter($event)"
                    (eventNew)="eventNew($event)">
                </app-parent-module-filter>
            </div>
            <app-parent-module-list
                class="w-full"
                [parentModules]="parentModules"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-parent-module-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class ParentModuleContainersComponent implements OnInit {
    public error: string = '';
    public parentModules: Service[] = [];
    public paginationEvent = new PaginationEvent();
    public parentModuleFilter: ServiceFilter;
    public parentModule = new Service();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 10;
    constructor(
        private _parentModuleService: ServicioService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog
    ) {
    }

    ngOnInit() {
        //this.getParentModule();
    }

    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginationEvent = paginationEvent;
        this.mergeFilterAndPagination();
    }

    public eventFilter(parentModuleFilter: ServiceFilter): void {
        this.parentModuleFilter = parentModuleFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.parentModuleFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getParentModule(mergedData);
    }

    private getParentModule(data?: any): void {
        this._parentModuleService.getWithQuery$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.parentModules = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const paretModuleForm = this._matDialog.open(ParentModuleNewComponent);
            paretModuleForm.componentInstance.title = 'Nuevo Padre Mudulo' || null;
            paretModuleForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.save(result);
                }
            });
        }
    }

    private save(data: Object) {
        this._parentModuleService.add$(data).subscribe((response) => {
            if (response) {
                this.getParentModule();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string) {
        this._parentModuleService.getById$(id).subscribe((response) => {
            this.parentModule = response;
            const paretModuleForm = this._matDialog.open(ParentModuleEditComponent);
            paretModuleForm.componentInstance.title = 'Editar Padre Modulo' || null;
            paretModuleForm.componentInstance.parentModule = this.parentModule;
            paretModuleForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.edit(result);
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
            this._parentModuleService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getParentModule();
                }
            });
        }).catch(() => {
        });
    }

    private edit(parentModule: Service) {
        this._parentModuleService.update$(this.parentModule.id, parentModule).subscribe((response) => {
            if (response) {
                this.getParentModule();
            }
        });
    }
}
