import {AfterViewInit, ChangeDetectorRef, Component, Input, NgZone, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormArray, ReactiveFormsModule, Validators, FormsModule} from '@angular/forms';
import { abcForms } from '../../../../../../../environments/generals';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import { ParentModule } from "../../../parentModule/models/parent-module";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule, JsonPipe } from "@angular/common";
import { MatPseudoCheckboxModule } from "@angular/material/core";
import { ModuleService } from "../../../../../../providers/services/setup/module.service";
import { Module } from "../../../module/models/module";
import { Role } from "../../models/role";
import {FuseLoadingBarComponent} from "../../../../../../../@fuse/components/loading-bar";

@Component({
    selector: 'app-role-assign',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        JsonPipe,
        CommonModule,
        MatPseudoCheckboxModule,
        FormsModule,
        MatDialogContent,
        FuseLoadingBarComponent
    ],
    template: `
        <!--<div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">

            <div
                class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium">Asignar Módulos</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon class="text-current" [svgIcon]="'heroicons_outline:x-mark'"></mat-icon>
                </button>
            </div>


            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="roleForm">
                <mat-form-field>
                    <mat-label>Parent Module</mat-label>
                    <mat-select formControlName="parentModuleId" placeholder="Select Parent Module">
                        <mat-option *ngFor="let parentModule of parentModules" [value]="parentModule.id">
                            {{ parentModule.title }}
                        </mat-option>
                    </mat-select>
                </mat-form-field>
            </form>


            <div class="flex justify-center my-4">
                <ul class="w-1/3  text-base font-medium bg-white border border-gray-200 rounded-lg">
                    @for (item of modules; track item.id; let idx = $index) {
                        <li class="w-full border-b">
                            <div class="flex items-center ps-3">
                                <input
                                    type="checkbox"
                                    [(ngModel)]="item.selected"
                                    id="men{{ idx }}"
                                    class="w-5 h-5"
                                />
                                <label
                                    for="men{{ idx }}"
                                    class="w-full py-3 ms-2">{{ item.title }}</label>
                            </div>
                        </li>
                    }
                </ul>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                <div class="flex space-x-2 items-center mt-4 sm:mt-0">
                    <button class="ml-auto sm:ml-0" [color]="'warn'" mat-stroked-button (click)="cancelForm()">
                        Cancelar
                    </button>
                    <button class="ml-auto sm:ml-0" [color]="'primary'" [disabled]="roleForm.invalid" mat-stroked-button
                            (click)="saveForm()">
                        Guardar
                    </button>
                </div>
            </div>
        </div>-->
        <div class="container mx-auto max-w-lg">
            <!-- 🔥 Cargando datos -->
            <fuse-loading-bar *ngIf="isLoading"></fuse-loading-bar>

            <!-- 🖥️ Formulario para escritorio -->
            <div class="hidden md:block bg-white shadow-lg rounded-lg overflow-hidden">
                <!-- Header -->
                <div class="flex items-center justify-between h-16 px-6 bg-primary text-white">
                    <div class="text-lg font-medium">Asignar Módulos</div>
                    <button mat-icon-button (click)="cancelForm()">
                        <mat-icon class="text-current">close</mat-icon>
                    </button>
                </div>

                <form [formGroup]="roleForm" class="flex flex-col p-6 sm:p-8">
                    <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Parent Module</mat-label>
                        <mat-select formControlName="parentModuleId">
                            <mat-option *ngFor="let parentModule of parentModules" [value]="parentModule.id">
                                {{ parentModule.title }}
                            </mat-option>
                        </mat-select>
                    </mat-form-field>
                </form>

                <div class="flex justify-center my-4">
                    <ul class="w-full sm:w-2/3 text-base font-medium bg-white border border-gray-200 rounded-lg shadow-md">
                        <li class="w-full border-b last:border-b-0 transition duration-200 hover:bg-gray-100"
                            *ngFor="let moduleCtrl of moduleControls; let i = index">
                            <div class="flex items-center p-3 space-x-3">
                                <input type="checkbox"
                                       [formControl]="moduleCtrl"
                                       id="mod{{ i }}"
                                       class="w-5 h-5 accent-primary-600 cursor-pointer transition-transform duration-200 transform hover:scale-105"/>
                                <label for="mod{{ i }}"
                                       class="w-full py-2 text-gray-700 cursor-pointer transition duration-200 hover:text-primary-600">
                                    {{ modules[i]?.title }}
                                </label>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="flex justify-end space-x-3 p-6">
                    <button mat-stroked-button color="warn" (click)="cancelForm()">Cancelar</button>
                    <button mat-stroked-button color="primary" [disabled]="roleForm.invalid" (click)="saveForm()">Guardar</button>
                </div>
            </div>

            <!-- 📱 Formulario para Móvil -->
            <div class="block md:hidden bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="bg-gray-800 text-white p-4 text-lg font-bold flex justify-between items-center">
                    <span>Asignar Módulos</span>
                    <button mat-icon-button (click)="cancelForm()">
                        <mat-icon>close</mat-icon>
                    </button>
                </div>

                <form [formGroup]="roleForm" class="p-4 space-y-4">
                    <div class="w-full">
                        <label class="font-semibold text-gray-700 block mb-2">Módulo Padre</label>
                        <select class="w-full border border-gray-300 rounded-lg p-3 shadow-sm text-gray-700 bg-white
                   focus:ring-primary-500 focus:border-primary-500 transition duration-200"
                                formControlName="parentModuleId">
                            <option *ngFor="let parentModule of parentModules" [value]="parentModule.id">
                                {{ parentModule.title }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="font-semibold text-gray-600">Módulos Disponibles</label>
                        <div class="grid grid-cols-1 gap-2">
                            <div *ngFor="let moduleCtrl of moduleControls; let i = index" class="flex items-center space-x-2 p-2 border rounded-lg">
                                <input type="checkbox" [formControl]="moduleCtrl" id="modM{{ i }}" class="w-5 h-5"/>
                                <label for="modM{{ i }}" class="w-full cursor-pointer">{{ modules[i]?.title }}</label>
                            </div>
                        </div>
                    </div>
                </form>

                <div class="flex justify-between p-4 border-t">
                    <button class="bg-gray-500 text-white px-4 py-2 rounded-lg" (click)="cancelForm()">Cancelar</button>
                    <button class="bg-primary text-white px-4 py-2 rounded-lg" [disabled]="roleForm.invalid" (click)="saveForm()">Guardar</button>
                </div>
            </div>
        </div>





    `,
})
export class RoleAssignComponent implements OnInit, AfterViewInit {
    @Input() title: string = '';
    @Input() roleId: string = '';
    @Input() parentModules: ParentModule[] = [];
    @Input() role = new Role();
    public modules: Module[] = [];
    public isLoading: boolean = true; // 🔥 Variable para controlar el loading

    roleForm = new FormGroup({
        parentModuleId: new FormControl('', [Validators.required]),
        modules: new FormArray([])
    });

    constructor(
        private _matDialog: MatDialogRef<RoleAssignComponent>,
        private _moduleService: ModuleService,
        private cdr: ChangeDetectorRef,
        private zone: NgZone
    ) {}

    ngOnInit() {
        this.getAllRolesSelectedByUserIdAndCompanyId$(this.roleId, this.parentModules[0]?.id);

        this.roleForm.get('parentModuleId')?.valueChanges.subscribe(value => {
            this.getAllRolesSelectedByUserIdAndCompanyId$(this.roleId, value);
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.cdr.detectChanges(); // 🔥 Solución para evitar ExpressionChangedAfterItHasBeenCheckedError
        });
    }

    private getAllRolesSelectedByUserIdAndCompanyId$(idRole: string, idCompany: string): void {
        this._moduleService.getAllModulesSelectedByRoleIdAndParentModuleId$(idRole, idCompany).subscribe(
            (response) => {
                this.zone.run(() => { // 🔥 Asegurar que Angular detecta cambios correctamente
                    this.modules = response;
                    this.updateModuleFormArray();
                    this.isLoading = false; // 🔥 Desactivar el loading
                    this.cdr.detectChanges(); // 🔥 Forzar actualización de vista
                });
            },
            () => {
                this.parentModules = [];
                this.isLoading = false; // 🔥 Desactivar el loading en caso de error
                this.cdr.detectChanges();
            }
        );
    }

    private updateModuleFormArray(): void {
        const modulesArray = this.roleForm.get('modules') as FormArray;
        modulesArray.clear(); // Limpiar el array antes de agregar nuevos valores
        this.modules.forEach(module => {
            modulesArray.push(new FormControl(module.selected));
        });
    }

    public saveForm(): void {
        if (this.roleForm.valid) {
            const data = {
                roleId: this.roleId,
                parentModuleId: this.roleForm.value.parentModuleId,
                moduleDTOS: this.modules.map((module, index) => ({
                    ...module,
                    selected: this.roleForm.get('modules')?.value[index]
                }))
            };
            this._matDialog.close(data);
        }
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }

    get moduleControls(): FormControl[] {
        return (this.roleForm.get('modules') as FormArray).controls as FormControl[];
    }
}
