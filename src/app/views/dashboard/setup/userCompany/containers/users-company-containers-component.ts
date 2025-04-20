import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserCompanyListComponent } from '../components/lists/user-company-list.component';
import { UsersService } from '../../../../../providers/services/setup/users.service';
import { SignupService } from '../../../../../providers/services/oauth';
import { MatDialog } from '@angular/material/dialog';
import { UserCompanyNewComponent } from '../components/form/user-company-new.component';
import { UserRolesAsingComponent } from '../components/form/user-company-roles-assign.component';
@Component({
    selector: 'app-users-company-container',
    standalone: true,
    imports: [UserCompanyListComponent],
    template: `
        <app-user-company-list
            class="w-full"
            [users]="users"
            (eventNew)="eventNew($event)"
            (eventAssign)="eventAssign($event)"
            (eventChangeState)="eventChangeState($event)">

        </app-user-company-list>
    `,
})
export class UsersContainerComponent implements OnInit {
    public error: string = '';
    public users: User[] = [];
    public user = new User();
    public userTree: any;

    constructor(
        private _userService: UsersService,
        private _signupService: SignupService,
        private _matDialog: MatDialog // private modalService: NgbModal,
    ) // private confirmDialogService: ConfirmDialogService
    {}

    ngOnInit() {
        this.getUsers();
    }

    getUsers(): void {
        this._userService.getByCompany$().subscribe(
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
            const userForm = this._matDialog.open(UserCompanyNewComponent);
            userForm.componentInstance.title = 'Nuevo Product' || null;
            userForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.saveUser(result);
                }
            });
        }
    }

    saveUser(data: Object) {
        this._userService.postCompany(data).subscribe((response) => {
            if (response) {
                this.getUsers();
            }
           // this.users = (response && response.data) || [];

        }, (error) => {
        });
    }

    eventAssign($event: string) {
        if($event){
            const userForm = this._matDialog.open(UserRolesAsingComponent);
            userForm.componentInstance.title = 'Nuevo Product' || null;
            userForm.componentInstance.idUser = $event;
            userForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.saveUser(result);
                }
            });
        }

    }

    public eventChangeState($event: string): void {
        this._userService.updateStateUserId$($event).subscribe((response) => {
            this.users = response.data;
        });
    }


}
