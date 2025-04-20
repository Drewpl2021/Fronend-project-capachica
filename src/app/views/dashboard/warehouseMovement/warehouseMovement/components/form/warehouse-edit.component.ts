import {Component, Input, OnInit} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import {DateAdapter, MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {Entities, EntityTypes} from "../../../../buys/purchases/models/purchases";
import {TypeDocument} from "../../../../accounting/typeDocument/models/type-document";
import {Stores} from "../../../../accounting/stores/models/stores";
import {OperationType} from "../../../../payments/operationTypes/models/operation-type";
import {PaymentsType} from "../../../../payments/paymentsTypes/models/payments-type";
import {ActivatedRoute, Router} from "@angular/router";
import {OperationTypeService} from "../../../../../../providers/services/payments/OperationType.service";
import {StoresService} from "../../../../../../providers/services/accounting/stores.service";
import {TypeDocumentService} from "../../../../../../providers/services/accounting/type-document.service";
import {EntityTypesService} from "../../../../../../providers/services/client/entityTypes.service";
import {PaymentsTypeService} from "../../../../../../providers/services/payments/PaymentsType.service";
import {WarehouseEditSeriesComponent} from "./warehouse-edit-series.component";
import {WarehouseEditLotesComponent} from "./warehouse-edit-lotes.component";
import {SalesService} from "../../../../../../providers/services/sales/sales.service";
import {WarehouseService} from "../../../../../../providers/services/warehouseMovement/warehouse.service";

@Component({
    selector: 'app-warehouse-edit',
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
        DecimalPipe,
        MatCheckboxModule,
        MatDatepickerModule,
        NgIf,
    ],
    template: `
        <div class="bg-white flex flex-col px-4 py-4  mx-auto rounded shadow-md "  style="width: 10000px">
            <div class="flex justify-between bg-primary-600 text-white p-2 rounded mb-4">
                <h1 class="text-2xl font-bold">Ventas / Almacén </h1>
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
                    <mat-form-field class="w-full" >
                        <mat-label>Tipo Comprobante</mat-label>
                        <mat-select formControlName="tipoComprobante">
                            <mat-option value="" disabled>Seleccione Tipo de Documento</mat-option>
                            <mat-option *ngFor="let comprobante of typeDocuments" [value]="comprobante.id">
                                {{ comprobante.name }}
                            </mat-option>
                        </mat-select>
                    </mat-form-field>
                </div>

                <div class="col-span-2">
                    <mat-form-field class="w-full" floatLabel="always"  >
                        <mat-label>Serie</mat-label>
                        <input matInput formControlName="serie" placeholder="Serie (B001)">
                        <mat-error *ngIf="categoryForm.get('serie')?.hasError('required')">
                            El campo es requerido
                        </mat-error>
                    </mat-form-field>
                </div>

                <div class="col-span-2">
                    <mat-form-field class="w-full"  floatLabel="always"  >
                        <mat-label>Número</mat-label>
                        <input matInput formControlName="numero" placeholder="Número (00000001)">
                        <mat-error *ngIf="categoryForm.get('numero')?.hasError('required')">
                            El campo es requerido
                        </mat-error>
                    </mat-form-field>
                </div>
                <div class="col-span-2">
                    <mat-form-field class="w-full" >
                        <mat-label>Almacén</mat-label>
                        <mat-select formControlName="almacen">
                            <mat-option value="" disabled>Seleccione Almacén</mat-option>
                            <mat-option *ngFor="let almacen of stores" [value]="almacen.id">
                                {{ almacen.name }}
                            </mat-option>
                        </mat-select>
                    </mat-form-field>
                </div>
                <div class="col-span-6 relative">
                    <mat-form-field class="w-full" floatLabel="always" >
                        <mat-label>Buscar Proveedor por Nombre / RUC</mat-label>
                        <input
                            matInput
                            formControlName="nameSocialReason"
                            placeholder="Buscar Proveedor"/>
                        <button mat-icon-button matSuffix>
                            <mat-icon>search</mat-icon>
                        </button>
                    </mat-form-field>
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
                                        [ngModelOptions]="{standalone: true}"
                                        (change)="onIGVChange()">Mostrar IGV</mat-checkbox>
                                </div>
                            </th>
                            <th class="border border-gray-300 ">PRODUCTO</th>
                            <th class="border border-gray-300 ">AFECTACIÓN</th>
                            <th class="border border-gray-300 ">U. MEDIDA</th>
                            <th class="border border-gray-300 ">CANTIDAD</th>
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
                            <td class="border text-center">{{ product.value.unitMeasurementName }}</td>
                            <td class="border text-center">{{ product.value.quantity }}</td>
                            <td class="border text-center">{{ product.value.unitPrice }}</td>
                            <td class="border  text-center ">{{ product.value.subtotal | number: '1.2-2' }}</td>
                            <td *ngIf="showIGV" class="border text-center ">{{ product.value.igv | number: '1.2-2' }}</td>
                            <td class="border text-center ">{{ (product.value.quantity * product.value.unitPrice) | number: '1.2-2' }}</td>
                            <td class="border text-center">
                                <mat-icon (click)="eventNew(true, product.value.name, product.value.quantity || 0, i)"
                                          *ngIf="product.value.series?.length > 0" color="primary" class="ml-1">filter_list</mat-icon>
                                <mat-icon (click)="eventNewLot(true, product.value.name, product.value.quantity || 0, i)"
                                          *ngIf="product.value.lots?.length > 0" color="primary" class="ml-1">layers</mat-icon>
                                <span *ngIf="!(product.value.series?.length > 0) && !(product.value.lots?.length > 0)">
                                    SIN OPCIONES
                                </span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="totals-container col-span-12" style="display: flex; justify-content: flex-end; align-items: center; margin-top: 20px;">
                    <!-- Contenedor de etiquetas -->
                    <div class="totals-labels" style="display: flex; flex-direction: column; align-items: flex-end; gap: 0; text-align: right;">
                        <label class="label" style="min-width: 100px;"><strong>IGV:</strong></label>
                        <label class="label" style="min-width: 100px;"><strong>BI:</strong></label>
                        <label class="label" style="min-width: 100px;"><strong>TOTAL:</strong></label>
                    </div>
                    <div class="ml-12 mr-12" style="display: flex; flex-direction: column; align-items: flex-end; gap: 0; text-align: left; margin-left: 8px;">
                        <span class="value text-primary-500" style="font-size: 1.2em;" [innerHTML]="categoryForm.get('igv')?.value | number: '1.2-2'"></span>
                        <span class="value text-primary-500" style="font-size: 1.2em;" [innerHTML]="categoryForm.get('bi')?.value | number: '1.2-2'"></span>
                        <span class="value text-primary-500" style="font-size: 1.2em;" [innerHTML]="categoryForm.get('total')?.value | number: '1.2-2'"></span>
                    </div>
                </div>
            </form>
            <div class="flex justify-start gap-1">
                <button mat-raised-button class="bg-primary-600 text-white" (click)="cancelForm()">Regresar</button>
            </div>
        </div>
    `,
})
export class WarehouseEditComponent implements OnInit {
    id: string = ''; // ID capturado desde la URL
    idEntityType: string = '';
    showIGV: boolean = false;
    showMenu: boolean = false;

    typeDocuments: TypeDocument[] = [];
    stores: Stores[] = [];
    entity: Entities[] = [];
    operationTypes: OperationType[] = [];
    paymentsTypes: PaymentsType[] = [];

    categoryForm = new FormGroup({
        fechaEmision: new FormControl(new Date(), [Validators.required]),
        tipoComprobante: new FormControl('', [Validators.required]),
        serie: new FormControl('', [Validators.required]),
        numero: new FormControl('', [Validators.required]),
        igv: new FormControl(''),
        bi: new FormControl(''),
        total: new FormControl(''),
        almacen: new FormControl('', [Validators.required]),
        proveedor: new FormControl(''),
        products: this.fb.array([]),
        searchQuery: new FormControl(''), // Control del buscador
        selectedProduct: new FormControl(null),
        importe: new FormControl(0, [Validators.required]),

        supplierId: new FormControl('', ), // ID del proveedor seleccionado
        nameSocialReason: new FormControl(''), // Nuevo campo
        documentNumber: new FormControl(''),
        unitMeasurementName: new FormControl(''), // Nuevo campo
        typeAffectation: new FormControl(''),
        amountPayment: new FormControl(''), // Dinámico y no editable
        amounts: new FormControl(''),


        // Formatea la fecha en el formato adecuado (YYYY-MM-DD)
        paymentDate: new FormControl(new Date(), [Validators.required]),
        operationType: new FormControl('', [Validators.required]),
        details: this.fb.array([this.createDetail()])
    });

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private categoryService: WarehouseService,
        private fb: FormBuilder,
        private _operationTypeService: OperationTypeService,
        private _stores: StoresService,
        private _typeDocument: TypeDocumentService,
        private _entityTypesService: EntityTypesService,
        private dialog: MatDialog,
        private dateAdapter: DateAdapter<Date>,
        private _paymentsTypeService: PaymentsTypeService,
    ) {
        this.dateAdapter.setLocale('es-ES');
    }

    ngOnInit(): void {
        // Captura el ID desde la URL
        this.route.paramMap.subscribe((params) => {
            this.id = params.get('id') || '';
            if (this.id) {
                this.loadCategoryData(this.id);
            }
        });
        this.CargarDatos();
    }
    private CargarDatos() {
        this._typeDocument.getWithSearch$().subscribe((data) => {
            this.typeDocuments = data?.content || [];
        });
        this._stores.getAll$().subscribe((data) => {
            this.stores = data?.content || [];
        });
        this._entityTypesService.getWithSearch$().subscribe((data) => {
            const entityType = data?.content?.find((type: EntityTypes) => type.code === '02');
            this.idEntityType = entityType.id!;
        });
        this._operationTypeService.getWithSearch$().subscribe((data) => {
            const entityType = data?.content?.find((type: any) => type.code === '02');
            if (entityType) {this.categoryForm.patchValue({operationType: entityType.id,});
            }
        });
        this._paymentsTypeService.getWithSearch$().subscribe((data) => {
            this.paymentsTypes = data?.content || [];
        });
    }
    private loadCategoryData(id: string): void {
        this.categoryService.getById$(id).subscribe(
            (data: any) => {

                if (data) {
                    this.categoryForm.patchValue({
                        fechaEmision: data.issueDate,
                        tipoComprobante: data.documentTypeId,
                        serie: data.series,
                        numero: data.number,
                        igv: data.igv,
                        bi: data.bi,
                        total: data.total,
                        almacen: data.storeId,
                        supplierId: data.supplierId,
                        nameSocialReason: data.nameSocialReason,
                        //documentNumber: data.sale.documentNumber,
                    });


                }
                if (data?.details) {
                    this.loadProductos(data.details);

                }
                if (data.paymentDto) {
                    this.loadAmountPayment(data.paymentDto);
                    if (data.paymentDto.paymentDetails) {
                        this.loadPaymentDetails(data.paymentDto.paymentDetails);
                    }
                }
            },
        );
    }
    private loadAmountPayment(paymentDto: any): void {
        if (paymentDto) {


            // Actualizar el formulario con el amount general
            this.categoryForm.patchValue({
                amountPayment: paymentDto.amount || 0, // Si no hay amount, usar 0
            });


        }
    }
    private loadPaymentDetails(paymentDetails: any[]): void {
        const paymentFormArray = paymentDetails.map((detail) =>
            this.fb.group({
                modoPago: [detail.paymentMethod?.paymentType?.id || '', Validators.required], // Tipo de pago
                paymentMethod: [detail.paymentMethod?.id || '', Validators.required], // Método de pago
                paymentMethods: [[detail.paymentMethod]], // Guardar el método en un array
                concept: [detail.concept || 'PAGO', Validators.required], // Concepto
                amounts: [detail.amount || 0, [Validators.required, Validators.min(0)]], // Importe
                notes: [detail.notes || '', Validators.required], // Notas
            })
        );
        this.categoryForm.setControl('details', this.fb.array(paymentFormArray));
    }

    private loadProductos(saleDetails: any[]): void {
        saleDetails.forEach(product => {


            const productForm = this.fb.group({
                id: [product.id],
                name: [product.description],
                quantity: [product.quantity],
                stock: [product.product?.minimumStock || 0],
                typeAffectation: [product.typeAffectation || '-'],
                unitMeasurementName: [product.unitMeasurementName || 'Sin Presentacion'],
                unitPrice: [product.unitPrice || 0],
                subtotal: [product.totalPrice || 0],
                igv: [product.igv || 0],
                selectedPresentation: [null],
                lots: this.fb.array(
                    product.lots?.map((lot: any) =>
                        this.fb.group({
                            lotCode: [lot.lotCode],
                            amount: [lot.amount],
                            manufactureDate: [lot.manufactureDate],
                            expirationDate: [lot.expirationDate],
                        })
                    ) || []
                ),
                series: this.fb.array( // Asegura que siempre sea un FormArray
                    product.series?.map((serie: any) =>
                        this.fb.group({ seriesCode: [serie.seriesCode] })
                    ) || []
                ),
            });

            this.productsArray.push(productForm); // Agregar el producto al FormArray
        });
    }
    public eventNew($event: boolean, productName: string, quantity: number, productIndex: number): void {
        if ($event) {
            const productGroup = this.productsArray.at(productIndex) as FormGroup;
            const seriesControl = productGroup.get('series') as FormArray;
            this.dialog.open(WarehouseEditSeriesComponent, {
                width: '500px',
                data: {productName, quantity, series: seriesControl.value || [],
                },
            });
        }
    }


    public eventNewLot($event: boolean, productName: string, quantity: number, productIndex: number): void {
        if ($event) {
            const productGroup = this.productsArray.at(productIndex) as FormGroup;
            const lotsControl = productGroup.get('lots') as FormArray;
            this.dialog.open(WarehouseEditLotesComponent, {
                width: '850px',
                data: {productName, quantity, lotes: lotsControl.value || [],
                },
            });
        }
    }


    public cancelForm(): void {
        this.router.navigate(['./'], { relativeTo: this.route.parent }).then((success) => {
            if (success) {

            }
        });
    }
    get details() {
        return (this.categoryForm.get('details') as FormArray);
    }
    createDetail(): FormGroup {
        return this.fb.group({
        });
    }
    get productsArray(): FormArray {
        return this.categoryForm.get('products') as FormArray;
    }
    toggleMenu(event: Event): void {
        this.showMenu = !this.showMenu;
        event.stopPropagation(); // Evita que el clic cierre el menú
    }
    onIGVChange(): void {

    }
}
