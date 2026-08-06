import { Injectable } from '@nestjs/common';

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
  calculatePricing(input: PricingInput): PricingBreakdown {
    const qty = Math.max(input.quantityPurchased, 1);

    const totalAdditionalCosts =
      input.transportationCost +
      input.loadingCost +
      input.packagingCost +
      input.storageCost +
      input.laborCost +
      input.customsCost +
      input.otherCosts;

    const totalCost = input.buyingPrice + totalAdditionalCosts;
    const costPerUnit = totalCost / qty;

    const vatAmountPerUnit = costPerUnit * (input.vatPercentage / 100);
    const costPlusVat = costPerUnit + vatAmountPerUnit;

    let recommendedSellingPrice: number;
    let expectedProfitPerUnit: number;

    if (input.manualSellingPrice && input.sellingPrice && input.sellingPrice > 0) {
      recommendedSellingPrice = input.sellingPrice;
      expectedProfitPerUnit = recommendedSellingPrice - costPlusVat;
    } else {
      const profitAmountPerUnit = costPlusVat * (input.profitPercentage / 100);
      recommendedSellingPrice = costPlusVat + profitAmountPerUnit;
      expectedProfitPerUnit = profitAmountPerUnit;
    }

    const expectedProfitPercentage =
      costPlusVat > 0 ? (expectedProfitPerUnit / costPlusVat) * 100 : 0;

    const explanation = this.buildExplanation({
      buyingPrice: input.buyingPrice,
      qty,
      totalAdditionalCosts,
      totalCost,
      costPerUnit,
      vatAmountPerUnit,
      profitPercentage: input.profitPercentage,
      recommendedSellingPrice,
      expectedProfitPerUnit,
      manualSellingPrice: input.manualSellingPrice || false,
      costBreakdown: {
        transportationCost: input.transportationCost,
        loadingCost: input.loadingCost,
        packagingCost: input.packagingCost,
        storageCost: input.storageCost,
        laborCost: input.laborCost,
        customsCost: input.customsCost,
        otherCosts: input.otherCosts,
        subtotal: totalAdditionalCosts,
      },
    });

    return {
      buyingPrice: input.buyingPrice,
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
