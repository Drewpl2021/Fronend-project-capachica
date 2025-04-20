import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialog} from '@angular/material/dialog';
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
import {SalesEditSeriesComponent} from "./sales-edit-series.component";
import {SalesEditLotesComponent} from "./sales-edit-lotes.component";
import {SalesService} from "../../../../../../providers/services/sales/sales.service";
import {SalesCancelSeriesComponent} from "./sales-cancel-series.component";
import {SalesCancelLotesComponent} from "./sales-cancel-lotes.component";
import {CreditNoteTypesService} from "../../../../../../providers/services/sales/credit-note-types.service";
import {CreditNoteTypes} from "../../models/sales";
import {ConfirmDialogService} from "../../../../../../shared/confirm-dialog/confirm-dialog.service";

@Component({
    selector: 'app-sale-cancel',
    standalone: true,
    imports: [FormsModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, NgForOf, DecimalPipe, MatCheckboxModule, MatDatepickerModule, NgIf,],
    template: `
        <div class="bg-white flex flex-col px-4 py-4  mx-auto rounded shadow-md "  style="width: 10000px">
            <div class="flex justify-between bg-primary-600 text-white p-2 rounded mb-4">
                <h1 class="text-2xl font-bold">Ventas / Almacén </h1>
            </div>
            <form class="grid grid-cols-12 gap-2 mb-8" [formGroup]="saleForm">
                <div class="col-span-2">
                    <mat-form-field class="w-full"  >
                        <mat-label>Fecha Emisión</mat-label>
                        <input matInput [matDatepicker]="picker" formControlName="fechaEmision" >
                        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                        <mat-datepicker #picker></mat-datepicker>
                    </mat-form-field>
                </div>
                <div class="col-span-2">
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
                    <mat-form-field class="w-full" >
                        <mat-label>Tipo Anulación</mat-label>
                        <mat-select formControlName="tipoAnulación">
                            <mat-option value="" disabled>Seleccione Tipo de Documento</mat-option>
                            <mat-option *ngFor="let comprobante of creditNoteTypes" [value]="comprobante.id">
                                {{ comprobante.name }}
                            </mat-option>
                        </mat-select>
                    </mat-form-field>
                </div>

                <div class="col-span-2">
                    <mat-form-field class="w-full" floatLabel="always">
                        <mat-label>Serie</mat-label>
                        <input matInput formControlName="serie" placeholder="Serie (B001)" readonly>
                    </mat-form-field>
                </div>


                <div class="col-span-2">
                    <mat-form-field class="w-full"  floatLabel="always"  >
                        <mat-label>Número</mat-label>
                        <input matInput formControlName="numero" placeholder="Número (00000001)">
                        <mat-error *ngIf="saleForm.get('numero')?.hasError('required')">
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
                                    <mat-checkbox [(ngModel)]="showIGV" [ngModelOptions]="{standalone: true}">Mostrar IGV</mat-checkbox>
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
                        <span class="value text-primary-500" style="font-size: 1.2em;" [innerHTML]="saleForm.get('igv')?.value | number: '1.2-2'"></span>
                        <span class="value text-primary-500" style="font-size: 1.2em;" [innerHTML]="saleForm.get('bi')?.value | number: '1.2-2'"></span>
                        <span class="value text-primary-500" style="font-size: 1.2em;" [innerHTML]="saleForm.get('total')?.value | number: '1.2-2'"></span>
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
                        <div class="flex-1">Número de <br> Transacción</div>

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
                            <mat-form-field appearance="fill" class="flex-1">
                                <input matInput formControlName="transactionNumber" placeholder="0000-0000-0000-0000" />
                            </mat-form-field>
                        </div>
                    </div>
                    <mat-form-field style="font-size: 1.5rem; border-radius: 8px; width: 300px;">
                        <mat-label style=" font-weight: bold;">💰 Importe Total</mat-label>
                        <input class="text-primary-500" formControlName="amountPayment"  type="number" matInput readonly style="width: 300px;font-weight: bold;text-align: center;border-radius: 8px;">
                    </mat-form-field>
                </div>
            </form>
            <div class="flex justify-start gap-1">
                <button mat-raised-button color="warn" (click)="cancelForm()">Regresar</button>
                <button mat-raised-button color="primary" [disabled]="saleForm.invalid" (click)="saveForm()">Guardar</button>
            </div>
        </div>
    `,
})
export class SalesCancelComponent implements OnInit {
    public id: string = '';
    public idEntityType: string = '';
    public showIGV: boolean = false;
    public showMenu: boolean = false;
    public typeDocuments: TypeDocument[] = [];
    public creditNoteTypes: CreditNoteTypes[] = [];
    public stores: Stores[] = [];
    public entity: Entities[] = [];
    public operationTypes: OperationType[] = [];
    public paymentsTypes: PaymentsType[] = [];
    public defaultPaymentId: string = '';

    saleForm = new FormGroup({
        id: new FormControl(''),
        fechaEmision: new FormControl(new Date(), [Validators.required]),
        tipoComprobante: new FormControl('', [Validators.required]),
        tipoAnulación: new FormControl('', [Validators.required]),
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
        productPresentationId: new FormControl(''),
        paymentDate: new FormControl(new Date(), [Validators.required]),
        operationType: new FormControl('', [Validators.required]),
        details: this.fb.array([this.createDetail()])
    });

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private _confirmDialogService: ConfirmDialogService,
        private salesService: SalesService,
        private fb: FormBuilder,
        private _operationTypeService: OperationTypeService,
        private _stores: StoresService,
        private _typeDocument: TypeDocumentService,
        private _creditNoteTypesService: CreditNoteTypesService,
        private _entityTypesService: EntityTypesService,
        private dialog: MatDialog,
        private _salesService: SalesService,
        private dateAdapter: DateAdapter<Date>,
        private cdr: ChangeDetectorRef,
        private _paymentsTypeService: PaymentsTypeService,) {
        this.dateAdapter.setLocale('es-ES');
    }
    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.id = params.get('id') || '';
            if (this.id) {
                this.loadSalesData(this.id);
            }
        });
        this.uploadData();
    }
    private uploadData() {
        this._typeDocument.getWithSearch$().subscribe((data) => {
            this.typeDocuments = data?.content || [];
            const codes = ['07'];
            this.typeDocuments = this.typeDocuments.filter(doc => codes.includes(doc.code));
            if (this.typeDocuments.length > 0) {
                const idTipoComprobante = this.typeDocuments[0].id;
                this.saleForm.get('tipoComprobante')?.setValue(null);
                setTimeout(() => {
                    this.saleForm.get('tipoComprobante')?.setValue(idTipoComprobante);
                }, 0);
            }
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
            if (entityType) {this.saleForm.patchValue({operationType: entityType.id,});
            }
        });
        this._paymentsTypeService.getWithSearch$().subscribe((data) => {
            this.paymentsTypes = data?.content || [];
        });
        this._creditNoteTypesService.getAll$().subscribe((data) => {
            setTimeout(() => {
                this.creditNoteTypes = data || [];
            });
        });


    }
    private loadSalesData(id: string): void {
        this.salesService.getById$(id).subscribe(
            (data: any) => {
                if (data.sale) {
                    this.saleForm.patchValue({
                        fechaEmision: data.sale.issueDate,
                        tipoComprobante: data.sale.documentTypeId,
                        serie: data.sale.series,
                        numero: data.sale.number,
                        igv: data.sale.igv,
                        bi: data.sale.bi,
                        total: data.sale.total,
                        almacen: data.sale.storeId,
                        supplierId: data.sale.supplierId,
                        nameSocialReason: data.sale.nameSocialReason,
                    });
                }
                if (data.sale?.details) {
                    this.loadProductos(data.sale.details);
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
            this.saleForm.patchValue({
                amountPayment: paymentDto.amount || 0,
            });
        }
    }
    private loadPaymentDetails(paymentDetails: any[]): void {
        const paymentFormArray = paymentDetails.map((detail) =>
            this.fb.group({
                modoPago: [detail.paymentMethod?.paymentType?.id || '', Validators.required],
                paymentMethod: [detail.paymentMethod?.id || '', Validators.required],
                paymentMethods: [[detail.paymentMethod]],
                concept: [detail.concept || 'PAGO', Validators.required],
                amounts: [detail.amount || 0, [Validators.required, Validators.min(0)]],
                notes: [detail.notes || '', Validators.required],
                transactionNumber: [detail.transactionNumber || ''],
                showTransactionNumber: [false]
            })
        );
        this.saleForm.setControl('details', this.fb.array(paymentFormArray));
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
                productId: [product.productId || 'Sin productId'],
                productPresentationId: [product.productPresentationId || 'Sin Presentacion'],
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
                series: this.fb.array(
                    product.series?.map((serie: any) =>
                        this.fb.group({ seriesCode: [serie.seriesCode] })
                    ) || []
                ),
            });
            this.productsArray.push(productForm);
        });
    }
    public eventNew($event: boolean, productName: string, quantity: number, productIndex: number): void {
        if ($event) {
            const productGroup = this.productsArray.at(productIndex) as FormGroup;
            const seriesControl = productGroup.get('series') as FormArray;
            this.dialog.open(SalesCancelSeriesComponent, {
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
            this.dialog.open(SalesCancelLotesComponent, {
                width: '850px',
                data: {productName, quantity, lotes: lotsControl.value || [],
                },
            });
        }
    }

    private generatePayload(): any {
        const localIssueDate = new Date(this.saleForm.get('fechaEmision')?.value.getTime() - this.saleForm.get('fechaEmision')?.value.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
        const localPaymentDateDate = new Date(this.saleForm.get('paymentDate')?.value.getTime() - this.saleForm.get('paymentDate')?.value.getTimezoneOffset() * 60000).toISOString().slice(0, 19);

        const currentDate = new Date().toISOString();
        return {
            paymentDto: {
                amount: this.saleForm.get('amountPayment')?.value,
                paymentDate: localPaymentDateDate|| currentDate,
                operationType: {
                    id: this.saleForm.get('operationType')?.value,
                    code: "02",
                    state: true,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                    deletedAt: null,
                },
                transactionRelatedId: this.saleForm.get('transactionRelatedId')?.value || null,
                entityId: this.saleForm.get('entityId')?.value || null,
                storeId: this.saleForm.get('almacen')?.value || null,
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
                        amount: detail.get('amounts')?.value || 0,
                        notes: detail.get('notes')?.value || '',
                        transactionNumber: detail.get('transactionNumber')?.value || '',
                    };
                }),
                createdAt: currentDate,
                updatedAt: currentDate
            },
            sale: {
                issueDate: localIssueDate || currentDate,
                documentTypeId: this.saleForm.get('tipoComprobante')?.value || '',
                series: this.saleForm.get('serie')?.value || '',
                // number: this.salesForm.get('numero')?.value || '',
                //companyId: this.saleForm.get('companyId')?.value || null,
                storeId: this.saleForm.get('almacen')?.value || null,
                supplierId: this.saleForm.get('supplierId')?.value || null,
                operationType: "INCOMING",
                nameSocialReason: this.saleForm.get('nameSocialReason')?.value || '',
                documentNumber: this.saleForm.get('documentNumber')?.value || '',
                igv: this.saleForm.get('igv')?.value || 0,
                bi: this.saleForm.get('bi')?.value || 0,
                total: this.saleForm.get('total')?.value || 0,
                currency: 'PEN',
                exchangeRate: this.saleForm.get('vuelto')?.value || 0,
                exemptAmount: 0,
                unaffectedAmount: 0,
                freeAmount: 0,
                retentionAmount: 0,
                detraction: "string",
                details: this.productsArray.controls.map((product: FormGroup) => {
                    return {
                        productId: product.get('productId')?.value || '',
                        productAccountingDynamicId: product.get('productAccountingDynamicId')?.value || '',
                        productPresentationId: product.get('productPresentationId')?.value || '',
                        description: product.get('name')?.value || '',
                        unitMeasurementName: product.get('unitMeasurementName')?.value || '',
                        typeAffectation: product.get('typeAffectation')?.value || '',
                        quantity: product.get('quantity')?.value || 0,
                        unitPrice: product.get('unitPrice')?.value || 0,
                        //totalPrice: product.get('subtotal')?.value + product.get('igv')?.value || 0,
                        totalPrice: product.get('subtotal')?.value,
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
                creditNoteType: {
                    id: this.saleForm.get('tipoAnulación')?.value || '',
                },
                creditNoteSaleRelatedId: this.saleForm.get('id')?.value || '',
                relatedNumber: this.saleForm.get('serie')?.value || '',
                relatedSeries: this.saleForm.get('numero')?.value || '',

                createdBy: "admin",
                updatedBy: "admin",
                createdAt: currentDate,
                updatedAt: currentDate,
                transactionRelatedId: this.saleForm.get('transactionRelatedId')?.value || null
            }
        };
    }
    public saveForm(): void {
        if (this.saleForm.valid) {
            this._confirmDialogService.confirmSave({})
                .then(() => {
                    const payload = this.generatePayload();
                    this._salesService.add$(payload).subscribe({
                        next: (response) => {
                            this.router.navigate(['./'], { relativeTo: this.route.parent }).then((success) => {
                            });
                        }
                    });
                })
        }
    }

    public cancelForm(): void {
        this.router.navigate(['./'], { relativeTo: this.route.parent }).then((success) => {
        });
    }
    get details() {
        return (this.saleForm.get('details') as FormArray);
    }
    createDetail(): FormGroup {
        return this.fb.group({
            modoPago: [this.defaultPaymentId || '', Validators.required],
            paymentMethod: ['', Validators.required],
            paymentMethods: [[]],
            concept: ['PAGO', Validators.required],
            amount: [0, [Validators.required, Validators.min(1)]],
            amounts: [0, [Validators.required, Validators.min(1)]],
            notes: ['PAGO POR DEUDA', Validators.required],
            transactionNumber: [''],
            showTransactionNumber: [false] // 🔹 Agregar este campo al FormGroup
        });
    }
    get productsArray(): FormArray {
        return this.saleForm.get('products') as FormArray;
    }
    toggleMenu(event: Event): void {
        this.showMenu = !this.showMenu;
        event.stopPropagation();
    }
}
