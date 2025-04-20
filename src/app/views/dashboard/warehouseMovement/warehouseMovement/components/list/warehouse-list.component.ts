import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import {Category, Warehouse} from '../../models/warehouse';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import {TypeDocument} from "../../../../accounting/typeDocument/models/type-document";
import {Stores} from "../../../../accounting/stores/models/stores";
import {TypeDocumentService} from "../../../../../../providers/services/accounting/type-document.service";
import {StoresService} from "../../../../../../providers/services/accounting/stores.service";
import {FileTickedWarehouseService} from "../../../../../../shared/files/file-ticked-warehouse.service";
import {FileA4WarehouseService} from "../../../../../../shared/files/file-a4-warehouse.service";
import {WarehouseService} from "../../../../../../providers/services/warehouseMovement/warehouse.service";
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
    selector: 'app-warehouse-list',
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
        DatePipe,
        MatTooltipModule
    ],
    template: `
        <br>
        <div class="table-container">
            <table class="custom-table">
                <thead>
                <tr class="bg-primary-600 text-white">
                    <th class="w-1/9 table-head text-center border-r">#</th>
                    <th class="w-1/9 table-header text-center border-r">Almacén</th>
                    <th class="w-1/9 table-header text-center border-r">Tipo de Documento</th>
                    <th class="w-1/9 table-header text-center border-r">Movimiento</th>
                    <th class="w-1/9 table-header text-center border-r">Razon Social</th>
                    <th class="w-1/9 table-header text-center border-r">N° de Doc.</th>
                    <th class="w-1/9 table-header text-center border-r">Serie</th>
                    <th class="w-1/9 table-header text-center border-r">Numero</th>
                    <th class="w-1/9 table-header text-center border-r">B.I.</th>
                    <th class="w-1/9 table-header text-center border-r">I.G.V.</th>
                    <th class="w-1/9 table-header text-center border-r">Total</th>
                    <th class="w-1/9 table-header text-center border-r">Fecha Creación</th>
                    <th class="w-1/9 table-header text-center border-r">Acciones</th>
                </tr>
                </thead>
                <tbody class="bg-white">
                    @for (category of categories; track category.id; let idx = $index) {
                        <tr class="hover:bg-gray-100">
                            <td class="w-1/9 p-2 text-center border-b">
                                {{ idx + 1 }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ getStorestNameById(category.storeId) }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ getDocumentNameById(category.documentTypeId) }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.operationType === 'OUTGOING' ? 'SALIDA' : category.operationType === 'INCOMING' ? 'ENTRADA' : category.operationType }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.nameSocialReason }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.documentNumber }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.series }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.number }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.bi }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.igv }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.total }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ category.createdAt | date:'dd/MM/yyyy HH:mm:ss' }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="flex justify-center space-x-3">
                                    <mat-icon
                                        matTooltip="Editar Movimiento"
                                        matTooltipPosition="above"
                                        (click)="goEdit(category.id)"
                                        class="text-amber-400 hover:text-amber-500 cursor-pointer">
                                        visibility
                                    </mat-icon>

                                    <mat-icon
                                        matTooltip="Descargar Ticket"
                                        matTooltipPosition="above"
                                        (click)="downloadTicket(category.id)"
                                        class="text-green-500 hover:text-green-700 cursor-pointer">
                                        ballot
                                    </mat-icon>

                                    <mat-icon
                                        matTooltip="Generar Documento A4"
                                        matTooltipPosition="above"
                                        (click)="generateDocumentA4(category.id)"
                                        class="text-green-500 hover:text-green-700 cursor-pointer">
                                        insert_drive_file
                                    </mat-icon>

                                    <mat-icon
                                        matTooltip="Eliminar Movimiento"
                                        matTooltipPosition="above"
                                        (click)="goDelete(category.id)"
                                        class="text-rose-500 hover:text-rose-600 cursor-pointer">
                                        delete_sweep
                                    </mat-icon>
                                </div>
                            </td>
                        </tr>
                    } @empty {
                        <tr>
                            <td colspan="9" class="text-center">
                                Sin Contenido
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
        <br>
    `,
})
export class PurchasesListComponent implements OnInit {
    abcForms: any;
    @Input() categories: Warehouse[] = [];
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();
    typeDocuments: TypeDocument[] = [];
    stores: Stores[] = [];

    constructor(
        private _typeDocument: TypeDocumentService,
        private _storesService: StoresService,
        private _categoryService: WarehouseService,
        private _fileTickedWarehouseService: FileTickedWarehouseService,
        private _fileA4WarehouseService: FileA4WarehouseService,
    ) {}

    generateDocumentA4(categoryId: string): void {
        this._categoryService.getById$(categoryId).subscribe(
            (data: any) => {
                if (!data) {
                    console.error("❌ No se encontraron datos para la categoría:", categoryId);
                    return;
                }

                if (data && data && data.documentTypeId) {
                    const documentTypeId = data.documentTypeId;
                    this._typeDocument.getById$(documentTypeId).subscribe(
                        (response) => {
                            const tipoDocument = response.name;
                            const totalEnTexto = this.convertirNumeroATexto(data.total);

                            const documentData = {
                                logo: 'https://i.postimg.cc/Y9fVScNR/logo-Inicio-UPe-U.png',
                                enterpriseName: 'EMPRESA SAC',
                                almacenAddress: 'Av. Siempre Viva 123',
                                almacenEmail: 'correo@empresa.com',
                                almacenPhone: '987654321',
                                enterpriseRUC: '20123456789',
                                serie: data.series,
                                number: data.number,
                                clientName: data.nameSocialReason,
                                clientRUC: data.documentNumber,
                                date: data.issueDate,
                                clientAddress: data.clientAddress || 'Sin dirección registrada',
                                exonerado: data.exemptAmount?.toFixed(2) || '0.00',
                                gravado: data.bi?.toFixed(2) || '0.00',
                                igv: data.igv?.toFixed(2) || '0.00',
                                total: data.total?.toFixed(2) || '0.00',
                                totalInWords: totalEnTexto,
                                tipoDocument: response.name, // ✅ Aquí se coloca el nombre del documento
                                detalle: data.details.map((item: any, index: number) => ({
                                    item: (index + 1).toString(),
                                    code: item.code || 'N/A',
                                    description: item.description,
                                    quantity: item.quantity.toString(),
                                    unit: item.unitMeasurementName || 'UND',
                                    unitPrice: item.unitPrice.toFixed(2),
                                    total: item.totalPrice.toFixed(2),
                                })),
                                qrCode: 'QR_DATA',
                            };
                            this._fileA4WarehouseService.downloadDocumentA4(documentData, tipoDocument);
                        },
                    );
                }
            },
        );
    }


    downloadTicket(categoryId: string) {
        this._categoryService.getById$(categoryId).subscribe(
            (data: any) => {
                if (data && data && data.documentTypeId) {
                    const documentTypeId = data.documentTypeId;


                    // ✅ Enviar `documentTypeId` en la petición y obtener el nombre
                    this._typeDocument.getById$(documentTypeId).subscribe(
                        (response) => {
                            // ✅ Usar el nombre obtenido en `tipoDocument`
                            const tipoDocument = response.name;

                            const totalEnTexto = this.convertirNumeroATexto(data.total);

                            const ticketData = {
                                logo: 'https://i.postimg.cc/Y9fVScNR/logo-Inicio-UPe-U.png',
                                vent_venta_tipo_doc_codigo: data.documentTypeId || '01',
                                vent_venta_serie: data.series || 'F001',
                                vent_venta_numero: data.number || '000001',
                                vent_venta_fecha: data.issueDate.split('T')[0] || '2025-01-28',
                                cliente: data.nameSocialReason || 'Cliente no especificado',
                                vent_venta_cliente_numero_documento: data.documentNumber || '00000000000',
                                cliente_direccion: data.clientAddress || 'Sin dirección registrada',
                                cliente_telefono: data.clientPhone || 'Sin teléfono',
                                vent_venta_qr: 'QR_DATA',
                                vent_venta_precio_cobrado: data.bi || '0.00',
                                vent_venta_igv: data.igv.toFixed(2) || '0.00',
                                vent_venta_precio_descuento_total: '0.00',
                                vent_venta_total: data.total.toFixed(2) || '0.00',
                                vent_venta_precio_cobrado_letras: totalEnTexto,

                                detalle: data.details.map((item: any) => ({
                                    vent_venta_detalle_producto: item.description || 'Producto',
                                    vent_venta_detalle_cantidad: item.quantity.toString(),
                                    vent_venta_detalle_precio_unitario: item.unitPrice.toFixed(2),
                                    vent_venta_detalle_precio: item.totalPrice.toFixed(2),
                                })),

                                venta_totales: {
                                    exonerado: data.exemptAmount.toFixed(2) || '0.00',
                                    gravado: data.bi.toFixed(2) || '0.00',
                                    inafecto: data.unaffectedAmount.toFixed(2) || '0.00',
                                },

                                almacen: {
                                    alm_almacen_direccion: data.storeAddress || 'Dirección del almacén no especificada',
                                },
                            };

                            this._fileTickedWarehouseService.downloadTicket(ticketData, tipoDocument);
                        },
                    );
                }
            }
        );
    }

    ngOnInit() {
        this.abcForms = abcForms;
        this.CargarDatos()

    }

    private CargarDatos() {
        this._typeDocument.getWithSearch$().subscribe((data) => {
            this.typeDocuments = data?.content || [];
        });
        this._storesService.getAll$().subscribe((data) => {
            this.stores = data?.content || [];
        });
    }
    public goEdit(id: string) {
        this.eventEdit.emit(id);
    }

    public goDelete(id:string) {
        this.eventDelete.emit(id);
    }

    getDocumentNameById(id: string): string {
        const doc = this.typeDocuments.find(doc => doc.id === id);
        return doc ? doc.name : 'No Disponible';
    }
    getStorestNameById(id: string): string {
        const doc = this.stores.find(doc => doc.id === id);
        return doc ? doc.name : 'No Disponible';
    }
    convertirNumeroATexto(num: number): string {
        const unidades = [
            'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
            'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'
        ];
        const decenas = [
            '', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'
        ];
        const centenas = [
            '', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'
        ];

        const parteEntera = Math.floor(num); // Obtiene solo la parte entera
        let parteDecimal = Math.round((num % 1) * 100); // Obtiene la parte decimal en XX/100

        // Convertir la parte entera a texto
        let texto = this.convertirParteEntera(parteEntera);

        // Convertir la primera letra a mayúscula
        texto = texto.charAt(0).toUpperCase() + texto.slice(1);

        // Formatear parte decimal como XX/100
        let decimalTexto = parteDecimal.toString().padStart(2, '0') + '/100';

        // **Retorna solo una vez la parte entera y decimal correctamente**


        return `${texto} y ${decimalTexto}`;
    }

// Nueva función para evitar llamadas recursivas con la parte decimal
    private convertirParteEntera(num: number): string {
        const unidades = [
            'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
            'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'
        ];
        const decenas = [
            '', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'
        ];
        const centenas = [
            '', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'
        ];

        let texto = '';

        if (num === 0) {
            return "Cero";
        }
        if (num < 20) {
            return unidades[num];
        }
        if (num < 100) {
            const decena = Math.floor(num / 10);
            const unidad = num % 10;
            return (num >= 21 && num <= 29) ? `veinti${unidad > 0 ? unidades[unidad] : ''}`
                : decenas[decena] + (unidad > 0 ? ' y ' + unidades[unidad] : '');
        }
        if (num < 1000) {
            const centena = Math.floor(num / 100);
            const resto = num % 100;
            return (num === 100) ? 'Cien'
                : (centenas[centena] === 'cien' ? 'ciento' : centenas[centena]) + (resto > 0 ? ' ' + this.convertirParteEntera(resto) : '');
        }
        if (num < 10000) {
            const mil = Math.floor(num / 1000);
            const resto = num % 1000;
            return (mil === 1 ? 'Mil' : this.convertirParteEntera(mil) + ' mil') + (resto > 0 ? ' ' + this.convertirParteEntera(resto) : '');
        }
        if (num < 1000000) {
            const cienMil = Math.floor(num / 1000);
            const resto = num % 1000;
            return this.convertirParteEntera(cienMil) + ' mil' + (resto > 0 ? ' ' + this.convertirParteEntera(resto) : '');
        }
        if (num === 1000000) {
            return 'Un millón';
        }

        return texto;
    }

}
