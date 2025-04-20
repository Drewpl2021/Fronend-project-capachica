import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DateAdapter} from "@angular/material/core";
import {format} from "date-fns";
import {NgForOf, NgIf} from "@angular/common";
import {Entities, EntityTypes} from "../../../../buys/purchases/models/purchases";
import {StoresService} from "../../../../../../providers/services/accounting/stores.service";
import {EntityTypesService} from "../../../../../../providers/services/client/entityTypes.service";
import {EntityService} from "../../../../../../providers/services/client/Entitys.service";
import {Stores} from "../../../../accounting/stores/models/stores";


@Component({
    selector: 'app-warehouse-filter',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        NgForOf,
        NgIf,
    ],
    template: `

        <div class="header-container">
            <div class="header-title bg-primary-600">
                <span class="header-icon">🚚</span>
                <span>Movimiento de Almacén</span>
            </div>
            <div class="actions-container">
                <form class="form-container" [formGroup]="unitMeasurementFilterForm"
                      (ngSubmit)="onSubmit()"
                      style="display: flex; flex-wrap: wrap; gap: 8px; width: 100%;">


                    <!-- Proveedor (Más grande) -->
                    <div class="col-span-6 relative" style="flex: 2; min-width: 300px;">
                        <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded"
                                        [subscriptSizing]="'dynamic'"
                                        style="width: 100%;">
                            <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:magnifying-glass'"></mat-icon>
                            <input matInput formControlName="proveedor" autocomplete="off" placeholder="Buscar Proveedor"
                                   (input)="buscarProveedor(unitMeasurementFilterForm.get('proveedor')?.value)"/>
                        </mat-form-field>

                        <!-- Mostrar Resultados -->
                        <div
                            *ngIf="entity.length > 0"
                            class=" absolute bg-white border border-gray-300 shadow-lg max-h-64 overflow-auto z-10">
                            <div
                                *ngFor="let provider of entity"
                                class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                (click)="seleccionarProveedor(provider)">
                                <div class="font-bold">{{ provider.nameSocialReason }}</div>
                                <div class="text-sm text-gray-500">RUC: {{ provider.documentNumber }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Serie (Más pequeño) -->
                    <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded"
                                    [subscriptSizing]="'dynamic'"
                                    style="flex: 0.5; min-width: 100px;">
                        <input matInput formControlName="series" autocomplete="off" placeholder="Serie"/>
                    </mat-form-field>

                    <!-- Número (Más pequeño) -->
                    <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded"
                                    [subscriptSizing]="'dynamic'"
                                    style="flex: 0.5; min-width: 100px;">
                        <input matInput formControlName="number" autocomplete="off" placeholder="Número"/>
                    </mat-form-field>

                    <!-- Fecha de Inicio (Más pequeño) -->
                    <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded"
                                    [subscriptSizing]="'dynamic'"
                                    style="flex: 0.5; min-width: 120px;">
                        <input matInput [matDatepicker]="picker" formControlName="startDate">
                        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                        <mat-datepicker #picker></mat-datepicker>
                    </mat-form-field>

                    <!-- Fecha de Fin (Más pequeño) -->
                    <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded"
                                    [subscriptSizing]="'dynamic'"
                                    style="flex: 0.5; min-width: 120px;">
                        <input matInput [matDatepicker]="pickerEnd" formControlName="endDate" autocomplete="off" placeholder="Selecciona una fecha"/>
                        <mat-datepicker-toggle matSuffix [for]="pickerEnd"></mat-datepicker-toggle>
                        <mat-datepicker #pickerEnd></mat-datepicker>
                    </mat-form-field>

                    <!-- Botón Visualizar -->
                    <button class="action-button" mat-flat-button [color]="'primary'" type="submit">
                        <mat-icon [svgIcon]="'heroicons_outline:funnel'"></mat-icon>
                        <span class="ml-1"> Visualizar</span>
                    </button>

                </form>

                <button class="action-button" mat-flat-button [color]="'primary'" (click)="goNew()">
                    <mat-icon [svgIcon]="'heroicons_outline:plus'"></mat-icon>
                    <span>Nuevo Movimiento</span>
                </button>
            </div>
        </div>

    `,
})
export class WarehouseFilterComponent implements OnInit {

    @Output() eventFilter: EventEmitter<any> = new EventEmitter<any>();
    @Output() eventNew = new EventEmitter<boolean>();
    abcForms: any;
    entity: Entities[] = [];
    stores: Stores[] = [];
    idEntityType: string = '';

    unitMeasurementFilterForm = new FormGroup({
        series: new FormControl(''),
        number: new FormControl(''),
        startDate: new FormControl(new Date()),
        endDate: new FormControl(new Date(), ),
        proveedor: new FormControl(''),
        supplierId: new FormControl('', ),

    });

    constructor(
        private dateAdapter: DateAdapter<Date>,
        private cdr: ChangeDetectorRef,
        private _stores: StoresService,
        private _entityTypesService: EntityTypesService,
        private _entityService: EntityService,
    ) {this.dateAdapter.setLocale('es-ES');
    }

    ngOnInit() {
        this.abcForms = abcForms;
        this.CargarDatos();
        this.cdr.detectChanges();
    }

    public goNew() {
        this.eventNew.emit(true);
    }

    onSubmit() {
        if (this.unitMeasurementFilterForm.valid) {
            const formData = {
                ...this.unitMeasurementFilterForm.value,
                startDate: this.unitMeasurementFilterForm.value.startDate
                    ? format(new Date(this.unitMeasurementFilterForm.value.startDate), 'yyyy-MM-dd')
                    : '',
                endDate: this.unitMeasurementFilterForm.value.endDate
                    ? format(new Date(this.unitMeasurementFilterForm.value.endDate), 'yyyy-MM-dd')
                    : '',
            };

            // ❌ Eliminar `proveedor` antes de enviar los datos
            delete formData.proveedor;

            this.eventFilter.emit(formData); // 🔥 Enviar los datos sin `proveedor`
        } else {
            console.warn("⚠️ El formulario no es válido");
        }
    }

    private CargarDatos() {

        this._stores.getAll$().subscribe((data) => {
            this.stores = data?.content || [];
        });
        this._entityTypesService.getWithSearch$().subscribe((data) => {
            const entityType = data?.content?.find((type: EntityTypes) => type.code === '02');
            this.idEntityType = entityType.id!;
        });
    }
    public buscarProveedor(query: string): void {
        if (!this.idEntityType || !query.trim()) {
            return;
        }
        const params = {
            documentNumber: query.trim(),
            idEntityType: this.idEntityType,
        };
        this._entityService.getWithFilt$(params).subscribe(
            (data: any) => {
                if (Array.isArray(data)) {
                    this.entity = data; // Si es un array
                } else if (data?.content) {
                    this.entity = data.content; // Si está en 'content'
                } else {
                    this.entity = [];
                }
                this.cdr.detectChanges(); // Actualiza la vista
            },

        );
    }

    public seleccionarProveedor(provider: Entities): void {
        if (provider) {


            this.unitMeasurementFilterForm.patchValue({
                proveedor: provider.nameSocialReason,
                supplierId: provider.id,
            });

            this.entity = []; // Limpia los resultados de búsqueda
        }
    }
}
