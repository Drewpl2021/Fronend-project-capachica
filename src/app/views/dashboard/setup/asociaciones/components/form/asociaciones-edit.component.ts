import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
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
                <div class="flex space-x-4">
                    <mat-form-field class="flex-1">
                        <mat-label>Nombre</mat-label>
                        <input type="text" matInput formControlName="nombre" />
                    </mat-form-field>

                    <mat-form-field class="flex-1">
                        <mat-label>Lugar</mat-label>
                        <input type="text" matInput formControlName="lugar" />
                    </mat-form-field>
                </div>
                <div class="flex space-x-4">
                    <mat-form-field class="flex-1">
                        <mat-label>URL</mat-label>
                        <input type="text" matInput formControlName="url" />
                    </mat-form-field>

                    <mat-form-field class="flex-1">
                        <mat-label>Descripción</mat-label>
                        <input type="text" matInput formControlName="descripcion" />
                    </mat-form-field>
                </div>


                <mat-slide-toggle formControlName="estado" color="primary">Estado</mat-slide-toggle>


                <div formArrayName="imagenes" class="mt-4">
                    <label class="font-medium mb-2 block">Imágenes</label>

                    <div *ngFor="let imgCtrl of imagenesControls.controls; let i=index"
                         [formGroupName]="i"
                         class="flex flex-row items-center space-x-4 mb-4 border rounded p-4">

                        <mat-form-field class="flex-grow min-w-[200px]">
                            <mat-label>URL de la imagen {{ i + 1 }}</mat-label>
                            <input matInput formControlName="url_image" />
                        </mat-form-field>

                        <mat-form-field class="w-32">
                            <mat-label>Código</mat-label>
                            <input matInput formControlName="codigo" />
                        </mat-form-field>

                        <button mat-icon-button color="warn" type="button" (click)="removeImage(i)" aria-label="Eliminar imagen {{ i + 1 }}">
                            <mat-icon>delete</mat-icon>
                        </button>
                    </div>

                    <button mat-stroked-button color="primary" type="button" (click)="addImage()">
                        Añadir imagen
                    </button>
                </div>

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
        imagenes: new FormArray([]),

    });

    constructor(
        private _matDialog: MatDialogRef<AsociacionesEditComponent>,
         private _municipalidadService: MunicipalidadService,
    ) {this.addImage();
    }

    ngOnInit() {
        this.CargarDatos();

        const patchData = {
            ...this.unitMeasurement,
            estado: !!this.unitMeasurement.estado
        };

        this.categoryForm.patchValue(patchData);

        this.cargarImagenes(this.unitMeasurement.imagenes || []);

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
    get imagenesControls() {
        return this.categoryForm.get('imagenes') as FormArray;
    }
    addImage() {
        this.imagenesControls.push(
            new FormGroup({
                url_image: new FormControl('', Validators.required),
                estado: new FormControl(true),
                codigo: new FormControl(''),
                description: new FormControl(''),
            })
        );
    }
    private cargarImagenes(imagenes: any[]) {
        this.imagenesControls.clear(); // limpia el FormArray

        if (imagenes && imagenes.length) {
            imagenes.forEach(imagen => {
                this.imagenesControls.push(new FormGroup({
                    url_image: new FormControl(imagen.url_image, Validators.required),
                    estado: new FormControl(imagen.estado),
                    codigo: new FormControl(imagen.codigo),
                    description: new FormControl(imagen.description || '')
                }));
            });
        } else {
            this.addImage(); // si no hay imágenes, agrega uno vacío
        }
    }

    removeImage(index: number) {
        this.imagenesControls.removeAt(index);
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
