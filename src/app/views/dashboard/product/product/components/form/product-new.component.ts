import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from "@angular/material/select";
import {CommonModule, JsonPipe} from "@angular/common";
import {ServicioService} from "../../../../../../providers/services/setup/servicio.service";
import {Emprendedor, Service} from "../../models/product";
import {jwtDecode} from "jwt-decode";
import {EmprendedorService} from "../../../../../../providers/services/product/Emprendedor.service";

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
        MatSelectModule,
        JsonPipe,
        CommonModule
    ],
    template: `
        <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <div
                class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium">Nuevo Producto</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon
                        class="text-current"
                        [svgIcon]="'heroicons_outline:x-mark'"
                    ></mat-icon>
                </button>
            </div>

            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="categoryForm">
                <div class="flex space-x-4">
                    <mat-form-field class="flex-1">
                        <mat-label>Nombre</mat-label>
                        <input type="text" matInput formControlName="name" />
                    </mat-form-field>

                    <mat-form-field class="flex-1">
                        <mat-label>Código</mat-label>
                        <input type="text" matInput formControlName="code"/>
                    </mat-form-field>
                </div>
                <div class="flex space-x-4">
                    <mat-form-field class="flex-1">
                        <mat-label>Cantidad disponible(Opcional)</mat-label>
                        <input type="number" matInput formControlName="cantidad"/>
                    </mat-form-field>

                    <mat-form-field class="flex-1">
                        <mat-label>Precio</mat-label>
                        <input type="number" matInput formControlName="costo"/>
                    </mat-form-field>
                </div>
                <div class="flex space-x-4">
                    <mat-form-field class="flex-1">
                        <mat-label>Descripción</mat-label>
                        <input type="text" matInput formControlName="description"/>
                    </mat-form-field>
                    <mat-form-field class="flex-1">
                        <mat-label>Tipo de Servicio</mat-label>
                        <mat-select formControlName="service_id">
                            <mat-option *ngFor="let service of service" [value]="service.id">
                                {{ service.name }}
                            </mat-option>
                        </mat-select>
                    </mat-form-field>

                </div>
                <mat-slide-toggle formControlName="status" color="primary">Estado</mat-slide-toggle>

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
                            <input matInput formControlName="code" />
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
export class ProductNewComponent implements OnInit {
    @Input() title: string = '';
    service: Service[] = [];
    emprendedors: Emprendedor[] = [];

    tokenValue: any;

    abcForms: any;
    categoryForm = new FormGroup({
        name: new FormControl('Kankacho', [Validators.required]),
        code: new FormControl('01', [Validators.required]),
        description: new FormControl('Kanckacho rico y mediano', [Validators.required]),
        costo: new FormControl('30', [Validators.required]),
        cantidad: new FormControl('', ),
        service_id: new FormControl('c4601625-5087-4f75-9988-c0d065f20c3e', [Validators.required]),
        emprendedor_id: new FormControl('', [Validators.required]),
        status: new FormControl(1, [Validators.required]),
        imagenes: new FormArray([]),

    });

    constructor(
        private _matDialog: MatDialogRef<ProductNewComponent>,
        private _serialFlowsService: ServicioService,
        private _emprendedorService: EmprendedorService,

    ) {
    }

    ngOnInit() {
        this.tokenValue = jwtDecode(localStorage.getItem("accessToken"));

        this.abcForms = abcForms;
        this.uploadData();
        this.addImage();
    }
    private uploadData() {
        const userId = this.tokenValue.id;

        this._serialFlowsService.getAll$().subscribe((data) => {
            this.service = data?.content || [];
        });
        this._emprendedorService.getByIdService$(userId).subscribe(data => {
            this.emprendedors = data || [];

            // Supongamos que `data` es el objeto emprendedor, y tiene el campo `id`
            const emprendedorId = data?.id || '';

            // Asignamos ese id al formControl 'emprendedor_id'
            this.categoryForm.get('emprendedor_id')?.setValue(emprendedorId);

            // Ahora puedes continuar con otras cosas
        });
    }

    get imagenesControls() {
        return this.categoryForm.get('imagenes') as FormArray;
    }

    addImage() {
        let maxCodeNumber = 0;

        this.imagenesControls.controls.forEach(ctrl => {
            const code: string = ctrl.get('code')?.value || '';
            const match = code.match(/(\d+)$/);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > maxCodeNumber) {
                    maxCodeNumber = num;
                }
            }
        });

        const newCodeNumber = maxCodeNumber + 1;
        const newCodigo = 'IMG-' + newCodeNumber.toString().padStart(3, '0');

        this.imagenesControls.push(
            new FormGroup({
                url_image: new FormControl('https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/0f/10/d0/kankacho-ayavireno-la.jpg?w=900&h=500&s=1', Validators.required),
                estado: new FormControl(1),  // si usas número para status
                code: new FormControl(newCodigo),
                description: new FormControl(''),
            })
        );
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
