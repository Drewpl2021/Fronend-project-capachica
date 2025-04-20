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
import {BarCodePrintComponent} from "../form/barCode-print.component";
import {MatDialog} from "@angular/material/dialog";
@Component({
    selector: 'app-bar-code-list-table',
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
        <div class="table-container">
            <table class="custom-table">
                <thead>
                <tr class="bg-primary-600 text-white">
                    <th class="w-1/9 table-head text-center border-r">#</th>
                    <th class="w-1/9 table-header text-center border-r">Nombre</th>
                    <th class="w-1/9 table-header text-center border-r">Descripción</th>
                    <th class="w-1/9 table-header text-center border-r">Código</th>
                    <th class="w-1/9 table-header text-center border-r">Marca</th>
                    <th class="w-1/9 table-header text-center border-r">Categoria</th>
                    <th class="w-1/9 table-header text-center border-r">Stock Minimo</th>
                    <th class="w-1/9 table-header text-center border-r">Estado</th>
                    <th class="w-1/9 table-header text-center border-r">Acciones</th>
                </tr>
                </thead>
                <tbody class="bg-white">
                    @for (product of products; track product.id; let idx = $index) {
                        <tr class="hover:bg-gray-100">
                            <td class="w-1/9 p-2 text-center border-b">
                                {{ idx + 1 }}
                            </td>

                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ product.product?.name }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ product.product?.description }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ product.product?.code }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ product.product?.brand }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ product.product?.category?.name }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ product.product?.minimumStock }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="w-max">
                                    <div
                                        class="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-{{product.product?.state===true?'green':'red'}}-500/20 text-{{product.product?.state===true?'green':'red'}}-600 py-1 px-2 text-xs rounded-md"
                                        style="opacity: 1">
                                        <span class="">{{ product.product?.state === true ? 'ACTIVO' : 'INACTIVO' }}</span>
                                    </div>
                                </div>
                            </td>

                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="flex justify-center space-x-3">
                                    <mat-icon
                                        class="text-amber-400 hover:text-amber-500 cursor-pointer"
                                        (click)="selectProduct(product)">qr_code
                                    </mat-icon>
                                </div>
                            </td>
                        </tr>
                    } @empty {
                        <tr>
                            <td colspan="9" class="text-center">
                                Sin Contenido
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
        <br>

    `,
})
export class BarCodeListTableComponent implements OnInit, OnChanges {
    abcForms: any;
    @Input() products: Product[] = [];
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();
    public validImageUrls: { [key: string]: string } = {};
    public selectedProduct: Product | null = null;

    constructor(
        private _matDialog: MatDialog,
    ) {}

    ngOnInit() {
        this.abcForms = abcForms;
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
    public goEdit(id: string) {
        this.eventEdit.emit(id);
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

}
