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
import {NgForOf, NgIf} from "@angular/common";
import {Stores} from "../../../../accounting/stores/models/stores";
import {StoresService} from "../../../../../../providers/services/accounting/stores.service";
import {ProductService} from "../../../../../../providers/services/catalog/product.service";
import {Product} from "../../../../catalog/products/models/product";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs";

@Component({
    selector: 'app-inventory-filter',
    standalone: true,
    imports: [FormsModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, NgForOf, NgIf,],
    template: `
        <div class="header-container ">
            <div class="header-title bg-primary-600">
                <span class="header-icon">📦</span>
                <span>Inventario</span>
            </div>
            <div class="actions-container">
                <form class="form-container" [formGroup]="unitMeasurementFilterForm">
                    <div class="relative w-full">
                        <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded w-full" [subscriptSizing]="'dynamic'">
                            <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:magnifying-glass'"></mat-icon>
                            <input matInput [formControl]="searchControl" [autocomplete]="'off'" [placeholder]="'Buscar Producto'" (focus)="openDropdown()" (blur)="closeDropdown()"/>
                        </mat-form-field>
                        <div *ngIf="showDropdown && products.length > 0" class="absolute left-0 w-[calc(100%-2px)] max-w-md bg-white border border-gray-300 rounded shadow-md max-h-60 overflow-y-auto z-10">
                            @for (product of products; track product.id) {
                                <div class="p-2 hover:bg-gray-100 cursor-pointer" (click)="selectProduct(product)">
                                    <div class="font-bold">{{ product.name }} / {{ product.brand || 'Sin nombre' }}</div>
                                </div>
                            }
                        </div>
                    </div>
                </form>
                <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded w-64" [subscriptSizing]="'dynamic'">
                    <mat-select [placeholder]="'Seleccionar Almacén'" (selectionChange)="onStoreChange($event)">
                        <mat-option [value]="'all'">
                            Todos los almacenes
                        </mat-option>
                        <mat-option *ngFor="let store of stores" [value]="store.id">
                            {{ store.name }}
                        </mat-option>
                    </mat-select>
                </mat-form-field>
                </div>
            </div>
    `,
})
export class InventoriesFilterComponent implements OnInit {
    @Output() eventFilter: EventEmitter<any> = new EventEmitter<any>();
    @Output() eventNew = new EventEmitter<boolean>();
    @Output() filterEvent: EventEmitter<{ storeId: string | null, productId: string | null }> = new EventEmitter();
    abcForms: any;
    stores: Stores[] = [];
    products: Product[] = [];
    searchControl = new FormControl('');
    showDropdown: boolean = false;
    selectedStoreId: string | null = null;
    selectedProductId: string | null = null;
    isSelecting: boolean = false;
    unitMeasurementFilterForm = new FormGroup({
        concatenatedFields: new FormControl('', [Validators.required])
    });
    constructor(
        private _storesService: StoresService,
        private _productDynamicService: ProductService,
    ) {}
    ngOnInit() {
        this.abcForms = abcForms;
        this.unitMeasurementFilterForm.valueChanges.subscribe(value => {
            this.eventFilter.emit(value);
        });
        this.UploadData();
        this.setupSearch();
    }
    private UploadData() {
        this._storesService.getAll$().subscribe((data) => {
            this.stores = data?.content || [];
        });
    }
    onStoreChange(event: any): void {
        if (event.value === 'all') {
            this.selectedStoreId = null;
        } else {
            this.selectedStoreId = event.value;
        }
        this.filterEvent.emit({
            storeId: this.selectedStoreId,
            productId: this.selectedProductId,
        });
    }
    private setupSearch(): void {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((query) => {
                    if (!query) {
                        this.products = [];
                        this.selectedProductId = null;
                        this.filterEvent.emit({ storeId: this.selectedStoreId, productId: this.selectedProductId });
                        return []; // No realizar petición
                    }
                    return this._productDynamicService.getAlls$$( {
                        concatenatedFields: query,
                        page: 0,
                        size: 10,
                    });
                })
            )
            .subscribe(
                (data: any) => {
                    this.products = data?.content || [];
                },
            );
    }
    selectProduct(product: any): void {
        this.isSelecting = true;
        this.selectedProductId = product ? product.id : null;
        this.searchControl.setValue(product ? product.name : '', { emitEvent: false });
        this.filterEvent.emit({ storeId: this.selectedStoreId, productId: this.selectedProductId });
        this.products = []; // Limpiar la lista de productos
        setTimeout(() => {
            this.isSelecting = false;
        }, 300);
    }
    openDropdown(): void {
        this.showDropdown = true;
    }
    closeDropdown(): void {
        setTimeout(() => (this.showDropdown = false), 200);
    }
}
