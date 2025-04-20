import {ChangeDetectorRef, Component, HostListener, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
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
import {Entities, EntityTypes, ProductDynamic, SerialFlows} from "../../models/sales";
import {EntityTypesService} from "../../../../../../providers/services/client/entityTypes.service";
import {EntityService} from "../../../../../../providers/services/client/Entitys.service";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialog} from "@angular/material/dialog";
import {SalesNewSeriesComponent} from "./sales-new-series.component";
import {SalesNewLotesComponent} from "./sales-new-lotes.component";
import {SalesService} from "../../../../../../providers/services/sales/sales.service";
import {OperationType} from "../../../../payments/operationTypes/models/operation-type";
import {PaymentsType} from "../../../../payments/paymentsTypes/models/payments-type";
import {OperationTypeService} from "../../../../../../providers/services/payments/OperationType.service";
import {PaymentsTypeService} from "../../../../../../providers/services/payments/PaymentsType.service";
import {PaymentsMethodsService} from "../../../../../../providers/services/payments/PaymentsMethods.service";
import {SerialFlowsService} from "../../../../../../providers/services/catalog/serial-flows.service";
import {EntitiesCompanyCNewComponent} from "../../../entitiesCompanyC/components/form/entitiesCompanyC-new.component";
import {ConfirmDialogService} from "../../../../../../shared/confirm-dialog/confirm-dialog.service";

@Component({
    selector: 'app-sales-new',
    standalone: true,
    imports: [FormsModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatSelectModule, JsonPipe, CommonModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule,],
    template: `
        <div class="bg-white flex flex-col px-4 py-4  mx-auto rounded shadow-md "  style="width: 10000px">
            <div class="flex justify-between bg-primary-600 text-white p-2 rounded mb-4">
                <h1 class="text-2xl font-bold">Ventas / Almacén </h1>
            </div>
            <form class="grid grid-cols-12 gap-2 mb-8" [formGroup]="salesForm">
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
                        <mat-select formControlName="tipoComprobante" (selectionChange)="onTypeDocumentChange($event.value)">
                            <mat-option value="" disabled>Seleccione Tipo de Documento</mat-option>
                            <mat-option *ngFor="let comprobante of typeDocuments" [value]="comprobante.id">
                                {{ comprobante.name }}
                            </mat-option>
                        </mat-select>
                    </mat-form-field>
                </div>
                <div class="col-span-3">
                    <mat-form-field class="w-full" floatLabel="always"  >
                        <mat-label>Serie</mat-label>
                        <input matInput formControlName="serie" placeholder="Serie " [readonly]="true">
                        <mat-error *ngIf="salesForm.get('serie')?.hasError('required')">
                            El campo es requerido
                        </mat-error>
                    </mat-form-field>
                </div>
                <!--<div class="col-span-2">
                    <mat-form-field class="w-full"  floatLabel="always"  >
                        <mat-label>Número</mat-label>
                        <input matInput formControlName="numero" placeholder="Número (00000001)">
                        <mat-error *ngIf="salesForm.get('numero')?.hasError('required')">
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
                <div class="col-span-6">
                    <div class="flex items-center gap-2">
                        <div class="relative w-full">
                            <mat-form-field class="w-full" floatLabel="always">
                                <mat-label>Buscar Cliente por Nombre / RUC</mat-label>
                                <input matInput formControlName="proveedor" placeholder="Buscar Cliente" (input)="searchProvider(salesForm.get('proveedor')?.value)" />
                                <button mat-icon-button matSuffix>
                                    <mat-icon>search</mat-icon>
                                </button>
                            </mat-form-field>
                            <div *ngIf="entity.length > 0" class="absolute w-full bg-white border border-gray-300 shadow-lg max-h-64 overflow-auto z-10">
                                <div *ngFor="let provider of entity" class="px-4 py-2 hover:bg-gray-100 cursor-pointer" (click)="selectProvider(provider)">
                                    <div class="font-bold">{{ provider.nameSocialReason }}</div>
                                    <div class="text-sm text-gray-500">RUC: {{ provider.documentNumber }}</div>
                                </div>
                            </div>
                        </div>
                        <button type="button" mat-icon-button color="primary" class="!w-8 !h-8" (click)="eventNewEntities(true)" >
                            <mat-icon>add</mat-icon>
                        </button>
                    </div>
                </div>
                <div class="col-span-6 relative">
                    <mat-form-field class="w-full" floatLabel="always">
                        <mat-label>Buscar Artículo / Producto</mat-label>
                        <input matInput formControlName="searchQuery" placeholder="Ingrese el nombre del producto" (keydown)="onKeyDown($event)" (focus)="showDropdown = true" (blur)="onBlur()" />
                        <button mat-icon-button matSuffix>
                            <mat-icon>search</mat-icon>
                        </button>
                    </mat-form-field>
                    <div *ngIf="showDropdown && productsDynamics.length > 0"
                         #dropdownContainer class="absolute w-full bg-white border border-gray-300 rounded shadow-md max-h-60 overflow-y-auto z-10"
                         tabindex="0" (keydown)="onKeyDown($event)">

                        <div *ngFor="let product of productsDynamics; let i = index"
                             #productItems
                             class="p-3 cursor-pointer flex items-center gap-3"
                             [ngClass]="{'bg-gray-200 selected-item': selectedIndex === i, 'hover:bg-gray-100': selectedIndex !== i}"
                             (click)="selectProduct(product)"
                             (mouseenter)="selectedIndex = i">

                            <!-- Imagen del producto -->
                            <div class="w-24 h-24 flex-shrink-0 border border-gray-300 rounded-lg overflow-hidden cursor-pointer group p-2">
                                <img *ngIf="validateAndSetImageUrl(product.product?.imageUrl)"
                                     [src]="validateAndSetImageUrl(product.product?.imageUrl)"
                                     alt="Imagen del producto"
                                     class="w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:animate-bounce">
                            </div>

                            <!-- Información del producto -->
                            <div class="flex flex-col">
                                <div class="font-bold">
                                    {{ product.product?.name }} | {{ product.product?.brand || 'Sin marca' }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    <strong>Presentaciones:</strong>
                                    <span *ngIf="product.product?.productPresentations?.length === 0">Sin presentaciones</span>
                                    <ul *ngIf="product.product?.productPresentations?.length > 0" class="list-disc pl-4">
                                        <li *ngFor="let presentation of product.product?.productPresentations">
                                            Presentación: {{ presentation?.unitMeasurement?.name || 'Sin nombre' }} |
                                            Cantidad: {{ presentation?.quantityInUnit || 'N/A' }}
                                        </li>
                                    </ul>
                                </div>

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
                                <div *ngIf="showMenu" class="absolute bg-white shadow-lg rounded mt-2 z-10 p-2" (click)="$event.stopPropagation()">
                                    <mat-checkbox [(ngModel)]="showIGV" [ngModelOptions]="{standalone: true}">Mostrar IGV</mat-checkbox>
                                </div>
                            </th>
                            <th class="border border-gray-300 ">PRODUCTO</th>
                            <th class="border border-gray-300 ">AFECTACIÓN</th>
                            <th class="border border-gray-300 ">U. MEDIDA</th>
                            <th class="border border-gray-300 ">CANTIDAD</th>
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
                                <td class="border p-2 text-center align-middle">
                                    <select formControlName="selectedPresentation" (change)="onPresentationChange($event, i)"
                                            style="height: 30px; background-color: white; border: 1px solid #ccc; text-align: center; margin: auto; display: block; border-radius: 8px; width: 100%;">
                                        <option *ngFor="let presentation of product.value.presentations" [value]="presentation.id">
                                            {{ presentation.factor }} - {{ presentation.name }}: {{ presentation.quantityInUnit }} UND
                                        </option>
                                    </select>
                                </td>
                                <td class="border text-center align-middle">
                                    <input matInput formControlName="quantity" type="number"
                                           (input)="onQuantityChange(i)"
                                           style="height: 30px; background-color: white; border: 1px solid #ccc; text-align: center; margin: auto; display: block; border-radius: 8px;"
                                           placeholder="Cantidad"/>
                                </td>
                                <td class="border p-2 text-center align-middle">
                                    <select formControlName="selectedPrice" (change)="onPriceChange($event, i)"
                                            style="height: 30px; background-color: white; border: 1px solid #ccc;
                   text-align: center; margin: auto; display: block; border-radius: 8px; width: 100%;">

                                        <!-- Opción "No hay precios disponibles" si no hay precios -->
                                        <option *ngIf="product.get('prices').value.length === 0" disabled selected>
                                            No hay precios disponibles
                                        </option>

                                        <!-- Opciones de precios si existen -->
                                        <option *ngFor="let price of product.get('prices').value" [value]="price.id">
                                            {{ price.name }} - S/{{ price.price }}
                                        </option>
                                    </select>
                                </td>

                                <td class="border text-center align-middle">
                                    <!-- Mostrar el precio en div si hay precios disponibles -->
                                    <div *ngIf="product.get('prices').value.length > 0"
                                         (focus)="clearInput($event)"
                                         (blur)="restoreInput($event, i, 'unitPrice')"
                                         (click)="calculateTotal(i)" tabindex="0">
                                        S/ {{ product.get('unitPrice').value }}
                                    </div>

                                    <!-- Input editable cuando no hay precios -->
                                    <input *ngIf="product.get('prices').value.length === 0" (focus)="clearInput($event)"
                                           type="number"
                                           class="form-control text-center"
                                           [formControlName]="'unitPrice'"
                                           (input)="calculateTotal(i)">
                                </td>

                                <td class="border  text-center ">{{ product.value.subtotal | number: '1.2-2' }}</td>
                                <td *ngIf="showIGV" class="border text-center ">{{ product.value.igv | number: '1.2-2' }}</td>
                                <td class="border text-center ">{{ (product.value.quantity * product.value.unitPrice) | number: '1.2-2' }}</td>
                                <td class="border text-center ">
                                    <mat-icon color="warn" (click)="deleteProduct(i)">delete</mat-icon>
                                    <mat-icon (click)="eventNew(true, product.value.name, product.value.quantity || 0, i, product.value.storeId, product.value.id)" *ngIf="product.value.serialControl" color="primary" class="ml-1">filter_list
                                    </mat-icon>
                                    <mat-icon (click)="eventNewLot(true, product.value.name, product.value.quantity || 0, i, product.value.storeId, product.value.id, product.value.selectedPresentation)" *ngIf="product.value.batchControl" color="primary" class="ml-1">layers</mat-icon>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div *ngIf="showWarning" class="totals-labels col-span-2 warning-text">
                    <label class="label">
                        <strong>NO TIENES ESA CANTIDAD EN EL ALMACÉN</strong>
                    </label>
                </div>

                <div class="totals-container col-span-12" style="display: flex; justify-content: flex-end; align-items: center; margin-top: 10px;">
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
                <div class="col-span-12  mt-4">
                    <button type="button" mat-raised-button color="primary" (click)="addDetail()">
                        Añadir Metodo de Pago
                    </button>
                    <br><br>
                    <div class="dynamic-header flex items-center space-x-4 mb-4">
                        <div class="w-12 text-center">#</div>
                        <div class="flex-1">Modo de Pago</div>
                        <div class="flex-1">Método de Pago</div>
                        <div class="flex-1">Concepto</div>
                        <div class="flex-1">Importe</div>
                        <div class="flex-1">Nota</div>
                        <div *ngIf="hasTransactionNumber()" class="flex-1">Número de <br> Transacción</div>
                    </div>
                    <div formArrayName="details" class="product-presentations-container">
                        <div *ngFor="let detail of details.controls; let i = index" [formGroupName]="i" class="flex items-center space-x-4 mb-4">
                            <div class="w-12 text-center"><b>{{ i + 1 }}</b></div>

                            <mat-form-field appearance="fill" class="form-field">
                                <mat-select formControlName="modoPago" (selectionChange)="onSelectPaymentType($event, i)">
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
                                <input type="number" matInput formControlName="amount" placeholder="Importe" (focus)="clearInput($event)" />
                            </mat-form-field>

                            <mat-form-field appearance="fill" class="flex-1">
                                <input matInput formControlName="notes" />
                            </mat-form-field>

                            <!-- SOLO mostrar este campo en la fila si se seleccionó un código permitido -->
                            <mat-form-field appearance="fill" class="flex-1" *ngIf="detail.get('showTransactionNumber')?.value">
                                <input matInput formControlName="transactionNumber" placeholder="0000-0000-0000-0000" />
                            </mat-form-field>

                            <button type="button" mat-icon-button color="warn" (click)="removeDetail(i)">
                                <mat-icon>delete</mat-icon>
                            </button>
                        </div>
                    </div>


                </div>
                <div appearance="fill" class="flex items-center" style="width: 300px">
                    <mat-form-field style="font-size: 1.5rem; border-radius: 8px; width: 300px;">
                        <mat-label style=" font-weight: bold;">💰 Importe Total</mat-label>
                        <input class="text-primary-500"  type="number" matInput formControlName="amount" readonly style="width: 300px;font-weight: bold;text-align: center;border-radius: 8px;">
                    </mat-form-field>
                    <mat-icon *ngIf="total === salesForm.get('amount')?.value" style="color: green;">check_circle
                    </mat-icon>
                    <mat-icon *ngIf="total !== salesForm.get('amount')?.value" style="color: red;">cancel</mat-icon>
                </div>
            </form>

            <div class="flex justify-end gap-1">
                <button mat-raised-button color="warn" (click)="cancelForm()">Regresar</button>
                <button
                    mat-raised-button
                    color="primary"
                    [disabled]="salesForm.invalid || isSubmitting || isSaveDisabled()"
                    (click)="saveForm()">
                    Guardar
                </button>
            </div>

        </div>
    `,
})
export class SalesNewComponent implements OnInit {
    @Input() title: string = 'nueva-venta';
    typeDocuments: TypeDocument[] = [];
    stores: Stores[] = [];
    serialFlows: SerialFlows[] = [];
    entity: Entities[] = [];
    productsDynamics: ProductDynamic[] = [];
    operationTypes: OperationType[] = [];
    paymentsTypes: PaymentsType[] = [];
    codeTypeDocumentSelect: string = '';
    selectedIndex: number = 0;
    showDropdown: boolean = false;
    defaultPaymentId: string = '';
    idEntityType: string = '';
    bi: number = 0;
    igv: number = 0;
    total: number = 0;
    vuelto: number = 0;
    showIGV: boolean = false;
    showMenu: boolean = false;
    serial: string = '';
    abcForms: any;
    showWarning: boolean = false;
    private quantityChangeTimeout: any;
    public isSubmitting: boolean = false;
    salesForm = new FormGroup({

        fechaEmision: new FormControl(new Date(), [Validators.required]),
        tipoComprobante: new FormControl('', [Validators.required]),
        serie: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
        //numero: new FormControl('', [Validators.required]),
        almacen: new FormControl('', [Validators.required]),
        proveedor: new FormControl('', [Validators.required]),
        products: this.fb.array([], [Validators.required]),
        searchQuery: new FormControl(''), // Control del buscador
        selectedProduct: new FormControl(null),
        importe: new FormControl(0, [Validators.required]),
        supplierId: new FormControl('', ),
        nameSocialReason: new FormControl(''),
        documentNumber: new FormControl(''),
        unitMeasurementName: new FormControl(''),
        typeAffectation: new FormControl(''),
        amount: new FormControl({ value: 0, disabled: true }, [Validators.required]),
        paymentDate: new FormControl(new Date(), [Validators.required]),
        operationType: new FormControl('', [Validators.required]),
        details: this.fb.array([this.createDetail()])
    });
    constructor(
        private dateAdapter: DateAdapter<Date>,
        private route: ActivatedRoute,
        private router: Router,
        private _stores: StoresService,
        private _serialFlowsService: SerialFlowsService,
        private _typeDocument: TypeDocumentService,
        private _entityTypesService: EntityTypesService,
        private _entityService: EntityService,
        private _productDynamicService: ProductDynamicService,
        private _salesService: SalesService,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private _operationTypeService: OperationTypeService,
        private _paymentsTypeService: PaymentsTypeService,
        private _confirmDialogService: ConfirmDialogService,
        private _paymentsMethodsService: PaymentsMethodsService,) {
        this.dateAdapter.setLocale('es-ES');
    }
    ngOnInit(): void {
        this.uploadData();
        this.cdr.detectChanges();
        this.salesForm
            .get('searchQuery')
            ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
            .subscribe((value) => {
                if (value) {
                    this.searchProduct(value);
                } else {
                    this.productsDynamics = [];
                }
            });
        this.details.valueChanges.subscribe(() => {
            this.updateTotalAmount();
        });
        this.loadPaymentTypes();

    }
    get productsArray(): FormArray {
        return this.salesForm.get('products') as FormArray;
    }
    onTypeDocumentChange(selectedId: string): void {
        const selectedDoc = this.typeDocuments.find(doc => doc.id === selectedId);
        if (selectedDoc) {
            this.codeTypeDocumentSelect = selectedDoc.code;
            const params = { code: this.codeTypeDocumentSelect };
            this._serialFlowsService.getByCode$(params).subscribe(
                (data) => {
                    if (data && data.serial) {
                        this.serial = data.serial;
                        this.salesForm.patchValue({ serie: this.serial });
                    } else {
                        this.serial = '';
                        this.salesForm.patchValue({ serie: '' });
                    }
                },
                (error) => {
                    this.serial = '';
                    this.salesForm.patchValue({ serie: '' });
                }
            );
        }
    }
    private uploadData() {
        this._serialFlowsService.getAll$().subscribe((data) => {
            this.serialFlows = data?.content || [];
        });
        this._typeDocument.getWithSearch$().subscribe((data) => {
            this.typeDocuments = data?.content || [];
            const codes = ['03', '01', '99'];
            this.typeDocuments = this.typeDocuments.filter(doc => codes.includes(doc.code));
            this.salesForm.patchValue({tipoComprobante:this.typeDocuments.find(data=>data.code==='99').id})
            this.onTypeDocumentChange(this.salesForm.value.tipoComprobante);
        });
        this._stores.getAll$().subscribe((data) => {
            this.stores = data?.content || [];
        });
        this._serialFlowsService.getAllsStore$().subscribe((data) => {
            const almacenId = data?.store?.id;
            if (almacenId) {
                this.salesForm.patchValue({ almacen: almacenId });
            }
        });
        this._entityTypesService.getWithSearch$().subscribe((data) => {
            const entityType = data?.content?.find((type: EntityTypes) => type.code === '01');
            this.idEntityType = entityType.id!;
            this.searchProvider('00000000');
        });
        this._operationTypeService.getWithSearch$().subscribe((data) => {
            const entityType = data?.content?.find((type: any) => type.code === '01');
            if (entityType) {
                this.salesForm.patchValue({
                    operationType: entityType.id,
                });
            }
        });
        this._paymentsTypeService.getWithSearch$().subscribe((data) => {
            this.paymentsTypes = data?.content || [];
            const defaultPayment = this.paymentsTypes.find(pt => pt.code === "01");
        });
    }

    public validateAndSetImageUrl(url: string): string {
        if (url && url.startsWith('http')) {
            return url;
        }
    }
    hasTransactionNumber(): boolean {
        return this.details.controls.some(detail => detail.get('showTransactionNumber')?.value === true);
    }

    onSelectPaymentType(event: any, detailIndex: number): void {
        const selectedPaymentTypeId = event.value;

        const detail = this.details.at(detailIndex) as FormGroup;

        if (selectedPaymentTypeId) {
            const selectedPaymentType = this.paymentsTypes.find(pt => pt.id === selectedPaymentTypeId);

            if (selectedPaymentType) {
                // Verificar si el código está en la lista permitida
                const showTransaction = ['02', '03', '05', '06', '07'].includes(selectedPaymentType.code);

                // Actualizar solo esta fila en el FormGroup
                detail.patchValue({
                    showTransactionNumber: showTransaction
                });

                this.searchPaymentTypeById(selectedPaymentTypeId, detailIndex);
            }
        } else {
            // Si no se selecciona nada, ocultar el campo en esta fila
            detail.patchValue({
                showTransactionNumber: false
            });

            detail.get('paymentMethods')?.setValue([]);
        }
    }

    searchPaymentTypeById(paymentTypeId: string, detailIndex: number): void {
        this._paymentsMethodsService.getByPaymentTypeId$(paymentTypeId).subscribe(
            (data) => {
                const detail = this.details.at(detailIndex) as FormGroup;
                detail.get('paymentMethods')?.setValue(data || []);
                const defaultPaymentMethod = data.find(pm => pm.code === "01");
                if (defaultPaymentMethod) {
                    detail.get('paymentMethod')?.setValue(defaultPaymentMethod.id);
                }
                this.cdr.detectChanges();
            },
            (error) => {
                const detail = this.details.at(detailIndex) as FormGroup;
                detail.get('paymentMethods')?.setValue([]);
                detail.get('paymentMethod')?.setValue('');
                this.cdr.detectChanges();
            }
        );
    }
    createDetail(): FormGroup {
        return this.fb.group({
            modoPago: [this.defaultPaymentId || '', Validators.required],
            paymentMethod: ['', Validators.required],
            paymentMethods: [[]],
            concept: ['PAGO', Validators.required],
            amount: [0, [Validators.required, Validators.min(1)]], // Importe
            notes: ['PAGO POR VENTA', Validators.required],
            transactionNumber: [''],
            showTransactionNumber: [false] // 🔹 Agregar este campo al FormGroup
        });
    }
    loadPaymentTypes() {
        this._paymentsTypeService.getWithSearch$().subscribe((data) => {
            this.paymentsTypes = data?.content || [];
            const defaultPayment = this.paymentsTypes.find(pt => pt.code === "01");
            if (defaultPayment) {
                this.defaultPaymentId = defaultPayment.id;
                this.details.controls.forEach((detail, index) => {
                    if (!detail.get('modoPago')?.value) {
                        detail.get('modoPago')?.setValue(this.defaultPaymentId);
                        this.searchPaymentTypeById(this.defaultPaymentId, index);
                    }
                });
            }
        });
    }
    onQuantityChange(index: number): void {
        clearTimeout(this.quantityChangeTimeout);
        this.showWarning = false;
        this.quantityChangeTimeout = setTimeout(() => {
            const quantityControl = this.productsArray.at(index).get('quantity');
            const selectedPresentationId = this.productsArray.at(index).get('selectedPresentation')?.value;
            const presentations = this.productsArray.at(index).get('presentations')?.value || [];
            const selectedPresentation = presentations.find((p: any) => p.id === selectedPresentationId);

            if (quantityControl && selectedPresentation) {
                let quantity = quantityControl.value;

                if (!quantity || isNaN(quantity)) {
                    quantity = 1;
                } else if (quantity < 1) {
                    quantity = 1;
                } else if (quantity > selectedPresentation.quantityInUnit) {
                    quantity = selectedPresentation.quantityInUnit;

                    this.showWarning = this.productsArray.value.some((product: any) => {
                        const selectedPresentation = product.presentations.find((p: any) => p.id === product.selectedPresentation);
                        return selectedPresentation && product.quantity > selectedPresentation.quantityInUnit;
                    });
                }
                quantityControl.setValue(quantity, { emitEvent: false });
                this.calculateTotal(index);
            }
        }, 500);
    }
    updateWarningState(): void {
        this.showWarning = this.productsArray.controls.some((productControl) => {
            const selectedPresentationId = productControl.get('selectedPresentation')?.value;
            const presentations = productControl.get('presentations')?.value || [];
            const selectedPresentation = presentations.find((p: any) => p.id === selectedPresentationId);
            const quantity = productControl.get('quantity')?.value;

            return selectedPresentation && quantity > selectedPresentation.quantityInUnit;
        });
    }

    private searchProduct(query: string): void {
        const storeId = this.salesForm.get('almacen')?.value;
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
    selectProduct(product: any): void {
        const storeId = this.salesForm.get('almacen')?.value;
        const serialControlStatus = product.product?.serialControl || false;
        const batchControlStatus = product.product?.batchControl || false;
        const typeAffectation = product.typeAffectation?.code || false;
        const percentageIgv = product.accountingDynamics?.percentageIgv || 0;
        const presentations = product.product?.productPresentations?.map((presentation: any) => ({
            id: presentation.id,
            name: presentation.unitMeasurement?.name || 'Sin nombre',
            factor: presentation.factor || 'Sin factor',
            quantityInUnit: presentation.quantityInUnit || 'Sin Cantidad',
            pricesDetail: presentation.pricesDetail || []
        })) || [];
        const defaultPrices = presentations.length > 0 ? presentations[0].pricesDetail : [];
        const defaultPrice = defaultPrices.length > 0 ? defaultPrices[0] : null;
        const productForm = this.fb.group({
            id: [product.product?.id],
            storeId: [storeId],
            name: [product.product?.name || ''],
            stock: [product.product?.minimumStock || 0],
            serialControl: [serialControlStatus],
            unit: [presentations[0]?.name || 'Sin nombre'],
            factor: [presentations[0]?.factor || 'Sin factor'],
            unitMeasurementName: [presentations[0]?.name || 'Sin Presentacion'],
            typeAffectation: [product.typeAffectation?.name || '-'],
            quantity: [1, Validators.required],
            unitPrice: [defaultPrice ? defaultPrice.price : 0],
            subtotal: [0],
            igv: [0],
            batchControl: [batchControlStatus],
            presentations: [presentations],
            selectedPresentation: [presentations[0]?.id || ''],
            prices: [defaultPrices],
            selectedPrice: [defaultPrice ? defaultPrice.id : ''],
            lots: [[]],
            series: [[]],
            percentageIgv: [percentageIgv],
            grabada: [typeAffectation],
        });
        this.productsArray.push(productForm);
        const index = this.productsArray.length - 1;
        this.calculateTotal(index);
        this.salesForm.patchValue({
            typeAffectation: product.typeAffectation?.name || '-',
            searchQuery: '',
        });
    }
    onKeyDown(event: KeyboardEvent) {
        if (!this.productsDynamics.length) return;

        switch (event.key) {
            case 'ArrowDown':
                this.selectedIndex = (this.selectedIndex + 1) % this.productsDynamics.length;
                this.scrollToSelectedItem(); // 👈 Desplazar scroll
                event.preventDefault();
                break;

            case 'ArrowUp':
                this.selectedIndex = (this.selectedIndex - 1 + this.productsDynamics.length) % this.productsDynamics.length;
                this.scrollToSelectedItem(); // 👈 Desplazar scroll
                event.preventDefault();
                break;

            case 'Home': // Ir al primer producto
                this.selectedIndex = 0;
                this.scrollToSelectedItem();
                event.preventDefault();
                break;

            case 'End': // Ir al último producto
                this.selectedIndex = this.productsDynamics.length - 1;
                this.scrollToSelectedItem();
                event.preventDefault();
                break;

            case 'Enter':
                if (this.selectedIndex >= 0) {
                    this.selectProduct(this.productsDynamics[this.selectedIndex]);
                    event.preventDefault();
                }
                break;

            case 'Escape':
                this.showDropdown = false;
                event.preventDefault();
                break;
        }
    }
    private scrollToSelectedItem(): void {
        setTimeout(() => {
            const selectedElement = document.querySelector('.selected-item');
            if (selectedElement) {
                selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 50); // ⏳ Pequeño delay para que Angular actualice la vista
    }

    onBlur() {
        setTimeout(() => {
            this.showDropdown = false;
        }, 200);
    }
    onPresentationChange(event: Event, index: number): void {
        const selectedPresentationId = (event.target as HTMLSelectElement).value;
        const presentations = this.productsArray.at(index).get('presentations')?.value || [];

        if (presentations.length === 0) {
            // Si no hay presentaciones, permitir la edición manual
            this.productsArray.at(index).patchValue({
                unitMeasurementName: null,
                prices: [],
                selectedPrice: null,
                unitPrice: null, // Permitir que el usuario ingrese el precio manualmente
                quantityInUnit: null,
                quantity: 1
            });

            return;
        }

        const selectedPresentation = presentations.find(
            (presentation: any) => presentation.id === selectedPresentationId
        );

        if (selectedPresentation) {
            let quantity = this.productsArray.at(index).get('quantity')?.value || 1;
            if (quantity > selectedPresentation.quantityInUnit) {
                quantity = selectedPresentation.quantityInUnit;
            }

            const firstPrice = selectedPresentation.pricesDetail.length > 0 ? selectedPresentation.pricesDetail[0] : null;

            this.productsArray.at(index).patchValue({
                unitMeasurementName: selectedPresentation.name,
                prices: selectedPresentation.pricesDetail,
                selectedPrice: firstPrice ? firstPrice.id : null,
                unitPrice: firstPrice ? firstPrice.price : null, // Ahora puede ser manual si no hay precios
                quantityInUnit: selectedPresentation.quantityInUnit,
                quantity: quantity
            });
            this.calculateTotal(index);
            this.updateWarningState();
            this.updateTotals();
        }
    }

    onPriceChange(event: Event, index: number): void {
        const selectedPriceId = (event.target as HTMLSelectElement).value;
        const prices = this.productsArray.at(index).get('prices')?.value || [];
        const selectedPrice = prices.find((price: any) => price.id === selectedPriceId);
        if (selectedPrice) {
            this.productsArray.at(index).patchValue({
                unitPrice: selectedPrice.price,
            });
            this.calculateTotal(index);
            this.updateTotals();
        }
    }

    public searchProvider(query: string): void {
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
                    this.entity = data;
                } else if (data?.content) {
                    this.entity = data.content;
                } else {
                    this.entity = [];
                }
                if (query.trim() === "00000000" && this.entity.length > 0) {
                    const selectedEntity = this.entity[0];
                    this.salesForm.patchValue({
                        proveedor: selectedEntity.nameSocialReason,
                        nameSocialReason: selectedEntity.nameSocialReason,
                        documentNumber: selectedEntity.documentNumber,
                        supplierId: selectedEntity.id
                    });
                    this.entity = [];
                }

                this.cdr.detectChanges();
            }
        );
    }



    /*public searchProvider(query: string): void {
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
                    this.entity = data;
                } else if (data?.content) {
                    this.entity = data.content;
                } else {
                    this.entity = [];
                }
                this.cdr.detectChanges();
            },

        );
    }*/
    public selectProvider(provider: Entities): void {
        if (provider) {
            this.salesForm.patchValue({
                proveedor: provider.nameSocialReason,
                supplierId: provider.id,
                nameSocialReason: provider.nameSocialReason,
                documentNumber: provider.documentNumber,
            });
            this.entity = [];
        }
    }
    deleteProduct(index: number): void {
        this.productsArray.removeAt(index);
        this.updateTotals();
    }
    calculateTotal(index: number): void {
        const productGroup = this.productsArray.at(index) as FormGroup;
        const porcentajeIGV = parseFloat(productGroup.get('percentageIgv')?.value) ;
        const grabada = parseFloat(productGroup.get('grabada')?.value);
        const igvAplicable = grabada === 10 ? porcentajeIGV : 0;
        const quantity = parseFloat(productGroup.get('quantity')?.value || 0);
        const unitPrice = parseFloat(productGroup.get('unitPrice')?.value || 0);
        const total = quantity * unitPrice;

        // Calcula base imponible e IGV con el porcentaje obtenido
        const baseImponible = this.roundToTwo(total / (1 + (igvAplicable / 100)));
        const igv = this.roundToTwo(total - baseImponible);

        productGroup.patchValue({
            subtotal: baseImponible,
            igv: igv,
        });

        this.updateTotals();
    }

    private roundToTwo(num: number): number {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }
    updateTotals(): void {
        let totalBI = 0;
        let totalIGV = 0;
        let totalFinal = 0;
        this.productsArray.controls.forEach((control: FormGroup) => {
            const subtotal = parseFloat(control.get('subtotal')?.value || 0);
            const igv = parseFloat(control.get('igv')?.value || 0);
            const totalProducto = subtotal + igv;
            totalBI += subtotal;
            totalIGV += igv;
            totalFinal += totalProducto;
        });
        this.bi = this.roundToTwo(totalBI);
        this.igv = this.roundToTwo(totalIGV);
        this.total = this.roundToTwo(totalFinal);
        this.calculateReturn();
    }
    calculateReturn(): void {
        const importeIngresado = this.salesForm.get('importe')?.value || 0;
        this.vuelto = this.roundToTwo(importeIngresado - this.total);
    }
    toggleMenu(event: Event): void {
        this.showMenu = !this.showMenu;
        event.stopPropagation();
    }
    @HostListener('document:click', ['$event'])
    closeMenu(): void {
        this.showMenu = false;
    }
    clearInput(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement.value === '0') {
            inputElement.value = '';
        }
    }
    restoreInput(event: Event, index: number | null, controlName: string): void {
        const inputElement = event.target as HTMLInputElement;
        const value = inputElement.value;
        if (!value) {
            if (index !== null) {
                const control = (this.productsArray.at(index) as FormGroup).get(controlName);
                control?.setValue(0);
            } else {
                const control = this.salesForm.get(controlName);
                control?.setValue(0);
            }
        }
    }
    public eventNew($event: boolean, productName: string, quantity: number, productIndex: number, storeId: string, productId: string): void {
        if ($event) {
            const productGroup = this.productsArray.at(productIndex) as FormGroup;
            const seriesControl = productGroup.get('series') as FormControl;
            const dialogRef = this.dialog.open(SalesNewSeriesComponent, {
                width: '650px',
                data: {
                    productName,
                    quantity,
                    storeId,
                    productId,
                    series: seriesControl.value || [],
                },
            });
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.length > 0) {
                    seriesControl.setValue(result);
                }
            });
        }
    }
    public eventNewLot($event: boolean, productName: string, quantity: number, productIndex: number, storeId: string, productId: string, selectedPresentation: string): void {
        if ($event) {
            const productGroup = this.productsArray.at(productIndex) as FormGroup;
            const lotsControl = productGroup.get('lots') as FormControl;
            const dialogRef = this.dialog.open(SalesNewLotesComponent, {
                width: '850px',
                data: {
                    productName,
                    quantity,
                    storeId,
                    productId,
                    selectedPresentation,
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
    isSaveDisabled(): boolean {
        return this.productsArray.controls.some((product: FormGroup) => {
            const serialControl = product.get('serialControl')?.value;
            const batchControl = product.get('batchControl')?.value;
            const series = product.get('series')?.value || [];
            const lots = product.get('lots')?.value || [];

            // Si el control de serie está activado pero no hay series, bloqueamos
            if (serialControl && series.length === 0) {
                return true;
            }

            // Si el control de lote está activado pero no hay lotes, bloqueamos
            if (batchControl && lots.length === 0) {
                return true;
            }

            return false; // Permitir guardar si no hay restricciones
        });
    }

    private generatePayload(): any {
        const localIssueDate = new Date(this.salesForm.get('fechaEmision')?.value.getTime() - this.salesForm.get('fechaEmision')?.value.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
        const localPaymentDateDate = new Date(this.salesForm.get('paymentDate')?.value.getTime() - this.salesForm.get('paymentDate')?.value.getTimezoneOffset() * 60000).toISOString().slice(0, 19);

        const currentDate = new Date().toISOString();
        return {
            paymentDto: {
                amount: this.salesForm.get('amount')?.value,
                paymentDate: localPaymentDateDate|| currentDate,
                operationType: {
                    id: this.salesForm.get('operationType')?.value,
                    code: "01",
                    state: true,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                    deletedAt: null,
                },
                transactionRelatedId: this.salesForm.get('transactionRelatedId')?.value || null,
                entityId: this.salesForm.get('entityId')?.value || null,
                storeId: this.salesForm.get('almacen')?.value || null,
                paymentDetails: this.details.controls.map((detail: FormGroup) => {
                    const selectedPaymentMethodId = detail.get('paymentMethod')?.value;
                    const selectedPaymentMethod = (detail.get('paymentMethods')?.value || []).find((method: any) => method.id === selectedPaymentMethodId);
                    return {
                        paymentMethod: {
                            id: selectedPaymentMethod?.id || '',
                            name: selectedPaymentMethod?.name || '',
                            code: selectedPaymentMethod?.code || '',
                            state: selectedPaymentMethod?.state || true,
                            createdAt: currentDate,
                            updatedAt: currentDate,
                            paymentType: {
                                id: selectedPaymentMethod?.paymentType?.id || '',
                                name: selectedPaymentMethod?.paymentType?.name || '',
                                code: selectedPaymentMethod?.paymentType?.code || '',
                                state: selectedPaymentMethod?.paymentType?.state || true,
                                createdAt: currentDate,
                                updatedAt: currentDate
                            }
                        },
                        concept: detail.get('concept')?.value || '',
                        amount: detail.get('amount')?.value || 0,
                        notes: detail.get('notes')?.value || '',
                        transactionNumber: detail.get('transactionNumber')?.value || '',
                    };
                }),
                createdAt: currentDate,
                updatedAt: currentDate
            },
            sale: {
                issueDate: localIssueDate || currentDate,
                documentTypeId: this.salesForm.get('tipoComprobante')?.value || '',
                series: this.salesForm.get('serie')?.value || '',
               // number: this.salesForm.get('numero')?.value || '',
                //companyId: this.salesForm.get('companyId')?.value || null,
                storeId: this.salesForm.get('almacen')?.value || null,
                supplierId: this.salesForm.get('supplierId')?.value || null,
                operationType: "INCOMING",
                nameSocialReason: this.salesForm.get('nameSocialReason')?.value || '',
                documentNumber: this.salesForm.get('documentNumber')?.value || '',
                igv: this.igv || 0,
                bi: this.bi || 0,
                total: this.total || 0,
                currency: 'PEN',
                exchangeRate: this.salesForm.get('vuelto')?.value || 0,
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
                createdBy: "admin",
                updatedBy: "admin",
                createdAt: currentDate,
                updatedAt: currentDate,
                transactionRelatedId: this.salesForm.get('transactionRelatedId')?.value || null
            }
        };
    }
    public saveForm(): void {
        if (this.salesForm.valid && !this.isSubmitting) {
            // Muestra la confirmación antes de continuar
            this._confirmDialogService.confirmSave({})
                .then(() => {
                    this.isSubmitting = true; // 🔒 Bloquea el botón
                    const payload = this.generatePayload();
                    this._salesService.add$(payload).subscribe({
                        next: (response) => {
                            this.router.navigate(['../'], { relativeTo: this.route });
                            this.isSubmitting = false; // 🔓 Habilita el botón después del éxito
                        },
                        error: (error) => {
                            this.isSubmitting = false; // 🔓 Habilita el botón si hay error
                        }
                    });
                })
        }
    }

    public cancelForm(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
    updateTotalAmount(): void {
        const totalAmount = this.details.value.reduce((sum, detail) => sum + (+detail.amount || 0), 0);
        this.salesForm.get('amount')?.setValue(totalAmount, { emitEvent: false });
    }
    addDetail(): void {
        this.details.push(this.createDetail());
        this.cdr.detectChanges();
    }
    get details() {
        return (this.salesForm.get('details') as FormArray);
    }
    removeDetail(index: number): void {
        this.details.removeAt(index);
        this.cdr.detectChanges();
    }

    public eventNewEntities($event: boolean): void {
        if ($event) {
            const entitiesForm = this.dialog.open(EntitiesCompanyCNewComponent);
            entitiesForm.componentInstance.title = 'Nueva Entidad' || null;
            entitiesForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.save(result);
                }
            });
        }
    }
    private save(data: Object) {
        this._entityService.add$(data).subscribe((response) => {
        });
    }
}
