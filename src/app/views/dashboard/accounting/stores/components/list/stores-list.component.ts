import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import { Stores} from '../../models/stores';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-store-list',
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
        <div class="table-container">
            <table class="custom-table">
                <thead>
                <tr class="bg-primary-600 text-white">
                    <th class="w-1/9 table-head text-center border-r">#</th>
                    <th class="w-1/9 table-header text-center border-r">Nombre</th>
                    <th class="w-1/9 table-header text-center border-r">Descripción</th>
                    <th class="w-1/9 table-header text-center border-r">Código</th>
                    <th class="w-1/9 table-header text-center border-r">Dirección</th>
                    <th class="w-1/9 table-header text-center border-r">Teléfono</th>
                    <th class="w-1/9 table-header text-center border-r">Email</th>
                    <th class="w-1/9 table-header text-center border-r">Fecha Creación</th>
                    <th class="w-1/9 table-header text-center border-r">Estado</th>
                    <th class="w-1/9 table-header text-center border-r">Acciones</th>
                </tr>
                </thead>
                <tbody class="bg-white">
                    @for (store of stores; track store.id; let idx = $index) {
                        <tr class="hover:bg-gray-100">
                            <td class="w-1/9 p-2 text-center border-b">
                                {{ idx + 1 }}
                            </td>

                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ store.name }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ store.description }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ store.code }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ store.address }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ store.phone }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ store.email }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ store.createdAt | date:'dd/MM/yyyy HH:mm:ss' }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="w-max">
                                    <div
                                        class="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-{{store.state===true?'green':'red'}}-500/20 text-{{store.state===true?'green':'red'}}-600 py-1 px-2 text-xs rounded-md"
                                        style="opacity: 1">
                                        <span class="">{{ store.state === true ? 'ACTIVO' : 'INACTIVO' }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="flex justify-center space-x-3">
                                    <mat-icon
                                        matTooltip="Editar Almacen"
                                        matTooltipClass="tooltip-amber"
                                        matTooltipPosition="above"
                                        [matTooltipDisabled]
                                        class="text-amber-400 hover:text-amber-500 cursor-pointer"
                                        (click)="goEdit(store.id)">edit
                                    </mat-icon>
                                    <mat-icon
                                        matTooltip="Eliminar Almacen"
                                        matTooltipClass="tooltip-red"
                                        matTooltipPosition="above"
                                        [matTooltipDisabled]
                                        class="text-rose-500 hover:text-rose-600 cursor-pointer"
                                        (click)="goDelete(store.id)">delete_sweep
                                    </mat-icon>
                                    <mat-icon
                                        matTooltip="Ver Grupo
                                        (Flujo Serial)"
                                        matTooltipClass="tooltip-red"
                                        matTooltipPosition="above"
                                        [matTooltipDisabled]
                                        class="text-blue-500 hover:text-blue-600 cursor-pointer"
                                        (click)="goGroup(store.id)"> settings
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
export class StoresListComponent implements OnInit {
    abcForms: any;
    @Input() stores: Stores[] = [];
    @Output() eventGroup = new EventEmitter<string>();
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();
    constructor() {}

    ngOnInit() {
        this.abcForms = abcForms;
    }
    public goGroup(id: string) {
        this.eventGroup.emit(id);
    }

    public goEdit(id: string) {
        this.eventEdit.emit(id);
    }

    public goDelete(id:string) {
        this.eventDelete.emit(id);
    }

}
