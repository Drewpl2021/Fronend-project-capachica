import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';


@Component({
    selector: 'app-accounting-plan-header',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    template: `
        <div class="header-container">
            <div class="header-title  bg-primary-600">
                <span class="header-icon">📑</span>
                <span>Plan Contable</span>
            </div>
            <div class="actions-container mt-4 flex flex-col sm:flex-row sm:space-x-4 sm:items-center sm:mt-0 sm:ml-auto">
                <button class="action-button ml-4" mat-flat-button [color]="'primary'" (click)="goExpand()">
                    <mat-icon [svgIcon]="'heroicons_outline:arrows-pointing-out'"></mat-icon>
                    <span class="ml-2 mr-1">Expandir Todo</span>
                </button>
                <button class="action-button ml-4" mat-flat-button [color]="'primary'" (click)="goCollapse()">
                    <mat-icon [svgIcon]="'heroicons_outline:arrows-pointing-in'"></mat-icon>
                    <span class="ml-2 mr-1">Juntar Todo</span>
                </button>
                <button class="action-button ml-4" mat-flat-button [color]="'primary'" (click)="goNew()">
                    <mat-icon [svgIcon]="'heroicons_outline:plus'"></mat-icon>
                    <span>Nueva Área</span>
                </button>
            </div>
        </div>
    `,
})
export class AccountingPlanHeaderComponent implements OnInit {
    @Output() eventNew = new EventEmitter<boolean>();
    @Output() eventCollapse = new EventEmitter<boolean>();
    @Output() eventExpand = new EventEmitter<boolean>();

    constructor() {
    }
    ngOnInit() {
    }
    public goNew() {
        this.eventNew.emit(true);
    }
    public goCollapse() {
        this.eventCollapse.emit(true);
    }
    public goExpand() {
        this.eventExpand.emit(true);
    }

}
