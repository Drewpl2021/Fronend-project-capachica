import {Component, EventEmitter, Input, LOCALE_ID, OnInit, Output} from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import { Warrinties} from '../../models/warrinties';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import {DateAdapter} from "@angular/material/core";
import esLocale from '@angular/common/locales/es';
import {StoresService} from "../../../../../../providers/services/accounting/stores.service";
import {Stores} from "../../../../accounting/stores/models/stores";
registerLocaleData(esLocale, 'es');

@Component({
    selector: 'app-warrinties-list',
    standalone: true,
    imports: [FormsModule, CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, DatePipe],
    providers: [{ provide: LOCALE_ID, useValue: 'es' }],
    template: `
        <br>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            @for (warrinty of warrinties; track warrinty.id; let idx = $index) {
                <div class="bg-white shadow-md rounded-lg p-4 border border-gray-300 relative">
                    <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-white text-xs font-bold" [style.backgroundColor]="warrinty.warehouseMovementDetail?.warehouseMovement?.documentTypeCode === 'SALES' ? '#16a34a' : '#2563eb'">
                        {{ warrinty.warehouseMovementDetail?.warehouseMovement?.documentTypeCode === 'SALES' ? 'VENTA' : 'COMPRA' }}
                    </div>
                    <div class="mt-2 text-sm space-y-2">
                        <p class="text-gray-700"><span class="font-semibold text-gray-900">📌 Código Serie:</span> {{ warrinty.seriesCode }}</p>
                        <p class="text-gray-700"><span class="font-semibold text-gray-900">📦 Producto:</span> {{ warrinty.warehouseMovementDetail?.description }}</p>
                        <p class="text-gray-700"><span class="font-semibold text-gray-900">📅 Fecha de Registro:</span>{{ warrinty.warehouseMovementDetail?.warehouseMovement?.issueDate | date: "d 'de' MMMM 'del' y"}}</p>
                        <p class="text-gray-700"><span class="font-semibold text-gray-900">📄 Tipo Doc.:</span><span [style.color]="warrinty.warehouseMovementDetail?.warehouseMovement?.documentTypeCode === 'SALES' ? '#16a34a' : '#2563eb'" class="font-bold">{{ warrinty.warehouseMovementDetail?.warehouseMovement?.documentTypeCode === 'SALES' ? 'Venta' : 'Compra' }}</span></p>
                        <p class="text-gray-700"><span class="font-semibold text-gray-900">📑 N° Doc.:</span> {{ warrinty.warehouseMovementDetail?.warehouseMovement?.series }}</p>
                        <p class="text-gray-700"><span class="font-semibold text-gray-900">👤 {{ warrinty.warehouseMovementDetail?.warehouseMovement?.documentTypeCode === 'SALES' ? 'Cliente' : 'Proveedor' }}</span> {{ warrinty.warehouseMovementDetail?.warehouseMovement?.nameSocialReason }}</p>
                        <p class="text-gray-700"><span class="font-semibold text-gray-900">🏬 Tienda:</span>{{ getStoreNameById(warrinty.warehouseMovementDetail?.warehouseMovement?.storeId) }}</p>
                        <p class="text-gray-700"><span class="font-semibold text-gray-900">💰 Precio:</span><span class="text-green-600 font-semibold"> S/ {{ warrinty.warehouseMovementDetail?.warehouseMovement?.total }}</span></p>
                    </div>
                </div>
            } @empty {
                <div class="col-span-full text-center text-gray-500">
                    Sin Contenido
                </div>
            }
        </div>
        <br>
    `,
})
export class WarrantiesListComponent implements OnInit {
    abcForms: any;
    @Input() warrinties: Warrinties[] = [];
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();
    public stores: Stores[] = [];

    constructor(
        private dateAdapter: DateAdapter<Date>,
        private _stores: StoresService,){
        this.dateAdapter.setLocale('es-ES');
    }
    ngOnInit() {
        this.abcForms = abcForms;
        this.uploadData();

    }
    private uploadData() {
        this._stores.getAll$().subscribe((data) => {
            this.stores = data?.content || [];
        });
    }
    public getStoreNameById(storeId: string): string {
        const store = this.stores.find(s => s.id === storeId);
        return store ? store.name : 'Desconocido';
    }

}
