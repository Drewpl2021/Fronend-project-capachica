import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
    selector: 'app-cont-asientos-filter',
    standalone: true,
    imports: [FormsModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule,],
    template: `
        <div class="relative flex flex-0 flex-col border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <div class="text-4xl font-extrabold tracking-tight">Categorías</div>
            <div class="mt-4 flex shrink-0 items-center sm:ml-4 sm:mt-0">
                <form class="flex flex-col flex-auto p-4 sm:p-6 overflow-y-auto" [formGroup]="unitMeasurementFilterForm">
                    <mat-form-field class="fuse-mat-dense fuse-mat-rounded min-w-64" [subscriptSizing]="'dynamic'">
                        <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:magnifying-glass'"></mat-icon>
                        <input matInput [formControlName]="'concatenatedFields'" [autocomplete]="'off'" [placeholder]="'Buscar categorías'"/>
                    </mat-form-field>
                </form>
                <button class="ml-4" mat-flat-button [color]="'primary'" (click)="goNew()">
                    <mat-icon [svgIcon]="'heroicons_outline:plus'"></mat-icon>
                    <span class="ml-2 mr-1">Add</span>
                </button>
            </div>
        </div>
    `,
})
export class CategoryFilterComponent implements OnInit {
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
