import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DateAdapter} from "@angular/material/core";
import {format} from "date-fns";
import {SerialFlowsService} from "../../../../../../providers/services/catalog/serial-flows.service";
import {SerialFlows} from "../../../../sales/sales/models/sales";

@Component({
    selector: 'app-payments-filter',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
    ],
    template: `
        <div class="header-container ">
            <div class="header-title bg-primary-600">
                <span class="header-icon">💵</span>
                <span>Pagos</span>
            </div>

            <div class="actions-container">
                <form class="form-container" [formGroup]="paymentsFilterForm" (ngSubmit)="onSubmit()" style="display: flex; flex-wrap: wrap; gap: 8px; width: 100%;">
                    <!--<mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded" [subscriptSizing]="'dynamic'">
                        <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:magnifying-glass'"></mat-icon>
                        <input
                            matInput
                            [formControlName]="'concatenatedFields'"
                            [autocomplete]="'off'"
                            [placeholder]="'Buscar Pagos'"
                        />
                    </mat-form-field>-->
                    <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded" [subscriptSizing]="'dynamic'" style="flex: 0.5; min-width: 120px;">
                        <input matInput [matDatepicker]="picker" formControlName="startDate">
                        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                        <mat-datepicker #picker></mat-datepicker>
                    </mat-form-field>
                    <mat-form-field class="mat-field-custom fuse-mat-dense fuse-mat-rounded" [subscriptSizing]="'dynamic'" style="flex: 0.5; min-width: 120px;">
                        <input matInput [matDatepicker]="pickerEnd" formControlName="endDate" autocomplete="off" placeholder="Selecciona una fecha"/>
                        <mat-datepicker-toggle matSuffix [for]="pickerEnd"></mat-datepicker-toggle>
                        <mat-datepicker #pickerEnd></mat-datepicker>
                    </mat-form-field>
                    <button class="action-button" mat-flat-button [color]="'primary'" type="submit">
                        <mat-icon [svgIcon]="'heroicons_outline:funnel'"></mat-icon>
                        <span class="ml-1"> Visualizar</span>
                    </button>
                </form>
                <button class="action-button" mat-flat-button [color]="'primary'" (click)="goNew()">
                    <mat-icon [svgIcon]="'heroicons_outline:plus'"></mat-icon>
                    <span>Nuevo Pago</span>
                </button>
            </div>
        </div>

    `,
})
export class PaymentsFilterComponent implements OnInit {
    @Output() eventChangeView: EventEmitter<number> = new EventEmitter<number>();
    @Output() eventFilter: EventEmitter<any> = new EventEmitter<any>();
    @Output() eventNew = new EventEmitter<boolean>();
    public serialFlows: SerialFlows[] = [];
    abcForms: any;
    paymentsFilterForm = new FormGroup({
        startDate: new FormControl(new Date()),
        endDate: new FormControl(new Date()),
        storeId: new FormControl(null), // Se llenará dinámicamente en `uploadData()`
    });

    constructor(
        private dateAdapter: DateAdapter<Date>,
        private _serialFlowsService: SerialFlowsService,
    ) {
        this.dateAdapter.setLocale('es-ES');
    }

    ngOnInit() {
        this.abcForms = abcForms;
        const formData = {...this.paymentsFilterForm.value,
            startDate: this.paymentsFilterForm.value.startDate
                ? format(new Date(this.paymentsFilterForm.value.startDate), 'yyyy-MM-dd') : '',
            endDate: this.paymentsFilterForm.value.endDate
                ? format(new Date(this.paymentsFilterForm.value.endDate), 'yyyy-MM-dd') : '',
        };
        this.eventFilter.emit(formData);
        this.uploadData();

    }
    private uploadData() {
        this._serialFlowsService.getAll$().subscribe((data) => {
            this.serialFlows = data?.content || [];
            const storeId = this.serialFlows.length > 0 ? this.serialFlows[0].store?.id : null;
            if (storeId) {
                this.paymentsFilterForm.patchValue({ storeId });
            }
        });
    }
    onSubmit() {
        if (this.paymentsFilterForm.valid) {
            const formData = {...this.paymentsFilterForm.value,
                startDate: this.paymentsFilterForm.value.startDate
                    ? format(new Date(this.paymentsFilterForm.value.startDate), 'yyyy-MM-dd') : '',
                endDate: this.paymentsFilterForm.value.endDate
                    ? format(new Date(this.paymentsFilterForm.value.endDate), 'yyyy-MM-dd') : '',
            };
            this.eventFilter.emit(formData);

        }
    }
    public goNew() {
        this.eventNew.emit(true);
    }

}
