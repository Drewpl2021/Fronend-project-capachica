import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import { Category } from '../../models/./category';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import {StoresService} from "../../../../../../providers/services/accounting/stores.service";
import {Stores} from "../../../../accounting/stores/models/stores";
import {ProductService} from "../../../../../../providers/services/catalog/product.service";
import {Product} from "../../../../catalog/products/models/product";
@Component({
    selector: 'app-kardex-list',
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
                    <th class="w-1/9 table-header text-center border-r">Almacén</th>
                    <th class="w-1/9 table-header text-center border-r">Fecha</th>
                    <th class="w-1/9 table-header text-center border-r">Tipo</th>
                    <th class="w-1/9 table-header text-center border-r">Cantidad</th>
                    <th class="w-1/9 table-header text-center border-r">Producto</th>
                    <th class="w-1/9 table-header text-center border-r">Descripción</th>
                    <th class="w-1/9 table-header text-center border-r">Presentación</th>
                    <th class="w-1/9 table-header text-center border-r">Precio Unitario</th>
                    <th class="w-1/9 table-header text-center border-r">Total</th>
                </tr>
                </thead>
                <tbody class="bg-white">
                    @for (category of categories; track category.id; let idx = $index) {
                        <tr class="hover:bg-gray-100">
                            <td class="w-1/9 p-2 text-center border-b">
                                {{ idx + 1 }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ getStoreNameById(category.warehouseMovementDetail?.warehouseMovement?.storeId) }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.date | date:'dd/MM/yyyy HH:mm:ss' }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.movementType }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.balanceQuantity }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ getProductNameById(category.warehouseMovementDetail?.productId) }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.warehouseMovementDetail?.description }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.warehouseMovementDetail?.productPresentationId }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.unitCost }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.totalCost }}
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
export class CategoryListComponent implements OnInit {
    abcForms: any;
    @Input() categories: Category[] = [];
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();
    products: Product[] = [];
    stores: Stores[] = [];

    constructor(
        private _storesService: StoresService,
        private _productService: ProductService,

    ) {}

    ngOnInit() {
        this.abcForms = abcForms;
        this.CargarDatos();
    }

    private CargarDatos() {
        this._storesService.getAll$().subscribe((data) => {
            this.stores = data?.content || [];
        });
        this._productService.getWithQuery$().subscribe((data) => {
            this.products = data?.content || [];
        });
    }

    getStoreNameById(storeId: string): string {
        const store = this.stores.find((s) => s.id === storeId); // Busca el almacén por ID
        return store ? store.name : 'Desconocido'; // Devuelve el nombre o 'Desconocido' si no lo encuentra
    }
    getProductNameById(productId: string): string {
        const product = this.products.find((p) => p.id === productId); // Busca el producto por ID
        return product ? product.name : 'Producto desconocido'; // Devuelve el nombre o un texto por defecto
    }
}
