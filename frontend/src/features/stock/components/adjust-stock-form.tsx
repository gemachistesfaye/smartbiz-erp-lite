import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdjustStock } from '@/features/inventory/hooks/use-inventory';
import { useProducts } from '@/features/products/hooks/use-products';

const adjustmentSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  type: z.enum(['ADJUSTMENT', 'DAMAGE', 'LOSS', 'CORRECTION']),
  quantity: z.number().refine((val) => val !== 0, 'Quantity cannot be zero'),
  reason: z.string().min(1, 'Reason is required'),
  notes: z.string().optional(),
});

type AdjustmentFormData = z.infer<typeof adjustmentSchema>;

export function AdjustStockForm({ onSuccess }: { onSuccess?: () => void }) {
  const adjustStock = useAdjustStock();
  const { data: productsData } = useProducts({ limit: 200, status: 'ACTIVE' });
  const products = productsData?.data || [];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdjustmentFormData>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      type: 'ADJUSTMENT',
      quantity: 0,
    },
  });

  const watchedQuantity = watch('quantity');
  const isDecrease = watchedQuantity < 0;

  const onSubmit = (data: AdjustmentFormData) => {
    adjustStock.mutate(data, { onSuccess: () => onSuccess?.() });
  };

  const isPending = adjustStock.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stock Adjustment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Product *</Label>
              <select
                id="productId"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register('productId')}
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sku || 'No SKU'})</option>
                ))}
              </select>
              {errors.productId && <p className="text-sm text-destructive">{errors.productId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Adjustment Type *</Label>
              <select
                id="type"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register('type')}
              >
                <option value="ADJUSTMENT">General Adjustment</option>
                <option value="DAMAGE">Damage</option>
                <option value="LOSS">Loss</option>
                <option value="CORRECTION">Correction</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantity * {isDecrease && <span className="text-destructive">(Decrease)</span>}
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Positive to increase, negative to decrease"
                {...register('quantity', { valueAsNumber: true })}
              />
              {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Input
              id="reason"
              placeholder="e.g. Physical count correction, damaged goods, etc."
              {...register('reason')}
            />
            {errors.reason && <p className="text-sm text-destructive">{errors.reason.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Input id="notes" placeholder="Optional notes" {...register('notes')} />
          </div>

          {isDecrease && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                This will decrease stock by {Math.abs(watchedQuantity)} units.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        {onSuccess && (
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adjusting...
            </>
          ) : (
            'Adjust Stock'
          )}
        </Button>
      </div>
    </form>
  );
}
