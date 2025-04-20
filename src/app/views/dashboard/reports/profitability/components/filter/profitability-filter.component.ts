import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {format} from "date-fns";
import {DateAdapter, MatOptionModule} from "@angular/material/core";
import {StoresService} from "../../../../../../providers/services/accounting/stores.service";
import {Stores} from "../../../../accounting/stores/models/stores";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs";
import {Product} from "../../../../catalog/products/models/product";
import {ProductService} from "../../../../../../providers/services/catalog/product.service";


@Component({
    selector: 'app-profitability-filter',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatOptionModule,
        MatSelectModule,
        NgForOf,
        NgIf,
    ],
    template: `
        <div class="header-container ">
            <div class="header-title bg-primary-600">
                <span class="header-icon">📈</span>
                <span>Rentabilidad</span>
            </div>
            <div class="actions-container">
                <form class="form-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 xl:grid-cols-8 gap-4 items-center" [formGroup]="unitMeasurementFilterForm" (ngSubmit)="onSubmit()">
                    <div class="col-span-2 relative">
                        <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded w-full" [subscriptSizing]="'dynamic'">
                            <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:magnifying-glass'"></mat-icon>
                            <input matInput [formControl]="searchControl" [autocomplete]="'off'" [placeholder]="'Buscar Producto'" (focus)="openDropdown()" (blur)="closeDropdown()"/>
                        </mat-form-field>
                        <div *ngIf="showDropdown && products.length > 0" class="absolute w-full bg-white border border-gray-300 rounded shadow-md max-h-60 overflow-y-auto z-10">
                            <div *ngFor="let product of products" class="p-2 hover:bg-gray-100 cursor-pointer" (click)="selectProduct(product)">
                                <div class="font-bold">
                                    {{ product.name }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded w-full col-span-2" [subscriptSizing]="'dynamic'">
                        <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:magnifying-glass'"></mat-icon>
                        <input matInput [formControlName]="'concatenatedFields'" [autocomplete]="'off'" [placeholder]="'Buscar Rentabilidad'"/>
                    </mat-form-field>
                    <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded w-full" [subscriptSizing]="'dynamic'">
                        <input matInput [matDatepicker]="picker" formControlName="startDate" placeholder="Fecha Inicio">
                        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                        <mat-datepicker #picker></mat-datepicker>
                    </mat-form-field>
                    <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded w-full" [subscriptSizing]="'dynamic'">
                        <input matInput [matDatepicker]="pickerEnd" formControlName="endDate" autocomplete="off" placeholder="Fecha Fin">
                        <mat-datepicker-toggle matSuffix [for]="pickerEnd"></mat-datepicker-toggle>
                        <mat-datepicker #pickerEnd></mat-datepicker>
                    </mat-form-field>
                    <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded w-full col-span-1" [subscriptSizing]="'dynamic'">
                        <mat-select [placeholder]="'Seleccionar Almacén*'" formControlName="storeId" (selectionChange)="onStoreChange($event)">
                            <mat-option value="">Mostrar Todo</mat-option>
                            <mat-option *ngFor="let store of stores" [value]="store.id">
                                {{ store.name }}
                            </mat-option>
                        </mat-select>
                    </mat-form-field>
                    <button class="action-button w-full md:w-auto col-span-1" mat-flat-button [color]="'primary'" type="submit">
                        <mat-icon [svgIcon]="'heroicons_outline:funnel'"></mat-icon>
                        <span class="ml-1"> Visualizar</span>
                    </button>
                </form>
            </div>
        </div>

    `,
})
export class ProfitabilityFilterComponent implements OnInit {
    @Output() eventFilter: EventEmitter<any> = new EventEmitter<any>();
    @Output() eventNew = new EventEmitter<boolean>();
    @Output() filterEvent: EventEmitter<{ productId: string | null }> = new EventEmitter();

    abcForms: any;
    stores: Stores[] = [];
    products: Product[] = [];
    selectedStoreId: string | '';
    searchControl = new FormControl('');
    showDropdown: boolean = false;
    selectedProductId: string | '';
    isSelecting: boolean = false;

    unitMeasurementFilterForm = new FormGroup({
        concatenatedFields: new FormControl(''),
        startDate: new FormControl(new Date()),
        endDate: new FormControl(new Date()),
        storeId: new FormControl('' ),
        productId: new FormControl('' ),

    });

    constructor(private dateAdapter: DateAdapter<Date>,
                private _storesService: StoresService,
                private _productDynamicService: ProductService,
    ) {
        this.dateAdapter.setLocale('es-ES');
    }

    ngOnInit() {
        this.abcForms = abcForms;
        this.CargarDatos();
        this.setupSearch();

    }

    private CargarDatos() {
        this._storesService.getAll$().subscribe((data) => {
            this.stores = data?.content || [];
        });
    }

    onSubmit() {
        if (this.unitMeasurementFilterForm.valid) {
            const startDateRaw = this.unitMeasurementFilterForm.value.startDate;
            const endDateRaw = this.unitMeasurementFilterForm.value.endDate;

            const formData = {
                ...this.unitMeasurementFilterForm.value,
                startDate: startDateRaw ? format(new Date(startDateRaw), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
                endDate: endDateRaw ? format(new Date(endDateRaw), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            };


            this.eventFilter.emit(formData);
        }
    }
    onStoreChange(event: any): void {
        this.selectedStoreId = event.value;
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
                        this.unitMeasurementFilterForm.controls['productId'].setValue('', { emitEvent: false }); // ✅ Resetear productId
                        this.filterEvent.emit({ productId: this.selectedProductId });
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
                    this.products = data?.content || []; // ✅ Actualizar lista de productos
                },
            );
    }
    selectProduct(product: any): void {
        if (!product) return;

        this.isSelecting = true;
        this.selectedProductId = product.id;

        // ✅ Asignar el `productId` al FormControl
        this.unitMeasurementFilterForm.controls['productId'].setValue(this.selectedProductId, { emitEvent: true });

        // ✅ Actualizar el campo de búsqueda con el nombre del producto seleccionado
        this.searchControl.setValue(product.name, { emitEvent: false });

        this.filterEvent.emit({ productId: this.selectedProductId });
        this.products = []; // ✅ Limpiar la lista de productos

        setTimeout(() => {
            this.isSelecting = false;
        }, 300);
    }


    openDropdown(): void {
        this.showDropdown = true; // Abre el dropdown al enfocar
    }
    closeDropdown(): void {
        setTimeout(() => (this.showDropdown = false), 200);
    }

}
