export class PriceDetail {
    id?: string | null;
    name?: string | null;
    description?: string | null;
    code?: string | null;
    state?: boolean | null;
    companyId?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;


    categoryName?: string | null;
    productName?: string | null;
    productDescription?: string | null;
    productCode?: string | null;
    productBrand?: string | null;
    unitMeasurementName?: string | null;
    factor?: number | null;
    productAccountingDynamicId?: string | null;
    productPresentationId?: string | null;
    priceDetailId?: string | null;
    unitPrice?: number | null;
}

export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: PriceDetail[];
    totalElements?: number;
}

export class PriceDetailFilter {
    concatenatedFields?: string;
}
