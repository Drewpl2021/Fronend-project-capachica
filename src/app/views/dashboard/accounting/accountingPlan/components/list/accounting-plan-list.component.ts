import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import {AccountingPlan} from "../../models/accounting-plan";
import { MatMenuModule } from '@angular/material/menu';


import {AreasListComponent} from "../../../areas/components/list/areas-list.component";

@Component({
    selector: 'app-accounting-plan-list',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        AreasListComponent
    ],
    template: `
        <div class="table w-full p-2">
            <div class="treeview-container">
                <div *ngFor="let node of areas" class="tree-node">
                    <div class="node-header flex items-center p-2 rounded-lg border border-gray-200 bg-white shadow-md mb-2">
                        <button
                            *ngIf="node.children?.length > 0"
                            (click)="toggleNode(node)"
                            class="toggle-button mr-2"
                        >
                            <mat-icon
                                *ngIf="node.collapse"
                                [svgIcon]="'heroicons_outline:plus-circle'"
                                [color]="'primary'"
                            ></mat-icon>
                            <mat-icon
                                *ngIf="!node.collapse"
                                [svgIcon]="'heroicons_outline:minus-circle'"
                                [color]="'primary'"
                            ></mat-icon>
                        </button>
                        <mat-icon
                            *ngIf="!node.children || node.children.length === 0"
                            [svgIcon]="'heroicons_outline:stop-circle'"
                            class="icon-placeholder mr-3"
                            [color]="'warn'"
                        ></mat-icon>
                        <span class="font-medium text-gray-700 flex-grow">
                    {{ node.name }} [{{ node.contAsientoClass }}]
                </span>
                        <div class="node-actions flex items-center space-x-2">
                            <button mat-icon-button [matMenuTriggerFor]="menu">
                                <mat-icon>more_vert</mat-icon>
                            </button>
                            <mat-menu #menu="matMenu">
                                <button mat-menu-item (click)="goNewSon(node.id)">
                                    <mat-icon>add</mat-icon>
                                    <span>Nuevo Hijo</span>
                                </button>
                                <button mat-menu-item (click)="goEdit(node.id)">
                                    <mat-icon>edit</mat-icon>
                                    <span>Actualizar</span>
                                </button>
                                <button
                                    mat-menu-item
                                    *ngIf="!node.children || node.children.length === 0"
                                    (click)="goDelete(node.id)"
                                >
                                    <mat-icon>delete</mat-icon>
                                    <span>Eliminar</span>
                                </button>
                            </mat-menu>
                        </div>
                    </div>
                    <div
                        *ngIf="!node.collapse && node.children?.length > 0"
                        class="node-children pl-6 border-l border-gray-300"
                    >
                        <app-area-list
                            [areas]="node.children"
                            (eventEdit)="goEdit($event)"
                            (eventDelete)="goDelete($event)"
                            (eventNewSonID)="goNewSon($event)"
                        ></app-area-list>
                    </div>
                </div>
            </div>
        </div>

    `,
})
export class AccountingPlanListComponent implements OnInit {
    abcForms: any;
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();
    @Output() eventNode = new EventEmitter<string>();
    @Output() eventNewSonID = new EventEmitter<string>();
    @Output() eventNewSonLVL = new EventEmitter<number>();
    @Input() areas: AccountingPlan[] = [];

    constructor() {}

    ngOnInit() {
        this.abcForms = abcForms;
    }

    public goNewSon(id: string) {
        this.eventNewSonID.emit(id);
    }
    public goNewSonlvl(areaLevel: number) {
        this.eventNewSonLVL.emit(areaLevel);
    }
    public goEdit(id: string) {
        this.eventEdit.emit(id);
    }
    public goDelete(id:string) {
        this.eventDelete.emit(id);
    }
    public toggleNode(node: AccountingPlan): void {
        node.collapse = !node.collapse;
        if (!node.collapse && node.children) {
            node.children.forEach((child) => (child.collapse = true));
        }
    }
}
