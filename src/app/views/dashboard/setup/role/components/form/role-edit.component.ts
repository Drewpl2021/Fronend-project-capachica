import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogRef} from '@angular/material/dialog';
import {MatOptionModule, MatPseudoCheckboxModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {Role} from "../../models/role";

@Component({
    selector: 'app-module-new',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        NgForOf,
        MatPseudoCheckboxModule,
    ],
    template: `
        <div class="container mx-auto max-w-lg">
            <!-- 🖥️ Formulario para escritorio -->
            <div class="hidden md:block bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="flex items-center justify-between h-16 px-6 bg-primary text-white">
                    <div class="text-lg font-medium">Editar Rol</div>
                    <button mat-icon-button (click)="cancelForm()">
                        <mat-icon class="text-current">close</mat-icon>
                    </button>
                </div>

                <form [formGroup]="roleForm" class="flex flex-col p-6 sm:p-8">
                    <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Rol</mat-label>
                        <input type="text" matInput formControlName="name"/>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Descripción</mat-label>
                        <input type="text" matInput formControlName="description"/>
                    </mat-form-field>

                    <mat-slide-toggle formControlName="status" color="primary">Activo</mat-slide-toggle>
                </form>

                <div class="flex justify-end space-x-3 p-6">
                    <button mat-stroked-button color="warn" (click)="cancelForm()">Cancelar</button>
                    <button mat-stroked-button color="primary" [disabled]="roleForm.invalid" (click)="saveForm()">Guardar</button>
                </div>
            </div>

            <!-- 📱 Formulario Móvil en Tarjetas -->
            <div class="block md:hidden bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="bg-gray-800 text-white p-4 text-lg font-bold flex justify-between items-center">
                    <span>Editar Rol</span>
                    <button mat-icon-button (click)="cancelForm()">
                        <mat-icon>close</mat-icon>
                    </button>
                </div>

                <form [formGroup]="roleForm" class="p-4 space-y-4">
                    <div>
                        <label class="font-semibold text-gray-600">Rol</label>
                        <input type="text" class="w-full border rounded-lg p-2 mt-1" formControlName="name">
                    </div>

                    <div>
                        <label class="font-semibold text-gray-600">Descripción</label>
                        <input type="text" class="w-full border rounded-lg p-2 mt-1" formControlName="description">
                    </div>

                    <div class="flex items-center space-x-2">
                        <mat-slide-toggle formControlName="status" color="primary">Activo</mat-slide-toggle>
                    </div>
                </form>

                <div class="flex justify-between p-4 border-t">
                    <button class="bg-gray-500 text-white px-4 py-2 rounded-lg" (click)="cancelForm()">Cancelar</button>
                    <button class="bg-primary text-white px-4 py-2 rounded-lg" [disabled]="roleForm.invalid" (click)="saveForm()">Guardar</button>
                </div>
            </div>
        </div>

    `,
})
export class RoleEditComponent implements OnInit {
    @Input() title: string = '';
    @Input() role = new Role();
    abcForms: any;
    roleForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        status: new FormControl(null, [Validators.required]),
        modules: new FormControl([])
    });

    constructor(
        private _matDialog: MatDialogRef<RoleEditComponent>
    ) {
    }

    ngOnInit() {
        this.abcForms = abcForms;
        this.roleForm.patchValue(this.role);

    }

    public saveForm(): void {
        if (this.roleForm.valid) {
            this._matDialog.close(this.roleForm.value);
        }
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }
}
