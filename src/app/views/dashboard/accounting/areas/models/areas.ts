export class Areas {
    id?: string;
    name?: string;
    description?: string;
    code?: string;
    areaLevel?: number;
    parentAreaId?: string;
    companyId?: string;
    children?: Areas[] = [];
    status?: boolean;
    collapse?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

