import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import { ContAsientos } from '../../models/cont-asientos';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
    selector: 'app-cont-asientos-list',
    standalone: true,
    imports: [FormsModule, CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, DatePipe],
    template: `
        <div class="table w-full p-2">
            <table class="w-full border">
                <thead>
                <tr class="bg-primary-600 text-white">
                    <th class="w-1/9 table-head text-center border-r">#</th>
                    <th class="w-1/9 table-header text-center border-r">Unida de medida</th>
                    <th class="w-1/9 table-header text-center border-r">Descripción</th>
                    <th class="w-1/9 table-header text-center border-r">Código</th>
                    <th class="w-1/9 table-header text-center border-r">Fecha Creación</th>
                    <th class="w-1/9 table-header text-center border-r">Fecha Actualización</th>
                    <th class="w-1/9 table-header text-center border-r">Fecha Eliminación</th>
                    <th class="w-1/9 table-header text-center border-r">Estado</th>
                    <th class="w-1/9 table-header text-center border-r">Emp</th>
                    <th class="w-1/9 table-header text-center border-r">Acciones</th>
                </tr>
                </thead>
                <tbody class="bg-white">
                    @for (category of categories; track category.id; let idx = $index) {
                        <tr class="hover:bg-gray-100">
                            <td class="w-1/9 p-2 text-center border-b">
                                {{ idx + 1 }}
                            </td>
                            <td class="w-1/9 p-2 items-center border-b text-sm">
                                {{ category.name }}
                            </td>
                            <td class="w-1/9 p-2 items-center border-b text-sm">
                                {{ category.description }}
                            </td>
                            <td class="w-1/9 p-2 items-center border-b text-sm">
                                {{ category.code }}
                            </td>
                            <td class="w-1/9 p-2 items-center border-b text-sm">
                                {{ category.createdAt | date:'dd/MM/yyyy HH:mm:ss' }}
                            </td>
                            <td class="w-1/9 p-2 items-center border-b text-sm">
                                {{ category.updatedAt | date:'dd/MM/yyyy HH:mm:ss' }}
                            </td>
                            <td class="w-1/9 p-2 items-center border-b text-sm">
                                {{ category.deletedAt | date:'dd/MM/yyyy HH:mm:ss' }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="w-max">
                                    <div class="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-{{category.state===true?'green':'red'}}-500/20 text-{{category.state===true?'green':'red'}}-600 py-1 px-2 text-xs rounded-md" style="opacity: 1">
                                        <span class="">{{ category.state === true ? 'ACTIVO' : 'INACTIVO' }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="w-1/9 p-2 text-start border-b text-sm">
                                {{ category.companyId }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="flex justify-center space-x-3">
                                    <mat-icon class="text-amber-400 hover:text-amber-500 cursor-pointer"
                                        (click)="goEdit(category.id)">edit
                                    </mat-icon>
                                    <mat-icon
                                        class="text-rose-500 hover:text-rose-600 cursor-pointer"
                                        (click)="goDelete(category.id)">delete_sweep
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
    `,
})
export class CategoryListComponent implements OnInit {
    abcForms: any;
    @Input() categories: ContAsientos[] = [];
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
