export class DocumentTypes {
    id?: string | null;
    name?: string | null;
    code?: string | null;
    state?: boolean | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}

export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: DocumentTypes[];
    totalElements?: number;
}

export class DocumentTypesFilter {
    concatenatedFields?: string;
}
