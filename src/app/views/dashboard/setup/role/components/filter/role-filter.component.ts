import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';


@Component({
    selector: 'app-role-filter',
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
        <div class="header-container flex flex-col sm:flex-row justify-between items-center p-4 bg-white shadow-md rounded-md">
            <!-- 🖥️ 📱 Título con icono -->
            <div class="header-title flex items-center space-x-3 text-primary-600 text-lg font-bold">
                <span class="header-icon text-2xl">🤝‍</span>
                <span>Lista de Roles</span>
            </div>

            <!-- 📱 Formulario de búsqueda (Móvil + Escritorio) -->
            <div class="w-full sm:w-auto mt-4 sm:mt-0">
                <form class="flex flex-col sm:flex-row items-center space-x-4 space-y-2 sm:space-y-0 w-full" [formGroup]="roleFilterForm">
                    <div class="w-full sm:w-64">
                        <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded w-full">
                            <mat-icon matPrefix [svgIcon]="'heroicons_solid:magnifying-glass'" class="icon-size-5"></mat-icon>
                            <input type="text" matInput [formControlName]="'name'" autocomplete="off" placeholder="Buscar Rol"/>
                        </mat-form-field>
                    </div>
                </form>
            </div>

            <!-- 🖥️ 📱 Botón Nuevo Rol (Adaptado a móviles y escritorio) -->
            <div class="w-full sm:w-auto mt-4 sm:mt-0 flex justify-center sm:justify-end">
                <button class="w-full sm:w-auto action-button flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md shadow-md hover:bg-primary-700 transition duration-200"
                        mat-flat-button (click)="goNew()">
                    <mat-icon [svgIcon]="'heroicons_outline:plus'" class="mr-2"></mat-icon>
                    <span>Nuevo Rol</span>
                </button>
            </div>
        </div>


    `,
})
export class RoleFilterComponent implements OnInit {

    @Output() eventFilter: EventEmitter<any> = new EventEmitter<any>();
    @Output() eventNew = new EventEmitter<boolean>();
    abcForms: any;
    roleFilterForm = new FormGroup({
        name: new FormControl('', [Validators.required])

    });

    constructor() {
    }

    ngOnInit() {
        this.abcForms = abcForms;
        this.roleFilterForm.valueChanges.subscribe(value => {
            this.eventFilter.emit(value);
        });
    }

    public goNew() {
        this.eventNew.emit(true);
    }

}
