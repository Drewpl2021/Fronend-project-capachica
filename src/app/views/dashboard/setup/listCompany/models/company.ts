export class Company {
    id?: string | null;
    ruc?: string | null;
    companyName?: string | null;
    tradeName?: string | null;
    taxRegime?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    address?: string | null;
    logo?: string | null;
    countryCode?: string | null;
    companyId?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;

    company?:  {
        id: string;
        ruc?: string;
        tradeName?: string
            logo?: string
    };

}

export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: Company[];
    totalElements?: number;
}

export class CompanyFilter {
    concatenatedFields?: string;
}
