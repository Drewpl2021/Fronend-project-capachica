import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Module, SectionDetail} from "../../models/module";
import {ParentModule} from "../../../parentModule/models/parent-module";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {SectionsDetailsService} from "../../../../../../providers/services/setup/sections-details.service";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ConfirmDialogService} from "../../../../../../shared/confirm-dialog/confirm-dialog.service";
import {ModuleEditComponent} from "../form/module-edit.component";
import {SeccionDetalleEditComponent} from "../form/seccion-detalle-edit.component";

@Component({
    selector: 'app-sections-new',
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
        MatTooltipModule,
    ],
    template: `
        <div class="bg-white flex flex-col px-4 py-4  mx-auto rounded shadow-md "  style="width: 10000px">
            <div class="flex justify-between bg-primary-600 text-white p-2 rounded mb-4">
                <h1 class="text-2xl font-bold"> Seccion Detalle  </h1>
            </div>
            <div>
                <br>
                <div class="cards-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; padding: 20px;">
                    <div *ngFor="let section of sectionDetails; let idx = index" class="card-container" style="display: flex; justify-content: center;">
                        <div class="card"
                             style="width: 100%; max-width: 350px; transition: transform 0.3s ease-in-out; background-color: #f9fafb; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 20px; margin-bottom: 20px; overflow: hidden;">
                            <div class="text-center" style="font-size: 1.5rem; font-weight: bold; margin-bottom: 10px; color: #4CAF50; background-color: #e8f5e9; padding: 10px; border-radius: 5px;">
                                {{ section.title }}
                            </div>

                            <div class="text-sm mb-2" style="font-size: 14px; margin-bottom: 8px;">
                                <strong>Código: </strong>{{ section.code }}
                            </div>
                            <div class="text-sm mb-2" style="font-size: 14px; margin-bottom: 8px;">
                                <strong>Estado: </strong>{{ section.status === 1 ? 'Activo' : 'Inactivo' }}
                            </div>
                            <div class="text-center">
                                <mat-icon
                                    matTooltip="Ver contenido seccion"
                                    matTooltipClass="tooltip-edit"
                                    matTooltipPosition="above"
                                    class="text-primary-600 hover:text-primary-700 cursor-pointer"
                                    style="font-size: 1.8em; transition: transform 0.3s ease;"
                                    (click)="goView(section.id)">
                                    visibility
                                </mat-icon>
                                <mat-icon
                                    matTooltip="Editar seccion"
                                    matTooltipClass="tooltip-edit"
                                    matTooltipPosition="above"
                                    class="text-amber-500 hover:text-amber-600 cursor-pointer"
                                    style="font-size: 1.8em; transition: transform 0.3s ease;"
                                    (click)="goEdit(section.id)">
                                    edit
                                </mat-icon>
                                <mat-icon
                                    matTooltip="Eliminar seccion"
                                    matTooltipClass="tooltip-delete"
                                    matTooltipPosition="above"
                                    class="text-rose-600 hover:text-rose-700 cursor-pointer"
                                    style="font-size: 1.8em; transition: transform 0.3s ease;"
                                    (click)="goDelete(section.id)">
                                    delete_sweep
                                </mat-icon>
                            </div>
                        </div>
                    </div>

                    <!-- Si no hay datos -->
                    <div *ngIf="sectionDetails.length === 0" class="text-center" style="color: #6B7280;">
                        No hay secciones registradas.
                    </div>
                </div>
            </div>




            <div class="flex justify-end gap-1">
                <button mat-raised-button color="warn" (click)="cancelForm()">Regresar</button>
            </div>

        </div>
    `,
})
export class SectionDetailViewComponent implements OnInit {
    @Input() title: string = '';
    @Input() module = new Module();
    public parentModules: ParentModule[] = [];
    abcForms: any;
    sectionDetails: SectionDetail[] = [];

    public sectionId: string = '';


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private _matDialog: MatDialog,
        private _sectionsDetailsService: SectionsDetailsService,
        private _confirmDialogService: ConfirmDialogService,

    ) {}

    ngOnInit() {
        this.abcForms = abcForms;
        this.route.params.subscribe(params => {
            this.sectionId = params['id']; // 'id' es el nombre del parámetro de la ruta
            this.uploadData();
        });
    }
    private uploadData() {
        this._sectionsDetailsService.getByIdSS$(this.sectionId).subscribe((data) => {
            this.sectionDetails = data || [];
        });
    }


    public goEdit(id: string) {
        this._sectionsDetailsService.getById$(id).subscribe((response) => {
            this.module = response;
            const moduleForm = this._matDialog.open(SeccionDetalleEditComponent);
            moduleForm.componentInstance.title = 'Editar Modulo' || null;
            moduleForm.componentInstance.module = this.module;
            moduleForm.componentInstance.parentModules = this.parentModules;

            moduleForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.edit(result);
                }
            });
        });
    }
    private edit(module: Module) {
        this._sectionsDetailsService.update$(this.module.id, module).subscribe((response) => {
            if (response) {
                this.uploadData();
            }
        });
    }
    public goView(id: string) {
        if (id) {
            this.router.navigate([`../../view-sections-detail/${id}`], { relativeTo: this.route }).then((success) => {
            });
        }
    }
    public cancelForm(): void {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }
    public goDelete(id: string) {
        this._confirmDialogService.confirmDelete(
            {
                // title: 'Confirmación Personalizada',
                // message: `¿Quieres proceder con esta acción ${}?`,
            }
        ).then(() => {
            this._sectionsDetailsService.delete$(id).subscribe((response) => {
                if (response) {
                    this.uploadData();
                }
            });
        }).catch(() => {
        });
    }
}
