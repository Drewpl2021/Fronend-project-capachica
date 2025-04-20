import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';


@Component({
    selector: 'app-entities-filter',
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
        <div class="header-container">
            <!-- Título -->
            <div class="header-title bg-primary-600">
                <span class="header-icon">🧑‍💼</span>
                <span>Entidades</span>
            </div>


            <!-- Botones y Formulario -->
            <div class="actions-container">
                <!-- Formulario de Búsqueda -->
                <form class="form-container" [formGroup]="unitMeasurementFilterForm">
                    <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded" [subscriptSizing]="'dynamic'">
                        <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:magnifying-glass'"></mat-icon>
                        <input
                            matInput
                            [formControlName]="'concatenatedFields'"
                            [autocomplete]="'off'"
                            [placeholder]="'Buscar Personas'"
                        />
                    </mat-form-field>
                </form>

                <!-- Botón Nueva Entidad -->
                <button class="action-button" mat-flat-button [color]="'primary'" (click)="goNew()">
                    <mat-icon [svgIcon]="'heroicons_outline:plus'"></mat-icon>
                    <span>Nueva Entidad</span>
                </button>
            </div>
        </div>

    `,
})
export class EntitiesFilterComponent implements OnInit {

    @Output() eventFilter: EventEmitter<any> = new EventEmitter<any>();
    @Output() eventNew = new EventEmitter<boolean>();
    abcForms: any;
    unitMeasurementFilterForm = new FormGroup({
        concatenatedFields: new FormControl('', [Validators.required])

    });

    constructor() {
    }

    ngOnInit() {
        this.abcForms = abcForms;
        this.unitMeasurementFilterForm.valueChanges.subscribe(value => {
            this.eventFilter.emit(value);
        });
    }

    public goNew() {
        this.eventNew.emit(true);
    }

}
