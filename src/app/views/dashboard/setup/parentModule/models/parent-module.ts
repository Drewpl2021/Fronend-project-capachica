import {Module} from "../../module/models/module";


export class ParentModule {
    id?: string; // UUID
    createdAt?: string;
    deleted?: boolean;
    deletedAt?: string | null;
    icon?: string;
    moduleOrder?: number;
    title?: string;
    status?: boolean;
    updatedAt?: string;
    link?: string;
    moduleDTOS?:Module[];
}


export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content: ParentModule[];
    totalElements?: number;
}
export class ParentModuleFilter{
    name?: string;
}
