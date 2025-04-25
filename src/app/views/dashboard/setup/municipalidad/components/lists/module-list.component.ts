import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {abcForms} from '../../../../../../../environments/generals';
import {Module, MunicipaldiadDescripcion} from '../../models/module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CommonModule, DatePipe} from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MunicipalidadService} from "../../../../../../providers/services/setup/municipalidad.service";

@Component({
    selector: 'app-module-list',
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
        <div>
            <br>
            <div class="cards-container" [ngStyle]="{ 'display': 'grid', 'grid-template-columns': 'repeat(auto-fill, minmax(300px, 1fr))', 'gap': '20px', 'padding': '20px' }">
                <div *ngFor="let municipalidad of municipalidad; let idx = index" class="card-container" [ngStyle]="{ 'display': 'flex', 'justify-content': 'center' }">
                    <div class="card"
                         [ngStyle]="{
                    'width': '100%',
                    'max-width': '350px',
                    'transition': 'transform 0.3s ease-in-out',
                    'background-color': 'white',
                    'border': '1px solid #ddd',
                    'border-radius': '8px',
                    'box-shadow': '0 4px 6px rgba(0, 0, 0, 0.1)',
                    'padding': '20px',
                    'margin-bottom': '20px'
                }">
                        <div class="text-center" [ngStyle]="{ 'font-size': '1.25rem', 'font-weight': 'bold', 'margin-bottom': '10px' }">
                            Nombre de la Municipalidad
                        </div>

                        <div class="text-sm mb-2">
                            <strong>Código: </strong>{{ municipalidad.codigo }}
                        </div>
                        <div class="text-sm mb-2">
                            <strong>Distrito: </strong>{{ municipalidad.distrito }}
                        </div>
                        <div class="text-sm mb-2">
                            <strong>Provincia: </strong>{{ municipalidad.provincia }}
                        </div>
                        <div class="text-sm mb-2">
                            <strong>Región: </strong>{{ municipalidad.region }}
                        </div>
                        <div class="text-center">
                            <button
                                [ngStyle]="{
                            'background-color': 'transparent',
                            'border': 'none',
                            'cursor': 'pointer',
                            'font-weight': '600',
                            'color': '#FBBF24',
                            'transition': 'color 0.3s ease-in-out'
                        }"
                                (click)="goEdit(municipalidad.id)"
                                matTooltip="Editar Módulo"
                                matTooltipClass="tooltip-edit"
                                matTooltipPosition="above">
                                Editar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Si no hay datos -->
                <div *ngIf="municipalidad.length === 0" class="text-center" [ngStyle]="{ 'color': '#6B7280' }">
                    No hay municipios registrados.
                </div>
            </div>

            <!--<div class="cards-container" [ngStyle]="{ 'display': 'grid', 'grid-template-columns': 'repeat(auto-fill, minmax(300px, 1fr))', 'gap': '20px', 'padding': '20px' }">
                <div *ngFor="let municipalidadDirec of municipalidadDirec; let idx = index" class="card-container" [ngStyle]="{ 'display': 'flex', 'justify-content': 'center' }">
                    <div class="card"
                         [ngStyle]="{
                    'width': '100%',
                    'max-width': '350px',
                    'transition': 'transform 0.3s ease-in-out',
                    'background-color': 'white',
                    'border': '1px solid #ddd',
                    'border-radius': '8px',
                    'box-shadow': '0 4px 6px rgba(0, 0, 0, 0.1)',
                    'padding': '20px',
                    'margin-bottom': '20px'
                }">
                        <div class="text-center" [ngStyle]="{ 'font-size': '1.25rem', 'font-weight': 'bold', 'margin-bottom': '10px' }">
                            Descripcion de la Municipalidad
                        </div>

                        <div class="text-sm mb-2">
                            <strong>Dirección: </strong>{{ municipalidadDirec.direccion }}
                        </div>
                        <div class="text-sm mb-2">
                            <strong>Descripcion: </strong>{{ municipalidadDirec.descripcion }}
                        </div>
                        <div class="text-sm mb-2">
                            <strong>Ruc: </strong>{{ municipalidadDirec.ruc }}
                        </div>
                        <div class="text-sm mb-2">
                            <strong>Correo: </strong>{{ municipalidadDirec.correo }}
                        </div>
                        <div class="text-sm mb-2">
                            <strong>Alcalde: </strong>{{ municipalidadDirec.nombre_alcalde }}
                        </div>
                        <div class="text-sm mb-2">
                            <strong>Gestion: </strong>{{ municipalidadDirec.anio_gestion }}
                        </div>
                        <div class="text-center">
                            <button
                                [ngStyle]="{
                            'background-color': 'transparent',
                            'border': 'none',
                            'cursor': 'pointer',
                            'font-weight': '600',
                            'color': '#FBBF24',
                            'transition': 'color 0.3s ease-in-out'
                        }"
                                (click)="goEdit(municipalidadDirec.id)"
                                matTooltip="Editar Módulo"
                                matTooltipClass="tooltip-edit"
                                matTooltipPosition="above">
                                Editar
                            </button>
                        </div>
                    </div>
                </div>

                <div *ngIf="municipalidadDirec.length === 0" class="text-center" [ngStyle]="{ 'color': '#6B7280' }">
                    No hay municipios registrados.
                </div>
            </div>-->
            <br>
        </div>
    `,
})
export class ModuleListComponent implements OnInit {
    abcForms: any;
    @Input() municipalidad: Module[] = [];
    @Input() municipalidadDirec: MunicipaldiadDescripcion[] = [];
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
        this.abcForms = abcForms;
    }

    public goEdit(id: string) {
        this.eventEdit.emit(id);
    }

    public goDelete(id: string) {
        this.eventDelete.emit(id);
    }

}
