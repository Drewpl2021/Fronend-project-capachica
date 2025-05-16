export class Payment {
    id?: string | null;
    code?: string | null;
    total?: number | null;
    bi?: number | null;
    igv?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
    deleted_at?: string | null;
}

export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: Payment[];
    totalElements?: number;
}

export class PaymentFilter {
    concatenatedFields?: string;
}
