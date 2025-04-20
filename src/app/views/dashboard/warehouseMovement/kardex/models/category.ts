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


    date?: string | null;
    movementType?: string | null;
    balanceQuantity?: number | null;
    totalCost?: number | null;
    warehouseMovementDetail?:{
        warehouseMovement?:  {
            id?: string | null;
            storeId?: string | null;
            details?: [

            ]
        };
        description?: string | null;
        productId?: string | null;
        productPresentationId?: string | null;

    };
    unitCost?: number | null;

}

export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: Category[];
    totalElements?: number;
}

export class CategoryFilter {
    concatenatedFields?: string;
}
