import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
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
import {Stores} from "../../../../accounting/stores/models/stores";
import {StoresService} from "../../../../../../providers/services/accounting/stores.service";
import {CategoryService} from "../../../../../../providers/services/catalog/category.service";
import {PriceDetail} from "../../models/price-details";
import {PricesService} from "../../../../../../providers/services/sales/prices.service";
import {Prices} from "../../../prices/models/prices";


@Component({
    selector: 'app-price-details-filter',
    standalone: true,
    imports: [FormsModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, NgForOf,],
    template: `
        <div class="header-container ">
            <div class="header-title bg-primary-600">
                <span class="header-icon">💰</span> <!-- Emoji de dinero -->
                <span>Lista de Precios Detalle</span>
            </div>
            <div class="actions-container">
                <form class="form-container" [formGroup]="unitMeasurementFilterForm">
                    <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded" [subscriptSizing]="'dynamic'">
                        <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:magnifying-glass'"></mat-icon>
                        <input matInput [formControlName]="'concatenatedFields'" [autocomplete]="'off'" [placeholder]="'Buscar Articulo'"/>
                    </mat-form-field>
                </form>
                <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded w-64" [subscriptSizing]="'dynamic'">
                    <mat-select [placeholder]="'Seleccionar Categoría*'" (selectionChange)="onCategoryChange($event)">
                        <mat-option *ngFor="let category of categories" [value]="category.id">
                            {{ category.name }}
                        </mat-option>
                    </mat-select>
                </mat-form-field>
                <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded w-64" [subscriptSizing]="'dynamic'">
                    <mat-select [placeholder]="'Seleccionar Almacén*'" (selectionChange)="onStoreChange($event)">
                        <mat-option *ngFor="let store of stores" [value]="store.id">
                            {{ store.name }}
                        </mat-option>
                    </mat-select>
                </mat-form-field>
                <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded w-64" [subscriptSizing]="'dynamic'">
                    <mat-select [placeholder]="'Seleccionar Precio*'" (selectionChange)="onPriceChange($event)">
                        <mat-option *ngFor="let price of prices" [value]="price.id">
                            {{ price.name }}
                        </mat-option>
                    </mat-select>
                </mat-form-field>
                <button class="action-button" mat-flat-button [color]="'primary'" (click)="emitVisualizeEvent()"
                        [disabled]="!selectedPriceId || !selectedStoreId || !selectedCategoryId">
                    <mat-icon [svgIcon]="'heroicons_outline:funnel'"></mat-icon>
                    <span class="ml-1"> Visualizar</span>
                </button>
            </div>
        </div>

    `,
})
export class PriceDetailsFilterComponent implements OnInit {
    @Output() eventVisualize: EventEmitter<{ storeId: string; categoryId: string; priceId: string }> = new EventEmitter();
    @Output() eventFilter: EventEmitter<any> = new EventEmitter<any>();
    @Output() eventNew = new EventEmitter<boolean>();
    abcForms: any;
    stores: Stores[] = [];
    categories: PriceDetail[] = [];
    prices: Prices[] = [];
    searchTerm: string = '';
    selectedCategoryId: string | null = null;
    selectedPriceId: string | null = null;
    selectedStoreId: string | null = null;

    unitMeasurementFilterForm = new FormGroup({
        concatenatedFields: new FormControl('', [Validators.required])

    });

    constructor(
        private _storesService: StoresService,
        private _categoryService: CategoryService,
        private _pricesService: PricesService,

    ) {}

    ngOnInit() {
        this.abcForms = abcForms;
        this.unitMeasurementFilterForm
            .get('concatenatedFields')
            ?.valueChanges.subscribe((value: string) => {
            this.searchTerm = value; // Guardar el valor en `searchTerm`


            // Emitir el valor para otros componentes si es necesario
            this.eventFilter.emit({ searchTerm: this.searchTerm });
        });
        this.CargarDatos();
    }

    private CargarDatos() {
        this._storesService.getAll$().subscribe((data) => {
            this.stores = data?.content || [];
        });

        this._categoryService.getAlls$(0, 1000).subscribe((data) => {
            this.categories = data?.content || [];
        });
        this._pricesService.getWithSearch$().subscribe((data) => {
            this.prices = data?.content || [];
        });
    }

    onCategoryChange(event: any): void {
        this.selectedCategoryId = event.value;

    }

    onPriceChange(event: any): void {
        this.selectedPriceId = event.value || null;

    }

    onStoreChange(event: any): void {
        this.selectedStoreId = event.value;
    }

    emitVisualizeEvent(): void {
        const filters = {
            storeId: this.selectedStoreId || null, // Enviar null si no está definido
            categoryId: this.selectedCategoryId || null,
            priceId: this.selectedPriceId || null,
            searchTerm: this.searchTerm || '',
        };
        this.eventVisualize.emit(filters);
    }

}
