import {Component, OnInit} from '@angular/core';
import {AreasListComponent} from '../components/list/areas-list.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import { TreeviewModule, TreeviewItem } from '@treeview/ngx-treeview';
import {SharedModule} from './areas.module';
import {AreasHeaderComponent} from "../components/header/areas-header.component";
import {AreaService} from "../../../../../providers/services/accounting/area.service";
import {MatDialog} from "@angular/material/dialog";
import {Areas} from "../models/areas";
import {AreasNewComponent} from "../components/form/areas-new.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {AreasNewSonComponent} from "../components/form/areas-new-son.component";
import {AreasEditComponent} from "../components/form/areas-edit.component";

@Component({
    selector: 'app-areas-container',
    standalone: true,
    imports: [AreasListComponent, PaginationControlsComponent, TreeviewModule, SharedModule, AreasHeaderComponent, ],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <app-area-header
                (eventNew)="eventNew($event)"
                (eventCollapse)="collapseAll()"
                (eventExpand)="expandAll()">
            </app-area-header>
            <app-area-list
                class="w-full"
                [areas]="areas"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
                (eventNewSonID)="eventNewSon($event)">
            </app-area-list>
        </div>
    `,
})
export class AreasContainersComponent implements OnInit {
    public error: string = '';
    public areas: Areas[] = [];
    public unitMeasurement = new Areas();


    constructor(
       private _areaService: AreaService,
       private _matDialog: MatDialog,
       private _confirmDialogService: ConfirmDialogService,
        ){}
    ngOnInit() {
       if (this.areas.length === 0) {
           this.getArea();
       }
    }
    public eventNew($event: boolean): void {
        if ($event) {
            const areaForm = this._matDialog.open(AreasNewComponent);
            areaForm.componentInstance.title = 'Nuevo Hijo' || null;

            areaForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    // Muestra la confirmación antes de guardar
                    this._confirmDialogService.confirmSave({})
                        .then(() => {
                            this.save(result); // Si el usuario confirma, procede con el guardado
                        })
                }
            });
        }
    }

    public eventNewSon($event: string): void {
        if ($event) {
            const areaForm = this._matDialog.open(AreasNewSonComponent);
            areaForm.componentInstance.evet$ = $event;
            areaForm.componentInstance.title = 'Area Nueva' || null;

            areaForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    // Muestra la confirmación antes de guardar
                    this._confirmDialogService.confirmSave({})
                        .then(() => {
                            this.save(result); // Si el usuario confirma, procede con el guardado
                        })
                }
            });
        }
    }
    private save(data: Object) {
        this._areaService.add$(data).subscribe((response) => {
            if (response) {
                this.getArea();
            }
        }, (error) => {
        });
    }
    public expandAll(): void {
        this.areas.forEach((node) => this.toggleCollapse(node, false));
    }

    public collapseAll(): void {
        this.areas.forEach((node) => this.toggleCollapse(node, true));
    }

    private toggleCollapse(node: Areas, collapse: boolean): void {
        node.collapse = collapse;
        node.children?.forEach((child) => this.toggleCollapse(child, collapse));
    }
    private getArea(): void {
        this._areaService.getTree$().subscribe(
            (response) => {
                this.areas = this.filterNodes(response).map((node) => ({
                    ...node,
                    collapse: true,
                }));
            },
            (error) => {
                this.error = 'Error cargando áreas: ' + error.message;
            });
    }
    private filterNodes(nodes: Areas[]): Areas[] {
        return nodes
            .filter((node) => node.deletedAt === null)
            .map((node) => ({
                ...node,
                children: node.children ? this.filterNodes(node.children) : [],
            }));
    }
    public eventEdit(id: string): void {
        this._areaService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const areaForm = this._matDialog.open(AreasEditComponent);
            areaForm.componentInstance.title = 'Editar Area' || null;
            areaForm.componentInstance.unitMeasurement = this.unitMeasurement;

            areaForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    // Muestra la confirmación antes de editar
                    this._confirmDialogService.confirmSave({})
                        .then(() => {
                            this.edit(result); // Si el usuario confirma, procede con la edición
                        })
                }
            });
        });
    }
    private edit(UnitMeasurement: Areas) {
        this._areaService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getArea();
            }
        });
    }
    public eventDelete(id: string) {
        this._confirmDialogService.confirmDelete(
            {
                // title: 'Confirmación Personalizada',
                // message: `¿Quieres proceder con esta acción ${}?`,
            }
        ).then(() => {
            this._areaService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getArea();
                }
            });
        }).catch(() => {
        });
    }
}
