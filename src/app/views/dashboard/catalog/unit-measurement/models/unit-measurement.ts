export class UnitMeasurement {
    companyId?: string;
    createdAt?: string;
    deletedAt?: string | null;
    description?: string;
    id?: string;
    name?: string;
    state?: boolean;
    sunatCode?: string;
    symbolPrint?: string;
    updatedAt?: string;
}

export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: UnitMeasurement[];
    totalElements?: number;
}

export class UnitMeasurementFilter {
    description?: string;
}
