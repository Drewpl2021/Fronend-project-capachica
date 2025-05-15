import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogRef} from '@angular/material/dialog';
import {Asociaciones, Municipaldiad} from "../../models/asociaciones";

import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {MunicipalidadService} from "../../../../../../providers/services/setup/municipalidad.service";

@Component({
    selector: 'app-category-new',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        NgForOf,
    ],
    template: `
        <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <!-- Header -->
            <div
                class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium">Editar Categoria</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon
                        class="text-current"
                        [svgIcon]="'heroicons_outline:x-mark'"
                    ></mat-icon>
                </button>
            </div>

            <!-- Compose form -->
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="categoryForm">
                <mat-form-field>
                    <mat-label>Nombre</mat-label>
                    <input type="text" matInput formControlName="nombre"/>
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Lugar</mat-label>
                    <input type="text" matInput formControlName="lugar"/>
                </mat-form-field>
                <mat-form-field>
                    <mat-label>URL</mat-label>
                    <input type="text" matInput formControlName="url"/>
                </mat-form-field>

                <mat-form-field>
                    <mat-label>Descripción</mat-label>
                    <input type="text" matInput formControlName="descripcion"/>
                </mat-form-field>

                <mat-slide-toggle formControlName="estado" color="primary">Estado</mat-slide-toggle>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <div class="flex space-x-2 items-center mt-4 sm:mt-0">
                        <button class="ml-auto sm:ml-0" color="warn" mat-stroked-button (click)="cancelForm()">
                            Cancelar
                        </button>
                        <button class="ml-auto sm:ml-0" color="primary" [disabled]="categoryForm.invalid"
                                mat-stroked-button (click)="saveForm()">
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class AsociacionesEditComponent implements OnInit {
    @Input() title: string = '';
    @Input() unitMeasurement = new Asociaciones();
    abcForms: any;
    stores: Municipaldiad[] = [];

    categoryForm = new FormGroup({
        nombre: new FormControl('', [Validators.required]),
        descripcion: new FormControl('', [Validators.required]),
        lugar: new FormControl('', [Validators.required]),
        url: new FormControl('', [Validators.required]),
        estado: new FormControl(true, [Validators.required]),  // <-- Cambiado a 1 (true)
        municipalidad_id: new FormControl('', [Validators.required]),

    });

    constructor(
        private _matDialog: MatDialogRef<AsociacionesEditComponent>,
         private _municipalidadService: MunicipalidadService,
    ) {
    }

    ngOnInit() {
        this.CargarDatos();

        const patchData = {
            ...this.unitMeasurement,
            estado: !!this.unitMeasurement.estado  // convierte 1/0 a true/false
        };
        this.categoryForm.patchValue(patchData);

    }
    private CargarDatos() {
        this._municipalidadService.getAll$().subscribe(data => {
            this.stores = data?.content || [];

            // Buscar municipalidad con codigo '01'
            const muni01 = this.stores.find(m => m.codigo === '01');

            if (muni01) {
                // Asignar el id de esa municipalidad al formulario
                this.categoryForm.patchValue({
                    municipalidad_id: muni01.id
                });
            }
        });
    }

    public saveForm(): void {
        if (this.categoryForm.valid) {
            this._matDialog.close(this.categoryForm.value);
        }
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }
}
