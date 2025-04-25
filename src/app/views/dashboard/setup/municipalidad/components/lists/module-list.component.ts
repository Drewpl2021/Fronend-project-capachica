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
        <br>
        <br>
        <div class="table-container">
            <table class="custom-table">
                <thead>
                <tr class="bg-primary-600 text-white">
                    <th class="w-1/9 table-head text-center border-r">#</th>
                    <th class="w-1/9 table-header text-center border-r">Módulo Padre</th>
                    <th class="w-1/9 table-header text-center border-r">Ícono Padre</th>
                    <th class="w-1/9 table-header text-center border-r">Módulo</th>
                    <th class="w-1/9 table-header text-center border-r">Icono</th>
                    <th class="w-1/9 table-header text-center border-r">Url</th>
                    <th class="w-1/9 table-header text-center border-r">Fecha Creación</th>
                    <th class="w-1/9 table-header text-center border-r">Estado</th>
                    <th class="w-1/9 table-header text-center border-r">Acciones</th>
                </tr>
                </thead>
                <tbody class="bg-white">
                    @for (module of modules; track module.id; let idx = $index) {
                        <tr class="hover:bg-gray-100">
                            <td class="w-1/9 p-2 text-center border-b">
                                {{ idx + 1 }}
                            </td>
                            <td class="w-1/9 p-2 text-start border-b text-sm">
                                {{ module.parentModule.title }}
                            </td>
                            <td class="w-1/9 p-2 text-start border-b text-sm">
                                {{ module.parentModule.icon }}
                            </td>
                            <td class="w-1/9 p-2 text-start border-b text-sm">
                                {{ module.title }}
                            </td>
                            <td class="w-1/9 p-2 text-start border-b text-sm">
                                {{ module.icon }}
                            </td>
                            <td class="w-1/9 p-2 text-start border-b text-sm" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 240px;">
                                {{ module.link }}
                            </td>

                            <td class="w-1/9 p-2 text-start border-b text-sm">
                                {{ module.createdAt | date:'dd/MM/yyyy HH:mm:ss' }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="w-max">
                                    <div
                                        class="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-{{module.status===true?'green':'red'}}-500/20 text-{{module.status===true?'green':'red'}}-600 py-1 px-2 text-xs rounded-md"
                                        style="opacity: 1">
                                        <span class="">{{ module.status === true ? 'ACTIVO' : 'INACTIVO' }}</span>
                                    </div>
                                </div>
                            </td>

                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="flex justify-center space-x-3">
                                    <!-- Botón de edición con tooltip -->
                                    <mat-icon
                                        matTooltip="Editar Módulo"
                                        matTooltipClass="tooltip-edit"
                                        matTooltipPosition="above"
                                        class="text-amber-400 hover:text-amber-500 cursor-pointer"
                                        (click)="goEdit(module.id)">
                                        edit
                                    </mat-icon>

                                    <!-- Botón de eliminación con tooltip -->
                                    <mat-icon
                                        matTooltip="Eliminar Módulo"
                                        matTooltipClass="tooltip-delete"
                                        matTooltipPosition="above"
                                        class="text-rose-500 hover:text-rose-600 cursor-pointer"
                                        (click)="goDelete(module.id)">
                                        delete_sweep
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
export class ModuleListComponent implements OnInit {
    abcForms: any;
    @Input() modules: Module[] = [];
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
