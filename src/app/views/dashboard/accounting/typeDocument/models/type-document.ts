export class TypeDocument {
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
    content?: TypeDocument[];
    totalElements?: number;
}

export class TypeDocumentFilter {
    concatenatedFields?: string;
}
