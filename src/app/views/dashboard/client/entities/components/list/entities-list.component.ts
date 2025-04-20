import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import { Entities} from '../../models/entities';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
    selector: 'app-entities-list',
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
                    <th class="w-1/9 table-header text-center border-r">Nombre/Razon Social</th>
                    <th class="w-1/9 table-header text-center border-r">Tipo de Documento</th>
                    <th class="w-1/9 table-header text-center border-r">N° de Documento</th>
                    <th class="w-1/9 table-header text-center border-r">Dirección</th>
                    <th class="w-1/9 table-header text-center border-r">Email</th>
                    <th class="w-1/9 table-header text-center border-r">N° de Teléfono</th>
                    <th class="w-1/9 table-header text-center border-r">Fecha Creación</th>
                    <th class="w-1/9 table-header text-center border-r">Acciones</th>
                </tr>
                </thead>
                <tbody class="bg-white">
                    @for (entity of entities; track entity.id; let idx = $index) {
                        <tr class="hover:bg-gray-100">
                            <td class="w-1/9 p-2 text-center border-b">
                                {{ idx + 1 }}
                            </td>

                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ entity.nameSocialReason }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ entity.documentType?.name }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ entity.documentNumber }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ entity.address }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ entity.email }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ entity.phone }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ entity.createdAt | date:'dd/MM/yyyy HH:mm:ss' }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="flex justify-center space-x-3">
                                    <mat-icon
                                        matTooltip="Editar Entidad"
                                        matTooltipPosition="above"
                                        (click)="goEdit(entity.id)"
                                        class="text-amber-400 hover:text-amber-500 cursor-pointer">
                                        edit
                                    </mat-icon>

                                    <mat-icon
                                        matTooltip="Eliminar Entidad"
                                        matTooltipPosition="above"
                                        (click)="goDelete(entity.id)"
                                        class="text-rose-500 hover:text-rose-600 cursor-pointer">
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
export class EntitiesListComponent implements OnInit {
    abcForms: any;
    @Input() entities: Entities[] = [];
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();
    constructor() {}

    ngOnInit() {
        this.abcForms = abcForms;
    }
    public goEdit(id: string) {
        this.eventEdit.emit(id);
    }

    public goDelete(id:string) {
        this.eventDelete.emit(id);
    }

}
