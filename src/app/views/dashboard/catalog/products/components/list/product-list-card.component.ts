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
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-product-list-card',
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
        MatTooltipModule

    ],
    template: `
        <br>
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
                        <h3 class="text-lg font-semibold text-gray-700">{{ product.name }}</h3>
                        <span class="text-xs font-bold px-2 py-1 rounded-md bg-{{product.state === true ? 'green' : 'red'}}-500/20 text-{{product.state === true ? 'green' : 'red'}}-600">
                    {{ product.state === true ? 'ACTIVO' : 'INACTIVO' }}
                </span>
                    </div>

                    <!-- Contenido -->
                    <div class="p-4">
                        <p class="text-sm text-gray-600"><strong>Descripción:</strong> {{ product.description }}</p>
                        <p class="text-sm text-gray-600"><strong>Código:</strong> {{ product.code }}</p>
                        <p class="text-sm text-gray-600"><strong>Marca:</strong> {{ product.brand }}</p>
                        <p class="text-sm text-gray-600"><strong>Categoría:</strong> {{ product.category?.name }}</p>
                        <p class="text-sm text-gray-600"><strong>Stock Mínimo:</strong> {{ product.minimumStock }}</p>
                    </div>

                    <!-- Acciones -->
                    <div class="flex justify-between items-center px-4 py-2 bg-gray-50">
                        <mat-icon
                            matTooltip="Editar Producto"
                            matTooltipClass="tooltip-amber"
                            matTooltipPosition="above"
                            [matTooltipDisabled]
                            class="text-amber-400 hover:text-amber-500 cursor-pointer"
                            (click)="goEdit(product.id)">edit
                        </mat-icon>
                        <mat-icon
                            matTooltip="Eliminar Producto"
                            matTooltipClass="tooltip-red"
                            matTooltipPosition="above"
                            [matTooltipDisabled]
                            class="text-rose-500 hover:text-rose-600 cursor-pointer"
                            (click)="goDelete(product.id)">delete_sweep
                        </mat-icon>
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
export class ProductListCardComponent implements OnInit, OnChanges {
    abcForms: any;
    @Input() products: Product[] = [];
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();
    public validImageUrls: { [key: string]: string } = {};

    constructor() {}

    ngOnInit() {
        this.abcForms = abcForms;
    }

    private processImageUrls(): void {
        this.products.forEach(product => {
            this.validImageUrls[product.id] = this.validateAndSetImageUrl(product.imageUrl);
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
    public goDelete(id:string) {
        this.eventDelete.emit(id);
    }
}
