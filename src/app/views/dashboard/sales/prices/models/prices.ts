export class Prices {
    id?: string | null;
    name?: string | null;
    description?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    store?: { id: string; name?: string };
    state?: boolean | null;
    companyId?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;

}

export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: Prices[];
    totalElements?: number;
}

export class PricesFilter {
    concatenatedFields?: string;
}
