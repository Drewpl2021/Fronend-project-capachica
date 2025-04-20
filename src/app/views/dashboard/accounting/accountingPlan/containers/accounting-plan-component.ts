import {Component, OnInit} from '@angular/core';
import {AccountingPlanListComponent} from '../components/list/accounting-plan-list.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {TreeviewModule} from '@treeview/ngx-treeview';
import {SharedModule} from './accounting-plan.module';
import {AccountingPlanHeaderComponent} from "../components/header/accounting-plan-header.component";
import {MatDialog} from "@angular/material/dialog";
import {AccountingPlan} from "../models/accounting-plan";
import {AccountingPlanNewComponent} from "../components/form/accounting-plan-new.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {AccountingPlanNewSonComponent} from "../components/form/accounting-plan-new-son.component";
import {AccountingPlanEditComponent} from "../components/form/accounting-plan-edit.component";
import {AccoutingPlanService} from "../../../../../providers/services/accounting/accounting-plan.service";

@Component({
    selector: 'app-accounting-plan-container',
    standalone: true,
    imports: [AccountingPlanListComponent, PaginationControlsComponent, TreeviewModule, SharedModule, AccountingPlanHeaderComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <app-accounting-plan-header
                (eventNew)="eventNew($event)"
                (eventCollapse)="collapseAll()"
                (eventExpand)="expandAll()">
            </app-accounting-plan-header>
            <app-accounting-plan-list
                class="w-full"
                [areas]="accountingPlan"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
                (eventNewSonID)="eventNewSon($event)">
            </app-accounting-plan-list>
        </div>
    `,
})
export class AccountingPlanComponent implements OnInit {
    public error: string = '';
    public accountingPlan: AccountingPlan[] = [];
    public unitMeasurement = new AccountingPlan();


    constructor(
       private _accountingPlanService: AccoutingPlanService,
       private _matDialog: MatDialog,
       private _confirmDialogService: ConfirmDialogService,
        ){}
    ngOnInit() {
       if (this.accountingPlan.length === 0) {
           this.getAccountingPlan();
       }
    }
    public eventNew($event: boolean): void {
        if ($event) {
            const accountingPlanForm = this._matDialog.open(AccountingPlanNewComponent);
            accountingPlanForm.componentInstance.title = 'Nuevo Hijo' || null;

            accountingPlanForm.afterClosed().subscribe((result: any) => {
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
            const accountingPlanForm = this._matDialog.open(AccountingPlanNewSonComponent);
            accountingPlanForm.componentInstance.evet$ = $event;
            accountingPlanForm.componentInstance.title = 'Area Nueva' || null;

            accountingPlanForm.afterClosed().subscribe((result: any) => {
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
        this._accountingPlanService.add$(data).subscribe((response) => {
            if (response) {
                this.getAccountingPlan();
            }
        }, (error) => {
        });
    }
    public expandAll(): void {
        this.accountingPlan.forEach((node) => this.toggleCollapse(node, false));
    }

    public collapseAll(): void {
        this.accountingPlan.forEach((node) => this.toggleCollapse(node, true));
    }

    private toggleCollapse(node: AccountingPlan, collapse: boolean): void {
        node.collapse = collapse;
        node.children?.forEach((child) => this.toggleCollapse(child, collapse));
    }
    private getAccountingPlan(): void {
        this._accountingPlanService.getTree$().subscribe(
            (response) => {
                this.accountingPlan = this.filterNodes(response).map((node) => ({
                    ...node,
                    collapse: true,
                }));
            },
            (error) => {
                this.error = 'Error cargando áreas: ' + error.message;
            });
    }
    private filterNodes(nodes: AccountingPlan[]): AccountingPlan[] {
        return nodes
            .filter((node) => node.deletedAt === null)
            .map((node) => ({
                ...node,
                children: node.children ? this.filterNodes(node.children) : [],
            }));
    }
    public eventEdit(id: string): void {
        this._accountingPlanService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const accountingPlanForm = this._matDialog.open(AccountingPlanEditComponent);
            accountingPlanForm.componentInstance.title = 'Editar Plan Contable' || null;
            accountingPlanForm.componentInstance.unitMeasurement = this.unitMeasurement;

            accountingPlanForm.afterClosed().subscribe((result: any) => {
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
    private edit(UnitMeasurement: AccountingPlan) {
        this._accountingPlanService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getAccountingPlan();
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
            this._accountingPlanService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getAccountingPlan();
                }
            });
        }).catch(() => {
        });
    }
}
