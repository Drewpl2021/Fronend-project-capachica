import {Component, OnInit} from '@angular/core';
import {Module, ModuleFilter, PaginatedResponse} from '../models/module';
import {ModuleListComponent} from '../components/lists/module-list.component';
import {MatDialog} from '@angular/material/dialog';

import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {ModuleFilterComponent} from "../components/filter/module-filter.component";
import {ModuleEditComponent} from "../components/form/module-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {ModuleService} from "../../../../../providers/services/setup/module.service";
import {ParentModuleService} from "../../../../../providers/services/setup/parent-module.service";
import {ParentModule} from "../../parentModule/models/parent-module";
import {SectionsService} from "../../../../../providers/services/setup/sections.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-module-container',
    standalone: true,
    imports: [ModuleListComponent,
        PaginationControlsComponent, ModuleFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <div class="flex flex-col md:min-w-160 max-h-screen -m-6">
                <app-module-filter
                    (eventFilter)="eventFilter($event)">
                </app-module-filter>
            </div>
            <app-module-list
                class="w-full"
                [modules]="modules"
                (eventView)="eventView($event)"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-module-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class ModuleContainersComponent implements OnInit {
    public error: string = '';
    public modules: Module[] = [];
    public paginationEvent = new PaginationEvent();
    public moduleFilter: ModuleFilter;
    public parentModules: ParentModule[] = [];
    public module = new Module();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 10;

    constructor(
        private _moduleService: SectionsService,
        private _parentModuleService: ParentModuleService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.getParentModule();
    }

    private getParentModule(data?: any): void {
        this._parentModuleService.getAllNotPaginate().subscribe(
            (response) => {
                this.parentModules = response;

            },
            (error) => {
                this.error = error;
            }
        );
    }

    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginationEvent = paginationEvent;
        this.mergeFilterAndPagination();
    }

    public eventFilter(moduleFilter: ModuleFilter): void {
        this.moduleFilter = moduleFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.moduleFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getModule(mergedData);
    }

    private getModule(data?: any): void {
        this._moduleService.getWithQuery$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.modules = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }


    public eventEdit(id: string) {
        this._moduleService.getById$(id).subscribe((response) => {
            this.module = response;
            const moduleForm = this._matDialog.open(ModuleEditComponent);
            moduleForm.componentInstance.title = 'Editar Modulo' || null;
            moduleForm.componentInstance.module = this.module;
            moduleForm.componentInstance.parentModules = this.parentModules;

            moduleForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.edit(result);
                }
            });
        });
    }
    public eventView(id: string): void {
        if (id) {
            this.router.navigate([`view-sections/${id}`], { relativeTo: this.route }).then((success) => {
            });
        }
    }

    public eventDelete(id: string) {
        this._confirmDialogService.confirmDelete(
            {
                // title: 'Confirmación Personalizada',
                // message: `¿Quieres proceder con esta acción ${}?`,
            }
        ).then(() => {
            this._moduleService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getModule();
                }
            });
        }).catch(() => {
        });
    }

    private edit(module: Module) {
        this._moduleService.update$(this.module.id, module).subscribe((response) => {
            if (response) {
                this.getModule();
            }
        });
    }
}
