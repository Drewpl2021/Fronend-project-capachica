export class ProductDynamic {
    id?: string | null;
    status?: boolean | null;
    companyId?: string | null;
    product?: {
        id: string;
        name?: string;
        brand?: string;
        productPresentations: [
            { unitMeasurement: { id: string; name: string; } },
        ],
        stockControl?: boolean | null;

    };
    store?: { id: string; name?: string };
    typeAffectation?: { id: string; name?: string };
    accountingDynamics?: { id: string; name?: string };
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}


export class accountingDynamic {
    id?: string | null;
    name?: string | null;
    description?: string | null;
    code?: string | null;
    percentageIgv?: number | null;
    status?: boolean;
    area?: { id: string; name?: string };
    accountingPlan?: { id: string; name?: string };
    subAccountingPlan?: { id: string; name?: string };
    accountingDynamicsDetails?: Array<{
        id?: string;
        code?: string;
        status?: boolean;
        accountingPlan?: { id: string; name?: string };
        subAccountingPlan?: { id: string; name?: string };
        area?: { id: string; name?: string };
        createdAt?: string;
        updatedAt?: string;
        deletedAt?: string | null;
    }>;
    createdAt?: string | null;
    updatedAt?: string | null;
}
export class Stores {
    id?: string | null;
    name?: string | null;
    description?: string | null;
    code?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    state?: boolean | null;
    companyId?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}

export class TypeAffectation {
    id?: string;
    name?: string;
    description?: string;
    code?: string;
    status?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}


export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: ProductDynamic[];
    totalElements?: number;
}

export class ProductDynamicFilter {
    concatenatedFields?: string;
}
