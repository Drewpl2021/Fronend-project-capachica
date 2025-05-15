export class Product {
    id?: string | null;
    status?: number | null;
    service_id?: string | null;
    emprendedor_id?: string | null;
    cantidad?: number | null;
    name?: string | null;
    description?: string | null;
    costo?: number | null;
    costo_unidad?: number | null;
    code?: string | null;
    created_at?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;

    emprendedor?: {
        id?: string | null;
        razon_social?: string | null;
        address?: string | null;
        code?: string | null;
        ruc?: string | null;
        description?: string | null;
        lugar?: string | null;
        img_logo?: string | null;
        name_family?: string | null;
        status?: number | null;
        asociacion_id?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        deletedAt?: string | null;
    } | null;

    service?: {
        id?: string | null;
        name?: string | null;
        description?: string | null;
        code?: string | null;
        category?: string | null;
        status?: number | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        deletedAt?: string | null;
    } | null;

    img_emprendedor_services?: Array<{
        id?: string | null;
        emprendedor_service_id?: string | null;
        url_image?: string | null;
        description?: string | null;
        estado?: number | null;
        code?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        deletedAt?: string | null;
    }> | null;
}

export class Service {
    id?: string | null;
    name?: string | null;
    description?: string | null;
    code?: string | null;
    category?: string | null;
    status?: boolean | null;
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
