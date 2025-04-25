import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {abcForms} from '../../../../../../../environments/generals';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CommonModule, DatePipe} from '@angular/common';
import {Role} from "../../models/role";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-role-list',
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
<div class="overflow-x-auto w-full">
    <!-- 🖥️ Tabla para escritorio -->
    <table class="hidden md:table w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-primary-600 text-white uppercase text-sm">
        <tr>
            <th class="p-3 border border-gray-300 text-center w-1/9">#</th>
            <th class="p-3 border border-gray-300 text-center w-1/9">Nombre</th>
            <th class="p-3 border border-gray-300 text-center w-1/9">Guard</th>
            <th class="p-3 border border-gray-300 text-center w-1/9">Fecha Creación</th>
            <th class="p-3 border border-gray-300 text-center w-1/9">Acciones</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
            @for (role of roles; track role.id; let idx = $index) {
                <tr class="hover:bg-gray-100">
                    <td class="p-2 border text-center">{{ idx + 1 }}</td>
                    <td class="p-2 border text-start text-sm">{{ role.name }}</td>
                    <td class="p-2 border text-start text-sm">{{ role.guard_name }}</td>
                    <td class="p-2 border text-start text-sm">{{ role.created_at | date:'dd/MM/yyyy HH:mm:ss' }}</td>
                    <td class="p-2 border text-center text-sm">
                        <div class="flex justify-center space-x-3">
                            <!-- Botón de edición con tooltip -->
                            <mat-icon
                                matTooltip="Editar Rol"
                                matTooltipClass="tooltip-edit"
                                matTooltipPosition="above"
                                class="text-amber-400 hover:text-amber-500 cursor-pointer"
                                (click)="goEdit(role.id)">
                                edit
                            </mat-icon>

                            <!-- Botón de eliminación con tooltip -->
                            <mat-icon
                                matTooltip="Eliminar Rol"
                                matTooltipClass="tooltip-delete"
                                matTooltipPosition="above"
                                class="text-rose-500 hover:text-rose-600 cursor-pointer"
                                (click)="goDelete(role.id)">
                                delete_sweep
                            </mat-icon>
                        </div>
                    </td>

                </tr>
            } @empty {
                <tr>
                    <td colspan="8" class="text-center p-3">Sin Contenido</td>
                </tr>
            }
        </tbody>
    </table>

    <!-- 📱 Versión móvil con tarjetas -->
    <div class="block md:hidden w-full">
        @for (role of roles; track role.id; let idx = $index) {
            <div class="border mb-3 rounded-lg shadow-md overflow-hidden">
                <div class="bg-gray-800 text-white p-3 font-bold">{{ idx + 1 }}</div>
                <div class="grid grid-cols-2 gap-x-3 gap-y-2 p-3">
                    <div class="font-semibold text-gray-600">Rol</div> <div>{{ role.name }}</div>
                    <div class="font-semibold text-gray-600">Fecha Creación</div>
                    <div>{{ role.created_at | date:'dd/MM/yyyy HH:mm:ss' }}</div>
                    <div class="font-semibold text-gray-600">Acciones</div>
                </div>
            </div>
        } @empty {
            <div class="text-center p-3">Sin Contenido</div>
        }
    </div>
</div>


<br>
    `,
})
export class RoleListComponent implements OnInit {
    abcForms: any;
    @Input() roles: Role[] = [];
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();
    @Output() eventAsignet = new EventEmitter<string>();

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
