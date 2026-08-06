import { Link } from '@tanstack/react-router';
import { ArrowLeft, Package, Calculator, Warehouse, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProduct } from '../hooks/use-products';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface ProductDetailPageProps {
  productId: string;
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const { data: product, isLoading } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-32 bg-muted animate-pulse rounded" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/products"><Button variant="link">Back to Products</Button></Link>
      </div>
    );
  }

  const pricing = product.pricing;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/products">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-muted-foreground">{product.sku || 'No SKU'}</p>
        </div>
        <Badge variant={product.status === 'ACTIVE' ? 'default' : 'secondary'} className="ml-auto">
          {product.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> General Information</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Name" value={product.name} />
            <InfoRow label="SKU" value={product.sku || '-'} />
            <InfoRow label="Barcode" value={product.barcode || '-'} />
            <InfoRow label="Brand" value={product.brand || '-'} />
            <InfoRow label="Category" value={product.category?.name || '-'} />
            <InfoRow label="Unit" value={product.unit ? `${product.unit.name} (${product.unit.symbol})` : '-'} />
            <InfoRow label="Description" value={product.description || '-'} />
            <InfoRow label="Created" value={formatDateTime(product.createdAt)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" /> Pricing Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Buying Price" value={formatCurrency(Number(product.buyingPrice))} />
            <InfoRow label="Quantity Purchased" value={String(product.quantityPurchased)} />
            {pricing && (
              <>
                <Separator />
                <InfoRow label="Total Additional Costs" value={formatCurrency(pricing.totalAdditionalCosts)} />
                <InfoRow label="Total Cost" value={formatCurrency(pricing.totalCost)} />
                <InfoRow label="Cost Per Unit" value={formatCurrency(pricing.costPerUnit)} />
                <InfoRow label="VAT Per Unit" value={formatCurrency(pricing.vatAmountPerUnit)} />
                <Separator />
                <InfoRow label="Recommended Selling Price" value={formatCurrency(pricing.recommendedSellingPrice)} highlight />
                <InfoRow label="Expected Profit Per Unit" value={formatCurrency(pricing.expectedProfitPerUnit)} />
                <InfoRow label="Profit Margin" value={`${pricing.expectedProfitPercentage.toFixed(1)}%`} />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" /> Cost Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Transportation" value={formatCurrency(Number(product.transportationCost))} />
            <InfoRow label="Loading/Unloading" value={formatCurrency(Number(product.loadingCost))} />
            <InfoRow label="Packaging" value={formatCurrency(Number(product.packagingCost))} />
            <InfoRow label="Storage" value={formatCurrency(Number(product.storageCost))} />
            <InfoRow label="Labor" value={formatCurrency(Number(product.laborCost))} />
            <InfoRow label="Customs" value={formatCurrency(Number(product.customsCost))} />
            <InfoRow label="Other Costs" value={formatCurrency(Number(product.otherCosts))} />
            {pricing && (
              <>
                <Separator />
                <InfoRow label="Subtotal" value={formatCurrency(pricing.costBreakdown.subtotal)} />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Warehouse className="h-5 w-5" /> Inventory (Future)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Reorder Level" value={String(product.reorderLevel)} />
            <InfoRow label="Max Stock" value={product.maxStock ? String(product.maxStock) : '-'} />
            <InfoRow label="Current Stock" value={product.inventory ? String(product.inventory.quantity) : '0'} />
            <InfoRow label="Min Threshold" value={product.inventory ? String(product.inventory.minThreshold) : '5'} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> Sales History (Future)</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Sales history will appear here once the Sales module is implemented.</p>
          </CardContent>
        </Card>
      </div>

      {pricing?.explanation && pricing.explanation.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Pricing Explanation</CardTitle></CardHeader>
          <CardContent>
            <div className="p-3 bg-muted rounded-md space-y-1">
              {pricing.explanation.map((line, i) => (
                <p key={i} className="text-sm text-muted-foreground">{line}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm ${highlight ? 'font-semibold text-primary' : 'font-medium'}`}>{value}</span>
    </div>
  );
}
