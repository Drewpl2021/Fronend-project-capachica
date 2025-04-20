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
    content?: TypeAffectation[];
    totalElements?: number;
}

export class TypeAffectationFilter {
    concatenatedFields?: string;
}
