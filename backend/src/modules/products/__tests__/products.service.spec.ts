import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from '../../pricing/pricing.service';
import { ProductsService } from '../products.service';
import { PrismaService } from '../../../prisma/prisma.service';

const mockPrisma = {
  product: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('ProductsService', () => {
  let service: ProductsService;
  let pricingService: PricingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        PricingService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    pricingService = module.get<PricingService>(PricingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product with auto-generated SKU', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(null);
      mockPrisma.product.count.mockResolvedValue(0);
      mockPrisma.product.create.mockResolvedValue({
        id: '1',
        name: 'Test Product',
        sku: 'PRD-00001',
        buyingPrice: 1000,
        sellingPrice: 1495,
      });

      const result = await service.create('business-1', {
        name: 'Test Product',
        buyingPrice: 1000,
        quantityPurchased: 10,
        profitPercentage: 30,
        vatPercentage: 15,
      });

      expect(mockPrisma.product.create).toHaveBeenCalled();
      expect(result.name).toBe('Test Product');
    });

    it('should reject duplicate SKU', async () => {
      mockPrisma.product.findFirst.mockResolvedValue({ id: 'existing', sku: 'DUP-001' });

      await expect(
        service.create('business-1', { name: 'Test', sku: 'DUP-001' }),
      ).rejects.toThrow('already exists');
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(0);

      const result = await service.findAll('business-1', { page: 1, limit: 20 });

      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(20);
      expect(result.data).toEqual([]);
    });
  });
});
