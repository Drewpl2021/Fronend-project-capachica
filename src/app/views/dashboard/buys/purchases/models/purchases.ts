export class Purchases {
    id?: string | null;
    bi?: number | null;
    companyId?: string | null;
    createdAt?: string | null;
    currency?: string | null;
    deletedAt?: string | null;
    documentTypeId?: string | null;
    exemptAmount?: number | null;
    igv?: number | null;
    issueDate?: string | null;
    number?: string | null;
    series?: string | null;
    storeId?: string | null;
    supplierId?: string | null;
    nameSocialReason?: string | null;
    documentNumber?: string | null;
    total?: number | null;
    unaffectedAmount?: number | null;
    updatedAt?: string | null;
    purchaseDetails?: Array<{
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
export class Company {
    id?: string | null;
    lastName?: string | null;
    firstName?: string | null;
    address?: string | null;
    email?: string | null;
    phone?: string | null;
    documentType?:  { id: string; name?: string };
    idEntityType?:  { id: string; name?: string };
    company?: {
        logo?: string
        companyName?: string
        address?: string
        phoneNumber?: string
        email?: string
        ruc?: string
    };
    serviceEntities?: { service: { id: string; name?: string } }[];
    state?: boolean | null;
    companyId?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
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
        imageUrl?: string;
        productPresentations: [
            { unitMeasurement: { id: string; name: string; factor: string;} },
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
    content?: Purchases[];
    totalElements?: number;
}

export class PurchasesFilter {
    concatenatedFields?: string;
}
