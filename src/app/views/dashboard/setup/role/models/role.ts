import {Module} from "../../module/models/module";

export class Role {
    id?: string;
    name?: string;
    guard_name?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
}


export class PaginatedResponseRole {
    totalPages?: number;
    currentPage?: number;
    content: Role[];
    totalElements?: number;
}

export class RoleFilter {
    name?: string;
}
