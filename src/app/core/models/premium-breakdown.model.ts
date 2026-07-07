
export interface PremiumBreakdownLine {
    label: string;
    amount: number;
}

export interface PremiumBreakdown {
    basePremium: number;
    lines: PremiumBreakdownLine[];   // each add-on/factor shown separately
    planMultiplier: number;
    totalPremium: number;
}
