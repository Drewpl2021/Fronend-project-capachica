import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import { Payment} from '../../models/./category';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
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
        <div class="table-container">
            <table class="custom-table">
                <thead>
                <tr class="bg-primary-600 text-white">
                    <th class="w-1/9 table-head text-center border-r">#</th>
                    <th class="w-1/9 table-header text-center border-r">Codigo</th>
                    <th class="w-1/9 table-header text-center border-r">Total</th>
                    <th class="w-1/9 table-header text-center border-r">B.i.</th>
                    <th class="w-1/9 table-header text-center border-r">IGV</th>
                    <th class="w-1/9 table-header text-center border-r">Fecha de Creación</th>
                    <th class="w-1/9 table-header text-center border-r">Ultima Fecha Actualizada</th>
                    <!-- <th class="w-1/9 table-header text-center border-r">Fecha de Elimincación</th>    -->
                    <th class="w-1/9 table-header text-center border-r">Acciones</th>
                </tr>
                </thead>
                <tbody class="bg-white">
                    @for (category of categories; track category.id; let idx = $index) {
                        <tr class="hover:bg-gray-100">
                            <td class="w-1/9 p-2 text-center border-b">
                                {{ idx + 1 }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.code }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.total }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.bi }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.igv }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.created_at | date:'dd/MM/yyyy HH:mm:ss' }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.updated_at | date:'dd/MM/yyyy HH:mm:ss' }}
                            </td>
                            <!-- <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.deleted_at | date:'dd/MM/yyyy HH:mm:ss' }}
                            </td>  -->
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="flex justify-center space-x-3">

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
export class CategoryListComponent implements OnInit {
    abcForms: any;
    @Input() categories: Payment[] = [];
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
