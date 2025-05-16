import {Component, Input, OnInit} from '@angular/core';
import {abcForms} from '../../../../../../../environments/generals';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {Role} from "../../../role/models/role";
import {JsonPipe} from "@angular/common";

@Component({
    selector: 'app-user-role-assign',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        JsonPipe,
    ],
    template: `
        <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <!-- Header -->
            <div class="flex items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium">Roles</div>
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
                    @for (item of roles; track item.id; let idx = $index) {
                        <li class="w-full border-b">
                            <div class="flex items-center ps-3">
                                <input
                                    type="checkbox"id="men{{ idx }}"
                                    class="w-5 h-5"
                                />
                                    <!--[(ngModel)]="item.selected"-->

                                <label
                                    for="men{{ idx }}"
                                    class="w-full py-3 ms-2">{{ item.name }}</label>
                            </div>
                        </li>
                    }
                </ul>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between m-6">
                <div class="flex space-x-4 items-center mt-4 sm:mt-0">
                    <button [color]="'warn'" mat-stroked-button (click)="cancelForm()">
                        Cancelar
                    </button>
                    <button [color]="'primary'" mat-stroked-button (click)="saveAssign()">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    `,
})
export class UserRolesAsingComponent implements OnInit {
    @Input() title: string = '';
    @Input() roles: Role[] = [];
    abcForms: any;
    constructor(
        private _matDialog: MatDialogRef<UserRolesAsingComponent>
    ) {
    }

    ngOnInit() {
        this.abcForms = abcForms;
    }


    public saveAssign(): void {
        this._matDialog.close(this.roles);

    }

    public cancelForm(): void {
        this._matDialog.close('');
    }
}
