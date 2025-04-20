import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from "@angular/material/select";
import {CommonModule, JsonPipe} from "@angular/common";
import {Areas} from "../../models/areas";

@Component({
    selector: 'app-area-son-new',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        JsonPipe,
        CommonModule
    ],
    template: `
        <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <div
                class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium">Nueva Area</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon
                        class="text-current"
                        [svgIcon]="'heroicons_outline:x-mark'"
                    ></mat-icon>
                </button>
            </div>

            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="accountForm" >
                <mat-form-field appearance="fill" class="w-full" >
                    <mat-label>Nombre</mat-label>
                    <input matInput formControlName="name" type="text" placeholder="Nombre del área" />
                </mat-form-field>
                <mat-form-field appearance="fill" class="w-full">
                    <mat-label>Código</mat-label>
                    <input matInput formControlName="code" type="text" placeholder="Código del área" />
                </mat-form-field>
                <mat-form-field appearance="fill" class="w-full">
                    <mat-label>Descripción</mat-label>
                    <textarea matInput formControlName="description" placeholder="Descripción del área"></textarea>
                </mat-form-field>
                <mat-slide-toggle formControlName="state" color="primary">Estado</mat-slide-toggle>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <div class="flex space-x-2 items-center mt-4 sm:mt-0">
                        <button class="ml-auto sm:ml-0" color="warn" mat-stroked-button (click)="cancelForm()">
                            Cancelar
                        </button>
                        <button class="ml-auto sm:ml-0" color="primary" [disabled]="accountForm.invalid"
                                mat-stroked-button (click)="saveForm()">
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>

    `,
})
export class AreasNewSonComponent implements OnInit {
    @Input() title: string = '';
    @Input() areas: Areas[] = [];
    public evet$: string | undefined;
    abcForms: any;
    accountForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        code: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        areaLevel: new FormControl( 2, [Validators.required]),
        companyId: new FormControl('952e9cec-7fda-4737-a6ea-04df2d9d30c8', [Validators.required]),
        parentAreaId: new FormControl('', [Validators.required]),
        state: new FormControl(true, [Validators.required]),
    });

    constructor(
        private _matDialog: MatDialogRef<AreasNewSonComponent>
    ) {
    }

    ngOnInit() {
        this.abcForms = abcForms;
        this.accountForm.patchValue({
            parentAreaId: this.evet$,
        });
    }


    public saveForm(): void {
        if (this.accountForm.valid) {
            this._matDialog.close(this.accountForm.value);
        }
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }
}
