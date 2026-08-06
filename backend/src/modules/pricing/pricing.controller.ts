import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PricingService } from './pricing.service';
import { CalculatePricingDto } from './dto/pricing.dto';

@ApiTags('Pricing')
@Controller('pricing')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('calculate')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Calculate pricing breakdown' })
  async calculate(@Body() dto: CalculatePricingDto) {
    return this.pricingService.calculatePricing({
      buyingPrice: dto.buyingPrice,
      quantityPurchased: dto.quantityPurchased,
      transportationCost: dto.transportationCost || 0,
      loadingCost: dto.loadingCost || 0,
      packagingCost: dto.packagingCost || 0,
      storageCost: dto.storageCost || 0,
      laborCost: dto.laborCost || 0,
      customsCost: dto.customsCost || 0,
      otherCosts: dto.otherCosts || 0,
      vatPercentage: dto.vatPercentage || 0,
      profitPercentage: dto.profitPercentage || 0,
      sellingPrice: dto.sellingPrice,
      manualSellingPrice: dto.manualSellingPrice,
    });
  }
}
