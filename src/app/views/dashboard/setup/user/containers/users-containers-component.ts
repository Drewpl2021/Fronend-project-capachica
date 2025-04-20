import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../models/user';
import {UserListComponent} from '../components/lists/user-list.component';
import {UsersService} from '../../../../../providers/services/setup/users.service';
import {MatDialog} from '@angular/material/dialog';
import {UserNewComponent} from '../components/form/user-new.component';
import {UserRolesAsingComponent} from '../components/form/user-roles-assign.component';
import {CompanyUserRoleService} from "../../../../../providers/services/setup/company-user-role.service";
import {Role} from "../../role/models/role";
import {catchError, Subscription, take} from "rxjs";

@Component({
    selector: 'app-users-container',
    standalone: true,
    imports: [UserListComponent],
    template: `
        <app-user-list
            class="w-full"
            [users]="users"
            (eventNew)="eventNew($event)"
            (eventAssign)="eventAssign($event)"
            (eventChangeState)="eventChangeState($event)"
        ></app-user-list>
    `,
})
export class UsersContainerComponent implements OnInit, OnDestroy {
    public error: string = '';
    public users: User[] = [];
    public roles: Role[] = [];
    public userId: string = '';
    private subscription: Subscription = new Subscription();

    constructor(
        private _userService: UsersService,
        private _companyUserRoleService: CompanyUserRoleService,
        private _matDialog: MatDialog // private modalService: NgbModal,
    ) {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit() {
        this.getUsers();
    }

    getUsers(): void {
        this._userService.getAll$().subscribe(
            (response) => {
                this.users = response;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const userForm = this._matDialog.open(UserNewComponent);
            userForm.componentInstance.title = 'Nuevo Usuario' || null;
            userForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.saveUser(result);
                }
            });
        }
    }

    saveUser(roles: Role[]) {
        const dataBody: any = {
            userId: this.userId,
            roleIds: roles.filter(role => role.selected).map(role => role.id),
        };
        this._companyUserRoleService.add$(dataBody).subscribe((response) => {
            if (response) {
                this.getUsers();
            }
        });
    }

    eventAssign(idUser: string): void {
        this.userId = idUser;
        if (!idUser) {
            return;
        }

        this.subscription.add(
            this._companyUserRoleService.getAllRolesSelectedByUserIdAndCompanyId$(this.userId)
                .pipe(
                    take(1),
                    catchError((error) => {
                        return [];
                    })
                )
                .subscribe((roles) => {
                    this.roles = roles;
                    this.openUserRolesDialog(this.roles);
                })
        );
    }

    private openUserRolesDialog(roles: Role[]): void {
        const userForm = this._matDialog.open(UserRolesAsingComponent);
        userForm.componentInstance.title = 'Asignar modulos a roles' || null;
        userForm.componentInstance.roles = roles;
        userForm.afterClosed().subscribe((result: any) => {
            if (result) {
                this.saveUser(result);
            }
        });

    }

    public eventChangeState($event: string): void {

    }


}
