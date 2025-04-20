import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {Stores} from "../../models/product-dynamics";
import {StoresService} from "../../../../../../providers/services/accounting/stores.service";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {NgForOf} from "@angular/common";


@Component({
    selector: 'app-product-dynamics-filter',
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
        MatOptionModule,
        NgForOf,
    ],
    template: `
        <div class="header-container">
            <div class="header-title bg-primary-600">
                <span class="header-icon">🚚</span>
                <span>Distribución de Productos</span>
            </div>
            <div class="actions-container">
                <form class="form-container" [formGroup]="unitMeasurementFilterForm">
                    <div class="flex flex-row gap-5 items-center">
                        <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded w-64" [subscriptSizing]="'dynamic'">
                            <mat-icon matPrefix [svgIcon]="'heroicons_solid:magnifying-glass'" class="text-gray-500"></mat-icon>
                            <input matInput formControlName="concatenatedFields" [placeholder]="'Buscar Productos'" />
                        </mat-form-field>

                        <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded w-64" [subscriptSizing]="'dynamic'">
                            <mat-select formControlName="storeId">
                                <mat-option value="" disabled>Seleccionar Almacén</mat-option>
                                <mat-option [value]="null">Mostrar todo</mat-option>
                                <mat-option *ngFor="let store of stores" [value]="store.id">
                                    {{ store.name }}
                                </mat-option>
                            </mat-select>
                        </mat-form-field>

                    </div>

                </form>
            </div>
        </div>

    `,
})
export class ProductDynamicsFilterComponent implements OnInit {
    @Output() eventFilter: EventEmitter<any> = new EventEmitter<any>();
    stores: Stores[] = [];
    unitMeasurementFilterForm = new FormGroup({
        concatenatedFields: new FormControl('', [Validators.required]),
        storeId: new FormControl(''),
    });

    constructor(private storesService: StoresService) {}

    ngOnInit() {
        this.unitMeasurementFilterForm.valueChanges.subscribe(value => {
            this.eventFilter.emit(value);
        });
        this.CargarDatos();
    }

    private CargarDatos() {
        this.storesService.getAll$().subscribe(data => {
            this.stores = data?.content || [];
        });
    }
}
