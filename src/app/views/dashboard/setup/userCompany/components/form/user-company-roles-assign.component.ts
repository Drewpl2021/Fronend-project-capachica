import {Component, Input, OnInit} from '@angular/core';
import {abcForms} from '../../../../../../../environments/generals';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RolAssigned} from '../../models/rolAssigned';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import {MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {ConfirmDialogService} from 'app/shared/confirm-dialog/confirm-dialog.service';
import {CompanyUserRoleService} from "../../../../../../providers/services/setup/company-user-role.service";

@Component({
    selector: 'app-user-company-role-assign',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    template: `
        <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <!-- Header -->
            <div class="flex items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium">Nuevo Usuario</div>
                <button mat-icon-button (click)="cancelForm()">
                    <mat-icon
                        class="text-current"
                        [svgIcon]="'heroicons_outline:x-mark'"
                    ></mat-icon>
                </button>
            </div>

            <!-- Body -->
            <div class="flex justify-center my-4">
                <ul class="w-1/3  text-base font-medium bg-white border border-gray-200 rounded-lg">
                    @for (item of rolAssigneds; track item.id; let idx = $index) {

                        <li class="w-full border-b">
                            <div class="flex items-center ps-3">
                                <input
                                    type="checkbox"
                                    [(ngModel)]="item.selected"
                                    id="men{{ idx }}"
                                    class="w-5 h-5"
                                />
                                <label
                                    for="men{{ idx }}"
                                    class="w-full py-3 ms-2"
                                >{{ item.name }}</label
                                >
                            </div>
                        </li>
                    }
                </ul>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between m-6">
                <div class="flex space-x-4 items-center mt-4 sm:mt-0">
                    <button
                        [color]="'warn'"
                        mat-stroked-button
                        (click)="cancelForm()">
                        Cancelar
                    </button>
                    <button
                        [color]="'primary'"
                        mat-stroked-button
                        (click)="saveAssign()">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    `,
})
export class UserRolesAsingComponent implements OnInit {
    @Input() title: string = '';
    @Input() idUser: string = '';
    abcForms: any;
    rolAssigneds: RolAssigned[] = [];
    rolesIds: number[] = [];
    private subscription: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private _companyUserRoleService: CompanyUserRoleService,
        private _rolService: CompanyUserRoleService,
        private _matDialog: MatDialogRef<UserRolesAsingComponent>,
        private _confirmDialogService: ConfirmDialogService
    ) {
    }

    ngOnInit() {
        this.abcForms = abcForms;
        this.getListRoles(this.idUser);
    }


    getListRoles(idUser: string) {
        //const params: any = {usuario_id: idUser};
        this.subscription = this._rolService
            .getAllRolesSelectedByUserIdAndCompanyId$(idUser)
            .subscribe(
                (response) => {
                    this.rolAssigneds = (response && response) || [];
                },
                (error) => {

                    // Manejar el error adecuadamente
                }
            );
    }

    public saveAssign(): void {
        this.rolAssigneds.map((data) => {
            if (data.selected) {
                this.rolesIds.push(data.id!);

            }
        });
        this._confirmDialogService
            .confirmSave()
            .then(() => {
                const dataBody: any = {
                    userId: this.idUser,
                    roleIds: this.rolesIds
                };
                this._companyUserRoleService.add$(dataBody).subscribe((response) => {
                    if (response) {
                        this._matDialog.close('');
                    }
                });
            })
            .catch(() => {
            });
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }
}
