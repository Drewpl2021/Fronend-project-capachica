import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import {accountingAccountClass} from '../../models/accounting-account-class';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-accounting-account-class-list',
    standalone: true,
    imports: [MatTooltipModule,FormsModule, CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, DatePipe],
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
                    <th class="w-1/9 table-header text-center border-r">Fecha Creación</th>
                    <th class="w-1/9 table-header text-center border-r">Fecha Actualización</th>
                    <th class="w-1/9 table-header text-center border-r">Estado</th>
                    <th class="w-1/9 table-header text-center border-r">Acciones</th>
                </tr>
                </thead>
                <tbody class="bg-white">
                    @for (account of accountes; track account.id; let idx = $index) {
                        <tr class="hover:bg-gray-100">
                            <td class="w-1/9 p-2 text-center border-b">
                                {{ idx + 1 }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ account.name }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ account.description }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ account.code }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ account.createdAt | date:'dd/MM/yyyy HH:mm:ss' }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ account.updatedAt | date:'dd/MM/yyyy HH:mm:ss' }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="w-max">
                                    <div class="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-{{account.status===true?'green':'red'}}-500/20 text-{{account.status===true?'green':'red'}}-600 py-1 px-2 text-xs rounded-md" style="opacity: 1">
                                        <span class="">{{ account.status === true ? 'ACTIVO' : 'INACTIVO' }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="flex justify-center space-x-3">
                                    <mat-icon
                                        matTooltip="Editar Cuenta"
                                        matTooltipClass="tooltip-amber"
                                        matTooltipPosition="above"
                                        [matTooltipDisabled]
                                        class="text-amber-400 hover:text-amber-500 cursor-pointer"
                                        (click)="goEdit(account.id)">edit
                                    </mat-icon>
                                    <mat-icon
                                        matTooltip="Eliminar Cuenta Contable"
                                        matTooltipClass="tooltip-red"
                                        matTooltipPosition="above"
                                        [matTooltipDisabled]
                                        class="text-rose-500 hover:text-rose-600 cursor-pointer"
                                        (click)="goDelete(account.id)">delete_sweep
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
export class AccountingAccountClassListComponent implements OnInit {
    abcForms: any;
    @Input() accountes: accountingAccountClass[] = [];
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
