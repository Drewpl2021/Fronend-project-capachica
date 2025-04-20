export class Stores {
    id?: string | null;
    name?: string | null;
    description?: string | null;
    code?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    state?: boolean | null;
    companyId?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}

export class SeriesFlow {
    id?: string | null;
    serial?: string | null;
    seriesGroup?: string | null;
    userId?: { id: string; name?: string };
    store?: { id: string; name?: string };
    typeDocument?: { id: string; name?: string };
    state?: boolean | null;
    companyId?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}

export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: Stores[];
    totalElements?: number;
}

export class StoresFilter {
    concatenatedFields?: string;
}
