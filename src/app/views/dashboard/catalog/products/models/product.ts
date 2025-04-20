export class Product {
    id?: string | null;
    name?: string | null;
    code?: string | null;
    description?: string | null;
    brand?: string | null;
    imageUrl?: string | null;
    minimumStock?: number | null;
    category?: { id: string; name?: string };
    unitMeasurement?: { id: string; name?: string };
    productPresentations?: Array<{
        id?: string;
        factor?: string;
        unitMeasurement?: { id: string; name?: string };
        createdAt?: string;
        updatedAt?: string;
        deletedAt?: string | null;
    }>;
    stockControl?: boolean;
    batchControl?: boolean;
    serialControl?: boolean;
    prescriptionRequired?: boolean;
    isService?: boolean;
    state?: boolean;
    createdAt?: string | null;
    updatedAt?: string | null;
}
export class UnitMeasurent {
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
export class Category {
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
    content?: Product[];
    totalElements?: number;
}

export class ProductFilter {
    concatenatedFields?: string;
}
