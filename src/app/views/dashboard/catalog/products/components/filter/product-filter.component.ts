import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {Category} from "../../models/product";
import {CategoryService} from "../../../../../../providers/services/catalog/category.service";
import {ProductService} from "../../../../../../providers/services/catalog/product.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@Component({
    selector: 'app-product-filter',
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
        MatProgressSpinnerModule,
    ],
    template: `
        <!-- 🔥 Pantalla de Carga -->
        <div *ngIf="isLoading" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 class="text-lg font-semibold text-gray-800">Subiendo archivo...</h2>
                <div class="mt-4">
                    <mat-spinner></mat-spinner> <!-- 🔥 Cargando con Angular Material -->
                </div>
            </div>
        </div>

        <div class="header-container">
            <div class="header-title bg-primary-600">
                <span class="header-icon">🏷️</span>
                <span>Productos</span>
            </div>
            <div class="actions-container" style="display: flex; align-items: center; gap: 16px;">

                <form class="form-container" [formGroup]="unitMeasurementFilterForm" (ngSubmit)="onSubmit()" style="flex: 1;">
                    <div class="form-fields-container" style="display: flex; gap: 16px; width: 100%; margin-bottom: 5px">

                        <button class="action-button" mat-flat-button [color]="'primary'" type="button" (click)="downloadFormat()">
                            <mat-icon [svgIcon]="'heroicons_outline:arrow-down-tray'"></mat-icon>
                            <span class="ml-1"> Descargar Formato</span>
                        </button>


                        <!-- Botón para Importar Excel -->
                        <button class="action-button" mat-flat-button [color]="'primary'" type="button" (click)="triggerFileInput()">
                            <mat-icon [svgIcon]="'heroicons_outline:document-text'"></mat-icon>
                            <span class="ml-1"> Importar Excel</span>
                        </button>

                        <!-- Input File Oculto -->
                        <input type="file" #fileInput accept=".xlsx, .xls" (change)="onFileSelected($event)" hidden>


                        <button class="action-button" mat-flat-button [color]="'primary'" type="button" >
                            <mat-icon [svgIcon]="'heroicons_outline:document-text'"></mat-icon>
                            <span class="ml-1"> Exportar a Excel</span>
                        </button>

                    </div>



                    <div class="form-fields-container" style="display: flex; gap: 16px; width: 100%;">
                        <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded full-width"
                                        [subscriptSizing]="'dynamic'"
                                        style="flex: 1;">
                            <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:magnifying-glass'"></mat-icon>
                            <input
                                matInput
                                formControlName="concatenatedFields"
                                autocomplete="off"
                                placeholder="Buscar Productos"
                            />
                        </mat-form-field>

                        <!-- Selección de Categoría -->
                        <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded full-width"
                                        [subscriptSizing]="'dynamic'"
                                        style="flex: 1;">
                            <mat-select formControlName="categoryId" placeholder="Seleccionar Categoría">
                                <mat-option [value]="">Mostrar todo</mat-option>
                                <mat-option *ngFor="let category of categories" [value]="category.id">
                                    {{ category.name }}
                                </mat-option>
                            </mat-select>
                        </mat-form-field>


                        <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded full-width"
                                        [subscriptSizing]="'dynamic'"
                                        style="flex: 1;">
                            <mat-select [(ngModel)]="viewMode" (selectionChange)="goChangeView($event.value)" placeholder="Cambiar vista">
                                <mat-option [value]="1">Tarjeta</mat-option>
                                <mat-option [value]="2">Tabla</mat-option>
                            </mat-select>
                        </mat-form-field>

                        <button class="action-button" mat-flat-button [color]="'primary'" type="submit">
                            <mat-icon [svgIcon]="'heroicons_outline:funnel'"></mat-icon>
                            <span class="ml-1"> Visualizar</span>
                        </button>

                        <button class="action-button" mat-flat-button color="primary" (click)="goNew()"
                                style="white-space: nowrap;">
                            <mat-icon [svgIcon]="'heroicons_outline:plus'"></mat-icon>
                            <span>Añadir Producto</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>


    `,
})
export class ProductFilterComponent implements OnInit {
    @ViewChild('fileInput') fileInput!: ElementRef; // Referencia al input file
    @Output() eventFilter: EventEmitter<any> = new EventEmitter<any>();
    @Output() eventNew = new EventEmitter<boolean>();
    @Output() eventChangeView: EventEmitter<number> = new EventEmitter<number>();
    public isLoading: boolean = false; // 🔥 Estado para la pantalla de carga
    public abcForms: any;
    public categoryId: string | null = null;
    public viewMode: number = 1;
    public categories: Category[] = [];
    public unitMeasurementFilterForm = new FormGroup({
        concatenatedFields: new FormControl(''),
        categoryId: new FormControl(null)

    });
    constructor(
        private _categoryService: CategoryService,
        private _productService: ProductService
    ) {}
    ngOnInit() {
        this.abcForms = abcForms;
        this.CargarDatos();
    }
    onSubmit() {
        if (this.unitMeasurementFilterForm.valid) {
            const formData = {
                ...this.unitMeasurementFilterForm.value,
                categoryId: this.unitMeasurementFilterForm.value.categoryId || '',
                concatenatedFields: this.unitMeasurementFilterForm.value.concatenatedFields || '',
            };
            this.eventFilter.emit(formData);
        }
    }
    private CargarDatos() {
        this._categoryService.getWithAll$().subscribe((data) => {
            this.categories = data || [];
        });

    }
    public goNew() {
        this.eventNew.emit(true);
    }
    public goChangeView(selectedView: number): void {
        this.viewMode = selectedView;
        this.eventChangeView.emit(selectedView);
    }
    downloadFormat(): void {
        const fileUrl = 'assets/excel/FormatoProductos.xlsx';
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', 'FormatoProductos.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    triggerFileInput(): void {
        this.fileInput.nativeElement.click();
    }

    // 🔥 Captura el archivo seleccionado y lo envía
    onFileSelected(event: any): void {
        const file: File = event.target.files[0];

        if (file) {
            this.uploadFile(file);
        }
    }


    uploadFile(file: File): void {
        this.isLoading = true; // 🔥 Mostrar pantalla de carga

        const formData = new FormData();
        formData.append('file', file);

        this._productService.postFile$(formData).subscribe({
            next: (response) => {
                this.getProduct();
                this.isLoading = false; // 🔥 Ocultar pantalla de carga
            },
            error: (error) => {
                this.isLoading = false; // 🔥 Ocultar pantalla de carga en caso de error
            }
        });
    }

    private getProduct(): void {
        if (this.unitMeasurementFilterForm.valid) {
            const formData = {
                ...this.unitMeasurementFilterForm.value,
                categoryId: this.unitMeasurementFilterForm.value.categoryId || '',
                concatenatedFields: this.unitMeasurementFilterForm.value.concatenatedFields || '',
            };
            this.eventFilter.emit(formData);
        }    }
}
