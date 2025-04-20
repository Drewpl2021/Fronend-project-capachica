export class Profitability {
    id: string;

    purchasePrice: string;
    salePrice: string;
    profitPerUnit: string;
    quantity: string;
    totalPricePurchase: string;
    totalPriceSale: string;
    totalProfit: string;
    profitabilityPercentage: string;
    warehouseMovementDetail?: {
        id: string;
        description: string;
        warehouseMovement: {
            series: string;
            number: string;
        },
    };
}

export interface ProfitabilitySummary {
    profitability_percentage_avg: number;
    quantity_total: number;
    total_price_purchase_total: number;
    total_price_sale_total: number;
    total_profit_total: number;
}


export class PaginatedResponse {
    totalPages?: number;
    currentPage?: number;
    content?: Profitability[];
    totalElements?: number;
}

export class ProfitabilityFilter {
    concatenatedFields?: string;
    startDate?: string;
    endDate?: string;
}
