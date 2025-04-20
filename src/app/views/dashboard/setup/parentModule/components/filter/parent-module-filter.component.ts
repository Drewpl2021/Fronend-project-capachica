import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
    selector: 'app-parent-module-filter',
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
        <div class="header-container ">
            <div class="header-title bg-primary-600">
                <span class="header-icon">🏗️</span>
                <span>Lista de Módulos Padres</span>
            </div>
            <div class="actions-container">
                <form class="flex flex-col sm:flex-row items-center space-x-4 space-y-4 sm:space-y-0 w-full" [formGroup]="parentModuleFilterForm">
                    <div class="flex-1">
                        <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded w-full">
                            <mat-icon matPrefix [svgIcon]="'heroicons_solid:magnifying-glass'" class="icon-size-5"></mat-icon>
                            <input type="text" matInput [formControlName]="'title'" [autocomplete]="'off'" [placeholder]="'Buscar Modulo Padre'"/>
                        </mat-form-field>
                    </div>
                </form>
                <div class="flex items-center">
                    <button class="action-button" mat-flat-button [color]="'primary'" (click)="goNew()" >
                        <mat-icon [svgIcon]="'heroicons_outline:plus'"></mat-icon>
                        <span class="ml-2">Nuevo Módulo Padre</span>
                    </button>
                </div>
            </div>
        </div>


    `,
})
export class ParentModuleFilterComponent implements OnInit {

    @Output() eventFilter: EventEmitter<any> = new EventEmitter<any>();
    @Output() eventNew = new EventEmitter<boolean>();
    abcForms: any;
    parentModuleFilterForm = new FormGroup({
        title: new FormControl('', [Validators.required])

    });

    constructor() {
    }

    ngOnInit() {
        this.abcForms = abcForms;
        this.parentModuleFilterForm.valueChanges.subscribe(value => {

            this.eventFilter.emit(value);
        });
    }

    public goNew() {
        this.eventNew.emit(true);
    }

}
