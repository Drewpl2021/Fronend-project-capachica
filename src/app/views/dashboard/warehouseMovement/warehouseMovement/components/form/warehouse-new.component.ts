import {ChangeDetectorRef, Component, HostListener, Input, OnInit} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from "@angular/material/select";
import {CommonModule, JsonPipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DateAdapter, MatNativeDateModule} from "@angular/material/core";
import {TypeDocument} from "../../../../accounting/typeDocument/models/type-document";
import {Stores} from "../../../../accounting/stores/models/stores";
import {StoresService} from "../../../../../../providers/services/accounting/stores.service";
import {TypeDocumentService} from "../../../../../../providers/services/accounting/type-document.service";
import {ProductDynamicService} from "../../../../../../providers/services/catalog/product-dynamic.service";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {Entities, EntityTypes, ProductDynamic, SerialFlows} from "../../models/warehouse";
import {EntityTypesService} from "../../../../../../providers/services/client/entityTypes.service";
import {EntityService} from "../../../../../../providers/services/client/Entitys.service";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialog} from "@angular/material/dialog";
import {WarehouseNewInSeriesComponent} from "./warehouse-new-in-series.component";
import {WarehouseNewInLotesComponent} from "./warehouse-new-in-lotes.component";
import {SerialFlowsService} from "../../../../../../providers/services/catalog/serial-flows.service";
import {WarehouseNewOnLotesComponent} from "./warehouse-new-on-lotes.component";
import {WarehouseNewOnSeriesComponent} from "./warehouse-new-on-series.component";
import {WarehouseService} from "../../../../../../providers/services/warehouseMovement/warehouse.service";
import {ConfirmDialogService} from "../../../../../../shared/confirm-dialog/confirm-dialog.service";

@Component({
    selector: 'app-warehouse-new',
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
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
    ],
    template: `
        <div class="bg-white flex flex-col px-4 py-4  mx-auto rounded shadow-md "  style="width: 10000px">
            <div class="flex justify-between bg-primary-600 text-white p-2 rounded mb-4">
                <h1 class="text-2xl font-bold">Movimiento / Almacén</h1>
            </div>
            <form class="grid grid-cols-12 gap-2 mb-8" [formGroup]="categoryForm">
                <div class="col-span-3">
                    <mat-form-field class="w-full"  >
                        <mat-label>Fecha Emisión</mat-label>
                        <input matInput [matDatepicker]="picker" formControlName="fechaEmision" >
                        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                        <mat-datepicker #picker></mat-datepicker>
                    </mat-form-field>
                </div>
                <div class="col-span-3">
                    <mat-form-field class="w-full">
                        <mat-label>Tipo Comprobante</mat-label>
                        <mat-select
                            formControlName="tipoComprobante"
                            (selectionChange)="onTypeDocumentChange($event.value)">

                            <mat-option value="" disabled>Seleccione Tipo de Documento</mat-option>

                            <mat-option *ngFor="let comprobante of typeDocuments" [value]="comprobante.id">
                                {{ comprobante.name }}
                            </mat-option>

                        </mat-select>
                    </mat-form-field>
                </div>
                <ng-container *ngIf="codeTypeDocumentSelect === '11' || codeTypeDocumentSelect === '10'">
                    <div class="col-span-2">
                        <mat-form-field class="w-full" floatLabel="always">
                            <mat-label>Serie</mat-label>
                            <input matInput
                                   formControlName="serie"
                                   placeholder="Serie (B001)"
                                   maxlength="4"
                                   (input)="limitInputLength($event)">
                            <mat-error *ngIf="categoryForm.get('serie')?.hasError('required')">
                                El campo es requerido
                            </mat-error>
                            <mat-error *ngIf="categoryForm.get('serie')?.hasError('minlength') || categoryForm.get('serie')?.hasError('maxlength')">
                                La serie debe tener exactamente 4 caracteres.
                            </mat-error>
                        </mat-form-field>
                    </div>

                    <!--<div class="col-span-2">
                        <mat-form-field class="w-full"  floatLabel="always"  >
                            <mat-label>Número</mat-label>
                            <input matInput formControlName="numero" placeholder="Número (00000001)">
                            <mat-error *ngIf="categoryForm.get('numero')?.hasError('required')">
                                El campo es requerido
                            </mat-error>
                        </mat-form-field>
                    </div>-->
                    <div class="col-span-3">
                        <mat-form-field class="w-full" >
                            <mat-label>Almacén</mat-label>
                            <mat-select formControlName="almacen" >
                                <mat-option value="" disabled>Seleccione Almacén</mat-option>
                                <mat-option *ngFor="let almacen of stores" [value]="almacen.id" [disabled]="true">
                                    {{ almacen.name }}
                                </mat-option>
                            </mat-select>
                        </mat-form-field>
                    </div>
                </ng-container>
                <ng-container *ngIf="codeTypeDocumentSelect === '12'">
                    <div class="col-span-2">
                        <mat-form-field class="w-full" floatLabel="always"  >
                            <mat-label>Serie</mat-label>
                            <input matInput formControlName="serie" placeholder="Serie " [readonly]="true">
                            <mat-error *ngIf="categoryForm.get('serie')?.hasError('required')">
                                El campo es requerido
                            </mat-error>
                        </mat-form-field>
                    </div>
                    <div class="col-span-2">
                        <mat-form-field class="w-full" >
                            <mat-label>Almacén de Salida</mat-label>
                            <mat-select formControlName="almacen" >
                                <mat-option value="" disabled>Seleccione Almacén</mat-option>
                                <mat-option *ngFor="let almacen of stores" [value]="almacen.id" [disabled]="true">
                                    {{ almacen.name }}
                                </mat-option>
                            </mat-select>
                        </mat-form-field>
                    </div>
                    <div class="col-span-2">
                        <mat-form-field class="w-full">
                            <mat-label>Almacén de Entrada</mat-label>
                            <mat-select formControlName="destinationStoreId">
                                <mat-option value="" disabled>Seleccione Almacén</mat-option>
                                <!-- 🔹 Usamos \`filteredStores\` en lugar de filtrar en la plantilla -->
                                <mat-option *ngFor="let almacen of filteredStores" [value]="almacen.id">
                                    {{ almacen.name }}
                                </mat-option>
                            </mat-select>
                        </mat-form-field>
                    </div>
                </ng-container>
                <div class="col-span-6 relative">
                    <mat-form-field class="w-full" floatLabel="always" >
                        <mat-label>Buscar Proveedor por Nombre / RUC</mat-label>
                        <input
                            matInput
                            formControlName="proveedor"
                            placeholder="Buscar Proveedor"
                            (input)="buscarProveedor(categoryForm.get('proveedor')?.value)"
                        />
                        <button mat-icon-button matSuffix>
                            <mat-icon>search</mat-icon>
                        </button>
                    </mat-form-field>
                    <div
                        *ngIf="entity.length > 0"
                        class="absolute w-full bg-white border border-gray-300 shadow-lg max-h-64 overflow-auto z-10">
                        <div
                            *ngFor="let provider of entity"
                            class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            (click)="seleccionarProveedor(provider)">
                            <div class="font-bold">{{ provider.nameSocialReason }}</div>
                            <div class="text-sm text-gray-500">RUC: {{ provider.documentNumber }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-span-6 relative">
                    <mat-form-field class="w-full" floatLabel="always" >
                        <mat-label>Buscar Artículo / Producto</mat-label>
                        <input
                            matInput
                            formControlName="searchQuery"
                            placeholder="Ingrese el nombre del producto"
                        />
                        <button mat-icon-button matSuffix>
                            <mat-icon>search</mat-icon>
                        </button>
                    </mat-form-field>
                    <div
                        *ngIf="productsDynamics.length > 0"
                        class="absolute w-full bg-white border border-gray-300 rounded shadow-md max-h-60 overflow-y-auto z-10">
                        <div
                            *ngFor="let product of productsDynamics"
                            class="p-2 hover:bg-gray-100 cursor-pointer"
                            (click)="seleccionarProducto(product)">
                            <div class="font-bold">
                                {{ product.product?.name }} (Stock: {{ product.product?.minimumStock || 0 }} UND)
                            </div>
                            <div class="text-sm text-gray-500">
                                CÓDIGO: {{ product?.product?.productPresentations?.[0]?.unitMeasurement?.name || 'Sin nombre' }}
                                MARCA: {{ product.product?.brand || 'Sin nombre'}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class=" col-span-12  overflow-x-auto">
                    <table class="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                        <tr class="bg-primary-600 text-white">
                            <th class="border border-gray-300  relative">
                                <mat-icon (click)="toggleMenu($event)" class=" text-white  p-1 h-8 w-8  justify-center ">settings</mat-icon>
                                <div *ngIf="showMenu"
                                     class="absolute bg-white shadow-lg rounded mt-2 z-10 p-2"
                                     (click)="$event.stopPropagation()">
                                    <mat-checkbox
                                        [(ngModel)]="showIGV"
                                        [ngModelOptions]="{standalone: true}">Mostrar IGV</mat-checkbox>
                                </div>
                            </th>
                            <th class="border border-gray-300 ">PRODUCTO</th>
                            <th class="border border-gray-300 ">AFECTACIÓN</th>
                            <th class="border border-gray-300 ">CANTIDAD</th>
                            <th class="border border-gray-300 ">U. MEDIDA</th>
                            <th class="border border-gray-300 ">Tipo de Precio</th>
                            <th class="border border-gray-300 ">PRECIO UNITARIO</th>
                            <th class="border border-gray-300 ">B. IMP.</th>
                            <th *ngIf="showIGV" class="border border-gray-300">IGV</th>
                            <th class="border border-gray-300 ">TOTAL</th>
                            <th class="border border-gray-300 ">OPCIÓN</th>
                        </tr>
                        </thead>
                        <tbody formArrayName="products">
                            <tr *ngFor="let product of productsArray.controls; let i = index" [formGroupName]="i">
                                <td class="border  text-center ">{{ i + 1 }}</td>
                                <td class="border  text-center ">{{ product.value.name }}</td>
                                <td class="border text-center">{{ product.value.typeAffectation }}</td>
                                <td class="border text-center align-middle">
                                    <input
                                        matInput
                                        formControlName="quantity"
                                        type="number"
                                        (input)="calcularTotal(i)"
                                        style="height: 30px; background-color: white; border: 1px solid #ccc; text-align: center; margin: auto; display: block; border-radius: 8px;"
                                        placeholder="Cantidad"/>
                                </td>
                                <td class="border p-2 text-center align-middle">
                                    <select
                                        formControlName="selectedPresentation"
                                        (change)="onPresentationChange($event, i)"
                                        style="height: 30px; background-color: white; border: 1px solid #ccc; text-align: center; margin: auto; display: block; border-radius: 8px; width: 100%;">
                                        <option *ngFor="let presentation of product.value.presentations" [value]="presentation.id">
                                            {{ presentation.name }} - {{ presentation.factor }}
                                        </option>
                                    </select>
                                </td>
                                <td class="border p-2 text-center align-middle">
                                    <!-- Select de Tipos de Precio (Depende de la Presentación Seleccionada) -->
                                    <select
                                        formControlName="selectedPrice"
                                        (change)="onPriceChange($event, i)"
                                        style="height: 30px; background-color: white; border: 1px solid #ccc; text-align: center; margin: auto; display: block; border-radius: 8px; width: 100%;"
                                    >
                                        <option *ngFor="let price of product.value.prices" [value]="price.id">
                                            {{ price.name }} - S/{{ price.price }}
                                        </option>
                                    </select>
                                </td>
                                <td class="border text-center align-middle">
                                    <div
                                        (focus)="clearInput($event)"
                                        (blur)="restoreInput($event, i, 'unitPrice')"
                                        (click)="calcularTotal(i)"
                                        tabindex="0">
                                        S/ {{ product.value.unitPrice }}
                                    </div>
                                </td>
                                <td class="border  text-center ">{{ product.value.subtotal | number: '1.2-2' }}</td>
                                <td *ngIf="showIGV" class="border text-center ">{{ product.value.igv | number: '1.2-2' }}</td>
                                <td class="border text-center ">{{ (product.value.quantity * product.value.unitPrice) | number: '1.2-2' }}</td>
                                <td class="border text-center ">
                                    <mat-icon color="warn" (click)="eliminarProducto(i)">delete</mat-icon>
                                    <!-- Para códigos 11 y 12 -->
                                    <ng-container *ngIf="codeTypeDocumentSelect === '11' || codeTypeDocumentSelect === '12'">
                                        <mat-icon
                                            (click)="eventNew(true, product.value.name, product.value.quantity || 0, i, product.value.storeId, product.value.id)"
                                            *ngIf="product.value.serialControl"
                                            color="primary"
                                            class="ml-1">
                                            filter_list
                                        </mat-icon>
                                        <mat-icon
                                            (click)="eventNewLot(true, product.value.name, product.value.quantity || 0, i, product.value.storeId, product.value.id, product.value.selectedPresentation )"
                                            *ngIf="product.value.batchControl"
                                            color="primary"
                                            class="ml-1">
                                            layers
                                        </mat-icon>
                                    </ng-container>

                                    <!-- Para código 10 -->
                                    <ng-container *ngIf="codeTypeDocumentSelect === '10'">
                                        <mat-icon
                                            (click)="eventNewSeries(true, product.value.name, product.value.quantity || 0, i)"
                                            *ngIf="product.value.serialControl"
                                            color="primary"
                                            class="ml-1">
                                            filter_list
                                        </mat-icon>
                                        <mat-icon
                                            (click)="eventNewLotes(true, product.value.name, product.value.quantity || 0, i)"
                                            *ngIf="product.value.batchControl"
                                            color="primary"
                                            class="ml-1">
                                            layers
                                        </mat-icon>
                                    </ng-container>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <br>
                <div class="totals-container col-span-12" style="display: flex; justify-content: flex-end; align-items: center; margin-top: 20px;">
                    <div class="totals-labels" style="display: flex; flex-direction: column; align-items: flex-end; gap: 0; text-align: right;">
                        <label class="label" style="min-width: 100px;"><strong>IGV:</strong></label>
                        <label class="label" style="min-width: 100px;"><strong>BI:</strong></label>
                        <label class="label" style="min-width: 100px;"><strong>TOTAL:</strong></label>
                    </div>
                    <div class="ml-12 mr-12" style="display: flex; flex-direction: column; align-items: flex-end; gap: 0; text-align: left; margin-left: 8px;">
                        <span class="value text-primary-500" style="font-size: 1.2em;">{{ igv | number: '1.2-2' }}</span>
                        <span class="value text-primary-500" style="font-size: 1.2em;">{{ bi | number: '1.2-2' }}</span>
                        <span class="value text-primary-500" style="font-size: 1.2em; font-weight: bold;">{{ total | number: '1.2-2' }}</span>
                    </div>
                </div>
            </form>
            <div class="flex justify-end gap-1">
                <button mat-raised-button color="warn" (click)="cancelForm()">Regresar</button>
                <ng-container *ngIf="codeTypeDocumentSelect === '11' || codeTypeDocumentSelect === '12'">
                    <button mat-raised-button color="primary" [disabled]="categoryForm.invalid || isSubmitting" (click)="saveForm()">
                        Guardar
                    </button>
                </ng-container>
                <ng-container *ngIf="codeTypeDocumentSelect === '10'">
                    <button mat-raised-button color="primary" [disabled]="categoryForm.invalid || isSubmitting" (click)="saveForms()">
                        Guardar
                    </button>
                </ng-container>

            </div>
        </div>
    `,
})
export class WarehouseNewComponent implements OnInit {
    @Input() title: string = 'nueva-categoría';
    typeDocuments: TypeDocument[] = [];
    stores: Stores[] = [];
    serialFlows: SerialFlows[] = [];
    entity: Entities[] = [];
    productsDynamics: ProductDynamic[] = [];
    codeTypeDocumentSelect: string = '';
    idEntityType: string = '';
    bi: number = 0;
    igv: number = 0;
    total: number = 0;
    vuelto: number = 0;
    showIGV: boolean = false;
    showMenu: boolean = false;
    serial: string = '';
    abcForms: any;
    almacenSalidaId: string | null = null;
    public isSubmitting: boolean = false;
    filteredStores: any[] = [];
    categoryForm = new FormGroup({
        fechaEmision: new FormControl(new Date(), [Validators.required]),
        tipoComprobante: new FormControl('', ),
        serie: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
        //numero: new FormControl('', [Validators.required]),
        almacen: new FormControl('', [Validators.required]),
        proveedor: new FormControl('', [Validators.required]),
        products: this.fb.array([], [Validators.required]),
        searchQuery: new FormControl(''), // Control del buscador
        selectedProduct: new FormControl(null),
        importe: new FormControl(0, ),
        destinationStoreId: new FormControl(''),
        supplierId: new FormControl('', ), // ID del proveedor seleccionado
        nameSocialReason: new FormControl(''), // Nuevo campo
        documentNumber: new FormControl(''),
        unitMeasurementName: new FormControl(''), // Nuevo campo
        typeAffectation: new FormControl(''),

        amount: new FormControl({ value: 0, disabled: true }), // Dinámico y no editable
    });

    constructor(
        private dateAdapter: DateAdapter<Date>,
        private route: ActivatedRoute,
        private _confirmDialogService: ConfirmDialogService,
        private router: Router,
        private _stores: StoresService,
        private _serialFlowsService: SerialFlowsService,
        private _typeDocument: TypeDocumentService,
        private _entityTypesService: EntityTypesService,
        private _entityService: EntityService,
        private _productDynamicService: ProductDynamicService,
        private _salesService: WarehouseService,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
    ) {this.dateAdapter.setLocale('es-ES');}

    ngOnInit(): void {
        this.CargarDatos();
        this.cdr.detectChanges();
        this.categoryForm
            .get('searchQuery')
            ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
            .subscribe((value) => {
                if (value) {
                    this.buscarProducto(value);
                } else {
                    this.productsDynamics = []; // Limpiar productos si no hay texto
                }
            });
    }
    get productsArray(): FormArray {
        return this.categoryForm.get('products') as FormArray;
    }
    onTypeDocumentChange(selectedId: string): void {
        const selectedDoc = this.typeDocuments.find(doc => doc.id === selectedId);
        if (selectedDoc) {
            this.codeTypeDocumentSelect = selectedDoc.code; // ✅ Guarda el código del documento seleccionado
            const params = { code: this.codeTypeDocumentSelect };
            this._serialFlowsService.getByCode$(params).subscribe(
                (data) => {
                    if (data && data.serial) {
                        this.serial = data.serial;
                        this.categoryForm.patchValue({ serie: this.serial });
                    } else {
                        this.serial = ''; // ✅ Limpiar si no hay serial
                        this.categoryForm.patchValue({ serie: '' }); // ✅ También limpiar el campo `serie`
                    }
                },
                (error) => {
                    this.serial = ''; // ✅ Limpiar en caso de error
                    this.categoryForm.patchValue({ serie: '' }); // ✅ También limpiar el campo `serie`
                }
            );
        }
    }

    private CargarDatos() {
        this._serialFlowsService.getAll$().subscribe((data) => {
            this.serialFlows = data?.content || [];
        });
        this._typeDocument.getWithSearch$().subscribe((data) => {
            this.typeDocuments = data?.content || [];
            const codes = ['10', '11', '12'];
            this.typeDocuments = this.typeDocuments.filter(doc => codes.includes(doc.code));
            const defaultDoc = this.typeDocuments.find(doc => doc.code === '12');
            if (defaultDoc) {
                this.categoryForm.patchValue({ tipoComprobante: defaultDoc.id });
                this.onTypeDocumentChange(defaultDoc.id); // ✅ Disparar el evento para actualizar la vista
            }
        });
        this._stores.getAll$().subscribe((data) => {
            this.stores = data?.content || [];
        });
        this._serialFlowsService.getAllsStore$().subscribe((data) => {
            const almacenId = data?.store?.id;
            if (almacenId) {
                this.categoryForm.patchValue({ almacen: almacenId });
            }
        });
        this._serialFlowsService.getAllsStore$().subscribe((data) => {
            this.almacenSalidaId = data?.store?.id; // Guardamos el ID del almacén de salida
            if (this.almacenSalidaId) {
                this.categoryForm.patchValue({ almacen: this.almacenSalidaId });
            }
            this.updateFilteredStores();
        });
        this._entityTypesService.getWithSearch$().subscribe((data) => {
            const entityType = data?.content?.find((type: EntityTypes) => type.code === '02');
            this.idEntityType = entityType.id!;
        });

    }
    updateFilteredStores(): void {
        this.filteredStores = this.stores.filter(a => a.id !== this.almacenSalidaId);
    }
    private buscarProducto(query: string): void {
        const storeId = this.categoryForm.get('almacen')?.value;
        if (!storeId) {
            return;
        }
        const params = {
            status: 'true',
            storeId: storeId,
            searchQuery: query,
            page: '0',
            size: '10',
        };
        this._productDynamicService.getWithSearch$(params).subscribe((data: any) => {
            this.productsDynamics = data?.content || [];
        });
    }

    seleccionarProducto(product: any): void {
        const storeId = this.categoryForm.get('almacen')?.value;
        const serialControlStatus = product.product?.serialControl || false;
        const batchControlStatus = product.product?.batchControl || false;

        // 🔹 Extraer Presentaciones
        const presentations = product.product?.productPresentations?.map((presentation: any) => ({
            id: presentation.id,
            name: presentation.unitMeasurement?.name || 'Sin nombre',
            factor: presentation.factor || 'Sin factor',
            pricesDetail: presentation.pricesDetail || [] // Guardamos los precios dentro de la presentación
        })) || [];

        // 🔹 Extraer los precios de la PRIMERA presentación seleccionada
        const defaultPrices = presentations.length > 0 ? presentations[0].pricesDetail : [];

        // 🔹 Seleccionar el PRIMER precio por defecto
        const defaultPrice = defaultPrices.length > 0 ? defaultPrices[0] : null;

        // 🔹 Crear el Formulario del Producto
        const productForm = this.fb.group({
            id: [product.product?.id],
            storeId: [storeId],
            name: [product.product?.name || ''],
            stock: [product.product?.minimumStock || 0],
            unit: [presentations[0]?.name || 'Sin nombre'],
            factor: [presentations[0]?.factor || 'Sin factor'],
            unitMeasurementName: [presentations[0]?.name || 'Sin Presentacion'],
            typeAffectation: [product.typeAffectation?.name || '-'],
            quantity: [1, Validators.required],
            unitPrice: [defaultPrice ? defaultPrice.price : 0], // ✅ Asigna el primer precio automáticamente
            subtotal: [0],
            igv: [0],
            serialControl: [serialControlStatus],
            batchControl: [batchControlStatus],
            presentations: [presentations],
            selectedPresentation: [presentations[0]?.id || ''],
            prices: [defaultPrices],
            selectedPrice: [defaultPrice ? defaultPrice.id : ''], // ✅ Selecciona el primer precio por defecto
            lots: [[]],
            series: [[]]
        });

        // 🔹 Agregar el formulario al array de productos
        this.productsArray.push(productForm);

        // 🔹 Llamar a `calcularTotal()` para actualizar los valores inmediatamente
        const index = this.productsArray.length - 1;
        this.calcularTotal(index);

        // 🔹 Mantener la funcionalidad de categoryForm
        this.categoryForm.patchValue({
            typeAffectation: product.typeAffectation?.name || '-',
            searchQuery: '',
        });
    }

    onPresentationChange(event: Event, index: number): void {
        const selectedPresentationId = (event.target as HTMLSelectElement).value;

        // Obtener las presentaciones del producto en la fila correspondiente
        const presentations = this.productsArray.at(index).get('presentations')?.value || [];

        // Buscar la presentación seleccionada
        const selectedPresentation = presentations.find(
            (presentation: any) => presentation.id === selectedPresentationId
        );

        if (selectedPresentation) {
            this.productsArray.at(index).patchValue({
                selectedPresentationId: selectedPresentation.id,  // 🔥 Guarda el ID de la presentación seleccionada
                unitMeasurementName: selectedPresentation.name,
                prices: selectedPresentation.pricesDetail,  // 🔥 Actualizar lista de precios
                selectedPrice: selectedPresentation.pricesDetail.length > 0 ? selectedPresentation.pricesDetail[0].id : null // Primer precio por defecto
            });

        }
    }


    onPriceChange(event: Event, index: number): void {
        const selectedPriceId = (event.target as HTMLSelectElement).value;

        // Obtener la lista de precios de la presentación actual
        const prices = this.productsArray.at(index).get('prices')?.value || [];

        // Buscar el precio seleccionado
        const selectedPrice = prices.find((price: any) => price.id === selectedPriceId);

        if (selectedPrice) {

            // 🔹 Actualizar el `unitPrice` con el valor del precio seleccionado
            this.productsArray.at(index).patchValue({
                unitPrice: selectedPrice.price,
            });

            // 🔹 Calcular total nuevamente
            this.calcularTotal(index);
        }
    }


    public buscarProveedor(query: string): void {
        if (!this.idEntityType || !query.trim()) {
            return;
        }
        const params = {
            documentNumber: query.trim(),
            idEntityType: this.idEntityType,
        };
        this._entityService.getWithFilt$(params).subscribe(
            (data: any) => {
                if (Array.isArray(data)) {
                    this.entity = data; // Si es un array
                } else if (data?.content) {
                    this.entity = data.content; // Si está en 'content'
                } else {
                    this.entity = [];
                }
                this.cdr.detectChanges(); // Actualiza la vista
            },

        );
    }

    public seleccionarProveedor(provider: Entities): void {
        if (provider) {
            this.categoryForm.patchValue({
                proveedor: provider.nameSocialReason,
                supplierId: provider.id,
                nameSocialReason: provider.nameSocialReason, // Nuevo campo
                documentNumber: provider.documentNumber, // Nuevo campo
            });

            this.entity = []; // Limpia los resultados de búsqueda
        }
    }

    eliminarProducto(index: number): void {
        this.productsArray.removeAt(index);
        this.actualizarTotales();
    }

    calcularTotal(index: number): void {
        const productGroup = this.productsArray.at(index) as FormGroup;
        const quantity = parseFloat(productGroup.get('quantity')?.value || 0);
        const unitPrice = parseFloat(productGroup.get('unitPrice')?.value || 0);
        const total = quantity * unitPrice;
        const baseImponible = this.roundToTwo(total / 1.18); // Precio unitario ya incluye IGV
        const igv = this.roundToTwo(total - baseImponible);
        productGroup.patchValue({
            subtotal: baseImponible, // Base Imponible
            igv: igv,               // IGV
        });
        this.actualizarTotales();
    }
    private roundToTwo(num: number): number {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }
    actualizarTotales(): void {
        let totalBI = 0; // Base imponible acumulada
        let totalIGV = 0; // IGV acumulado
        let totalFinal = 0; // Total acumulado
        this.productsArray.controls.forEach((control: FormGroup) => {
            const subtotal = parseFloat(control.get('subtotal')?.value || 0); // BI
            const igv = parseFloat(control.get('igv')?.value || 0); // IGV
            const totalProducto = subtotal + igv; // Total por producto

            totalBI += subtotal;
            totalIGV += igv;
            totalFinal += totalProducto;
        });
        this.bi = this.roundToTwo(totalBI);
        this.igv = this.roundToTwo(totalIGV);
        this.total = this.roundToTwo(totalFinal);
        this.calcularVuelto();
    }
    calcularVuelto(): void {
        const importeIngresado = this.categoryForm.get('importe')?.value || 0;
        this.vuelto = this.roundToTwo(importeIngresado - this.total);
    }
    toggleMenu(event: Event): void {
        this.showMenu = !this.showMenu;
        event.stopPropagation(); // Evita que el clic cierre el menú
    }
    @HostListener('document:click', ['$event'])
    closeMenu(): void {
        this.showMenu = false;
    }
    clearInput(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement.value === '0') {
            inputElement.value = ''; // Borra el contenido si es '0'
        }
    }
    restoreInput(event: Event, index: number | null, controlName: string): void {
        const inputElement = event.target as HTMLInputElement;
        const value = inputElement.value;
        if (!value) {
            if (index !== null) {
                const control = (this.productsArray.at(index) as FormGroup).get(controlName);
                control?.setValue(0); // Restaurar a 0 en el formulario reactivo
            } else {
                const control = this.categoryForm.get(controlName);
                control?.setValue(0); // Restaurar a 0 en el formulario reactivo
            }
        }
    }

    public eventNew($event: boolean, productName: string, quantity: number, productIndex: number, storeId: string, productId: string): void {
        if ($event) {
            const productGroup = this.productsArray.at(productIndex) as FormGroup;
            const seriesControl = productGroup.get('series') as FormControl;
            const dialogRef = this.dialog.open(WarehouseNewInSeriesComponent, {
                width: '650px',
                data: {
                    productName,
                    quantity,
                    storeId, // Enviar Store ID al modal
                    productId, // Enviar Product ID al modal
                    series: seriesControl.value || [], // Pasar series actuales o un array vacío
                },
            });

            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.length > 0) {
                    seriesControl.setValue(result); // Actualiza las series en el formulario principal
                }
            });
        }
    }

    public eventNewLot($event: boolean, productName: string, quantity: number, productIndex: number, storeId: string, productId: string, selectedPresentation:string): void {
        if ($event) {
            const productGroup = this.productsArray.at(productIndex) as FormGroup;
            const lotsControl = productGroup.get('lots') as FormControl;
            const dialogRef = this.dialog.open(WarehouseNewInLotesComponent, {
                width: '850px',
                data: {
                    selectedPresentation,
                    productName,
                    quantity,
                    storeId,
                    productId,
                    lotes: lotsControl.value ? [...lotsControl.value] : [],
                },
            });

            dialogRef.afterClosed().subscribe((result: any) => {
                if (Array.isArray(result) && result.length > 0) {
                    lotsControl.setValue(result);
                }
            });
        }
    }

    public eventNewSeries($event: boolean, productName: string, quantity: number, productIndex: number): void {
        if ($event) {
            const productGroup = this.productsArray.at(productIndex) as FormGroup;
            const seriesControl = productGroup.get('series') as FormControl;
            const dialogRef = this.dialog.open(WarehouseNewOnSeriesComponent, {
                width: '500px',
                data: {
                    productName,
                    quantity,
                    series: seriesControl.value || [], // Pasar series actuales o un array vacío
                },
            });
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.length > 0) {
                    seriesControl.setValue(result); // Actualiza las series en el formulario principal
                }
            });
        }
    }
    public eventNewLotes($event: boolean, productName: string, quantity: number, productIndex: number): void {
        if ($event) {
            const productGroup = this.productsArray.at(productIndex) as FormGroup;
            const lotsControl = productGroup.get('lots') as FormControl;
            const dialogRef = this.dialog.open(WarehouseNewOnLotesComponent, {
                width: '850px',
                data: {
                    productName,
                    quantity,
                    lotes: lotsControl.value || [], // Pasar lotes actuales o un array vacío
                },
            });
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.length > 0) {
                    lotsControl.setValue(result); // Actualiza los lotes en el formulario principal
                }
            });
        }
    }

    private generatePayload(): any {
        const localIssueDate = new Date(this.categoryForm.get('fechaEmision')?.value.getTime() - this.categoryForm.get('fechaEmision')?.value.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
        const currentDate = new Date().toISOString(); // Fecha actual en formato ISO

        return {
                 issueDate: localIssueDate || currentDate,
                documentTypeId: this.categoryForm.get('tipoComprobante')?.value || '',
                series: this.categoryForm.get('serie')?.value || '',
                //number: this.categoryForm.get('numero')?.value || '',
                companyId: this.categoryForm.get('companyId')?.value || null,
                storeId: this.categoryForm.get('almacen')?.value || null,
                supplierId: this.categoryForm.get('supplierId')?.value || null,
                destinationStoreId: this.categoryForm.get('destinationStoreId')?.value || null,
                operationType: "OUTGOING",
                documentTypeCode: 'OUTPUT',
                nameSocialReason: this.categoryForm.get('nameSocialReason')?.value || '',
                documentNumber: this.categoryForm.get('documentNumber')?.value || '',
                igv: this.igv || 0,
                bi: this.bi || 0,
                total: this.total || 0,
                currency: 'PEN',
                exchangeRate: this.categoryForm.get('vuelto')?.value || 0,
                exemptAmount: 0,
                unaffectedAmount: 0,
                freeAmount: 0,
                retentionAmount: 0,
                detraction: "string",
                details: this.productsArray.controls.map((product: FormGroup) => {
                    return {
                        productId: product.get('id')?.value || '',
                        productAccountingDynamicId: product.get('productAccountingDynamicId')?.value || '',
                        productPresentationId: product.get('selectedPresentation')?.value || '',
                        description: product.get('name')?.value || '',
                        unitMeasurementName: product.get('unitMeasurementName')?.value || '',
                        typeAffectation: product.get('typeAffectation')?.value || '',
                        quantity: product.get('quantity')?.value || 0,
                        unitPrice: product.get('unitPrice')?.value || 0,
                        totalPrice: product.get('subtotal')?.value + product.get('igv')?.value || 0,
                        igv: product.get('igv')?.value || 0,
                        exemptAmount: 0,
                        unaffectedAmount: 0,
                        freeAmount: 0,
                        series: (product.get('series')?.value || []).map((serie: any) => ({
                            seriesCode: serie.seriesCode || '',
                            serieSaleId: serie.serieSaleId || ''

                        })),
                        lots: (product.get('lots')?.value || []).map((lot: any) => ({
                            amount: lot.amount || 0,
                            lotCode: lot.lotCode || '',
                            expirationDate: lot.expirationDate || '',
                            manufactureDate: lot.manufactureDate || '',
                            lotSaleId: lot.lotSaleId || ''
                        }))
                    };
                }),
                //createdBy: "admin",
                //updatedBy: "admin",
                createdAt: currentDate,
                updatedAt: currentDate,
                transactionRelatedId: this.categoryForm.get('transactionRelatedId')?.value || null
        };
    }

    private generatePayloads(): any {
        const localIssueDate = new Date(this.categoryForm.get('fechaEmision')?.value.getTime() - this.categoryForm.get('fechaEmision')?.value.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
        const currentDate = new Date().toISOString(); // Fecha actual en formato ISO
        return {
                issueDate: localIssueDate || currentDate,
                documentTypeId: this.categoryForm.get('tipoComprobante')?.value,
                series: this.categoryForm.get('serie')?.value,
                //number: this.categoryForm.get('numero')?.value,
                companyId: this.categoryForm.get('companyId')?.value || null,
                storeId: this.categoryForm.get('almacen')?.value,
                supplierId: this.categoryForm.get('supplierId')?.value,
                nameSocialReason: this.categoryForm.get('nameSocialReason')?.value,
                documentNumber: this.categoryForm.get('documentNumber')?.value,
                igv: this.igv,
                operationType: "INCOMING",
                documentTypeCode: 'INPUT',
                bi: this.bi,
                total: this.total,
                currency: 'PEN',
                exchangeRate: this.categoryForm.get('vuelto')?.value || 0,
                exemptAmount: 0,
                unaffectedAmount: 0,
                freeAmount: 0,
                retentionAmount: 0,
                detraction: "string",
                details: this.productsArray.controls.map((product: FormGroup) => {
                    return {
                        productId: product.get('id')?.value || '',
                        productAccountingDynamicId: product.get('productAccountingDynamicId')?.value || '',
                        productPresentationId: product.get('selectedPresentation')?.value || '',
                        description: product.get('name')?.value,
                        unitMeasurementName: product.get('unitMeasurementName')?.value || '',
                        typeAffectation: product.get('typeAffectation')?.value,
                        quantity: product.get('quantity')?.value,
                        unitPrice: product.get('unitPrice')?.value,
                        totalPrice: product.get('subtotal')?.value + product.get('igv')?.value || 0,
                        igv: product.get('igv')?.value,
                        exemptAmount: 0,
                        unaffectedAmount: 0,
                        freeAmount: 0,
                        lots: (product.get('lots')?.value || []).map((lot: any) => ({
                            lotCode: lot.codigo,
                            amount: lot.cantidad,
                            manufactureDate: lot.fechaFabricacion,
                            expirationDate: lot.fechaCaducidad,
                        })),
                        series: (product.get('series')?.value || []).map((serie: any) => ({
                            seriesCode: serie.serie,
                        })),
                    };
                }),
                //createdBy: 'admin',
                //updatedBy: 'admin',
                createdAt: currentDate,
                updatedAt: currentDate,
                transactionRelatedId: this.categoryForm.get('transactionRelatedId')?.value || null
        };
    }
    public saveForm(): void {
        if (this.categoryForm.valid && !this.isSubmitting) {
            // Muestra la confirmación antes de continuar
            this._confirmDialogService.confirmSave({})
                .then(() => {
                    // Si el usuario confirma, procede con el guardado
                    this.isSubmitting = true; // 🔒 Bloquea el botón al hacer clic

                    const payload = this.generatePayload();
                    this._salesService.add$(payload).subscribe({
                        next: (response) => {
                            this.router.navigate(['../'], { relativeTo: this.route });
                            this.isSubmitting = false; // 🔓 Habilita el botón después del éxito
                        },
                        error: (error) => {
                            this.isSubmitting = false; // 🔓 Habilita el botón en caso de error
                        }
                    });
                })
        }
    }
    public saveForms(): void {
        if (this.categoryForm.valid && !this.isSubmitting) {
            // Muestra la confirmación antes de continuar
            this._confirmDialogService.confirmSave({})
                .then(() => {
                    // Si el usuario confirma, procede con el guardado
                    this.isSubmitting = true; // 🔒 Bloquear el botón para evitar múltiples envíos

                    const payload = this.generatePayloads();
                    this._salesService.add$(payload).subscribe({
                        next: (response) => {
                            this.router.navigate(['../'], { relativeTo: this.route });
                            this.isSubmitting = false; // 🔓 Habilitar botón después de éxito
                        },
                        error: (error) => {
                            this.isSubmitting = false; // 🔓 Habilitar botón en caso de error
                        }
                    });
                })
        }
    }

    public cancelForm(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
    limitInputLength(event: any): void {
        if (event.target.value.length > 4) {
            event.target.value = event.target.value.slice(0, 4); // Corta el texto si es mayor a 4 caracteres
            event.target.dispatchEvent(new Event('input')); // Notifica al formulario del cambio
        }
    }

}
