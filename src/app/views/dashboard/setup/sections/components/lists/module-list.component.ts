import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {abcForms} from '../../../../../../../environments/generals';
import {Module} from '../../models/module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CommonModule, DatePipe} from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-sections-list',
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
        <br><br>
        <div class="card-container" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; padding: 20px;">
            <div *ngFor="let module of modules; let idx = index" class="card" style="width: 300px; border-radius: 12px; border: 1px solid #ddd; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); background-color: white; padding: 20px; transition: transform 0.3s ease-in-out; cursor: pointer;">
                <div class="card-header" style="font-size: 1.5em; font-weight: bold; margin-bottom: 15px; color: #2d3748; text-align: center;">
                    <span class="text-primary-600" style="font-size: 1.5em;">{{ module.name }}</span>
                    <div style="font-size: 1em; color: #718096; margin-top: 5px; text-align: center;">Código: {{ module.code }}</div>
                </div>
                <div class="card-body" style="margin-bottom: 20px;">
                    <div style="font-size: 1.1em; margin-bottom: 10px; color: #2d3748;">
                        <strong>Fecha Creación:</strong> <span style="color: #4A5568;">{{ module.created_at | date:'dd/MM/yyyy HH:mm:ss' }}</span>
                    </div>
                    <div style="font-size: 1em; margin-bottom: 15px; text-align: center;">
                        <strong>Estado:</strong>
                        <span style="padding: 4px 8px; font-weight: bold; border-radius: 5px; background-color: {{module.status === 1 ? '#38a169' : '#e53e3e'}}; color: white; transition: background-color 0.3s ease;">
                    {{ module.status === 1 ? 'ACTIVO' : 'INACTIVO' }}
                </span>
                    </div>
                </div>
                <div class="card-footer" style="text-align: center;">
                    <div class="flex justify-center space-x-3">
                        <mat-icon
                            matTooltip="Ver contenido seccion"
                            matTooltipClass="tooltip-edit"
                            matTooltipPosition="above"
                            class="text-primary-600 hover:text-primary-700 cursor-pointer"
                            style="font-size: 1.8em; transition: transform 0.3s ease;"
                            (click)="goView(module.id)">
                            visibility
                        </mat-icon>
                        <mat-icon
                            matTooltip="Editar seccion"
                            matTooltipClass="tooltip-edit"
                            matTooltipPosition="above"
                            class="text-amber-500 hover:text-amber-600 cursor-pointer"
                            style="font-size: 1.8em; transition: transform 0.3s ease;"
                            (click)="goEdit(module.id)">
                            edit
                        </mat-icon>

                        <!-- Botón de eliminación con tooltip -->
                        <mat-icon
                            matTooltip="Eliminar seccion"
                            matTooltipClass="tooltip-delete"
                            matTooltipPosition="above"
                            class="text-rose-600 hover:text-rose-700 cursor-pointer"
                            style="font-size: 1.8em; transition: transform 0.3s ease;"
                            (click)="goDelete(module.id)">
                            delete_sweep
                        </mat-icon>
                    </div>
                </div>
            </div>

            <!-- Si no hay módulos -->
            <div *ngIf="modules.length === 0" class="card" style="width: 300px; border-radius: 12px; border: 1px solid #ddd; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); background-color: white; padding: 20px; text-align: center;">
                <span style="color: #2d3748; font-size: 1.3em; font-weight: bold;">Sin Contenido</span>
            </div>
        </div>


    `,
})
export class ModuleListComponent implements OnInit {
    abcForms: any;
    @Input() modules: Module[] = [];
    @Output() eventView = new EventEmitter<string>();
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
        this.abcForms = abcForms;
    }

    public goView(id: string) {
        this.eventView.emit(id);
    }
    public goEdit(id: string) {
        this.eventEdit.emit(id);
    }

    public goDelete(id: string) {
        this.eventDelete.emit(id);
    }

}
