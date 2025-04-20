import {Component, Input, OnInit} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogRef} from '@angular/material/dialog';
import {EntitiesCompanyC, DocumentTypes, EntityTypes, Services} from "../../models/entitiesCompanyC";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {DocumentTypesService} from "../../../../../../providers/services/client/DocumentTypes.service";
import {ServicesService} from "../../../../../../providers/services/client/Services.service";
import {EntityService} from "../../../../../../providers/services/client/Entitys.service";

@Component({
    selector: 'app-entities-client-new',
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
        <div class=" container flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <!-- Header -->
            <div
                class=" header flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium">Editar Entidad</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon
                        class="text-current"
                        [svgIcon]="'heroicons_outline:x-mark'"
                    ></mat-icon>
                </button>
            </div>

            <!-- Compose form -->
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="entitiesForm">

                <!-- Tipo de Documento y Entidad -->
                <div class="flex flex-row gap-6 items-center">
                    <mat-form-field appearance="fill" class="form-field w-64">
                        <mat-label>Tipo de Documento</mat-label>
                        <mat-select formControlName="documentType">
                            <mat-option *ngFor="let entity of documentTypes" [value]="entity.id">
                                {{ entity.name }}
                            </mat-option>
                        </mat-select>
                    </mat-form-field>
                    <mat-form-field appearance="fill" class="form-field w-64">
                        <mat-label>Entidad</mat-label>
                        <mat-select formControlName="idEntityType">
                            <mat-option *ngFor="let entity of entityTypes" [value]="entity.id">
                                {{ entity.name }}
                            </mat-option>
                        </mat-select>
                    </mat-form-field>
                </div>


                <div class="flex flex-row gap-6 items-center">
                    <mat-form-field class="form-field w-64" appearance="fill">
                        <mat-label>Número De Documento</mat-label>
                        <input type="text" matInput formControlName="documentNumber" />
                    </mat-form-field>
                    <mat-form-field class="form-field w-64" appearance="fill">
                        <mat-label>Nombre o Razón Social</mat-label>
                        <input type="text" matInput formControlName="nameSocialReason" />
                    </mat-form-field>
                </div>
                <div class="flex flex-row gap-6 items-center">
                    <mat-form-field class="form-field w-64" appearance="fill">
                        <mat-label>Dirección</mat-label>
                        <input type="text" matInput formControlName="address" />
                    </mat-form-field>
                    <mat-form-field class="form-field w-64" appearance="fill">
                        <mat-label>Correo Electrónico</mat-label>
                        <input type="text" matInput formControlName="email" />
                    </mat-form-field>
                    <mat-form-field class="form-field w-64" appearance="fill">
                        <mat-label>Número De Teléfono</mat-label>
                        <input type="text" matInput formControlName="phone" />
                    </mat-form-field>
                </div>

                <!-- Servicios -->
                <div class="flex flex-col mt-6">
                    <button type="button" mat-raised-button color="primary" (click)="addService()" class="self-start mb-3">
                        Añadir Servicio
                    </button>
                    <h3 class="text-lg font-semibold mb-2">Servicios</h3>
                    <div formArrayName="serviceEntities" class="service-list flex flex-col">
                        <div *ngFor="let service of servicesArray.controls; let i = index" [formGroupName]="i"
                             class="dynamic-row flex items-center mb-2">
                            <!-- Campo para seleccionar servicio -->
                            <mat-form-field class="form-field w-64" appearance="fill">
                                <mat-select formControlName="serviceId">
                                    <mat-option *ngFor="let service of servicess" [value]="service.id">
                                        {{ service.name }}
                                    </mat-option>
                                </mat-select>
                            </mat-form-field>
                            <!-- Botón eliminar -->
                            <button type="button" mat-raised-button color="warn" (click)="removeService(i)">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <div class="flex space-x-2 items-center mt-4 sm:mt-0">
                        <button class="ml-auto sm:ml-0" color="warn" mat-stroked-button (click)="cancelForm()">
                            Cancelar
                        </button>
                        <button class="ml-auto sm:ml-0" color="primary" [disabled]="entitiesForm.invalid"
                                mat-stroked-button (click)="saveForm()">
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `,
})
export class EntitiesCompanyCEditComponent implements OnInit {
    @Input() title: string = '';
    @Input() entitys = new EntitiesCompanyC();
    documentTypes: DocumentTypes[] = [];
    entityTypes: EntityTypes[] = [];
    servicess: Services[] = [];

    abcForms: any;
    entitiesForm = new FormGroup({
        documentNumber: new FormControl('', [Validators.required]),
        nameSocialReason: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required]),
        documentType: new FormControl('', Validators.required), // Tipo de documento
        idEntityType: new FormControl('', Validators.required), // Tipo de entidad
        serviceEntities: this.fb.array([]), // Servicios
    });



    constructor(
        private fb: FormBuilder,
        private _matDialog: MatDialogRef<EntitiesCompanyCEditComponent>,
        private _documentTypesService: DocumentTypesService,
        private _servicesService: ServicesService,
        private _entityService: EntityService,
    ) {
    }

    ngOnInit() {
        this.abcForms = abcForms;
        this.CargarDatos();



        this.entitiesForm.patchValue({
            documentNumber: this.entitys.documentNumber || '',
            nameSocialReason: this.entitys.nameSocialReason || '',
            address: this.entitys.address || '',
            email: this.entitys.email || '',
            phone: this.entitys.phone || '',
            documentType: this.entitys.documentType?.id || '',
            idEntityType: this.entitys.idEntityType?.id || '', // Usar solo el id
        });


        if (this.entitys.serviceEntities) {
            this.entitys.serviceEntities.forEach((service: any) => {
                this.servicesArray.push(this.fb.group({
                    serviceId: service.service?.id || '', // Asegura que se accede correctamente
                }));
            });
        }



    }

    public saveForm(): void {
        if (this.entitiesForm.valid) {
            this._matDialog.close(this.entitiesForm.value);
        }
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }


    get servicesArray(): FormArray {
        return this.entitiesForm.get('serviceEntities') as FormArray;
    }


    addService(): void {
        this.servicesArray.push(this.fb.group({
            serviceId: ['', Validators.required],
        }));
    }

    removeService(index: number): void {
        this.servicesArray.removeAt(index);
    }

    private CargarDatos() {
        this._entityService.getAll$().subscribe((data) => {
            this.entityTypes = data || null;
        });
        this._documentTypesService.getAll$().subscribe((data) => {
            this.documentTypes = data || null;
        });
        this._servicesService.getAll$().subscribe((data) => {
            this.servicess = data || null;
        });
    }

}
