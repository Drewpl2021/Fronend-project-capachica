import {ParentModule} from "../../parentModule/models/parent-module";

export class Module {
    createdAt?: string;
    deleted?: boolean;
    deletedAt?: string | null;
    icon?: string;
    id?: string;
    moduleOrder?: number;
    title?: string;
    status?: boolean;
    updatedAt?: string;
    link?: string;
    parentModuleId?: string;
    parentModule?: ParentModule;
    assigned?: boolean;
    selected?: boolean;
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
