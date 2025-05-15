import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import { Asociaciones } from '../../models/asociaciones';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import {EntityTypes} from "../../../../buys/purchases/models/purchases";
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
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            <ng-container *ngIf="categories.length > 0; else emptyState">
                <div *ngFor="let category of categories; let i = index"
                     class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition-shadow">

                    <div>
                        <img
                            [src]="category.imagenes?.length > 0 && currentImageIndices[i] !== undefined ? category.imagenes[currentImageIndices[i]].url_image : 'assets/img/placeholder.png'"
                            alt="Imagen de {{ category.nombre }}"
                            class="w-full h-48 object-cover rounded-md mt-2"/>
                        <h3 class="font-bold text-lg mb-2">{{ category.nombre }}</h3>
                        <p class="text-gray-600 mb-2">
                            {{ category.descripcion.length > 100 ? (category.descripcion | slice:0:100) + '...' : category.descripcion }}
                        </p>

                        <p class="text-sm text-gray-500 mb-1"><strong>Lugar:</strong> {{ category.lugar }}</p>
                        <p class="text-sm text-gray-500 mb-1"><strong>URL:</strong>
                            <a href="{{ category.url }}" target="_blank" class="text-blue-500 hover:underline">
                                {{ category.url }}
                            </a>
                        </p>
                        <p class="text-sm text-gray-500 mb-1"><strong>Creado:</strong> {{ category.createdAt | date:'dd/MM/yyyy HH:mm:ss' }}</p>
                    </div>

                    <div class="mt-4 flex items-center justify-between">
        <span
            [ngClass]="{
            'bg-green-100 text-green-700': category.estado === true,
            'bg-red-100 text-red-700': category.estado === false
          }"
            class="py-1 px-3 rounded-full font-semibold text-xs uppercase select-none">
          {{ category.estado === true ? 'ACTIVO' : 'INACTIVO' }}
        </span>

                        <div class="flex space-x-4">
                            <mat-icon
                                matTooltip="Editar Categoria"
                                matTooltipClass="tooltip-amber"
                                matTooltipPosition="above"
                                [matTooltipDisabled]
                                class="text-amber-400 hover:text-amber-500 cursor-pointer"
                                (click)="goEdit(category.id)">edit
                            </mat-icon>
                            <mat-icon
                                matTooltip="Eliminar Categoria"
                                matTooltipClass="tooltip-red"
                                matTooltipPosition="above"
                                [matTooltipDisabled]
                                class="text-rose-500 hover:text-rose-600 cursor-pointer"
                                (click)="goDelete(category.id)">delete_sweep
                            </mat-icon>
                        </div>
                    </div>

                    <div class="mt-2 text-sm text-gray-400 text-right">
                        <span>#{{ i + 1 }}</span>
                    </div>
                </div>
            </ng-container>

            <ng-template #emptyState>
                <div class="col-span-full text-center text-gray-500 py-10">
                    Sin Contenido
                </div>
            </ng-template>
        </div>

    `,
})
export class AsociacionesListComponent implements OnInit, OnDestroy, OnChanges  {
    abcForms: any;
    @Input() categories: Asociaciones[] = [];
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();
    constructor() {}
    currentImageIndices: number[] = [];
    intervalId?: any;
    ngOnInit() {
        this.abcForms = abcForms;
        this.setupIndices();
        this.startCarousel();
        this.currentImageIndices = this.categories.map(_ => 0);

        // Cada 3 segundos cambia la imagen de cada categoría
        this.intervalId = setInterval(() => {
            this.categories.forEach((category, i) => {
                if (category.imagenes?.length) {
                    this.currentImageIndices[i] = (this.currentImageIndices[i] + 1) % category.imagenes.length;
                }
            });
        }, 3000);
    }
    ngOnChanges() {
        // Cada vez que categories cambie, reinicializa los índices
        this.setupIndices();
    }
    public goEdit(id: string) {
        this.eventEdit.emit(id);

    }

    public goDelete(id:string) {
        this.eventDelete.emit(id);
    }
    setupIndices() {
        if (this.categories && this.categories.length > 0) {
            this.currentImageIndices = this.categories.map(() => 0);
        }
    }

    startCarousel() {
        this.intervalId = setInterval(() => {
            this.categories.forEach((category, i) => {
                if (category.imagenes?.length) {
                    this.currentImageIndices[i] = (this.currentImageIndices[i] + 1) % category.imagenes.length;
                }
            });
        }, 3000);
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

}
