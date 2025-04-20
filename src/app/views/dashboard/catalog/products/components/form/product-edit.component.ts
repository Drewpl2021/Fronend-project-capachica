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
import {MatDialogRef} from '@angular/material/dialog';
import {UnitMeasurent, Category, Product} from "../../models/product";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {CategoryService} from "../../../../../../providers/services/catalog/category.service";
import {UnitMeasurementService} from "../../../../../../providers/services/catalog/unit-measurement.service";

@Component({
    selector: 'app-product-new',
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
    ],
    template: `
        <div class="container">
            <!-- Header -->
            <div class="header flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="title">Editar Producto</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon class="text-current" [svgIcon]="'heroicons_outline:x-mark'"></mat-icon>
                </button>
            </div>

            <!-- Formulario -->
            <form class="form" [formGroup]="productForm">
                <div class="form-row">
                    <mat-form-field appearance="fill" class="form-field">
                        <mat-label>Nombre</mat-label>
                        <input type="text" matInput formControlName="name" />
                    </mat-form-field>

                    <mat-form-field appearance="fill" class="form-field">
                        <mat-label>Código</mat-label>
                        <input type="text" matInput formControlName="code" />
                    </mat-form-field>

                    <mat-form-field appearance="fill" class="form-field">
                        <mat-label>Stock Mínimo</mat-label>
                        <input type="number" matInput formControlName="minimumStock" />
                    </mat-form-field>

                    <mat-form-field appearance="fill" class="form-field">
                        <mat-label>Marca</mat-label>
                        <input type="text" matInput formControlName="brand" />
                    </mat-form-field>
                </div>
                <div class="form-row">


                    <mat-form-field appearance="fill" class="form-field">
                        <mat-label>URL de Imagen</mat-label>
                        <input type="text" matInput formControlName="imageUrl" />
                    </mat-form-field>

                    <mat-form-field appearance="fill" class="form-field">
                        <mat-label>Categoría</mat-label>
                        <mat-select formControlName="category">
                            <mat-option *ngFor="let category of categories" [value]="category.id">
                                {{ category.name }}
                            </mat-option>
                        </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="fill" class="form-field">
                        <mat-label>Descripción</mat-label>
                        <input matInput formControlName="description"/>
                    </mat-form-field>
                </div>
                <div class="toggle-grid">
                    <mat-slide-toggle formControlName="stockControl" color="primary">Control de Stock</mat-slide-toggle>
                    <mat-slide-toggle formControlName="batchControl" color="primary">Control por Lotes</mat-slide-toggle>
                    <mat-slide-toggle formControlName="serialControl" color="primary">Control de Serie</mat-slide-toggle>
                    <mat-slide-toggle formControlName="prescriptionRequired" color="primary">Requiere Prescripción</mat-slide-toggle>
                    <mat-slide-toggle formControlName="isService" color="primary">Es un Servicio</mat-slide-toggle>
                    <mat-slide-toggle formControlName="state" color="primary">Estado</mat-slide-toggle>
                </div>

                <button type="button" mat-raised-button color="primary" (click)="addProductPresentation()">
                    Añadir Presentación
                </button>
                <div class="dynamic-header">
                    <div>#</div>
                    <div style="margin-left: 150px">Factor</div>
                    <div style="margin-left: 300px">Unidad de Medida*</div>
                </div>

                <div formArrayName="productPresentations" class="product-presentations-container">
                    <div *ngFor="let presentation of productPresentations.controls; let i = index" [formGroupName]="i" class="dynamic-row">
                        <div><b>{{ i + 1 }}</b></div>
                        <mat-form-field appearance="fill" class="form-field">
                            <input type="number" matInput formControlName="factor" />
                        </mat-form-field>
                        <mat-form-field appearance="fill" class="form-field">
                            <mat-select formControlName="unitMeasurement">
                                <mat-option *ngFor="let unit of units" [value]="unit.id">
                                    {{ unit.name }}
                                </mat-option>
                            </mat-select>
                        </mat-form-field>
                        <button type="button" mat-icon-button color="warn" (click)="removeProductPresentation(i)">
                            <mat-icon>delete</mat-icon>
                        </button>
                    </div>
                </div>

                <!-- Botones -->
                <div class="actions">
                    <button type="button" mat-stroked-button color="warn" (click)="cancelForm()">Cancelar</button>
                    <button type="button" mat-raised-button color="primary" [disabled]="productForm.invalid" (click)="saveForm()">
                        Guardar
                    </button>
                </div>
            </form>
        </div>

    `,
})
export class ProductEditComponent implements OnInit {
    @Input() title: string = '';
    @Input() product = new Product();
    categories: Category[] = [];
    units: UnitMeasurent[] = [];

    abcForms: any;
    productForm: FormGroup = this.fb.group({
        name: ['', Validators.required],
        code: ['', Validators.required],
        description: [''],
        brand: [''],

        imageUrl: [''],
        minimumStock: [0, Validators.required],
        category: ['', Validators.required],
        productPresentations: this.fb.array([]),
        stockControl: [true, Validators.required],
        batchControl: [true, Validators.required],
        serialControl: [true, Validators.required],
        prescriptionRequired: [true, Validators.required],
        isService: [true, Validators.required],
        state: [true, Validators.required],
    });


    constructor(
        private fb: FormBuilder,
        private _matDialog: MatDialogRef<ProductEditComponent>,
        private categoryService: CategoryService,
        private unitService: UnitMeasurementService
    ) {
    }

    ngOnInit() {
        this.abcForms = abcForms;
        this.loadFormData();
        this.CargarDatos();
    }

    private loadFormData(): void {
        if (this.product) {
            this.productForm.patchValue({
                name: this.product.name,
                code: this.product.code,
                description: this.product.description,
                brand: this.product.brand,
                imageUrl: this.product.imageUrl,
                minimumStock: this.product.minimumStock,
                category: this.product.category?.id || '',
                stockControl: this.product.stockControl,
                batchControl: this.product.batchControl,
                serialControl: this.product.serialControl,
                prescriptionRequired: this.product.prescriptionRequired,
                isService: this.product.isService,
                state: this.product.state,
            });

            this.product.productPresentations?.forEach((presentation) => {
                this.productPresentations.push(this.createProductPresentation(presentation));
            });
        }
    }

    private CargarDatos() {
        this.categoryService.getWithAll$().subscribe((data) => {
            this.categories = data || [];
        });
        this.unitService.getWithActive$().subscribe((data) => {
            this.units = data || [];
        });
    }
    // Getter para las presentaciones de producto
    get productPresentations(): FormArray {
        return this.productForm.get('productPresentations') as FormArray;
    }

    // Crear una nueva presentación de producto
    private createProductPresentation(presentation?: any): FormGroup {
        return this.fb.group({
            id: new FormControl(presentation?.id || ''),
            factor: [presentation?.factor || 1, Validators.required],
            unitMeasurement: [presentation?.unitMeasurement?.id || '', Validators.required],
        });
    }

    // Agregar una nueva presentación
    public addProductPresentation(): void {
        this.productPresentations.push(this.createProductPresentation());
    }

    // Eliminar una presentación por índice
    public removeProductPresentation(index: number): void {
        this.productPresentations.removeAt(index);
    }

    public saveForm(): void {
        if (this.productForm.valid) {
            const formValues = this.productForm.value;

            const payload = {
                name: formValues.name,
                code: formValues.code,
                description: formValues.description,
                brand: formValues.brand,
                taxType: formValues.taxType,
                imageUrl: formValues.imageUrl,
                minimumStock: formValues.minimumStock,
                category: { id: formValues.category },
                productPresentations: formValues.productPresentations.map((presentation: any) => ({
                    id: presentation.id,
                    factor: presentation.factor,
                    unitMeasurement: { id: presentation.unitMeasurement },
                })),
                stockControl: formValues.stockControl,
                batchControl: formValues.batchControl,
                serialControl: formValues.serialControl,
                prescriptionRequired: formValues.prescriptionRequired,
                isService: formValues.isService,
                state: formValues.state,
            };

            this._matDialog.close(payload);
        }
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }
}
