export class PaymentsType {
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
    content?: PaymentsType[];
    totalElements?: number;
}

export class PaymentsTypeFilter {
    concatenatedFields?: string;
}
