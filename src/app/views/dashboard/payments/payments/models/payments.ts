export class Payments {
    id?: string | null;
    amount?: number | null;
    paymentNumber?: number | null;
    paymentDate?: string | null;
    nameSocialReason?: string | null;
    documentNumber?: string | null;
    entityId?: string | null;
    operationType?: { id: string; name?: string };
    series?: string | null;
    relatedSeries?: string | null;
    relatedNumber?: string | null;
    paymentDetails?: Array<{
        id?: string;
        paymentMethod?: { id: string; name?: string };
        concept?: string | null;
        amount?: string | null;
        notes?: string | null;
    }>;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}

export class Summary {
    name?: string | null;
    operationTypeId?: string | null;
    transactionGroup?: string | null;
    transactionStatus?: boolean| null;
    totalAmount?: number | null;
}
export class SummaryDetail {

    paymentMethodId?: string | null;
    paymentMethodCode?: string | null;
    paymentMethodName?: string | null;
    totalAmount?: number | null;
}
export class SummaryDetailSon {
    id?: string | null;
    payment?: {
        id?: string;
        nameSocialReason?: string | null;
        documentNumber?: string | null;
        amount?: number | null;
    }[]; // ✅ Es un array de objetos
    amount?: number | null;
}


export class OperationType {
    id?: string | null;
    name?: string | null;
    code?: string | null;
    state?: boolean | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}

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

export class Entities {
    id?: string | null;
    nameSocialReason?: string | null;
    documentNumber?: string | null;
    address?: string | null;
    email?: string | null;
    phone?: string | null;
    documentType?:  { id: string; name?: string };
    idEntityType?:  { id: string; name?: string };
    serviceEntities?: { service: { id: string; name?: string } }[];
    state?: boolean | null;
    companyId?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}

export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: Payments[];
    totalElements?: number;
}

export class PaymentsFilter {
    startDate?: string;
    endDate?: string;
    concatenatedFields?: string;
    storeId?: string;
}
