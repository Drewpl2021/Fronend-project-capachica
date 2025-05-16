export class Asociaciones {
    id?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    lugar?: string | null;
    url?: string | null;
    estado?: boolean | null;
    municipalidad_id: string | null;
    imagenes?: Imagen[] | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}
export class Imagen {
    id?: string | null;
    url_image?: string | null;
    estado?: boolean | null;
    codigo?: string | null;
}
export class Municipaldiad {
    id?: string;
    distrito?: string;
    provincia?: string;
    region?: string;
    codigo?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;


}
export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: Asociaciones[];
    totalElements?: number;
}

export class AsociacionesFilter {
    concatenatedFields?: string;
}
