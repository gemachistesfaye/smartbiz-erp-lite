import { useRef } from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types/models';

interface PriceLabelProps {
  product: Product;
  businessName?: string;
  quantity?: number;
}

export function PriceLabel({ product, businessName, quantity = 1 }: PriceLabelProps) {
  const labelRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = labelRef.current;
    if (!content) return;

    const printWindow = window.open('', '_blank', 'width=320,height=200');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Price Label - ${product.name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 12px; padding: 8px; }
          .label { text-align: center; border: 1px solid #333; padding: 8px; max-width: 280px; margin: 0 auto; }
          .business-name { font-size: 10px; color: #666; margin-bottom: 4px; }
          .product-name { font-size: 16px; font-weight: bold; margin-bottom: 6px; line-height: 1.2; }
          .price { font-size: 20px; font-weight: bold; color: #0D8ABC; margin-bottom: 4px; }
          .unit { font-size: 11px; color: #666; }
          .sku { font-size: 9px color: #999; margin-top: 4px; }
          .qty { font-size: 11px; color: #333; margin-top: 2px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="space-y-3">
      <div ref={labelRef} className="bg-white text-black p-3 max-w-[280px] mx-auto border border-gray-300 text-center">
        {businessName && (
          <div className="text-[10px] text-gray-500 mb-1">{businessName}</div>
        )}
        <div className="text-base font-bold leading-tight mb-2">{product.name}</div>
        <div className="text-xl font-bold text-[#0D8ABC] mb-1">
          {formatCurrency(Number(product.sellingPrice))}
        </div>
        {product.unit && (
          <div className="text-[11px] text-gray-500">per {product.unit.name}</div>
        )}
        {quantity > 1 && (
          <div className="text-[11px] text-gray-700 mt-1">Qty: {quantity}</div>
        )}
        {product.sku && (
          <div className="text-[9px] text-gray-400 mt-1">SKU: {product.sku}</div>
        )}
      </div>

      <div className="flex justify-center">
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer className="mr-2 h-4 w-4" />
          Print Label
        </Button>
      </div>
    </div>
  );
}
