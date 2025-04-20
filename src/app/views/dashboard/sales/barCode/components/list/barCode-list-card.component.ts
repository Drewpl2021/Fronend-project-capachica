import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import { Product} from '../../models/product';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import {MatDialog} from "@angular/material/dialog";
import {BarCodePrintComponent} from "../form/barCode-print.component";
@Component({
    selector: 'app-bar-code-list-card',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        DatePipe
    ],
    template: `
        <br>
        <!-- Listado de Productos -->
        <!-- Listado de Productos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
            @for (product of products; track product.id; let idx = $index) {
                <div class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">

                    <!-- Imagen del Producto -->
                    <div class="relative w-full h-48 bg-white p-2 flex items-center justify-center overflow-hidden group">
                        <img *ngIf="validImageUrls[product.id]"
                             [src]="validImageUrls[product.id]"
                             alt="Imagen del producto"
                             class="w-full h-full object-contain rounded-lg transform transition-all duration-300 ease-in-out group-hover:translate-y-[-10px] group-hover:scale-105">
                        <mat-icon class="text-gray-400 text-5xl" *ngIf="!validImageUrls[product.id]">image</mat-icon>
                    </div>

                    <!-- Header de la Card -->
                    <div class="bg-gray-100 px-4 py-2 flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-700">{{ product.product?.name }}</h3>
                        <span class="text-xs font-bold px-2 py-1 rounded-md bg-{{product.product?.state === true ? 'green' : 'red'}}-500/20 text-{{product.product?.state === true ? 'green' : 'red'}}-600">
                    {{ product.product?.state === true ? 'ACTIVO' : 'INACTIVO' }}
                </span>
                    </div>

                    <!-- Contenido -->
                    <div class="p-4">
                        <p class="text-sm text-gray-600"><strong>Descripción:</strong> {{ product.product?.description }}</p>
                        <p class="text-sm text-gray-600"><strong>Código:</strong> {{ product.product?.code }}</p>
                        <p class="text-sm text-gray-600"><strong>Marca:</strong> {{ product.product?.brand }}</p>
                        <p class="text-sm text-gray-600"><strong>Tipo de Impuesto:</strong> {{ product.product?.taxType }}</p>
                        <p class="text-sm text-gray-600"><strong>Categoría:</strong> {{ product.product?.category?.name }}</p>
                    </div>

                    <!-- Acciones -->
                    <div class="flex justify-between items-center px-4 py-2 bg-gray-50">
                        <div class="flex space-x-2 items-center mt-4 sm:mt-0">
                            <!-- Botón Seleccionar (Abre el Modal) -->
                            <button
                                class="ml-auto sm:ml-0 bg-primary-600 text-white"
                                mat-stroked-button
                                (click)="selectProduct(product)">
                                {{ selectedProduct?.id === product.id ? 'Seleccionado ✅' : 'Seleccionar' }}
                            </button>
                        </div>
                    </div>
                </div>
            } @empty {
                <div class="col-span-full text-center text-gray-600">
                    Sin Contenido
                </div>
            }
        </div>


        <br>

    `,
})
export class BarCodeListCardComponent implements OnInit, OnChanges {
    abcForms: any;
    @Input() products: Product[] = [];
    @Output() eventEdit = new EventEmitter<Product[]>();
    @Output() eventDelete = new EventEmitter<string>();
    public validImageUrls: { [key: string]: string } = {};
    public selectedProduct: Product | null = null;
    constructor(
        private _matDialog: MatDialog,

    ) {}

    ngOnInit() {
        this.abcForms = abcForms;
    }



    public selectProduct(product: Product) {
        this.selectedProduct = product; // Guardamos el único producto seleccionado
        //console.log("📌 Producto Seleccionado:", this.selectedProduct);
        this.openModalWithSelectedProduct();
    }

    // 🔥 Función para abrir el modal con el producto seleccionado
    private openModalWithSelectedProduct() {
        if (!this.selectedProduct) {
            //console.warn("⚠️ No hay producto seleccionado.");
            return;
        }

        const productForm = this._matDialog.open(BarCodePrintComponent, {
            width: '600px',
            data: { product: this.selectedProduct } // 🔥 Pasamos el único producto seleccionado
        });

        productForm.afterClosed().subscribe((result: any) => {
            //console.log("📌 Modal cerrado. Resultado:", result);
        });
    }



    private processImageUrls(): void {
        this.products.forEach(product => {
            this.validImageUrls[product.id] = this.validateAndSetImageUrl(product.product?.imageUrl);
        });
    }
    public validateAndSetImageUrl(url: string): string {
        if (url && url.startsWith('http')) {
            return url;
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['products'] && this.products.length > 0) {
            this.processImageUrls();
        }
    }
}
