import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from "@angular/material/select";
import {CommonModule, JsonPipe} from "@angular/common";
import {MatPseudoCheckboxModule} from "@angular/material/core";

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
        MatSelectModule,
        JsonPipe,
        CommonModule,
        MatPseudoCheckboxModule
    ],
    template: `
        <!--<div class=" container" style="width: 500px">
            <div
                class="header flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium">Nuevo Rol</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon
                        class="text-current"
                        [svgIcon]="'heroicons_outline:x-mark'"
                    ></mat-icon>
                </button>
            </div>
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto"
                  [formGroup]="roleForm">
                <mat-form-field>
                    <mat-label>Rol</mat-label>
                    <input type="text" matInput [formControlName]="'name'"/>
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Descripcion</mat-label>
                    <input type="text" matInput [formControlName]="'description'"/>
                </mat-form-field>
            </form>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                <div class="flex space-x-2 items-center mt-4 sm:mt-0">
                    <button class="ml-auto sm:ml-0"
                            [color]="'warn'"
                            mat-stroked-button
                            (click)="cancelForm()">
                        Cancelar
                    </button>
                    <button
                        class="ml-auto sm:ml-0"
                        [color]="'primary'"
                        [disabled]="roleForm.invalid"
                        mat-stroked-button
                        (click)="saveForm()">
                        Guardar
                    </button>
                </div>
            </div>
        </div>-->
        <!-- 📌 Formulario Responsivo con TailwindCSS -->
        <div class="container mx-auto max-w-lg">
            <!-- 🖥️ Formulario para escritorio -->
            <div class="hidden md:block bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="flex items-center justify-between h-16 px-6 bg-primary text-white">
                    <div class="text-lg font-medium">Nuevo Rol</div>
                    <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
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
                </form>

                <div class="flex justify-end space-x-3 p-6">
                    <button mat-stroked-button color="warn" (click)="cancelForm()">Cancelar</button>
                    <button mat-stroked-button color="primary" [disabled]="roleForm.invalid" (click)="saveForm()">Guardar</button>
                </div>
            </div>

            <!-- 📱 Formulario Móvil en Tarjetas -->
            <div class="block md:hidden bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="bg-gray-800 text-white p-4 text-lg font-bold flex justify-between items-center">
                    <span>Nuevo Rol</span>
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
                </form>

                <div class="flex justify-between p-4 border-t">
                    <button class="bg-gray-500 text-white px-4 py-2 rounded-lg" (click)="cancelForm()">Cancelar</button>
                    <button class="bg-primary text-white px-4 py-2 rounded-lg" [disabled]="roleForm.invalid" (click)="saveForm()">Guardar</button>
                </div>
            </div>
        </div>


    `,
})
export class RoleNewComponent implements OnInit {
    @Input() title: string = '';
    abcForms: any;
    roleForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        modules: new FormControl([])

    });

    constructor(
        private _matDialog: MatDialogRef<RoleNewComponent>
    ) {
    }


    ngOnInit() {
        this.abcForms = abcForms;
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
