export class User {
    self?: any | null;
    id?: string;
    origin?: any | null;
    createdTimestamp?: number;
    username?: string;
    enabled?: boolean;
    totp?: boolean;
    emailVerified?: boolean;
    firstName?: string;
    lastName?: string;
    email?: string;
    federationLink?: any | null;
    serviceAccountClientId?: any | null;
    attributes?: any | null;
    credentials?: any | null;
    disableableCredentialTypes?: string[];
    requiredActions?: string[];
    federatedIdentities?: any | null;
    realmRoles?: any | null;
    clientRoles?: any | null;
    clientConsents?: any | null;
    notBefore?: number;
    applicationRoles?: any | null;
    socialLinks?: any | null;
    groups?: any | null;
    access?: Access;
}

export class Access {
    manageGroupMembership: boolean;
    view: boolean;
    mapRoles: boolean;
    impersonate: boolean;
    manage: boolean;
}
