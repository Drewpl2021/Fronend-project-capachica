export class Warrinties {
    id?: string | null;
    name?: string | null;
    description?: string | null;
    code?: string | null;
    state?: boolean | null;
    companyId?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;

    seriesCode?: string | null;
    warehouseMovementDetail?: {
        id: string;
        description: string;
        warehouseMovement: {
            documentTypeCode: string;
            issueDate: string;
            series: string;
            nameSocialReason: string;
            storeId: string;
            total: string;
        },
    };
    seriesCodeExist?: boolean | null;

}

export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: Warrinties[];
    totalElements?: number;
}

export class WarrintiesFilter {
    concatenatedFields?: string;
}
