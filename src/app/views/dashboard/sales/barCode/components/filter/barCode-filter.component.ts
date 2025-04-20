import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {Category} from "../../models/product";
import {CategoryService} from "../../../../../../providers/services/catalog/category.service";


@Component({
    selector: 'app-bar-code-filter',
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
    ],
    template: `
        <div class="header-container">
            <div class="header-title bg-primary-600">
                <span class="header-icon">🖨️</span>
                <span>Imprimir Código de Barras</span>
            </div>
            <div class="actions-container" style="display: flex; align-items: center; gap: 16px;">

                <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded full-width"
                                [subscriptSizing]="'dynamic'"
                                style="flex: 1;">
                    <mat-select [(ngModel)]="viewMode" (selectionChange)="goChangeView($event.value)" placeholder="Cambiar vista">
                        <mat-option [value]="1">Tarjeta</mat-option>
                        <mat-option [value]="2">Tabla</mat-option>
                    </mat-select>
                </mat-form-field>
            </div>
        </div>


    `,
})
export class BarCodeFilterComponent implements OnInit {
    @Output() eventChangeView: EventEmitter<number> = new EventEmitter<number>();
    @Output() eventFilter: EventEmitter<any> = new EventEmitter<any>();
    @Output() eventNew = new EventEmitter<boolean>();
    abcForms: any;
    categoryId: string | null = null;
    public viewMode: number = 1;

    categories: Category[] = [];


    unitMeasurementFilterForm = new FormGroup({
        concatenatedFields: new FormControl(''),
        categoryId: new FormControl(null)

    });

    constructor(

    ) {
    }

    ngOnInit() {
        this.abcForms = abcForms;

    }
    public goChangeView(selectedView: number): void {
        this.viewMode = selectedView;
        this.eventChangeView.emit(selectedView);
    }


}
