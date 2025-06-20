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
import { MatTooltipModule } from '@angular/material/tooltip';
import {ConfirmDialogService} from "../../../../../../shared/confirm-dialog/confirm-dialog.service";
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

        <div class="card-container" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; padding: 20px;">
            <!-- Iterar sobre las categorías utilizando *ngFor -->
            <div *ngFor="let category of categories; let idx = index" class="card" style="background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: 300px; overflow: hidden; transition: transform 0.3s ease;">
                <div class="card-header" style="background-color: #f8f9fa; padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: center;">
                    <h3 style="font-size: 18px; margin: 0;">{{ idx + 1 }}. Marleny Torres</h3>
                    <!-- Estado -->
                    <span class="status" style="font-weight: bold; padding: 5px 10px; border-radius: 12px; background-color: {{ category.status === 'pendiente' ? '#ffc107' : '#28a745' }}; color: white;">
                  {{ category.status | uppercase }}
                </span>
                </div>
                <div class="card-body" style="padding: 15px; font-size: 14px;">
                    <p style="margin-bottom: 10px;"><strong>Servicio:</strong> {{ category.reserve_details?.[0]?.emprendimiento_service?.name }}</p>
                    <p style="margin-bottom: 10px;"><strong>Descripción:</strong> {{ category.reserve_details?.[0]?.emprendimiento_service?.description }}</p>
                    <p style="margin-bottom: 10px;"><strong>Código:</strong>  {{ category.reserve_details?.[0]?.emprendimiento_service?.code }}</p>
                    <p style="margin-bottom: 10px;"><strong>Fecha Creación:</strong> {{ category.created_at | date:'dd/MM/yyyy HH:mm:ss' }}</p>
                </div>
                <div class="card-footer" style="padding: 10px 15px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e0e0e0;">
                    <button
                        class="btn-edit"
                        (click)="goEdit(category)"
                        style="background-color: #007bff; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin: 0 5px; transition: background-color 0.3s;">
                        Confirmar Entrega
                    </button>                </div>
            </div>
        </div>

        <br>
    `,
})
export class CategoryListComponent implements OnInit {
    abcForms: any;
    @Input() categories: Category[] = [];
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();
    constructor(        private _confirmDialogService: ConfirmDialogService,
    ) {}

    ngOnInit() {
        this.abcForms = abcForms;

        const storedCategories = localStorage.getItem('categories');
        if (storedCategories) {
            this.categories = JSON.parse(storedCategories);
            }
    }


    goEdit(category: any) {
        if (category.status === 'pendiente') {
            // Llamamos al servicio de confirmación antes de proceder
            this._confirmDialogService.confirmSave({}).then(() => {
                // Si el usuario confirma, cambiamos el estado de la categoría
                category.status = 'completado'; // Cambiar el estado de 'pendiente' a 'completado'

                // Guardamos el estado actualizado de las categorías en el localStorage
                this.saveCategoriesToLocalStorage();
            });
        }
    }

    // Método para guardar las categorías en el localStorage
    private saveCategoriesToLocalStorage() {
        localStorage.setItem('categories', JSON.stringify(this.categories));
    }



    public goDelete(id:string) {
        this.eventDelete.emit(id);
    }

}
