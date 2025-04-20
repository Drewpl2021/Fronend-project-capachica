export class PaymentMethods {
    id?: string | null;
    name?: string | null;
    code?: string | null;
    state?: boolean | null;
    paymentType?: { id: string; name?: string };
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}

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
    content?: PaymentMethods[];
    totalElements?: number;
}

export class PaymentMethodsFilter {
    concatenatedFields?: string;
}
