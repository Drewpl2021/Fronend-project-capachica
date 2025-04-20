export class EntitiesCompanyP {
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
    entitys?: {
        id: string;
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
    };
}

export class DocumentTypes {
    id?: string | null;
    name?: string | null;
    code?: string | null;
    state?: boolean | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}

export class EntityTypes {
    id?: string | null;
    name?: string | null;
    code?: string | null;
    state?: boolean | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}

export class Services {
    id?: string | null;
    name?: string | null;
    description?: string | null;
    code?: string | null;
    state?: boolean | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}


export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: EntitiesCompanyP[];
    totalElements?: number;
}

export class EntitiesFilter {
    concatenatedFields?: string;
}
