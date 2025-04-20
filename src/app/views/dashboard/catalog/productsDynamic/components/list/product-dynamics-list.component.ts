import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import {accountingDynamic, ProductDynamic, TypeAffectation} from '../../models/product-dynamics';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import {TypeAffectationService} from "../../../../../../providers/services/accounting/type-afectation.service";
import {MatSelectModule} from "@angular/material/select";
import {AccountingDynamicsService} from "../../../../../../providers/services/accounting/accounting-dinamic.service";
@Component({
    selector: 'app-product-dynamics-list',
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
        DatePipe,
        MatSelectModule,
    ],
    
    template: `
        <br>
        <div class="table-container">
            <table class="custom-table">
                <thead>
                <tr class="bg-primary-600 text-white">
                    <th class="w-1/9 table-head text-center border-r">#</th>
                    <th class="w-1/9 table-header text-center border-r">Almacén</th>
                    <th class="w-1/9 table-header text-center border-r">Producto</th>
                    <th class="w-1/9 table-header text-center border-r">Marca</th>
                    <th class="w-1/9 table-header text-center border-r">Unidad De Medida</th>
                    <th class="w-1/9 table-header text-center border-r">Tipo de Afectación</th>
                    <th class="w-1/9 table-header text-center border-r">Dinamica Contable</th>
                    <th class="w-1/9 table-header text-center border-r">Control de Stock</th>
                    <th class="w-1/9 table-header text-center border-r">
                        Estado
                        <div class="flex items-center justify-center gap-4">
                            <!-- Estado Visual General -->
                            <div
                                class="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none
            bg-{{ status ? 'green' : 'red' }}-500/20 text-{{ status ? 'green' : 'red' }}-600
            py-1 px-2 text-xs rounded-md">
                                <span>{{ status ? 'ACTIVO' : 'INACTIVO' }}</span>
                            </div>

                            <!-- Toggle General -->
                            <mat-slide-toggle [(ngModel)]="status" (change)="toggleAllStatus()"> </mat-slide-toggle>
                        </div>
                    </th>

                </tr>
                </thead>
                <tbody class="bg-white">
                    @for (productDynamic of productDynamics; track productDynamic.id; let idx = $index) {
                        <tr class="hover:bg-gray-100">
                            <td class="w-1/9 p-2 text-center border-b">
                                {{ idx + 1 }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ productDynamic.store?.name }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ productDynamic.product?.name }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ productDynamic.product?.brand }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ productDynamic.product?.productPresentations[0]?.unitMeasurement?.name }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <mat-form-field appearance="outline" class="adjusted-select">
                                    <mat-select
                                        [(ngModel)]="productDynamic.typeAffectation.id"
                                        (selectionChange)="onTypeAffectationChange(productDynamic)">
                                        <mat-option *ngFor="let item of typeAffectation" [value]="item.id">
                                            {{ item.name }}
                                        </mat-option>
                                    </mat-select>
                                </mat-form-field>
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <mat-form-field appearance="outline" class="adjusted-select">
                                    <mat-select
                                        [(ngModel)]="productDynamic.accountingDynamics.id"
                                        (selectionChange)="onTypeAffectationChange(productDynamic)">
                                        <mat-option *ngFor="let item of accountingDynamics" [value]="item.id">
                                            {{ item.name }}
                                        </mat-option>
                                    </mat-select>
                                </mat-form-field>
                            </td>

                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="w-max">
                                    <div
                                        class="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-{{productDynamic.product?.stockControl ===true?'green':'red'}}-500/20 text-{{productDynamic.product?.stockControl ===true?'green':'red'}}-600 py-1 px-2 text-xs rounded-md"
                                        style="opacity: 1">
                                        <span class="">{{ productDynamic.product?.stockControl  === true ? 'ACTIVO' : 'INACTIVO' }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="flex items-center justify-center gap-4">
                                    <!-- Estado Visual -->
                                    <div
                                        class="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-{{ productDynamic.status === true ? 'green' : 'red' }}-500/20 text-{{ productDynamic.status === true ? 'green' : 'red' }}-600 py-1 px-2 text-xs rounded-md">
                                        <span>{{ productDynamic.status === true ? 'ACTIVO' : 'INACTIVO' }}</span>
                                    </div>

                                    <!-- Toggle Estado -->
                                    <mat-slide-toggle
                                        [(ngModel)]="productDynamic.status"
                                        (change)="onStatusChange(productDynamic)">
                                    </mat-slide-toggle>
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
            <div class="flex justify-end mt-4" *ngIf="isSaveButtonVisible">
                <button mat-raised-button color="primary" (click)="saveChanges()">Guardar Cambios</button>
            </div>
        </div>
        <br>
    `,
})
export class ProductDynamicsListComponent implements OnInit {
    @Input() productDynamics: ProductDynamic[] = [];
    @Output() eventEdit = new EventEmitter<ProductDynamic[]>();
    @Output() eventDelete = new EventEmitter<string>();
    isSaveButtonVisible: boolean = false;
    updatedProductDynamic: ProductDynamic[] = [];
    abcForms: any;
    typeAffectation: TypeAffectation[] = [];
    accountingDynamics: accountingDynamic[] = [];
    status: boolean = false;

    constructor(private tupeAffectationService: TypeAffectationService,
                private accountingDynamicService: AccountingDynamicsService,
    ) {}

    ngOnInit() {
        this.abcForms = abcForms;
        this.CargarDatos();
    }

    onStatusChange(productDynamic: ProductDynamic): void {
        if (!this.updatedProductDynamic.some((c) => c.id === productDynamic.id)) {
            this.updatedProductDynamic.push({ ...productDynamic });
        }
        this.isSaveButtonVisible = true;
    }
    onTypeAffectationChange(productDynamic: ProductDynamic): void {
        this.trackUpdatedProductDynamics(productDynamic);
    }
    private trackUpdatedProductDynamics(productDynamic: ProductDynamic): void {
        const existing = this.updatedProductDynamic.find((c) => c.id === productDynamic.id);
        if (!existing) {
            this.updatedProductDynamic.push({ ...productDynamic });
        } else {
            Object.assign(existing, productDynamic);
        }
        this.isSaveButtonVisible = true;
    }
    toggleAllStatus(): void {
        this.productDynamics.forEach(product => {
            product.status = this.status; // 🔥 Cambia todos los estados al valor del toggle general
            this.onStatusChange(product); // Llama a la función para actualizar el estado
        });

    }

    saveChanges(): void {
        this.eventEdit.emit(this.updatedProductDynamic);
        this.updatedProductDynamic = [];
        this.isSaveButtonVisible = false;


    }

    private CargarDatos() {
        this.tupeAffectationService.getAll$().subscribe((data) => {
            this.typeAffectation = data || null;
        });
        this.accountingDynamicService.getAll$().subscribe((data) => {
            this.accountingDynamics = data?.content || [];
        });
    }

}
