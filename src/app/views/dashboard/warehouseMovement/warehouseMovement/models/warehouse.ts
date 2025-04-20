export class Category {
    id?: string | null;
    name?: string | null;
    description?: string | null;
    code?: string | null;
    state?: boolean | null;
    companyId?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}
export class SerialFlows {
    id?: string | null;
    serial?: string | null;
    seriesGroup?: number | null;
    store?:  { id: string; name?: string };

}

export class Entities {
    id?: string | null;
    nameSocialReason?: string | null;
    documentNumber?: string | null;
    address?: string | null;
    email?: string | null;
    phone?: string | null;
    documentType?:  { id: string; name?: string };
    idEntityType?:  { id: string; name?: string };
    serviceEntities?: { service: { id: string; name?: string } }[];
    state?: boolean | null;
    companyId?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}
export class Warehouse {
    id?: string | null;
    bi?: number | null;
    companyId?: string | null;
    createdAt?: string | null;
    createdBy?: string | null;
    currency?: string | null;
    deletedAt?: string | null;
    detraction?: string | null;
    documentTypeId?: string | null;
    exchangeRate?: number | null;
    exemptAmount?: number | null;
    freeAmount?: number | null;
    igv?: number | null;
    issueDate?: string | null;
    operationType?: string | null;
    number?: string | null;
    retentionAmount?: number | null;
    series?: string | null;
    storeId?: string | null;
    nameSocialReason?: string | null;
    documentNumber?: string | null;
    supplierId?: string | null;
    total?: number | null;
    unaffectedAmount?: number | null;
    updatedAt?: string | null;
    updatedBy?: string | null;
    saleDetails?: Array<{
        productId: string;
        description: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        igv: number;
        lots: Array<{ codigo: string; cantidad: number; fechaFabricacion: string; fechaCaducidad: string }>;
        series: Array<{ serie: string }>;
    }>;
}


export class Lots {
    lotCode?: string;
    amount?: string;
    remainingAmount?: string;
    manufactureDate?: string;
    expirationDate?: string;
    manufactureDateFormatted?: string;
    expirationDateFormatted?: string;
}
export class EntityTypes {
    id?: string | null;
    name?: string | null;
    code?: string | null;
    state?: boolean | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}

export class ProductDynamic {
    id?: string | null;
    status?: boolean | null;
    companyId?: string | null;
    product?: {
        id: string;
        name?: string;
        brand?: string;
        productPresentations: [{
            unitMeasurement: { id: string; name: string; },
            pricesDetail: [{ id: string; name: string; price: number; }]
        },
        ],
        minimumStock?: string;
        stockControl?: boolean | null;
        serialControl?: boolean | null;
        batchControl?: boolean | null;
    };
    store?: { id: string; name?: string };
    typeAffectation?: { id: string; name?: string };
    accountingDynamics?: { id: string; name?: string };
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}

export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: Category[];
    totalElements?: number;
}

export class CategoryFilter {
    concatenatedFields?: string;
}
