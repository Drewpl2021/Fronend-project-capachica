import {ParentModule} from "../../parentModule/models/parent-module";

export class Module {

    id?: string;
    name?: string;
    code?: string;
    status?: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}
export class SectionDetail {

    id?: string;
    title?: string;
    description?: string;
    section_id?: string;
    code?: string;
    status?: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}
export class SectionDetailEnd {

    id?: string;
    title?: string;
    description?: string;
    section_detail_id?: string;
    code?: string;
    image?: string;
    subtitle?: string;
    status?: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
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
