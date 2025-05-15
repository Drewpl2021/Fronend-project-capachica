import {Module} from "../../module/models/module";


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
    content: Service[];
    totalElements?: number;
}
export class ServiceFilter{
    name?: string;
}
