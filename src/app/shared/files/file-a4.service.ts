import { Injectable } from '@angular/core';
import * as pdfMakeModule from 'pdfmake/build/pdfmake';
import * as pdfFontsModule from 'pdfmake/build/vfs_fonts';

const pdfMake = pdfMakeModule.default || pdfMakeModule;
const pdfFonts = pdfFontsModule.default || pdfFontsModule;
pdfMake.vfs = pdfFonts.vfs;

@Injectable({
    providedIn: 'root',
})
export class FileA4Service {
    /**
     * Convierte una URL de imagen a Base64
     * @param url URL de la imagen
     * @returns Promesa que resuelve con la imagen en Base64
     */
    convertUrlToBase64(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                const reader = new FileReader();
                reader.onloadend = function () {
                    if (reader.result) {
                        resolve(reader.result as string);
                    } else {
                        reject('Error al convertir la imagen a Base64');
                    }
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.onerror = function () {
                reject('Error al cargar la imagen desde la URL');
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        });
    }
    /**
     * Genera el documento PDF en formato A4
     * @param data Datos necesarios para construir el documento
     */
    async downloadDocumentA4(dummyData:any, tipoDocument: string) {
        const logoBase64 = await this.convertUrlToBase64(
            dummyData.logo
        );
        const pdfDefinition = {
            //watermark: { text: 'Documento de Prueba', color: 'red', opacity: 0.3, bold: true, italics: false },
            content: [
                {
                    layout: 'noBorders',
                    table: {
                        widths: ['*', 300, '*'],
                        body: [
                            [
                                [{ image: logoBase64, width: 100, alignment: 'left' }],
                                [
                                    {
                                        layout: 'noBorders',
                                        table: {
                                            widths: ['*'],
                                            body: [
                                                [{ text: dummyData.enterpriseName, style: ['bigTitle', 'nerita', 'horiAlignCenter'] }],
                                                [{ text: dummyData.almacenAddress, style: ['title', 'horiAlignCenter'] }],
                                                [{ text: dummyData.almacenEmail, style: ['title', 'horiAlignCenter'] }],
                                                [{ text: dummyData.almacenPhone, style: ['title', 'horiAlignCenter'] }],
                                            ],
                                        },
                                    },
                                ],
                                [
                                    {
                                        layout: 'noBorders',
                                        table: {
                                            widths: ['*'],
                                            body: [
                                                [{ text: `R.U.C: ${dummyData.enterpriseRUC}`, style: ['title', 'horiAlignCenter', 'nerita'] }],
                                                [{ text: tipoDocument, style: ['bigTitle', 'nerita', 'horiAlignCenter', 'backgrounds'] }], // ✅ Ahora usa `tipoDocument`
                                                [{ text: `${dummyData.serie} - ${dummyData.number}`, style: ['title', 'horiAlignCenter', 'nerita'] }],
                                            ],
                                        },
                                    },
                                ],
                            ],
                        ],
                    },
                },
                '\n',
                {
                    layout: 'noBorders',
                    table: {
                        widths: ['auto', '*'],
                        body: [
                            [{ text: 'SEÑOR(ES):', style: 'tableTitle' }, { text: dummyData.clientName, style: 'small' }],
                            [{ text: 'RUC:', style: 'tableTitle' }, { text: dummyData.clientRUC, style: 'small' }],
                            [{ text: 'FECHA:', style: 'tableTitle' }, { text: dummyData.date, style: 'small' }],
                            [{ text: 'DIRECCIÓN:', style: 'tableTitle' }, { text: dummyData.clientAddress, style: 'small' }],
                        ],
                    },
                },
                '\n',
                {
                    layout: 'lightHorizontalLines',
                    table: {
                        widths: ['auto', 'auto', 278, 'auto', 'auto', 'auto', 'auto'],
                        body: [
                            [
                                { text: 'ITEM', style: 'tableHeader' },
                                { text: 'CÓDIGO', style: 'tableHeader' },
                                { text: 'DESCRIPCIÓN', style: 'tableHeader' },
                                { text: 'CANT.', style: 'tableHeader' },
                                { text: 'U.MED.', style: 'tableHeader' },
                                { text: 'P.UNIT.', style: 'tableHeader' },
                                { text: 'TOTAL', style: 'tableHeader' },
                            ],
                            ...dummyData.detalle.map((item: any) => [
                                { text: item.item, style: 'small', alignment: 'center' },
                                { text: item.code, style: 'small' },
                                { text: item.description, style: 'small' },
                                { text: item.quantity, style: 'small', alignment: 'right' },
                                { text: item.unit, style: 'small', alignment: 'right' },
                                { text: item.unitPrice, style: 'small', alignment: 'right' },
                                { text: item.total, style: 'small', alignment: 'right' },
                            ]),
                        ],
                    },
                },
                '\n',
                {
                    layout: 'noBorders',
                    table: {
                        widths: ['*', 'auto'],
                        body: [
                            [
                                { text: 'SON: ' + dummyData.totalInWords + ' SOLES', style: ['small', 'nerita'] },
                                {
                                    layout: 'noBorders',
                                    table: {
                                        widths: ['*', 'auto'],
                                        body: [
                                            [{ text: 'EXONERADA: S/.', style: 'small', alignment: 'right' }, { text: dummyData.exonerado, style: 'small', alignment: 'right' }],
                                            [{ text: 'GRAVADA: S/.', style: 'small', alignment: 'right' }, { text: dummyData.gravado, style: 'small', alignment: 'right' }],
                                            [{ text: 'IGV: S/.', style: 'small', alignment: 'right' }, { text: dummyData.igv, style: 'small', alignment: 'right' }],
                                            [{ text: 'TOTAL: S/.', style: 'small', alignment: 'right' }, { text: dummyData.total, style: 'small', alignment: 'right' }],
                                        ],
                                    },
                                },
                            ],
                        ],
                    },
                },
                '\n',
                { qr: dummyData.qrCode, fit: '90', alignment: 'center' },
            ],
            styles: {
                tableHeader: { bold: true, fontSize: 9, fillColor: '#00b0f0', color: '#ffffff' },
                tableTitle: { fontSize: 8, bold: true },
                title: { fontSize: 9 },
                bigTitle: { fontSize: 12 },
                small: { fontSize: 8 },
                nerita: { bold: true },
                horiAlignCenter: { alignment: 'center' },
                backgrounds: { fillColor: '#e9ecef' },
            },
            pageSize: 'A4',
            pageMargins: [25, 30, 25, 25],
        };

        pdfMake.createPdf(pdfDefinition).open();
    }
}
