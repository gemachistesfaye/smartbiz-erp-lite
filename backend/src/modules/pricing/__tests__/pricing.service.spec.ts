import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from '../pricing.service';

describe('PricingService', () => {
  let service: PricingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PricingService],
    }).compile();

    service = module.get<PricingService>(PricingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculatePricing', () => {
    it('should calculate basic pricing without additional costs', () => {
      const result = service.calculatePricing({
        buyingPrice: 1000,
        quantityPurchased: 10,
        transportationCost: 0,
        loadingCost: 0,
        packagingCost: 0,
        storageCost: 0,
        laborCost: 0,
        customsCost: 0,
        otherCosts: 0,
        vatPercentage: 15,
        profitPercentage: 30,
      });

      expect(result.buyingPrice).toBe(1000);
      expect(result.quantityPurchased).toBe(10);
      expect(result.totalAdditionalCosts).toBe(0);
      expect(result.totalCost).toBe(1000);
      expect(result.costPerUnit).toBe(100);
      expect(result.vatAmountPerUnit).toBe(15);
      expect(result.recommendedSellingPrice).toBeGreaterThan(0);
      expect(result.expectedProfitPerUnit).toBeGreaterThan(0);
    });

    it('should calculate pricing with additional costs', () => {
      const result = service.calculatePricing({
        buyingPrice: 5000,
        quantityPurchased: 100,
        transportationCost: 500,
        loadingCost: 200,
        packagingCost: 300,
        storageCost: 100,
        laborCost: 150,
        customsCost: 0,
        otherCosts: 50,
        vatPercentage: 15,
        profitPercentage: 30,
      });

      expect(result.totalAdditionalCosts).toBe(1300);
      expect(result.totalCost).toBe(6300);
      expect(result.costPerUnit).toBe(63);
      expect(result.vatAmountPerUnit).toBeCloseTo(9.45, 1);
    });

    it('should use manual selling price when specified', () => {
      const result = service.calculatePricing({
        buyingPrice: 1000,
        quantityPurchased: 10,
        transportationCost: 0,
        loadingCost: 0,
        packagingCost: 0,
        storageCost: 0,
        laborCost: 0,
        customsCost: 0,
        otherCosts: 0,
        vatPercentage: 15,
        profitPercentage: 30,
        sellingPrice: 200,
        manualSellingPrice: true,
      });

      expect(result.recommendedSellingPrice).toBe(200);
      expect(result.expectedProfitPerUnit).toBe(200 - result.costPerUnit - result.vatAmountPerUnit);
    });

    it('should handle zero quantity by using 1', () => {
      const result = service.calculatePricing({
        buyingPrice: 1000,
        quantityPurchased: 0,
        transportationCost: 0,
        loadingCost: 0,
        packagingCost: 0,
        storageCost: 0,
        laborCost: 0,
        customsCost: 0,
        otherCosts: 0,
        vatPercentage: 0,
        profitPercentage: 0,
      });

      expect(result.quantityPurchased).toBe(1);
      expect(result.costPerUnit).toBe(1000);
    });

    it('should generate explanation lines', () => {
      const result = service.calculatePricing({
        buyingPrice: 1000,
        quantityPurchased: 10,
        transportationCost: 100,
        loadingCost: 0,
        packagingCost: 0,
        storageCost: 0,
        laborCost: 0,
        customsCost: 0,
        otherCosts: 0,
        vatPercentage: 15,
        profitPercentage: 30,
      });

      expect(result.explanation.length).toBeGreaterThan(0);
      expect(result.explanation.some((line) => line.includes('1000'))).toBe(true);
    });

    it('should calculate profit percentage correctly', () => {
      const result = service.calculatePricing({
        buyingPrice: 1000,
        quantityPurchased: 1,
        transportationCost: 0,
        loadingCost: 0,
        packagingCost: 0,
        storageCost: 0,
        laborCost: 0,
        customsCost: 0,
        otherCosts: 0,
        vatPercentage: 0,
        profitPercentage: 50,
      });

      expect(result.expectedProfitPercentage).toBeCloseTo(50, 0);
    });
  });
});
