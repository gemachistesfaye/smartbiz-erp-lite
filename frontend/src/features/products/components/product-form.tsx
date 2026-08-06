import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Calculator, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCreateProduct, useUpdateProduct, useCalculatePricing } from '../hooks/use-products';
import { useCategories } from '@/features/categories/hooks/use-categories';
import { useAllUnits } from '@/features/units/hooks/use-units';
import { formatCurrency } from '@/lib/utils';
import type { Product, PricingBreakdown } from '@/types/models';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  sku: z.string().max(50).optional(),
  barcode: z.string().max(100).optional(),
  brand: z.string().max(100).optional(),
  categoryId: z.string().optional(),
  unitId: z.string().optional(),
  description: z.string().optional(),
  buyingPrice: z.number().min(0).optional(),
  quantityPurchased: z.number().min(1).optional(),
  transportationCost: z.number().min(0).optional(),
  loadingCost: z.number().min(0).optional(),
  packagingCost: z.number().min(0).optional(),
  storageCost: z.number().min(0).optional(),
  laborCost: z.number().min(0).optional(),
  customsCost: z.number().min(0).optional(),
  otherCosts: z.number().min(0).optional(),
  vatPercentage: z.number().min(0).optional(),
  profitPercentage: z.number().min(0).optional(),
  sellingPrice: z.number().min(0).optional(),
  manualSellingPrice: z.boolean().optional(),
  reorderLevel: z.number().min(0).optional(),
  maxStock: z.number().min(0).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const calculatePricing = useCalculatePricing();
  const { data: categoriesData } = useCategories({ limit: 100 });
  const { data: units } = useAllUnits();
  const [pricing, setPricing] = useState<PricingBreakdown | null>(product?.pricing || null);
  const isEditing = !!product;

  const categories = categoriesData?.data || [];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      sku: product?.sku || '',
      barcode: product?.barcode || '',
      brand: product?.brand || '',
      categoryId: product?.categoryId || '',
      unitId: product?.unitId || '',
      description: product?.description || '',
      buyingPrice: product?.buyingPrice || 0,
      quantityPurchased: product?.quantityPurchased || 1,
      transportationCost: product?.transportationCost || 0,
      loadingCost: product?.loadingCost || 0,
      packagingCost: product?.packagingCost || 0,
      storageCost: product?.storageCost || 0,
      laborCost: product?.laborCost || 0,
      customsCost: product?.customsCost || 0,
      otherCosts: product?.otherCosts || 0,
      vatPercentage: product?.vatPercentage || 0,
      profitPercentage: product?.profitPercentage || 0,
      sellingPrice: product?.sellingPrice || 0,
      manualSellingPrice: product?.manualSellingPrice || false,
      reorderLevel: product?.reorderLevel || 0,
      maxStock: product?.maxStock || undefined,
      status: product?.status || 'ACTIVE',
    },
  });

  const watchedFields = watch();

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (watchedFields.buyingPrice && watchedFields.quantityPurchased) {
        calculatePricing.mutate(
          {
            buyingPrice: watchedFields.buyingPrice || 0,
            quantityPurchased: watchedFields.quantityPurchased || 1,
            transportationCost: watchedFields.transportationCost || 0,
            loadingCost: watchedFields.loadingCost || 0,
            packagingCost: watchedFields.packagingCost || 0,
            storageCost: watchedFields.storageCost || 0,
            laborCost: watchedFields.laborCost || 0,
            customsCost: watchedFields.customsCost || 0,
            otherCosts: watchedFields.otherCosts || 0,
            vatPercentage: watchedFields.vatPercentage || 0,
            profitPercentage: watchedFields.profitPercentage || 0,
            sellingPrice: watchedFields.sellingPrice || 0,
            manualSellingPrice: watchedFields.manualSellingPrice || false,
          },
          { onSuccess: (data) => setPricing(data) },
        );
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [
    watchedFields.buyingPrice,
    watchedFields.quantityPurchased,
    watchedFields.transportationCost,
    watchedFields.loadingCost,
    watchedFields.packagingCost,
    watchedFields.storageCost,
    watchedFields.laborCost,
    watchedFields.customsCost,
    watchedFields.otherCosts,
    watchedFields.vatPercentage,
    watchedFields.profitPercentage,
    watchedFields.sellingPrice,
    watchedFields.manualSellingPrice,
  ]);

  const onSubmit = (data: ProductFormData) => {
    const payload = {
      ...data,
      buyingPrice: data.buyingPrice || 0,
      quantityPurchased: data.quantityPurchased || 1,
      transportationCost: data.transportationCost || 0,
      loadingCost: data.loadingCost || 0,
      packagingCost: data.packagingCost || 0,
      storageCost: data.storageCost || 0,
      laborCost: data.laborCost || 0,
      customsCost: data.customsCost || 0,
      otherCosts: data.otherCosts || 0,
      vatPercentage: data.vatPercentage || 0,
      profitPercentage: data.profitPercentage || 0,
      reorderLevel: data.reorderLevel || 0,
    };

    if (isEditing) {
      updateProduct.mutate(
        { id: product.id, data: payload },
        { onSuccess: () => onSuccess?.() },
      );
    } else {
      createProduct.mutate(payload, { onSuccess: () => onSuccess?.() });
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" placeholder="e.g. Samsung Galaxy A54" {...register('name')} aria-invalid={!!errors.name} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" placeholder="Auto-generated if empty" {...register('sku')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input id="barcode" placeholder="Optional barcode" {...register('barcode')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" placeholder="Optional brand" {...register('brand')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register('categoryId')}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitId">Unit</Label>
              <select
                id="unitId"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register('unitId')}
              >
                <option value="">Select unit</option>
                {units?.map((unit) => (
                  <option key={unit.id} value={unit.id}>{unit.name} ({unit.symbol})</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Optional product description" {...register('description')} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Pricing & Costs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buyingPrice">Buying Price (Br) *</Label>
              <Input id="buyingPrice" type="number" step="0.01" {...register('buyingPrice', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantityPurchased">Quantity Purchased *</Label>
              <Input id="quantityPurchased" type="number" {...register('quantityPurchased', { valueAsNumber: true })} />
            </div>
          </div>

          <Separator />
          <p className="text-sm font-medium text-muted-foreground">Additional Costs</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transportationCost">Transportation</Label>
              <Input id="transportationCost" type="number" step="0.01" {...register('transportationCost', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loadingCost">Loading/Unloading</Label>
              <Input id="loadingCost" type="number" step="0.01" {...register('loadingCost', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="packagingCost">Packaging</Label>
              <Input id="packagingCost" type="number" step="0.01" {...register('packagingCost', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storageCost">Storage</Label>
              <Input id="storageCost" type="number" step="0.01" {...register('storageCost', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="laborCost">Labor</Label>
              <Input id="laborCost" type="number" step="0.01" {...register('laborCost', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customsCost">Customs</Label>
              <Input id="customsCost" type="number" step="0.01" {...register('customsCost', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherCosts">Other Costs</Label>
              <Input id="otherCosts" type="number" step="0.01" {...register('otherCosts', { valueAsNumber: true })} />
            </div>
          </div>

          <Separator />
          <p className="text-sm font-medium text-muted-foreground">Margins & Tax</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vatPercentage">VAT %</Label>
              <Input id="vatPercentage" type="number" step="0.01" {...register('vatPercentage', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profitPercentage">Profit %</Label>
              <Input id="profitPercentage" type="number" step="0.01" {...register('profitPercentage', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="manualSellingPrice">Manual Selling Price</Label>
                <input type="checkbox" id="manualSellingPrice" {...register('manualSellingPrice')} className="h-4 w-4" />
              </div>
              {watchedFields.manualSellingPrice && (
                <Input id="sellingPrice" type="number" step="0.01" placeholder="Override price" {...register('sellingPrice', { valueAsNumber: true })} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {pricing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Pricing Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Additional Costs</p>
                <p className="text-lg font-semibold">{formatCurrency(pricing.totalAdditionalCosts)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cost Per Unit</p>
                <p className="text-lg font-semibold">{formatCurrency(pricing.costPerUnit)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">VAT Per Unit</p>
                <p className="text-lg font-semibold">{formatCurrency(pricing.vatAmountPerUnit)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recommended Price</p>
                <p className="text-lg font-semibold text-primary">{formatCurrency(pricing.recommendedSellingPrice)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expected Profit/Unit</p>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(pricing.expectedProfitPerUnit)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <p className="text-lg font-semibold">{pricing.expectedProfitPercentage.toFixed(1)}%</p>
              </div>
            </div>

            {pricing.explanation.length > 0 && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium mb-2">Calculation Breakdown:</p>
                {pricing.explanation.map((line, i) => (
                  <p key={i} className="text-sm text-muted-foreground">{line}</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reorderLevel">Reorder Level</Label>
              <Input id="reorderLevel" type="number" {...register('reorderLevel', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxStock">Maximum Stock</Label>
              <Input id="maxStock" type="number" {...register('maxStock', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register('status')}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Update Product' : 'Create Product'
          )}
        </Button>
      </div>
    </form>
  );
}
