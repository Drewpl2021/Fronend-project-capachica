export class accountingAccountClass {
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
    content?: accountingAccountClass[];
    totalElements?: number;
}

export class accountingAccountClassFilter {
    concatenatedFields?: string;
}
