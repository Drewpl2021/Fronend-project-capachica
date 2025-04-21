import {Component, OnInit} from '@angular/core';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {RoleFilterComponent} from "../../role/components/filter/role-filter.component";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CompanyService} from "../../../../../providers/services/setup/company.service";
import {UbigeoSunatService} from "../../../../../providers/services/setup/ubigeo-sunat.service";
import {CommonModule} from "@angular/common";
import {Company} from "../models/company";
import {MatIconModule} from "@angular/material/icon";
import Swal from 'sweetalert2';

@Component({
    selector: 'app-company-container',
    standalone: true,
    imports: [
        PaginationControlsComponent,
        RoleFilterComponent,
        ReactiveFormsModule,
        CommonModule,
        MatIconModule
    ],
    template: `
        <div class="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
            <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">Datos de la Empresa</h1>
            <form [formGroup]="companyForm" class="space-y-6">
                <!-- Sección de Datos del Representante -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Datos del Representante</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="tradeName" class="text-lg font-medium">Nombre Comercial:</label>
                            <input type="text" id="tradeName" formControlName="tradeName"
                                   class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-300"
                                   placeholder="Ingrese el nombre comercial">
                        </div>
                        <div>
                            <label for="companyName" class="text-lg font-medium">Razón Social:</label>
                            <input type="text" id="companyName" formControlName="companyName"
                                   class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-300"
                                   placeholder="Ingrese la razón social">
                        </div>
                    </div>
                </div>

                <!-- Información de Contacto -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Información de Contacto</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label for="taxRegime" class="text-lg font-medium">Régimen Tributario:</label>
                            <input type="text" id="taxRegime" formControlName="taxRegime"
                                   class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-300"
                                   placeholder="Ingrese el régimen tributario">
                        </div>
                        <div>
                            <label for="ruc" class="text-lg font-medium">RUC:</label>
                            <input type="text" id="ruc" formControlName="ruc"
                                   class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-300"
                                   placeholder="Ingrese el RUC">
                        </div>
                        <div>
                            <label for="phoneNumber" class="text-lg font-medium">Teléfono:</label>
                            <input type="text" id="phoneNumber" formControlName="phoneNumber"
                                   class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-300"
                                   placeholder="Ingrese el número telefónico">
                        </div>
                    </div>
                </div>

                <!-- Información General -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Información General</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label for="codDepSunat" class="text-lg font-medium">Departamento:</label>
                            <select id="codDepSunat" formControlName="codDepSunat"
                                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-300">
                                <option value="">Seleccione un departamento</option>
                                <option *ngFor="let department of departments" [value]="department.codDepSunat">
                                    {{ department.descDepSunat }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label for="codProvSunat" class="text-lg font-medium">Provincia:</label>
                            <select id="codProvSunat" formControlName="codProvSunat"
                                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-300">
                                <option value="">Seleccione una provincia</option>
                                <option *ngFor="let province of provinces" [value]="province.codProvSunat">
                                    {{ province.descProvSunat }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label for="codUbigeoSunat" class="text-lg font-medium">Distrito:</label>
                            <select id="codUbigeoSunat" formControlName="codUbigeoSunat"
                                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-300">
                                <option value="">Seleccione un distrito</option>
                                <option *ngFor="let ubigeo of ubigeos" [value]="ubigeo.codUbigeoSunat">
                                    {{ ubigeo.descUbigeoSunat }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Botones -->
                <div class="flex justify-center space-x-4 mt-6">
                    <button type="button" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg"
                            (click)="onCancel()">
                        <mat-icon class="text-white mr-2">close</mat-icon> Cancelar
                    </button>
                    <button type="button" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg"
                            (click)="saveCompanyData()">
                        <mat-icon class="text-white mr-2">check</mat-icon> Guardar
                    </button>
                </div>
            </form>
        </div>

    `,
})
export class CompanyContainersComponent implements OnInit {
    public companyForm: FormGroup;
    public departments: any[] = [];
    public provinces: Array<any> = [];
    public ubigeos: Array<any> = [];
    public originalCompanyData: any = {};
    public validLogoUrl: string = '';

    constructor(
        private fb: FormBuilder,
        private ubigeoSunatService: UbigeoSunatService,
        private companyService: CompanyService,
    ) {
    }

    ngOnInit() {
        this.initForm();
        this.loadCompanyData();
        this.loadDepartments();
        // Escuchar cambios en el campo de URL del logo
        this.companyForm.get('logo')?.valueChanges.subscribe(url => {
            this.validateAndSetLogoUrl(url);
        });

        this.companyForm.get('codDepSunat')?.valueChanges.subscribe((departmentCode) => {
            if (departmentCode) {
                this.loadProvinces(departmentCode);
            } else {
                this.provinces = [];
                this.ubigeos = [];
                this.companyForm.patchValue({codProvSunat: '', codUbigeoSunat: ''}, {emitEvent: false});
            }
        });

        this.companyForm.get('codProvSunat')?.valueChanges.subscribe((provinceCode) => {
            if (provinceCode) {
                this.loadUbigeos(provinceCode);
            } else {
                this.ubigeos = [];
                this.companyForm.patchValue({codUbigeoSunat: ''}, {emitEvent: false});
            }
        });
    }

    private validateAndSetLogoUrl(url: string): void {
        if (url && url.startsWith('http')) {
            this.validLogoUrl = url;
        } else {
            this.validLogoUrl = ''; // No mostrar imagen si no es una URL válida
        }
    }

    private initForm(): void {
        this.companyForm = this.fb.group({
            id: [''],
            tradeName: [''],
            companyName: [''],
            taxRegime: [''],
            ruc: [''],
            phoneNumber: [''],
            email: [''],
            logo: [''],
            address: [''],
            calculationIgvByTotal: [false],
            codDepSunat: [''],
            codProvSunat: [''],
            codUbigeoSunat: [''],
            processType: [''],
            printFormat: [''],
            countryCode: [''],
            userSol: [''],
            passwordSol: [''],
            withholdingAgent: [false],
            electronicBillingOse: [false],
            electronicBillingDomain: [''],
            accesTokenElectronicBilling: [''],
        });
        this.companyForm.valueChanges.subscribe(() => {
            const hasChanges = !this.companyForm.pristine;
            this.toggleButtons(hasChanges);
        });
    }

    public onCancel(): void {
        this.companyForm.reset(this.originalCompanyData); // Restaura los datos originales
        this.companyForm.markAsPristine(); // Marca como sin cambios
        this.toggleButtons(false); // Deshabilita los botones
        this.loadDepartments;
        // Vuelve a cargar provincias y ubigeos según los valores originales
        const codDepSunat = this.originalCompanyData.codDepSunat;


        this.loadProvinces(codDepSunat);


        const codProvSunat = this.originalCompanyData.codProvSunat;

        this.loadUbigeos(codProvSunat);

    }


    private toggleButtons(enable: boolean): void {
        const saveButton = document.querySelector('.btn-success') as HTMLButtonElement;
        const cancelButton = document.querySelector('.btn-outline-danger') as HTMLButtonElement;

        if (saveButton && cancelButton) {
            saveButton.disabled = !enable;
            cancelButton.disabled = !enable;
        }
    }

    private loadCompanyData(): void {
        this.companyService.getCompanyAccessToken().subscribe(
            (response: Company) => {
                this.originalCompanyData = response; // Asignar los datos originales
                this.companyForm.patchValue(response);
            },
            (error) => {
                console.error('Error al cargar los datos de la empresa:', error);
            }
        );
    }


    toggleCalculationIgvByTotal(event: Event): void {
        const isChecked = (event.target as HTMLInputElement).checked;
        this.companyForm.get('calculationIgvByTotal')?.setValue(isChecked);
    }

    toggleSwitch(controlName: string, event: Event): void {
        const isChecked = (event.target as HTMLInputElement).checked;
        this.companyForm.get(controlName)?.setValue(isChecked);
    }

    public saveCompanyData(): void {
        if (this.companyForm.valid) {
            const updatedCompanyData: Company = {
                ...this.companyForm.value,
            };
            this.companyService.updateObject$(updatedCompanyData).subscribe(
                () => {
                    Swal.fire({
                        title: '¡Éxito!',
                        text: 'Los datos de la empresa se actualizaron correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                        customClass: {
                            confirmButton: 'custom-confirm-button'
                        }
                    });

                    this.originalCompanyData = {...updatedCompanyData}; // Actualizar los datos originales
                    this.companyForm.markAsPristine(); // Marcar el formulario como sin cambios
                    this.toggleButtons(false); // Deshabilitar los botones
                },
                (error) => {
                    console.error('Error al actualizar los datos de la empresa:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un error al actualizar los datos de la empresa.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            );
        }
    }

    private loadDepartments(): void {
        this.ubigeoSunatService.getDepartments().subscribe(
            (response) => {

                this.departments = response; // Asignar los datos al arreglo
            },
            (error) => {
                console.error('Error al cargar los departamentos:', error);
            }
        );
    }

    private loadProvinces(departmentCode: string): void {
        this.ubigeoSunatService.getProvinces(departmentCode).subscribe(
            (response) => {
                this.provinces = response; // Asignar las provincias

            },
            (error) => {
                console.error('Error al cargar las provincias: ', error);
            }
        );
    }

    private loadUbigeos(provinceCode: string): void {
        this.ubigeoSunatService.getUbigeos(provinceCode).subscribe(
            (response) => {
                this.ubigeos = response; // Asignar los ubigeos
            },
            (error) => {
                console.error('Error al cargar los ubigeos: ', error);
            }
        );
    }
}




