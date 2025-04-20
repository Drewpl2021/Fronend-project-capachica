import {ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
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
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UnitMeasurent, Category, Product} from "../../models/product";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule, NgForOf} from "@angular/common";
import {CategoryService} from "../../../../../../providers/services/catalog/category.service";
import {UnitMeasurementService} from "../../../../../../providers/services/catalog/unit-measurement.service";
import {BarCodeService} from "../../../../../../providers/services/sales/barCode.service";
import {Prices} from "../../../prices/models/prices";

@Component({
    selector: 'app-bar-code-new',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, NgForOf,],
    template: `
        <div >
            <div class="header flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="title">Datos para la Impresión</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon class="text-current" [svgIcon]="'heroicons_outline:x-mark'"></mat-icon>
                </button>
            </div>
            <form class="form" [formGroup]="productForm">
                <div class="form-row">
                    <mat-form-field appearance="fill" class="form-field">
                        <mat-label>Código</mat-label>
                        <input type="text" matInput formControlName="code" readonly />
                    </mat-form-field>
                </div>
                <div class="form-row" *ngIf="filteredPrices.length > 0">
                    <mat-form-field appearance="fill" class="form-field">
                        <mat-label>Presentación</mat-label>
                        <mat-select formControlName="presentation" (selectionChange)="onPresentationChange($event.value)">
                            <mat-option *ngFor="let presentation of presentaciones" [value]="presentation.id">
                                {{ presentation.unitMeasurement?.name || 'Sin Unidad' }}
                            </mat-option>
                        </mat-select>
                    </mat-form-field>
                </div>
                <div class="form-row" *ngIf="filteredPrices.length > 0">
                    <mat-form-field appearance="fill" class="form-field">
                        <mat-label>Precios</mat-label>
                        <mat-select (selectionChange)="onPriceChange($event.value)">
                            <mat-option *ngFor="let price of filteredPrices" [value]="price.id">
                                {{ price.name }} - S/ {{ price.price }}
                            </mat-option>
                        </mat-select>
                    </mat-form-field>
                </div>
                <div class="form-row" *ngIf="filteredPrices.length === 0">
                    <mat-form-field appearance="fill" class="form-field">
                        <mat-label>Precio</mat-label>
                        <input type="number" matInput formControlName="price" />
                    </mat-form-field>
                </div>
                <div class="form-row">
                    <mat-form-field appearance="fill" class="form-field">
                        <mat-label>Cantidad de Impresiones</mat-label>
                        <input type="number" matInput formControlName="quantity" />
                    </mat-form-field>
                </div>
                <div class="actions">
                    <button type="button" mat-stroked-button color="warn" (click)="cancelForm()">Cancelar</button>
                    <button type="button" mat-raised-button color="primary" [disabled]="productForm.invalid" (click)="saveForm()">
                        Generar Código de Barras
                    </button>
                </div>
            </form>
        </div>

    `,
})
export class BarCodePrintComponent implements OnInit {
    @Input() title: string = '';
    @Input() product = new Product();
    categories: Category[] = [];
    selectedPresentationId: string | null = null; // 🔥 Para almacenar la presentación seleccionada
    selectedPriceId: string | null = null; // 🔥 Para almacenar el precio seleccionado
    filteredPrices: any[] = [];
    abcForms: any;
    selectedPriceValue: number | null = null; // 🔥 Almacena el valor del precio seleccionado
    presentaciones: any[] = [];
    showManualPriceInput: boolean = false;
    productForm: FormGroup = this.fb.group({
        code: ['', Validators.required],
        presentation: [null, Validators.required], // 🔥 Asegurar que permita valores null
        price: [null, Validators.required], // ✅ Deshabilitado hasta que se seleccione un precio
        quantity: ['1', Validators.required],
        width: ['50'],
        height: ['20']
    });


    constructor(
        private fb: FormBuilder,
        private cdRef: ChangeDetectorRef,
        private _matDialog: MatDialogRef<BarCodePrintComponent>,
        private categoryService: CategoryService,
        private barCodeService: BarCodeService,
        private unitService: UnitMeasurementService,
        public dialogRef: MatDialogRef<BarCodePrintComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }


    ngOnInit() {
        this.loadFormData(); // Intenta cargar datos en el formulario
        this.CargarDatos();

        setTimeout(() => {
            this.cdRef.detectChanges(); // 🔥 Solución para NG0100
        }, 0);
    }
    private loadFormData(): void {
        if (this.data?.product) {


            // 🔹 Extraer correctamente las presentaciones
            this.presentaciones = this.data.product.product?.productPresentations || [];


            // 🔹 Asegurar que haya presentaciones
            if (this.presentaciones.length > 0) {
                this.selectedPresentationId = this.presentaciones[0].id;
                this.updateFilteredPrices(this.selectedPresentationId);
            }

            // 🔹 Determinar si mostrar el campo de precio manual
            this.showManualPriceInput = this.presentaciones.length === 0;

            this.productForm.patchValue({
                code: this.data.product.product?.code || '',
                presentation: this.selectedPresentationId || null,
                price: this.selectedPriceId || null
            });

            setTimeout(() => this.cdRef.detectChanges(), 0);
        }
    }

    private updateFilteredPrices(selectedPresentationId: string): void {
        const selectedPresentation = this.presentaciones.find(p => p.id === selectedPresentationId);
        this.filteredPrices = selectedPresentation ? selectedPresentation.pricesDetail : [];



        // ✅ Determinar si se debe mostrar el campo de precio manual
        this.showManualPriceInput = this.presentaciones.length === 0 || this.filteredPrices.length === 0;

        // Si hay precios disponibles, seleccionamos el primero
        if (this.filteredPrices.length > 0) {
            this.selectedPriceId = this.filteredPrices[0].id;
            this.productForm.patchValue({ price: this.filteredPrices[0].price });
        } else {
            this.selectedPriceId = null;
            this.productForm.patchValue({ price: null });
        }

        this.cdRef.detectChanges();
    }

    onPresentationChange(selectedPresentationId: string): void {
        this.selectedPresentationId = selectedPresentationId;
        this.updateFilteredPrices(selectedPresentationId);
    }

    onPriceChange(selectedPriceId: string): void {
        this.selectedPriceId = selectedPriceId;
        const selectedPrice = this.filteredPrices.find(p => p.id === selectedPriceId);


        this.selectedPriceValue = selectedPrice ? selectedPrice.price : null;

        this.productForm.patchValue({ price: this.selectedPriceValue });

        this.cdRef.detectChanges();
    }

    private CargarDatos() {
        this.categoryService.getAll$().subscribe((data) => {
            this.categories = data?.content || [];
        });
    }

    public saveForm(): void {
        if (this.productForm.valid) {
            const formValues = this.productForm.value;
            const params = {
                text: formValues.code.trim(),
                price: formValues.price,
                quantity: formValues.quantity,
                width: formValues.width,
                height: formValues.height
            };

            this.barCodeService.getFileById$(params).subscribe((response) => {

                const blob = new Blob([response], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                window.open(url);
                this._matDialog.close('');

            });
        }
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }

}
