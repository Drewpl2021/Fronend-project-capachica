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
export class AccountingPlan {
    id?: string;
    name?: string;
    description?: string;
    contAsientoClass?: string;
    contAsientoAccount?: number;
    contAsientoLevel?: string;
    parentAccountingPlan?: string;
    companyId?: string;
    children?: AccountingPlan[] = [];
    state?: boolean;
    collapse?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}
export class Areas {
    id?: string;
    name?: string;
    description?: string;
    code?: string;
    areaLevel?: number;
    parentAreaId?: string;
    companyId?: string;
    children?: Areas[] = [];
    status?: boolean;
    collapse?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}


export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: accountingDynamic[];
    totalElements?: number;
}

export class accountingDynamicFilter {
    concatenatedFields?: string;
}
