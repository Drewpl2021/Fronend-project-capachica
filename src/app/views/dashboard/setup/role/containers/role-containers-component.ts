import {Component, OnInit} from '@angular/core';
import {RoleListComponent} from '../components/lists/role-list.component';
import {MatDialog} from '@angular/material/dialog';
import {RoleNewComponent} from '../components/form/role-new.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {RoleFilterComponent} from "../components/filter/role-filter.component";
import {RoleEditComponent} from "../components/form/role-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {ParentModuleService} from "../../../../../providers/services/setup/parent-module.service";
import {ParentModule} from "../../parentModule/models/parent-module";
import {PaginatedResponseRole, Role, RoleFilter} from "../models/role";
import {RoleService} from "../../../../../providers/services";
import {RoleAssignComponent} from "../components/form/role-assign.component";

@Component({
    selector: 'app-role-container',
    standalone: true,
    imports: [RoleListComponent,
        PaginationControlsComponent, RoleFilterComponent, RoleAssignComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <div class="flex flex-col  md:min-w-160 max-h-screen -m-6">
                <app-role-filter
                    (eventFilter)="eventFilter($event)"
                    (eventNew)="eventNew($event)">
                </app-role-filter>
            </div>
            <app-role-list
                class="w-full"
                [roles]="roles"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
                (eventAsignet)="eventAsignet($event)"
            ></app-role-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class RoleContainersComponent implements OnInit {
    public error: string = '';
    public roles: Role[] = [];
    public role = new Role();
    public paginationEvent = new PaginationEvent();
    public roleFilter: RoleFilter;
    public parentModules: ParentModule[] = [];
    paginatedResponse: PaginatedResponseRole = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 10;

    constructor(
        private _roleService: RoleService,
        private _parentModuleService: ParentModuleService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog
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

    public eventFilter(roleFilter: RoleFilter): void {
        this.roleFilter = roleFilter;
        this.mergeFilterAndPagination();
    }

    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.roleFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getModule(mergedData);
    }

    private getModule(data?: any): void {
        this._roleService.getWithQuery$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.roles = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const roleForm = this._matDialog.open(RoleNewComponent);
            roleForm.componentInstance.title = 'Nuevo Rol' || null;
            roleForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.save(result);
                }
            });
        }
    }

    private save(data: Object) {
        this._roleService.add$(data).subscribe((response) => {
            if (response) {
                this.getModule();
            }
        }, (error) => {
        });
    }

    public eventEdit(id: string) {
        this._roleService.getById$(id).subscribe((response) => {
            this.role = response;
            const roleForm = this._matDialog.open(RoleEditComponent);
            roleForm.componentInstance.title = 'Editar Rol' || null;
            roleForm.componentInstance.role = this.role;
            roleForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.edit(result);
                }
            });
        });
    }
    private edit(role: Role) {
        this._roleService.update$(this.role.id, role).subscribe((response) => {
            if (response) {
                this.getModule();
            }
        });
    }

    public eventDelete(id: string) {
        this._confirmDialogService.confirmDelete(
            {
                // title: 'Confirmación Personalizada',
                // message: `¿Quieres proceder con esta acción ${}?`,
            }
        ).then(() => {
            this._roleService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getModule();
                }
            });
        }).catch(() => {
        });
    }



    private assigment(data: Object) {
        this._roleService.postAssigmentModulesToRole$(data).subscribe((response) => {
            if (response) {
                this.getModule();
            }
        });
    }


    public eventAsignet(roleId: string): void {

        const roleForm = this._matDialog.open(RoleAssignComponent);
        roleForm.componentInstance.title = 'Editar Rol' || null;
        roleForm.componentInstance.roleId = roleId;
        roleForm.componentInstance.parentModules = this.parentModules;
        roleForm.afterClosed().subscribe((result: any) => {
            if (result) {
                this.assigment(result);
            }
        });
    }
}
