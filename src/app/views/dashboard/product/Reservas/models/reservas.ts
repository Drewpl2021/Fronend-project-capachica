export class Reservas {
    id?: string | null;
    userId?: number | null;
    code?: string | null;
    bi?: string | null;
    igv?: string | null;
    total?: string | null;
    status?: string | null;  // Estado de la reserva (pendiente, activo, etc.)
    created_at?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;

    // Información del usuario
    user?: {
        id?: number | null;
        name?: string | null;
        last_name?: string | null;
        code?: string | null;
        username?: string | null;
        email?: string | null;
        emailVerifiedAt?: string | null;
        imagenUrl?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        deletedAt?: string | null;
    } | null;

    // Detalles de la reserva
    reserve_details?: Array<{
        id?: string | null;
        emprendedorServiceId?: string | null;
        reservaId?: string | null;
        costo?: string | null;
        cantidad?: string | null;
        IGV?: string | null;
        BI?: string | null;
        total?: string | null;
        lugar?: string | null;
        description?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        deletedAt?: string | null;

        // Información del servicio de emprendimiento
        emprendimiento_service?: {
            id?: string | null;
            serviceId?: string | null;
            emprendedorId?: string | null;
            cantidad?: number | null;
            name?: string | null;
            description?: string | null;
            costo?: string | null;
            costoUnidad?: string | null;
            code?: string | null;
            status?: number | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            deletedAt?: string | null;

            // Información del servicio
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
        } | null;
    }> | null;
}


export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: Reservas[];
    totalElements?: number;
}

export class CategoryFilter {
    concatenatedFields?: string;
}
