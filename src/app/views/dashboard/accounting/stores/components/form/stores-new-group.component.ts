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
import {SeriesFlow} from "../../models/stores";
import {UsersService} from "../../../../../../providers/services/setup/users.service";
import {User} from "../../../../setup/userCompany/models/user";
import {SerialFlowsService} from "../../../../../../providers/services/catalog/serial-flows.service";
import {ConfirmDialogService} from "../../../../../../shared/confirm-dialog/confirm-dialog.service";
import {Subject} from "rxjs";

@Component({
    selector: 'app-store-new-group',
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
        <div class="container flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <!-- Header -->
            <div
                class="header flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
                <div class="text-lg font-medium">Series - Almacén</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon class="text-current" [svgIcon]="'heroicons_outline:x-mark'"></mat-icon>
                </button>
            </div>

            <!-- Formulario para el select y el botón -->
            <form [formGroup]="storeForm" class="flex justify-end mt-4 mb-2 items-center gap-4">
                <!-- Select de Usuarios -->
                <mat-form-field appearance="fill" class="w-1/3">
                    <mat-label>Seleccionar Usuario</mat-label>
                    <mat-select formControlName="userId">
                        <mat-option value="" disabled>Seleccionar Usuario</mat-option>
                        <mat-option *ngFor="let user of users" [value]="user.id">
                            {{ user.firstName }} {{ user.lastName }}
                        </mat-option>
                    </mat-select>
                </mat-form-field>

                <!-- Botón de Generar Nuevo Grupo -->
                <button mat-stroked-button color="primary" (click)="saveForm()">
                    <mat-icon svgIcon="heroicons_outline:cog" class="mr-2"></mat-icon>
                    GENERAR NUEVO GRUPO DE SERIES
                </button>
            </form>

            <!-- Tabla de datos -->
            <div class="table-container">
                <table class="w-full border">
                    <thead>
                    <tr class="bg-primary-600 text-white">
                        <th class="w-1/9 table-head text-center border-r">#</th>
                        <th class="w-1/9 table-header text-center border-r">Comprobante</th>
                        <th class="w-1/9 table-header text-center border-r">Serie</th>
                        <th class="w-1/9 table-header text-center border-r">N° Cajero</th>
                        <th class="w-1/9 table-header text-center border-r">Almacén</th>
                    </tr>
                    </thead>
                    <tbody class="bg-white">
                    <tr *ngFor="let store of serialFlow; let idx = index; trackBy: trackById" class="hover:bg-gray-100">
                        <td class="w-1/9 p-2 text-center border-b">{{ idx + 1 }}</td>
                        <td class="w-1/9 p-2 text-start border-b text-sm">{{ store.typeDocument?.name }}</td>
                        <td class="w-1/9 p-2 text-start border-b text-sm">{{ store.serial }}</td>
                        <td class="w-1/9 p-2 text-start border-b text-sm">{{ store.seriesGroup }}</td>
                        <td class="w-1/9 p-2 text-start border-b text-sm">{{ store.store?.name }}</td>
                    </tr>

                    <tr *ngIf="serialFlow.length === 0">
                        <td colspan="5" class="text-center">Sin Contenido</td>
                    </tr>
                    </tbody>
                </table>

                <!-- Botones para eliminar grupos -->
                <div class="delete-buttons flex flex-wrap gap-4 mt-4">
                    <button
                        *ngFor="let cashier of uniqueCashiers"
                        (click)="goDelete(cashier)"
                        class="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 hover:shadow-lg transition duration-300 ease-in-out">
                        ELIMINAR GRUPO {{ cashier }}
                    </button>
                </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex flex-row justify-end gap-4 mt-4">
                <button mat-stroked-button color="warn" (click)="cancelForm()">Cancelar</button>
                <button mat-raised-button color="primary" (click)="cancelForm()">Guardar</button>
            </div>
        </div>


    `,
})
export class StoresNewGroupComponent implements OnInit {
    @Input() title: string = '';
    @Input() id: string = '';
    public payloadEmitter = new Subject<any>();

    abcForms: any;
    serialFlow: SeriesFlow[] = [];
    public users: User[] = [];
    public error: string = '';
    public userId: string | null = null;
    uniqueCashiers: number[] = [];

    storeForm = new FormGroup({
        userId: new FormControl(''),
        storeId: new FormControl(''),
    });
    constructor(
        private _matDialog: MatDialogRef<StoresNewGroupComponent>,
        private _userService: UsersService,
        private _seriesFlowService: SerialFlowsService,
        private _confirmDialogService: ConfirmDialogService,

    ) {
    }
// Para garantizar un trackBy funcional
    trackById(index: number, item: any): any {
        return item.id || index; // Usar `id` si está disponible; de lo contrario, usa el índice
    }

    ngOnInit() {
        this.abcForms = abcForms;
        this.getUsers();
        if (this.id) {
            this.getSerialByStore(this.id);
        }

    }

    public saveForm(): void {
        if (!this.userId) {
            return;
        }
        if (this.storeForm.valid) {
            // Muestra la confirmación antes de proceder con el guardado
            this._confirmDialogService.confirmSave({})
                .then(() => {
                    const payload = {
                        userId: this.storeForm.value.userId,
                        store: {
                            id: this.id,
                        },
                    };
                    this._seriesFlowService.add$(payload).subscribe((response) => {
                        if (response) {
                            this.getSerialByStore(this.id);
                        }
                    });
                })
        }
    }


    public cancelForm(): void {
        this._matDialog.close('');
    }

    getUsers(): void {
        this._userService.getByCompany$().subscribe(
            (response) => {
                if (response.length > 0) {
                    this.users = response; // Guardar la lista de usuarios
                    this.userId = response[0].id; // Seleccionar el primer usuario por defecto
                    this.storeForm.patchValue({ userId: this.userId }); // Establecer el valor inicial en el formulario
                }
            },
            (error) => {
                console.error('Error al obtener usuarios:', error);
                this.error = 'Error al cargar los usuarios.';
            }
        );
    }
    getSerialByStore(storeId: string): void {
        this._seriesFlowService.getListStores$(storeId).subscribe(
            (response) => {
                const filteredResponse = response.filter((item: any) => item.deletedAt === null);
                this.serialFlow = filteredResponse || [];
                this.uniqueCashiers = [
                    ...new Set(this.serialFlow.map((item: any) => item.seriesGroup)),
                ].filter((cashier) => cashier !== null && cashier !== undefined);
            }
        );
    }

    public goDelete(cashier: string): void {
        this._confirmDialogService.confirmDelete(
            {
                title: 'Confirmación de Eliminación',
                message: `¿Estás seguro de que deseas eliminar el grupo ${cashier}?`,
            }
        ).then(() => {
            this._seriesFlowService.delete$(cashier).subscribe(
                (response) => {
                    if (response) {
                        this.getSerialByStore(this.id);
                    }
                },
            );
        }).catch(() => {
        });
    }
}
