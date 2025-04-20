export class Inventory {
    id?: string | null;
    name?: string | null;
    description?: string | null;
    code?: string | null;
    state?: boolean | null;
    companyId?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;

    availableQuantity?: number | null;
    reservedQuantity?: number | null;
    incomingQuantity?: number | null;
    outgoingQuantity?: number | null;
    totalCost?: number | null;
    unitCost?: number | null;
    store?: { id: string; name?: string };
    operationType?: string | null;

    product?: {
        id: string;
        name?: string;
    };
}
export interface TotalCost {
    totalCost: number;
}

export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: Inventory[];
    totalElements?: number;
}

export class InventoryFilter {
    concatenatedFields?: string;
}
