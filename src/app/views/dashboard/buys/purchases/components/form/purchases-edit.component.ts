import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {Entities, EntityTypes} from "../../models/purchases";
import {DateAdapter, MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {PurchasesService} from "../../../../../../providers/services/buys/purchases.service";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {TypeDocument} from "../../../../accounting/typeDocument/models/type-document";
import {Stores} from "../../../../accounting/stores/models/stores";
import {StoresService} from "../../../../../../providers/services/accounting/stores.service";
import {TypeDocumentService} from "../../../../../../providers/services/accounting/type-document.service";
import {EntityTypesService} from "../../../../../../providers/services/client/entityTypes.service";
import {OperationType} from "../../../../payments/operationTypes/models/operation-type";
import {PaymentsType} from "../../../../payments/paymentsTypes/models/payments-type";
import {OperationTypeService} from "../../../../../../providers/services/payments/OperationType.service";
import {PaymentsTypeService} from "../../../../../../providers/services/payments/PaymentsType.service";
import {MatDialog} from "@angular/material/dialog";
import {PurchasesSeriesComponent} from "./purchases-edit-series.component";
import {PurchasesLotesComponent} from "./purchases-edit-lotes.component";

@Component({
    selector: 'app-purchases-edit',
    standalone: true,
    imports: [FormsModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, NgForOf, DecimalPipe, MatCheckboxModule, MatDatepickerModule, NgIf,],
    template: `
        <div class="bg-white flex flex-col px-4 py-4  mx-auto rounded shadow-md "  style="width: 10000px">
            <div class="flex justify-between bg-primary-600 text-white p-2 rounded mb-4">
                <h1 class="text-2xl font-bold">Compras / Almacén </h1>
            </div>
            <form class="grid grid-cols-12 gap-2 " [formGroup]="purchasesForm">
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
                        <mat-error *ngIf="purchasesForm.get('serie')?.hasError('required')">
                            El campo es requerido
                        </mat-error>
                    </mat-form-field>
                </div>
                <div class="col-span-2">
                    <mat-form-field class="w-full"  floatLabel="always"  >
                        <mat-label>Número</mat-label>
                        <input matInput formControlName="numero" placeholder="Número (00000001)">
                        <mat-error *ngIf="purchasesForm.get('numero')?.hasError('required')">
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
                        <input matInput formControlName="nameSocialReason" placeholder="Buscar Proveedor"/>
                        <button mat-icon-button matSuffix>
                            <mat-icon>search</mat-icon>
                        </button>
                    </mat-form-field>
                </div>
                <div class="col-span-6 relative">
                    <mat-form-field class="w-full" floatLabel="always" >
                        <mat-label>Buscar Artículo / Producto</mat-label>
                        <input matInput formControlName="searchQuery" placeholder="Ingrese el nombre del producto"/>
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
                                <div *ngIf="showMenu" class="absolute bg-white shadow-lg rounded mt-2 z-10 p-2" (click)="$event.stopPropagation()">
                                    <mat-checkbox [(ngModel)]="showIGV" [ngModelOptions]="{standalone: true}" (change)="onIGVChange()">Mostrar IGV</mat-checkbox>
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
                                <mat-icon (click)="eventNew(true, product.value.name, product.value.quantity || 0, i)" *ngIf="product.value.series?.length > 0" color="primary" class="ml-1">filter_list</mat-icon>
                                <mat-icon (click)="eventNewLot(true, product.value.name, product.value.quantity || 0, i)" *ngIf="product.value.lots?.length > 0" color="primary" class="ml-1">layers</mat-icon>
                                <span *ngIf="!(product.value.series?.length > 0) && !(product.value.lots?.length > 0)">
                                    SIN OPCIONES
                                </span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="totals-container col-span-12" style="display: flex; justify-content: flex-end; align-items: center; margin-top: 20px;">
                    <div class="totals-labels" style="display: flex; flex-direction: column; align-items: flex-end; gap: 0; text-align: right;">
                        <label class="label" style="min-width: 100px;"><strong>IGV:</strong></label>
                        <label class="label" style="min-width: 100px;"><strong>BI:</strong></label>
                        <label class="label" style="min-width: 100px;"><strong>TOTAL:</strong></label>
                    </div>
                    <div class="ml-12 mr-12" style="display: flex; flex-direction: column; align-items: flex-end; gap: 0; text-align: left; margin-left: 8px;">
                        <span class="value text-primary-500" style="font-size: 1.2em;" [innerHTML]="purchasesForm.get('igv')?.value | number: '1.2-2'"></span>
                        <span class="value text-primary-500" style="font-size: 1.2em;" [innerHTML]="purchasesForm.get('bi')?.value | number: '1.2-2'"></span>
                        <span class="value text-primary-500" style="font-size: 1.2em;" [innerHTML]="purchasesForm.get('total')?.value | number: '1.2-2'"></span>
                    </div>
                </div>
                <div class="col-span-12  mt-4">
                    <div class="dynamic-header flex items-center space-x-4 mb-4">
                        <div class="w-12 text-center">#</div>
                        <div class="flex-1">Modo de Pago</div>
                        <div class="flex-1">Método de Pago</div>
                        <div class="flex-1">Concepto</div>
                        <div class="flex-1">Importe</div>
                        <div class="flex-1">Nota</div>
                    </div>
                    <div formArrayName="details" class="product-presentations-container">
                        <div *ngFor="let detail of details.controls; let i = index" [formGroupName]="i" class="flex items-center space-x-4 mb-4">
                            <div class="w-12 text-center"><b>{{ i + 1 }}</b></div>
                            <mat-form-field appearance="fill" class="form-field">
                                <mat-select formControlName="modoPago">
                                    <mat-option value="" disabled>Seleccione Modo de Pago</mat-option>
                                    <mat-option *ngFor="let paymentType of paymentsTypes" [value]="paymentType.id">
                                        {{ paymentType.name }}
                                    </mat-option>
                                </mat-select>
                            </mat-form-field>
                            <mat-form-field appearance="fill" class="form-field">
                                <mat-select formControlName="paymentMethod" [disabled]="!(detail.get('paymentMethods')?.value?.length > 0)">
                                    <mat-option value="" disabled>Seleccione Método de Pago</mat-option>
                                    <mat-option *ngIf="detail.get('paymentMethods')?.value?.length === 0" disabled>
                                        No hay métodos disponibles
                                    </mat-option>
                                    <mat-option *ngFor="let method of detail.get('paymentMethods')?.value || []" [value]="method.id">
                                        {{ method.name }}
                                    </mat-option>
                                </mat-select>
                            </mat-form-field>
                            <mat-form-field appearance="fill" class="flex-1">
                                <input matInput formControlName="concept" />
                            </mat-form-field>
                            <mat-form-field appearance="fill" class="form-field">
                                <input type="number" matInput formControlName="amounts" placeholder="Importe"/>
                            </mat-form-field>
                            <mat-form-field appearance="fill" class="flex-1">
                                <input matInput formControlName="notes" />
                            </mat-form-field>
                        </div>
                    </div>
                </div>
                <mat-form-field style="flex: 1;" class="col-span-3">
                    <mat-label>Importe Total</mat-label>
                    <input type="number" matInput style="font-weight: bold; color: #000;" formControlName="amountPayment" readonly />
                </mat-form-field>
            </form>
            <div class="flex justify-start gap-1">
                <button mat-raised-button class="bg-primary-600 text-white" (click)="cancelForm()">Regresar</button>
            </div>
        </div>
    `,
})
export class PurchasesEditComponent implements OnInit {
    id: string = '';
    idEntityType: string = '';
    showIGV: boolean = false;
    showMenu: boolean = false;
    typeDocuments: TypeDocument[] = [];
    stores: Stores[] = [];
    entity: Entities[] = [];
    operationTypes: OperationType[] = [];
    paymentsTypes: PaymentsType[] = [];
    purchasesForm = new FormGroup({
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
        searchQuery: new FormControl(''),
        selectedProduct: new FormControl(null),
        importe: new FormControl(0, [Validators.required]),
        supplierId: new FormControl('', ),
        nameSocialReason: new FormControl(''),
        documentNumber: new FormControl(''),
        unitMeasurementName: new FormControl(''),
        typeAffectation: new FormControl(''),
        amountPayment: new FormControl(''),
        amounts: new FormControl(''),
        paymentDate: new FormControl(new Date(), [Validators.required]),
        operationType: new FormControl('', [Validators.required]),
        details: this.fb.array([this.createDetail()])
    });
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private purchasesService: PurchasesService,
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
        this.route.paramMap.subscribe((params) => {
            this.id = params.get('id') || '';
            if (this.id) {
                this.loadPuchasesData(this.id);
            }
        });
        this.uploadData();
    }
    private uploadData() {
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
            if (entityType) {this.purchasesForm.patchValue({operationType: entityType.id,});
            }
        });
        this._paymentsTypeService.getWithSearch$().subscribe((data) => {
            this.paymentsTypes = data?.content || [];
        });
    }
    private loadPuchasesData(id: string): void {
        this.purchasesService.getById$(id).subscribe(
            (data: any) => {
                if (data.purchase) {
                    this.purchasesForm.patchValue({
                        fechaEmision: data.purchase.issueDate,
                        tipoComprobante: data.purchase.documentTypeId,
                        serie: data.purchase.series,
                        numero: data.purchase.number,
                        igv: data.purchase.igv,
                        bi: data.purchase.bi,
                        total: data.purchase.total,
                        almacen: data.purchase.storeId,
                        supplierId: data.purchase.supplierId,
                        nameSocialReason: data.purchase.nameSocialReason,
                    });

                }
                if (data.purchase?.details) {
                    this.loadProductos(data.purchase.details);
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
            this.purchasesForm.patchValue({
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
        this.purchasesForm.setControl('details', this.fb.array(paymentFormArray));
    }
    private loadProductos(purchaseDetails: any[]): void {
        purchaseDetails.forEach(product => {
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
                            codigo: [lot.lotCode],
                            cantidad: [lot.amount],
                            fechaFabricacion: [lot.manufactureDate],
                            fechaCaducidad: [lot.expirationDate],
                        })
                    ) || []
                ),
                series: this.fb.array( // Asegura que siempre sea un FormArray
                    product.series?.map((serie: any) =>
                        this.fb.group({ serie: [serie.seriesCode] })
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
            this.dialog.open(PurchasesSeriesComponent, {
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
            this.dialog.open(PurchasesLotesComponent, {
                width: '850px',
                data: {productName, quantity, lotes: lotsControl.value || [],
                },
            });
        }
    }
    public cancelForm(): void {
        this.router.navigate(['./'], { relativeTo: this.route.parent }).then((success) => {
        });
    }
    get details() {
        return (this.purchasesForm.get('details') as FormArray);
    }
    createDetail(): FormGroup {
        return this.fb.group({
        });
    }
    get productsArray(): FormArray {
        return this.purchasesForm.get('products') as FormArray;
    }
    toggleMenu(event: Event): void {
        this.showMenu = !this.showMenu;
        event.stopPropagation(); // Evita que el clic cierre el menú
    }
    onIGVChange(): void {
    }
}
