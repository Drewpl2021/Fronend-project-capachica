import { Injectable } from "@angular/core";
import * as pdfMakeModule from "pdfmake/build/pdfmake";
import * as pdfFontsModule from "pdfmake/build/vfs_fonts";

// Resuelve las exportaciones predeterminadas o el módulo completo
const pdfMake = pdfMakeModule.default || pdfMakeModule;
const pdfFonts = pdfFontsModule.default || pdfFontsModule;

// Asigna directamente las fuentes al objeto pdfMake
pdfMake.vfs = pdfFonts.vfs;

@Injectable({
    providedIn: "root",
})
export class FileTickedSaleService {
    /**
     * Convierte una URL de imagen a Base64.
     * @param url URL de la imagen
     * @returns Promesa que resuelve con la imagen en Base64
     */
    convertUrlToBase64(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        resolve(reader.result as string);
                    } else {
                        reject("Error al convertir la imagen a Base64");
                    }
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.onerror = () => reject("Error al cargar la imagen desde la URL");
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.send();
        });
    }

    /**
     * Genera y descarga un ticket en formato PDF con imagen en la cabecera.
     * @param data Datos del ticket
     * @param tipoDocument Tipo de documento (ej. BOLETA, FACTURA)
     */
    async downloadTicket(data: any, tipoDocument: string, companyName: string, companyRuc: string) {
        // Convertir logo a Base64
        const logoBase64 = await this.convertUrlToBase64(
            data.logo
        );

        const ticket = {
            content: [
                {
                    layout: "noBorders",
                    table: {
                        widths: ["*", "auto", "*"],
                        body: [
                            [{ text: "" }, { image: logoBase64, width: 50, alignment: "center" }, { text: "" }],
                            [
                                { text: companyName + " - " + companyRuc, style: ["title"], colSpan: 3, alignment: "center" },
                                {},
                                {},
                            ],
                            [
                                { text: data.almacen.alm_almacen_direccion, style: ["small"], colSpan: 3, alignment: "center" },
                                {},
                                {},
                            ],
                            [
                                { text: "**********************************************************", style: ["small"], colSpan: 3, alignment: "center" },
                                {},
                                {},
                            ],
                        ],
                    },
                },
                { text: tipoDocument, style: ["title", "horiAlignCenter"] },
                { text: `${data.vent_venta_serie} - ${data.vent_venta_numero}`, style: ["title", "horiAlignCenter"] },
                { text: "**********************************************************", style: ["small", "horiAlignCenter"] },
                {
                    layout: "noBorders",
                    table: {
                        body: [
                            [{ text: "FECHA DE EMISIÓN:", style: "tableTitle" }, { text: data.vent_venta_fecha, style: "small" }],
                            [{ text: "CLIENTE:", style: "tableTitle" }, { text: data.cliente, style: "small" }],
                            [{ text: "DOCUMENTO IDENT.:", style: "tableTitle" }, { text: data.vent_venta_cliente_numero_documento, style: "small" }],
                            [{ text: "DIRECCIÓN:", style: "tableTitle" }, { text: data.cliente_direccion, style: "small" }],
                            [{ text: "TELÉFONO:", style: "tableTitle" }, { text: data.cliente_telefono, style: "small" }],
                        ],
                    },
                },
                { text: "**********************************************************", style: ["small", "horiAlignCenter"] },
                {
                    layout: "lightHorizontalLines",
                    table: {
                        widths: [95, "auto", "auto", "auto"],
                        body: [
                            [{ text: "DESCRIPCIÓN", style: "tableTitle" }, { text: "CANT.", style: "tableTitle" }, { text: "P. UNIT.", style: "tableTitle" }, { text: "IMPORTE", style: "tableTitle" }],
                            ...data.detalle.map((ed) => [
                                { text: ed.vent_venta_detalle_producto, style: "small" },
                                { text: ed.vent_venta_detalle_cantidad, style: "small" },
                                { text: ed.vent_venta_detalle_precio_unitario, style: "small" },
                                { text: ed.vent_venta_detalle_precio, style: "small" },
                            ]),
                        ],
                    },
                },
                { text: "**********************************************************", style: ["small", "horiAlignCenter"] },
                {
                    layout: "noBorders",
                    table: {
                        widths: ["*", "auto"],
                        body: [
                            [{ text: "TOTAL A PAGAR: S/.", style: "small", alignment: "right" }, { text: data.vent_venta_precio_cobrado, style: "small", alignment: "right" }],
                            [{ text: "IGV - 18%: S/.", style: "small", alignment: "right" }, { text: data.vent_venta_igv, style: "small", alignment: "right" }],
                            [{ text: "TOTAL DESCUENTO: S/.", style: "small", alignment: "right" }, { text: data.vent_venta_precio_descuento_total, style: "small", alignment: "right" }],
                            [{ text: "TOTAL IMPORTE: S/.", style: "small", alignment: "right" }, { text: data.vent_venta_total, style: "small", alignment: "right" }],
                        ],
                    },
                },
                { text: "**********************************************************", style: ["small", "horiAlignCenter"] },
                { text: "SON: " + data.vent_venta_precio_cobrado_letras, style: ["small", "horiAlignCenter"] },
                '\n',
                { qr: data.vent_venta_qr, fit: "80", style: ["horiAlignCenter"] },
            ],
            styles: {
                tableTitle: { fontSize: 8, bold: true },
                title: { fontSize: 10, bold: true },
                small: { fontSize: 8 },
                horiAlignCenter: { alignment: "center" },
            },
            pageSize: { width: 240.28, height: "auto" },
            pageMargins: [10, 25, 10, 25],
        };

        pdfMake.createPdf(ticket).open();
    }
}
