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

