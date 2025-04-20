import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { abcForms } from '../../../../../../../environments/generals';
import {Company, Purchases} from '../../models/purchases';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { TypeDocument} from "../../../../accounting/typeDocument/models/type-document";
import { TypeDocumentService} from "../../../../../../providers/services/accounting/type-document.service";
import { Stores} from "../../../../accounting/stores/models/stores";
import { StoresService} from "../../../../../../providers/services/accounting/stores.service";
import { FileTickedService} from "../../../../../../shared/files/file-ticked.service";
import { FileA4Service} from "../../../../../../shared/files/file-a4.service";
import { PurchasesService} from "../../../../../../providers/services/buys/purchases.service";
import {CompanyUserService} from "../../../../../../providers/services/setup/company-user.service";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-purchases-list',
    standalone: true,
    imports: [MatTooltipModule,FormsModule, CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, DatePipe],
    template: `
        <br>
        <div class="table-container">
            <table class="custom-table">
                <thead>
                <tr class="bg-primary-600 text-white">
                    <th class="w-1/9 table-head text-center border-r">#</th>
                    <th class="w-1/9 table-header text-center border-r">Almacén</th>
                    <th class="w-1/9 table-header text-center border-r">Tipo de Documento</th>
                    <th class="w-1/9 table-header text-center border-r">Razon Social</th>
                    <th class="w-1/9 table-header text-center border-r">N° de Doc.</th>
                    <th class="w-1/9 table-header text-center border-r">Serie</th>
                    <th class="w-1/9 table-header text-center border-r">Numero</th>
                    <th class="w-1/9 table-header text-center border-r">B.I.</th>
                    <th class="w-1/9 table-header text-center border-r">I.G.V.</th>
                    <th class="w-1/9 table-header text-center border-r">Total</th>
                    <th class="w-1/9 table-header text-center border-r">Fecha Emisión</th>
                    <th class="w-1/9 table-header text-center border-r">Acciones</th>
                </tr>
                </thead>
                <tbody class="bg-white">
                    @for (purchases of purchases; track purchases.id; let idx = $index) {
                        <tr class="hover:bg-gray-100">
                            <td class="w-1/9 p-2 text-center border-b">
                                {{ idx + 1 }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ getStorestNameById(purchases.storeId) }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ getDocumentNameById(purchases.documentTypeId) }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ purchases.nameSocialReason }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ purchases.documentNumber }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ purchases.series }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ purchases.number }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ purchases.bi }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ purchases.igv }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ purchases.total }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                {{ purchases.createdAt | date:'dd/MM/yyyy HH:mm:ss' }}
                            </td>
                            <td class="w-1/9 p-2 text-center border-b text-sm">
                                <div class="flex justify-center space-x-3">
                                    <mat-icon
                                        matTooltip="Ver Detalles"
                                        matTooltipPosition="above"
                                        (click)="goEdit(purchases.id)"
                                        class="text-amber-400 hover:text-amber-500 cursor-pointer">
                                        visibility
                                    </mat-icon>

                                    <mat-icon
                                        matTooltip="Descargar Ticket"
                                        matTooltipPosition="above"
                                        (click)="downloadTicket(purchases.id)"
                                        class="text-green-500 hover:text-green-700 cursor-pointer">
                                        ballot
                                    </mat-icon>

                                    <mat-icon
                                        matTooltip="Generar documento A4"
                                        matTooltipPosition="above"
                                        (click)="generateDocumentA4(purchases.id)"
                                        class="text-green-500 hover:text-green-700 cursor-pointer">
                                        insert_drive_file
                                    </mat-icon>

                                    <mat-icon
                                        matTooltip="Eliminar Compra"
                                        matTooltipPosition="above"
                                        (click)="goDelete(purchases.id)"
                                        class="text-rose-500 hover:text-rose-600 cursor-pointer">
                                        delete_sweep
                                    </mat-icon>
                                </div>
                            </td>
                        </tr>}
                    @empty {
                        <tr>
                            <td colspan="9" class="text-center">
                                Sin Contenido
                            </td>
                        </tr>}
                </tbody>
            </table>
            <!--<div class="mb-3" style="display: flex; flex-direction: column; flex: 2;">

                <div *ngIf="validLogoUrl">
                    <img [src]="validLogoUrl" alt="Logo de la empresa" class="img-fluid"
                         style="max-width: 200px; margin-top: 10px; border: 1px solid #ddd; padding: 5px;"/>
                </div>
            </div>-->

        </div><br>
    `,
})
export class PurchasesListComponent implements OnInit {
    abcForms: any;
    @Input() purchases: Purchases[] = [];
    @Output() eventEdit = new EventEmitter<string>();
    @Output() eventDelete = new EventEmitter<string>();
    typeDocuments: TypeDocument[] = [];
    stores: Stores[] = [];
    companies: Company[] = [];
    public validLogoUrl: string = '';

    constructor(
        private _typeDocument: TypeDocumentService,
        private _storesService: StoresService,
        private _companyUserService: CompanyUserService,
        private _fileTickedService:FileTickedService,
        private _fileA4Service: FileA4Service,
        private _purchasesService: PurchasesService,
        ) {}
    generateDocumentA4(purchasesId: string): void {
        this._purchasesService.getById$(purchasesId).subscribe(
            (data: any) => {

                if (data && data.purchase && data.purchase.documentTypeId) {
                    const documentTypeId = data.purchase.documentTypeId;
                    this._typeDocument.getById$(documentTypeId).subscribe(
                        (response) => {
                            const tipoDocument = response.name;
                            const totalEnTexto = this.convertTextNumber(data.purchase.total);
                            const companyRuc = this.companies.length > 0 ? this.companies[0].company.ruc : '20123456789';
                            const companyPhoneNumber = this.companies.length > 0 ? this.companies[0].company.phoneNumber : '987654321';
                            const companyAddress = this.companies.length > 0 ? this.companies[0].company.address : 'Av. Siempre Viva 123';
                            const companyEmail = this.companies.length > 0 ? this.companies[0].company.email : 'correo@emprea.com';
                            const companyName = this.companies.length > 0 ? this.companies[0].company.companyName : 'EMPRESA SAC';
                            const documentData = {
                                logo: this.validLogoUrl || 'https://i.postimg.cc/Y9fVScNR/logo-Inicio-UPe-U.png',
                                enterpriseName: companyName,
                                almacenAddress: companyAddress,
                                almacenEmail: companyEmail,
                                almacenPhone: companyPhoneNumber,
                                enterpriseRUC: companyRuc,
                                serie: data.purchase.series,
                                number: data.purchase.number,
                                clientName: data.purchase.nameSocialReason,
                                clientRUC: data.purchase.documentNumber,
                                date: data.purchase.issueDate,
                                clientAddress: data.purchase.clientAddress || 'Sin dirección registrada',
                                exonerado: data.purchase.exemptAmount?.toFixed(2) || '0.00',
                                gravado: data.purchase.bi?.toFixed(2) || '0.00',
                                igv: data.purchase.igv?.toFixed(2) || '0.00',
                                total: data.purchase.total?.toFixed(2) || '0.00',
                                totalInWords: totalEnTexto,
                                tipoDocument: response.name,
                                detalle: data.purchase.details.map((item: any, index: number) => ({
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
                            this._fileA4Service.downloadDocumentA4(documentData, tipoDocument);
                        },
                    );
                }
            },
        );
    }

    downloadTicket(purchasesId: string) {
        this._purchasesService.getById$(purchasesId).subscribe(
            (data: any) => {
                if (data && data.purchase && data.purchase.documentTypeId) {
                    const documentTypeId = data.purchase.documentTypeId;
                    this._typeDocument.getById$(documentTypeId).subscribe(
                        (response) => {
                            const tipoDocument = response.name;
                            const totalEnTexto = this.convertTextNumber(data.purchase.total);
                            const companyRuc = this.companies.length > 0 ? this.companies[0].company.ruc : '20123456789';
                            const companyPhoneNumber = this.companies.length > 0 ? this.companies[0].company.phoneNumber : '987654321';
                            const companyAddress = this.companies.length > 0 ? this.companies[0].company.address : 'Av. Siempre Viva 123';
                            const companyEmail = this.companies.length > 0 ? this.companies[0].company.email : 'correo@emprea.com';
                            const companyName = this.companies.length > 0 ? this.companies[0].company.companyName : 'EMPRESA SAC';
                            const ticketData = {
                                logo: this.validLogoUrl || 'https://i.postimg.cc/Y9fVScNR/logo-Inicio-UPe-U.png',
                                vent_venta_tipo_doc_codigo: data.purchase.documentTypeId,
                                vent_venta_serie: data.purchase.series ,
                                vent_venta_numero: data.purchase.number ,
                                vent_venta_fecha: data.purchase.issueDate.split('T')[0],
                                cliente: data.purchase.nameSocialReason ,
                                vent_venta_cliente_numero_documento: data.purchase.documentNumber,
                                cliente_direccion: data.purchase.clientAddress || 'Sin dirección registrada',
                                cliente_telefono: data.purchase.clientPhone || 'Sin teléfono',
                                vent_venta_qr: 'QR_DATA',
                                vent_venta_precio_cobrado: data.purchase.bi || '0.00',
                                vent_venta_igv: data.purchase.igv?.toFixed(2) || '0.00',
                                vent_venta_precio_descuento_total: '0.00',
                                vent_venta_total: data.purchase.total?.toFixed(2) || '0.00',
                                vent_venta_precio_cobrado_letras: totalEnTexto,
                                detalle: data.purchase.details.map((item: any) => ({
                                    vent_venta_detalle_producto: item.description || 'Producto',
                                    vent_venta_detalle_cantidad: item.quantity.toString(),
                                    vent_venta_detalle_precio_unitario: item.unitPrice.toFixed(2),
                                    vent_venta_detalle_precio: item.totalPrice.toFixed(2),
                                })),
                                venta_totales: {
                                    exonerado: data.purchase.exemptAmount?.toFixed(2) || '0.00',
                                    gravado: data.purchase.bi?.toFixed(2) || '0.00',
                                    inafecto: data.purchase.unaffectedAmount?.toFixed(2) || '0.00',
                                },
                                almacen: {
                                    alm_almacen_direccion: companyAddress || 'Dirección del almacén no especificada',
                                },
                            };
                            this._fileTickedService.downloadTicket(ticketData, tipoDocument, companyName, companyRuc);
                        },
                    );
                }
            },
        );
    }
    ngOnInit() {
        this.abcForms = abcForms;
        this.uploadData()
    }
    private uploadData() {
        this._typeDocument.getWithSearch$().subscribe((data) => {
            this.typeDocuments = data?.content || [];
        });
        this._storesService.getAll$().subscribe((data) => {
            this.stores = data?.content || [];
        });
        this._companyUserService.getAllToken$().subscribe((data) => {
            // Guardamos los datos en la variable companies
            this.companies = Array.isArray(data) ? data : [data];


            // Extraer y asignar el logo de la primera compañía (o ajustarlo para cada compañía)
            if (this.companies.length > 0 && this.companies[0]?.company?.logo) {
                this.validateAndSetLogoUrl(this.companies[0].company.logo);
            } else {
                console.warn('No se encontró la URL del logo.');
                this.validLogoUrl = ''; // Evita mostrar imágenes rotas
            }
        });
    }
    public validateAndSetLogoUrl(url: string): void {
        if (url && url.startsWith('http')) {
            this.validLogoUrl = url;
        } else {
            this.validLogoUrl = ''; // No mostrar imagen si no es una URL válida
        }
    }
    getDocumentNameById(id: string): string {
        const doc = this.typeDocuments.find(doc => doc.id === id);
        return doc ? doc.name : 'No Disponible';
    }
    getStorestNameById(id: string): string {
        const doc = this.stores.find(doc => doc.id === id);
        return doc ? doc.name : 'No Disponible';
    }
    public goEdit(id: string) {
        this.eventEdit.emit(id);
    }
    public goDelete(id: string) {
        this.eventDelete.emit(id);
    }
    convertTextNumber(num: number): string {
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
        let texto = this.convertPartThirdPart(parteEntera);
        texto = texto.charAt(0).toUpperCase() + texto.slice(1);
        let decimalTexto = parteDecimal.toString().padStart(2, '0') + '/100';
        return `${texto} y ${decimalTexto} SOLES`;
    }
    private convertPartThirdPart(num: number): string {
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
            return (num >= 21 && num <= 29) ? `veinti${unidad > 0 ? unidades[unidad] : ''}` : decenas[decena] + (unidad > 0 ? ' y ' + unidades[unidad] : '');
        }
        if (num < 1000) {
            const centena = Math.floor(num / 100);
            const resto = num % 100;
            return (num === 100) ? 'Cien' : (centenas[centena] === 'cien' ? 'ciento' : centenas[centena]) + (resto > 0 ? ' ' + this.convertPartThirdPart(resto) : '');
        }
        if (num < 10000) {
            const mil = Math.floor(num / 1000);
            const resto = num % 1000;
            return (mil === 1 ? 'Mil' : this.convertPartThirdPart(mil) + ' mil') + (resto > 0 ? ' ' + this.convertPartThirdPart(resto) : '');
        }
        if (num < 1000000) {
            const cienMil = Math.floor(num / 1000);
            const resto = num % 1000;
            return this.convertPartThirdPart(cienMil) + ' mil' + (resto > 0 ? ' ' + this.convertPartThirdPart(resto) : '');
        }
        if (num === 1000000) {
            return 'Un millón';
        }
        return texto;
    }
}

