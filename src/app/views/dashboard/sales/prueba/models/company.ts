export class Company {
    id: string;
    ruc?: string;
    razonSocial?: string; // Equivalente a "companyName"
    tradeName?: string;
    taxRegime?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    logo?: string;
    calculationIgvByTotal?: boolean;
    codDepSunat?: string;
    codProvSunat?: string;
    codUbigeoSunat?: string;
    processType?: string;
    printFormat?: string;
    countryCode?: string;
    userSol?: string;
    passwordSol?: string;
    withholdingAgent?: boolean;
    electronicBillingOse?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deleted?: boolean;
}
