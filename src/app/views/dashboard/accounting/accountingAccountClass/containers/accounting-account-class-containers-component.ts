import {Component, OnInit} from '@angular/core';
import {accountingAccountClass, accountingAccountClassFilter, PaginatedResponse} from '../models/accounting-account-class';
import {AccountingAccountClassListComponent} from '../components/list/accounting-account-class-list.component';
import {MatDialog} from '@angular/material/dialog';
import {AccountingAccountClassNewComponent} from '../components/form/accounting-account-class-new.component';
import {PaginationControlsComponent} from "../../../../../shared/pagination-controls/pagination-controls.component";
import {PaginationEvent} from "../../../../../shared/pagination-controls/models/PaginationEvent";
import {AccountingAccountClassFilterComponent} from "../components/filter/accounting-account-class-filter.component";
import {AccountingAccountClassEditComponent} from "../components/form/accounting-account-class-edit.component";
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {AccountingAccountClassService} from "../../../../../providers/services/accounting/accounting-account-class.service";

@Component({
    selector: 'app-accounting-account-class-container',
    standalone: true,
    imports: [AccountingAccountClassListComponent, PaginationControlsComponent, AccountingAccountClassFilterComponent],
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <app-accounting-account-class-filter
                (eventFilter)="eventFilter($event)"
                (eventNew)="eventNew($event)">
            </app-accounting-account-class-filter>
            <app-accounting-account-class-list
                class="w-full"
                [accountes]="accountes"
                (eventEdit)="eventEdit($event)"
                (eventDelete)="eventDelete($event)"
            ></app-accounting-account-class-list>
            <pagination-controls
                [totalItems]="paginatedResponse.totalElements"
                [itemsPerPage]="size"
                [currentPage]="paginatedResponse.currentPage"
                (paginationChange)="paginationChange($event)"
            ></pagination-controls>
        </div>
    `,
})
export class AccountingAccountClassContainersComponent implements OnInit {
    public error: string = '';
    public accountes: accountingAccountClass[] = [];
    public paginationEvent = new PaginationEvent();
    public accountFilter: accountingAccountClassFilter;
    public unitMeasurement = new accountingAccountClass();
    paginatedResponse: PaginatedResponse = {content: [], totalPages: 0, currentPage: 0, totalElements: 0};
    size: number = 20;

    constructor(
        private _accountService: AccountingAccountClassService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog
    ) {}
    ngOnInit() {
    }
    public paginationChange(paginationEvent: PaginationEvent): void {
        this.paginationEvent = paginationEvent;
        this.mergeFilterAndPagination();
    }
    public eventFilter(accountFilter: accountingAccountClassFilter): void {
        this.accountFilter = accountFilter;
        this.mergeFilterAndPagination();
    }
    private mergeFilterAndPagination(): void {
        const mergedData = {
            ...this.accountFilter,
            page: this.paginationEvent.page,
            size: this.paginationEvent.size
        };
        this.getAccount(mergedData);
    }
    private getAccount(data?: any): void {
        this._accountService.getWithSearch$(data).subscribe(
            (response) => {
                this.paginatedResponse = response;
                this.accountes = this.paginatedResponse.content;
            },
            (error) => {
                this.error = error;
            }
        );
    }
    public eventNew($event: boolean): void {
        if ($event) {
            const accountForm = this._matDialog.open(AccountingAccountClassNewComponent);
            accountForm.componentInstance.title = 'Nueva Cuenta Contable' || null;
            accountForm.afterClosed().subscribe((result: any) => {
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
        this._accountService.add$(data).subscribe((response) => {
            if (response) {
                this.getAccount();
            }
        }, (error) => {
        });
    }
    public eventEdit(id: string): void {
        this._accountService.getById$(id).subscribe((response) => {
            this.unitMeasurement = response;
            const accountForm = this._matDialog.open(AccountingAccountClassEditComponent);
            accountForm.componentInstance.title = 'Editar Cuenta Contable' || null;
            accountForm.componentInstance.unitMeasurement = this.unitMeasurement;

            accountForm.afterClosed().subscribe((result: any) => {
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

    public eventDelete(id: string) {
        this._confirmDialogService.confirmDelete({}).then(() => {
            this._accountService.delete$(id).subscribe((response) => {
                if (response) {
                    this.getAccount();
                }
            });
        }).catch(() => {
        });
    }
    private edit(UnitMeasurement: accountingAccountClass) {
        this._accountService.update$(this.unitMeasurement.id, UnitMeasurement).subscribe((response) => {
            if (response) {
                this.getAccount();
            }
        });
    }
}
