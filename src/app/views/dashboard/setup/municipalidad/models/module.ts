
export class Module {
    id?: string;
    distrito?: string;
    provincia?: string;
    region?: string;
    codigo?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;


}

export class MunicipaldiadDescripcion {
    id?: string;
    municipalidad_id?: string;
    logo?: string;
    direccion?: string;
    descripcion?: string;
    ruc?: string;
    correo?: string;
    nombre_alcalde?: string;
    anio_gestion?: string;
    createdAt?: string;
    updatedAt?: string;

}

export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content: Module[];
    totalElements?: number;
}

export class ModuleFilter {
    name?: string;
}
