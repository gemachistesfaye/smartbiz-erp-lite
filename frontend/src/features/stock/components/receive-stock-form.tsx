import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useReceiveStock } from '@/features/inventory/hooks/use-inventory';
import { useActiveSuppliers } from '@/features/suppliers/hooks/use-suppliers';
import { useProducts } from '@/features/products/hooks/use-products';
import { formatCurrency } from '@/lib/utils';

const receivingItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  buyingPrice: z.number().min(0, 'Price must be positive'),
});

const receivingSchema = z.object({
  supplierId: z.string().optional(),
  purchaseReference: z.string().optional(),
  date: z.string().optional(),
  items: z.array(receivingItemSchema).min(1, 'At least one item is required'),
  transportationCost: z.number().min(0).optional(),
  packagingCost: z.number().min(0).optional(),
  storageCost: z.number().min(0).optional(),
  laborCost: z.number().min(0).optional(),
  otherCosts: z.number().min(0).optional(),
  notes: z.string().optional(),
});

type ReceivingFormData = z.infer<typeof receivingSchema>;

export function ReceiveStockForm({ onSuccess }: { onSuccess?: () => void }) {
  const receiveStock = useReceiveStock();
  const { data: suppliersData } = useActiveSuppliers();
  const { data: productsData } = useProducts({ limit: 200, status: 'ACTIVE' });

  const suppliers = suppliersData || [];
  const products = productsData?.data || [];

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ReceivingFormData>({
    resolver: zodResolver(receivingSchema),
    defaultValues: {
      items: [{ productId: '', quantity: 1, buyingPrice: 0 }],
      transportationCost: 0,
      packagingCost: 0,
      storageCost: 0,
      laborCost: 0,
      otherCosts: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const watchedCosts = watch(['transportationCost', 'packagingCost', 'storageCost', 'laborCost', 'otherCosts']);

  const subtotal = (watchedItems || []).reduce<number>(
    (sum, item) => sum + (item?.quantity || 0) * (item?.buyingPrice || 0),
    0,
  );
  const additionalCosts = (watchedCosts || []).reduce<number>(
    (sum, cost) => sum + (Number(cost) || 0),
    0,
  );
  const totalCost = subtotal + additionalCosts;

  const onSubmit = (data: ReceivingFormData) => {
    receiveStock.mutate(data, { onSuccess: () => onSuccess?.() });
  };

  const isPending = receiveStock.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Receiving Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplierId">Supplier</Label>
              <select
                id="supplierId"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register('supplierId')}
              >
                <option value="">Select supplier (optional)</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchaseReference">Purchase Reference</Label>
              <Input id="purchaseReference" placeholder="e.g. PO-2024-001" {...register('purchaseReference')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register('date')} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end">
              <div className="space-y-2">
                {index === 0 && <Label>Product</Label>}
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  {...register(`items.${index}.productId`)}
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku || 'No SKU'})</option>
                  ))}
                </select>
                {errors.items?.[index]?.productId && (
                  <p className="text-sm text-destructive">{errors.items[index]?.productId?.message}</p>
                )}
              </div>
              <div className="space-y-2">
                {index === 0 && <Label>Quantity</Label>}
                <Input
                  type="number"
                  placeholder="Qty"
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                {index === 0 && <Label>Buying Price (Br)</Label>}
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  {...register(`items.${index}.buyingPrice`, { valueAsNumber: true })}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ productId: '', quantity: 1, buyingPrice: 0 })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Costs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transportationCost">Transportation</Label>
              <Input id="transportationCost" type="number" step="0.01" {...register('transportationCost', { valueAsNumber: true })} />
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
              <Label htmlFor="otherCosts">Other</Label>
              <Input id="otherCosts" type="number" step="0.01" {...register('otherCosts', { valueAsNumber: true })} />
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" placeholder="Optional notes" {...register('notes')} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Subtotal: {formatCurrency(subtotal)}</p>
              <p className="text-sm text-muted-foreground">Additional Costs: {formatCurrency(additionalCosts)}</p>
              <p className="text-lg font-bold">Total: {formatCurrency(totalCost)}</p>
            </div>
            <div className="flex gap-2">
              {onSuccess && (
                <Button type="button" variant="outline" onClick={onSuccess}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Receiving...
                  </>
                ) : (
                  'Receive Stock'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
