export class ContAsientos {
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

export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: ContAsientos[];
    totalElements?: number;
}

export class CategoryFilter {
    concatenatedFields?: string;
}
