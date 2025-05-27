import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import { Product } from '../../models/product';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
    selector: 'app-category-list',
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
        <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <ng-container *ngIf="categories.length > 0; else emptyList">
                <div *ngFor="let category of categories; let idx = index" class="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
                    <div>
                        <img
                            [src]="category.img_emprendedor_services?.length > 0 && currentImageIndices[idx] !== undefined ? category.img_emprendedor_services[currentImageIndices[idx]].url_image : 'assets/img/placeholder.png'"
                            alt="Imagen de {{ category.name }}"
                            class="w-full h-48 object-cover rounded-md mt-2"/>
                        <h3 class="font-bold text-lg mb-2">{{ idx + 1 }}. {{ category.name }}</h3>
                        <p class="text-sm text-gray-600 mb-1">{{ category.description }}</p>
                        <p class="text-sm"><span class="font-semibold">Código:</span> {{ category.code }}</p>
                        <p class="text-sm"><span class="font-semibold">Cantidad:</span> {{ category.cantidad }}</p>
                        <p class="text-sm"><span class="font-semibold">Costo:</span> S/. {{ category.costo }}</p>
                        <p class="text-sm"><span class="font-semibold">Creado:</span> {{ category.created_at | date:'dd/MM/yyyy HH:mm:ss' }}</p>
                        <div
                            class="inline-block mt-2 px-2 py-1 rounded text-xs font-bold uppercase"
                            [ngClass]="category.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                            {{ category.status === 1 ? 'ACTIVO' : 'INACTIVO' }}
                        </div>
                    </div>
                    <div class="flex justify-end space-x-3 mt-4">
                        <mat-icon
                            matTooltip="Editar Categoria"
                            matTooltipClass="tooltip-amber"
                            matTooltipPosition="above"
                            class="text-amber-400 hover:text-amber-500 cursor-pointer"
                            (click)="goEdit(category.id)">edit
                        </mat-icon>
                        <mat-icon
                            matTooltip="Eliminar Categoria"
                            matTooltipClass="tooltip-red"
                            matTooltipPosition="above"
                            class="text-rose-500 hover:text-rose-600 cursor-pointer"
                            (click)="goDelete(category.id)">delete_sweep
                        </mat-icon>
                    </div>
                </div>
            </ng-container>

            <ng-template #emptyList>
                <p class="col-span-full text-center text-gray-500">Sin Contenido</p>
            </ng-template>
        </div>

        <br>
    `,
})
export class ProductListComponent implements OnInit, OnChanges, OnDestroy {
    abcForms: any;
    @Input() categories: Product[] = [];
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();
    constructor() {}
    currentImageIndices: number[] = [];
    intervalId?: any;

    ngOnInit() {
        this.abcForms = abcForms;
        this.startCarousel();

    }
    public goEdit(id: string) {
        this.eventEdit.emit(id);
    }
    ngOnChanges() {
        // Cada vez que categories cambie, reinicializa los índices
        this.setupIndices();
    }
    startCarousel() {
        this.intervalId = setInterval(() => {
            this.categories.forEach((category, i) => {
                if (category.img_emprendedor_services?.length) {
                    this.currentImageIndices[i] = (this.currentImageIndices[i] + 1) % category.img_emprendedor_services.length;
                }
            });
        }, 9000);
    }
    setupIndices() {
        if (this.categories && this.categories.length > 0) {
            this.currentImageIndices = this.categories.map(() => 0);
        }
    }
    public goDelete(id:string) {
        this.eventDelete.emit(id);
    }
    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
