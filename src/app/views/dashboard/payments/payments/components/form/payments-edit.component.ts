import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogRef} from '@angular/material/dialog';
import {Entities, OperationType, PaymentMethods, Payments} from "../../models/payments";
import {DateAdapter, MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {OperationTypeService} from "../../../../../../providers/services/payments/OperationType.service";
import {PaymentsMethodsService} from "../../../../../../providers/services/payments/PaymentsMethods.service";
import {Stores} from "../../../../catalog/productsDynamic/models/product-dynamics";
import {StoresService} from "../../../../../../providers/services/accounting/stores.service";
import {EntityTypes} from "../../../../buys/purchases/models/purchases";
import {EntityTypesService} from "../../../../../../providers/services/client/entityTypes.service";
import {EntityService} from "../../../../../../providers/services/client/Entitys.service";
import {debounceTime, distinctUntilChanged, skipWhile} from "rxjs";

@Component({
    selector: 'app-payments-new',
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
        MatDatepickerModule,
        NgIf,
    ],
    template: `
    <div class=" container flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
      <!-- Header -->
      <div class="header flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
        <div class="text-lg font-medium">Editar Pago</div>
        <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
          <mat-icon class="text-current" [svgIcon]="'heroicons_outline:x-mark'"></mat-icon>
        </button>
      </div>

      <!-- Formulario -->
      <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="paymentsForm">
          <div class="form-container" style="display: flex; gap: 20px; justify-content: flex-start;">
              <mat-form-field style="flex: 1;">
                  <mat-label>Almacén</mat-label>
                  <mat-select formControlName="storeId">
                      <mat-option value="" disabled>Seleccione Almacén</mat-option>
                      <mat-option *ngFor="let almacen of stores" [value]="almacen.id">
                          {{ almacen.name }}
                      </mat-option>
                  </mat-select>
              </mat-form-field>

              <mat-form-field appearance="fill" class="form-field" style="flex: 1;">
                  <mat-label>Tipo de Operación</mat-label>
                  <mat-select formControlName="operationType">
                      <mat-option value="" disabled>Seleccione Tipo Operación</mat-option>
                      <mat-option *ngFor="let operationType of operationTypes" [value]="operationType.id">
                          {{ operationType.name }}
                      </mat-option>
                  </mat-select>
              </mat-form-field>
              <mat-form-field class="w-full" style="flex: 1;">
                  <mat-label>Fecha de Pago</mat-label>
                  <input matInput [matDatepicker]="picker" formControlName="paymentDate">
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
          </div>

          <div class="form-container" style="display: flex; gap: 20px; justify-content: flex-start;">
              <div style="position: relative; flex: 1;">
                  <mat-form-field class="w-full">
                      <mat-label>Buscar Proveedor</mat-label>
                      <input
                          matInput
                          formControlName="proveedor"
                          placeholder="Nombre o RUC del proveedor"
                      />
                      <button mat-icon-button matSuffix>
                          <mat-icon>search</mat-icon>
                      </button>
                  </mat-form-field>


                  <!-- Lista de resultados de búsqueda -->
                  <div
                      *ngIf="entity.length > 0"
                      style="position: absolute; top: 100%; left: 0; width: 100%; background: white; border: 1px solid #ccc; border-radius: 4px;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); max-height: 200px; overflow-y: auto; z-index: 1000;">
                      <div *ngFor="let provider of entity"
                           style="padding: 10px; cursor: pointer; transition: background 0.2s ease-in-out;"
                           (click)="seleccionarProveedor(provider)">
                          <div style="font-weight: bold;">{{ provider.nameSocialReason }}</div>
                          <div style="font-size: 14px; color: gray;">RUC: {{ provider.documentNumber }}</div>
                      </div>
                  </div>
              </div>

              <mat-form-field style="flex: 1;">
                  <mat-label>Importe Total</mat-label>
                  <input type="number" matInput style="font-weight: bold; color: #000;" formControlName="amount" readonly />
              </mat-form-field>
          </div>

        <!-- Botón para agregar detalles -->
        <button type="button" mat-raised-button color="primary" (click)="addDetail()">Añadir Detalle</button>
        <br>

        <!-- Cabecera de la tabla dinámica -->
        <div class="dynamic-header">
          <div>#</div>
          <div style="margin-left: 30px">Método de Pago</div>
          <div style="margin-left: 50px">Concepto</div>
          <div style="margin-left: 100px">Importe</div>
          <div style="margin-left: 150px">Nota</div>
        </div>

        <!-- Lista de detalles dinámicos -->
        <div formArrayName="details" class="product-presentations-container">
          <div *ngFor="let detail of details.controls; let i = index" [formGroupName]="i" class="dynamic-row">
            <div><b>{{ i + 1 }}</b></div>

            <mat-form-field appearance="fill" class="form-field">
              <mat-select formControlName="paymentMethod">
                <mat-option *ngFor="let paymentMethod of paymentMethods" [value]="paymentMethod.id">
                  {{ paymentMethod.name }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill" class="form-field">
              <input matInput formControlName="concept" />
            </mat-form-field>

            <mat-form-field appearance="fill" class="form-field">
              <input type="number" matInput formControlName="amount" />
            </mat-form-field>

            <mat-form-field appearance="fill" class="form-field">
              <input matInput formControlName="notes" />
            </mat-form-field>

            <!-- Botón para eliminar detalle -->
            <button type="button" mat-icon-button color="warn" (click)="removeDetail(i)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>

        <!-- Botones de guardar y cancelar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
          <div class="flex space-x-2 items-center mt-4 sm:mt-0">
            <button class="ml-auto sm:ml-0" color="warn" mat-stroked-button (click)="cancelForm()">Cancelar</button>
            <button class="ml-auto sm:ml-0" color="primary" [disabled]="paymentsForm.invalid" mat-stroked-button (click)="saveForm()">Guardar</button>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class PaymentsEditComponent implements OnInit {
    @Input() title: string = '';
    @Input() payments = new Payments();
    operationTypes: OperationType[] = [];
    paymentMethods: PaymentMethods[] = [];
    stores: Stores[] = [];
    entity: Entities[] = [];
    idEntityType: string = '';
    isSelected: boolean = false;

    paymentsForm = new FormGroup({
        amount: new FormControl({ value: 0, disabled: true }, [Validators.required]),
        paymentDate: new FormControl(new Date(), [Validators.required]),
        operationType: new FormControl('', [Validators.required]),

        // Campos adicionales
        proveedor: new FormControl('', [Validators.required]), // Nombre del proveedor
        supplierId: new FormControl('', [Validators.required]), // ID del proveedor
        nameSocialReason: new FormControl(''), // Nuevo campo para almacenar el nombre
        documentNumber: new FormControl(''), // Nuevo campo para almacenar el RUC
        storeId: new FormControl('', [Validators.required]), // ID del proveedor

        details: this.fb.array([this.createDetail()])
    });

    constructor(
        private _matDialog: MatDialogRef<PaymentsEditComponent>,
        private _operationTypeService: OperationTypeService,
        private paymentsMethodsService: PaymentsMethodsService,
        private cdr: ChangeDetectorRef,
        private dateAdapter: DateAdapter<Date>,
        private fb: FormBuilder,
        private storesService: StoresService,
        private _entityTypesService: EntityTypesService,
        private _entityService: EntityService, // Servicio para buscar proveedores

    ) {
        this.dateAdapter.setLocale('es-ES');
    }

    ngOnInit() {
        this.CargarDatos();



        // Configurar los datos iniciales en el formulario
        const formData = {
            ...this.payments,
            proveedor: this.payments.nameSocialReason, // Mostrar el nombre del proveedor en el buscador
            supplierId: this.payments.entityId, // ID del proveedor
            documentNumber: this.payments.documentNumber, // Documento del proveedor
            paymentDate: new Date(this.payments.paymentDate), // Formatear fecha correctamente
            operationType: this.payments.operationType?.id || '', // ID del tipo de operación
        };

        if (this.payments.paymentDetails) {
            const detailsFormArray = this.payments.paymentDetails.map(detail =>
                this.fb.group({
                    paymentMethod: [detail.paymentMethod?.id || '', Validators.required],
                    concept: [detail.concept, Validators.required],
                    amount: [detail.amount, [Validators.required, Validators.min(0)]],
                    notes: [detail.notes, Validators.required],
                })
            );
            this.paymentsForm.setControl('details', this.fb.array(detailsFormArray)); // Asignar el FormArray con los detalles
        }

        this.paymentsForm.patchValue(formData);

        // Configurar el buscador de proveedores
        this.paymentsForm.get('proveedor')?.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                skipWhile(value => this.isSelected) // Evitar búsquedas si ya se seleccionó
            )
            .subscribe(query => {
                this.buscarProveedor(query);
            });
    }

    private CargarDatos() {
        this._operationTypeService.getWithSearch$().subscribe((data) => {
            this.operationTypes = data?.content || [];
        });
        this.storesService.getAll$().subscribe(data => {
            this.stores = data?.content || [];
        });
        this.paymentsMethodsService.getWithSearch$().subscribe((data) => {
            this.paymentMethods = data?.content || [];
        });
        this._entityTypesService.getWithSearch$().subscribe((data) => {
            const entityType = data?.content?.find((type: EntityTypes) => type.code === '02');
            this.idEntityType = entityType.id!;
        });
    }
    buscarProveedor(query: string): void {
        if (!query.trim() || !this.idEntityType) {
            this.entity = [];
            return;
        }

        const params = {
            documentNumber: query.trim(),
            idEntityType: this.idEntityType,
        };

        this._entityService.getWithFilt$(params).subscribe({
            next: (data: any) => {
                this.entity = Array.isArray(data) ? data : data?.content || [];
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error al buscar proveedor:', err);
                this.entity = [];
            },
        });
    }

    seleccionarProveedor(provider: Entities): void {
        if (provider) {
            this.isSelected = true;

            this.paymentsForm.patchValue(
                {
                    proveedor: provider.nameSocialReason,
                    supplierId: provider.id,
                    nameSocialReason: provider.nameSocialReason,
                    documentNumber: provider.documentNumber,
                },
                { emitEvent: false } // Evita disparar valueChanges
            );


            this.entity = []; // Limpia los resultados de búsqueda
            this.cdr.detectChanges(); // Actualiza la vista manualmente
            setTimeout(() => (this.isSelected = false), 500);
        }
    }

    public saveForm(): void {
        if (this.paymentsForm.valid) {
            const formValues = this.paymentsForm.value;
            const formattedData = {
                id: this.payments.id,
                amount: Number(formValues.amount),
                paymentDate: new Date(formValues.paymentDate).toISOString(),
                operationType: { id: formValues.operationType },
                nameSocialReason: formValues.proveedor, // Nombre del proveedor
                documentNumber: formValues.documentNumber, // Documento del proveedor
                entityId: formValues.supplierId, // ID del proveedor
                paymentDetails: formValues.details.map(detail => ({
                    paymentMethod: { id: detail.paymentMethod },
                    concept: detail.concept,
                    amount: Number(detail.amount),
                    notes: detail.notes,
                }))
            };



            this._matDialog.close(formattedData);
        }
    }

    public cancelForm(): void {
        this._matDialog.close(''); // Cierra el modal sin guardar
    }

    get details() {
        return (this.paymentsForm.get('details') as FormArray);
    }

    createDetail(): FormGroup {
        return this.fb.group({
            paymentMethod: ['', Validators.required],
            concept: ['', Validators.required],
            amount: [0, [Validators.required, Validators.min(0)]],
            notes: ['', Validators.required]
        });
    }

    addDetail(): void {
        this.details.push(this.createDetail());
        this.cdr.detectChanges(); // Asegura que la vista se actualice
    }

    removeDetail(index: number): void {
        this.details.removeAt(index);
        this.cdr.detectChanges(); // Asegura que la vista se actualice
    }
}
