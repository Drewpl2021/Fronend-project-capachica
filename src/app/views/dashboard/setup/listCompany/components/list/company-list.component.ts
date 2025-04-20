import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import { Company} from '../../models/company';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import {ConfirmDialogService} from "../../../../../../shared/confirm-dialog/confirm-dialog.service";
import {CompanyUserAdminService} from "../../../../../../providers/services/setup/company-user-admin.service";
import {EventService} from "../../../../../../providers/utils/event-service";
@Component({
    selector: 'app-company-list',
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
        DatePipe
    ],
    template: `
        <br><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            @for (companies of company; track companies.id; let idx = $index) {
                <div class="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                    <div class="flex justify-between items-center">
                        <h3 class="font-semibold text-lg">{{ companies.tradeName }}</h3>
                        <span class="text-gray-500 text-sm">#{{ idx + 1 }}</span>
                    </div>
                    <div class="mt-2">
                        <p class="text-gray-700"><strong>Empresa:</strong> {{ companies.companyName }}</p>
                        <p class="text-gray-700"><strong>Dirección:</strong> {{ companies.address }}</p>
                        <p class="text-gray-700"><strong>Email:</strong> {{ companies.email }}</p>
                        <p class="text-gray-700"><strong>Teléfono:</strong> {{ companies.phoneNumber }}</p>
                    </div>
                    <div class="flex justify-between items-center mt-4">
                        <button class=" text-white px-3 py-1 rounded-md" mat-flat-button [color]="'primary'" (click)="selectAndSave(companies.id)">
                            Seleccionar
                        </button>
                    </div>
                </div>
            } @empty {
                <div class="col-span-4 text-center text-gray-500 p-4">
                    Sin Contenido
                </div>
            }
        </div><br>
    `,
})
export class CompanyListComponent implements OnInit {
    abcForms: any;
    @Input() company: Company[] = [];
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();

    constructor(
        private _confirmDialogService: ConfirmDialogService,
        private _companyUserAdminService: CompanyUserAdminService,
        private _eventService: EventService

    ) {}
    ngOnInit() {
        this.abcForms = abcForms;
    }
    public selectAndSave(id: string) {
        const payload = {
            company: { id: id }
        };
        this.save(payload);
    }
    public save(data: Object) {
        this._confirmDialogService.confirmSave({
            title: 'Confirmar Acción',
            message: '¿Estás seguro de que quieres cambiar de empresa?',
        }).then(() => {
            this._companyUserAdminService.add$(data).subscribe(response => {
                if (response) {
                    this._eventService.emitEvent(true); // Puedes pasar cualquier dato
                }
            });
        });

    }
}
