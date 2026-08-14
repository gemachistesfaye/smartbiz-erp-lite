import { Injectable, BadRequestException } from '@nestjs/common';

export interface PricingInput {
  buyingPrice: number;
  quantityPurchased: number;
  transportationCost: number;
  loadingCost: number;
  packagingCost: number;
  storageCost: number;
  laborCost: number;
  customsCost: number;
  otherCosts: number;
  vatPercentage: number;
  profitPercentage: number;
  sellingPrice?: number;
  manualSellingPrice?: boolean;
}

export interface PricingBreakdown {
  buyingPrice: number;
  quantityPurchased: number;
  totalAdditionalCosts: number;
  totalCost: number;
  costPerUnit: number;
  vatAmountPerUnit: number;
  profitAmountPerUnit: number;
  recommendedSellingPrice: number;
  expectedProfitPerUnit: number;
  expectedProfitPercentage: number;
  costBreakdown: {
    transportationCost: number;
    loadingCost: number;
    packagingCost: number;
    storageCost: number;
    laborCost: number;
    customsCost: number;
    otherCosts: number;
    subtotal: number;
  };
  explanation: string[];
}

@Injectable()
export class PricingService {
  private sanitizeInput(input: PricingInput): PricingInput {
    return {
      buyingPrice: Math.max(0, Number(input.buyingPrice) || 0),
      quantityPurchased: Math.max(1, Math.floor(Number(input.quantityPurchased) || 1)),
      transportationCost: Math.max(0, Number(input.transportationCost) || 0),
      loadingCost: Math.max(0, Number(input.loadingCost) || 0),
      packagingCost: Math.max(0, Number(input.packagingCost) || 0),
      storageCost: Math.max(0, Number(input.storageCost) || 0),
      laborCost: Math.max(0, Number(input.laborCost) || 0),
      customsCost: Math.max(0, Number(input.customsCost) || 0),
      otherCosts: Math.max(0, Number(input.otherCosts) || 0),
      vatPercentage: Math.max(0, Math.min(100, Number(input.vatPercentage) || 0)),
      profitPercentage: Math.max(0, Number(input.profitPercentage) || 0),
      sellingPrice: input.sellingPrice ? Math.max(0, Number(input.sellingPrice)) : undefined,
      manualSellingPrice: input.manualSellingPrice,
    };
  }

  calculatePricing(input: PricingInput): PricingBreakdown {
    const sanitized = this.sanitizeInput(input);
    const qty = sanitized.quantityPurchased;

    const totalAdditionalCosts =
      sanitized.transportationCost +
      sanitized.loadingCost +
      sanitized.packagingCost +
      sanitized.storageCost +
      sanitized.laborCost +
      sanitized.customsCost +
      sanitized.otherCosts;

    const totalCost = sanitized.buyingPrice + totalAdditionalCosts;
    const costPerUnit = totalCost / qty;

    const vatAmountPerUnit = costPerUnit * (sanitized.vatPercentage / 100);
    const costPlusVat = costPerUnit + vatAmountPerUnit;

    let recommendedSellingPrice: number;
    let expectedProfitPerUnit: number;

    if (sanitized.manualSellingPrice && sanitized.sellingPrice && sanitized.sellingPrice > 0) {
      recommendedSellingPrice = sanitized.sellingPrice;
      expectedProfitPerUnit = recommendedSellingPrice - costPlusVat;
    } else {
      const profitAmountPerUnit = costPlusVat * (sanitized.profitPercentage / 100);
      recommendedSellingPrice = costPlusVat + profitAmountPerUnit;
      expectedProfitPerUnit = profitAmountPerUnit;
    }

    const expectedProfitPercentage =
      costPlusVat > 0 ? (expectedProfitPerUnit / costPlusVat) * 100 : 0;

    const explanation = this.buildExplanation({
      buyingPrice: sanitized.buyingPrice,
      qty,
      totalAdditionalCosts,
      totalCost,
      costPerUnit,
      vatAmountPerUnit,
      profitPercentage: sanitized.profitPercentage,
      recommendedSellingPrice,
      expectedProfitPerUnit,
      manualSellingPrice: sanitized.manualSellingPrice || false,
      costBreakdown: {
        transportationCost: sanitized.transportationCost,
        loadingCost: sanitized.loadingCost,
        packagingCost: sanitized.packagingCost,
        storageCost: sanitized.storageCost,
        laborCost: sanitized.laborCost,
        customsCost: sanitized.customsCost,
        otherCosts: sanitized.otherCosts,
        subtotal: totalAdditionalCosts,
      },
    });

    return {
      buyingPrice: sanitized.buyingPrice,
      quantityPurchased: qty,
      totalAdditionalCosts,
      totalCost,
      costPerUnit: Math.round(costPerUnit * 100) / 100,
      vatAmountPerUnit: Math.round(vatAmountPerUnit * 100) / 100,
      profitAmountPerUnit: Math.round(expectedProfitPerUnit * 100) / 100,
      recommendedSellingPrice: Math.round(recommendedSellingPrice * 100) / 100,
      expectedProfitPerUnit: Math.round(expectedProfitPerUnit * 100) / 100,
      expectedProfitPercentage: Math.round(expectedProfitPercentage * 100) / 100,
      costBreakdown: {
        transportationCost: input.transportationCost,
        loadingCost: input.loadingCost,
        packagingCost: input.packagingCost,
        storageCost: input.storageCost,
        laborCost: input.laborCost,
        customsCost: input.customsCost,
        otherCosts: input.otherCosts,
        subtotal: Math.round(totalAdditionalCosts * 100) / 100,
      },
      explanation,
    };
  }

  calculateForProduct(product: any): PricingBreakdown {
    return this.calculatePricing({
      buyingPrice: Number(product.buyingPrice),
      quantityPurchased: product.quantityPurchased,
      transportationCost: Number(product.transportationCost),
      loadingCost: Number(product.loadingCost),
      packagingCost: Number(product.packagingCost),
      storageCost: Number(product.storageCost),
      laborCost: Number(product.laborCost),
      customsCost: Number(product.customsCost),
      otherCosts: Number(product.otherCosts),
      vatPercentage: Number(product.vatPercentage),
      profitPercentage: Number(product.profitPercentage),
      sellingPrice: Number(product.sellingPrice),
      manualSellingPrice: product.manualSellingPrice,
    });
  }

  private buildExplanation(data: {
    buyingPrice: number;
    qty: number;
    totalAdditionalCosts: number;
    totalCost: number;
    costPerUnit: number;
    vatAmountPerUnit: number;
    profitPercentage: number;
    recommendedSellingPrice: number;
    expectedProfitPerUnit: number;
    manualSellingPrice: boolean;
    costBreakdown: Record<string, number>;
  }): string[] {
    const lines: string[] = [];

    lines.push(`Buying price for ${data.qty} units: Br ${data.buyingPrice.toFixed(2)}`);

    const additionalItems = Object.entries(data.costBreakdown).filter(
      ([key, val]) => key !== 'subtotal' && val > 0,
    );

    if (additionalItems.length > 0) {
      lines.push('Additional costs:');
      additionalItems.forEach(([key, val]) => {
        const label = key.replace(/Cost$/, '').replace(/([A-Z])/g, ' $1').trim();
        lines.push(`  - ${label}: Br ${val.toFixed(2)}`);
      });
      lines.push(`Total additional costs: Br ${data.totalAdditionalCosts.toFixed(2)}`);
    }

    lines.push(`Total cost: Br ${data.totalCost.toFixed(2)}`);
    lines.push(`Cost per unit: Br ${data.costPerUnit.toFixed(2)}`);

    if (data.vatAmountPerUnit > 0) {
      lines.push(`VAT per unit: Br ${data.vatAmountPerUnit.toFixed(2)}`);
    }

    if (data.manualSellingPrice) {
      lines.push(`Manual selling price: Br ${data.recommendedSellingPrice.toFixed(2)}`);
    } else if (data.profitPercentage > 0) {
      lines.push(`Profit margin: ${data.profitPercentage}%`);
    }

    lines.push(`Recommended selling price: Br ${data.recommendedSellingPrice.toFixed(2)}`);
    lines.push(`Expected profit per unit: Br ${data.expectedProfitPerUnit.toFixed(2)}`);

    return lines;
  }
}
