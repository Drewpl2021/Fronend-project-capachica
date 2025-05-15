import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {abcForms} from '../../../../../../../environments/generals';
import {Service} from '../../models/parent-module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CommonModule, DatePipe} from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-parent-module-list',
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
                    <th >#</th>
                    <th >Nombre</th>
                    <th>Descripción</th>
                    <th >Código</th>
                    <th >Categoria</th>
                    <th >Estado</th>
                    <th >Acciones</th>
                </tr>
                </thead>
                <tbody class="bg-white">
                    @for (parentModule of parentModules; track parentModule.id; let idx = $index) {
                        <tr class="hover:bg-gray-100">
                            <td class=" p-2 text-center border-b">
                                {{ idx + 1 }}
                            </td>
                            <td class=" p-2 text-start border-b text-sm">
                                {{ parentModule.name }}
                            </td>
                            <td class="w-2/6 p-2 text-start border-b text-sm">
                                {{ parentModule.description }}
                            </td>
                            <td class="w-2/6 p-2 text-start border-b text-sm">
                                {{ parentModule.code }}
                            </td>

                            <td class="w-2/6 p-2 text-start border-b text-sm">
                                {{ parentModule.category }}
                            </td>
                            <td class="w-1/6 p-2 text-center border-b text-sm">
                                <div class="w-max">
                                    <div
                                        class="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none
                                            bg-{{ getStatusBoolean(parentModule.status) ? 'green' : 'red' }}-500/20
                                            text-{{ getStatusBoolean(parentModule.status) ? 'green' : 'red' }}-600 py-1 px-2 text-xs rounded-md"
                                        style="opacity: 1"
                                    >
                                        <span>{{ getStatusBoolean(parentModule.status) ? 'ACTIVO' : 'INACTIVO' }}</span>
                                    </div>

                                </div>
                            </td>

                            <td class="w-2/6 p-2 text-center border-b text-sm">
                                <div class="flex justify-center space-x-3">
                                    <!-- Botón de edición con tooltip -->
                                    <mat-icon
                                        matTooltip="Editar Modulo Padre"
                                        matTooltipClass="tooltip-edit"
                                        matTooltipPosition="above"
                                        class="text-amber-400 hover:text-amber-500 cursor-pointer"
                                        (click)="goEdit(parentModule.id)">
                                        edit
                                    </mat-icon>

                                    <!-- Botón de eliminación con tooltip -->
                                    <mat-icon
                                        matTooltip="Eliminar Modulo Padre"
                                        matTooltipClass="tooltip-delete"
                                        matTooltipPosition="above"
                                        class="text-rose-500 hover:text-rose-600 cursor-pointer"
                                        (click)="goDelete(parentModule.id)">
                                        delete_sweep
                                    </mat-icon>
                                </div>
                            </td>
                        </tr>
                    } @empty {
                        <tr>
                            <td colspan="6" class="text-center">
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
export class ParentModuleListComponent implements OnInit {
    abcForms: any;
    @Input() parentModules: Service[] = [];
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
    // Método para manejar status
    public getStatusBoolean(status: number | boolean): boolean {
        return status === 1 || status === true;
    }

}
