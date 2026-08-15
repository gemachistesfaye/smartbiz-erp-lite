import { useRef } from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/store/auth-store';
import type { Sale } from '@/types/models';

interface ReceiptProps {
  sale: Sale;
}

export function Receipt({ sale }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  const handlePrint = () => {
    const content = receiptRef.current;
    if (!content) return;

    const printWindow = window.open('', '_blank', 'width=320,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${sale.saleNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; font-size: 12px; width: 280px; padding: 10px; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .line { border-top: 1px dashed #000; margin: 8px 0; }
          .row { display: flex; justify-content: space-between; margin: 2px 0; }
          .item-row { margin: 4px 0; }
          .item-name { font-weight: bold; }
          .item-detail { color: #555; font-size: 11px; }
          .total-row { font-weight: bold; font-size: 14px; margin-top: 4px; }
          .footer { text-align: center; margin-top: 12px; font-size: 10px; color: #555; }
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
    <div className="space-y-4">
      <div ref={receiptRef} className="bg-white text-black p-4 font-mono text-xs max-w-[300px] mx-auto">
        <div className="center bold text-base mb-1">SmartBiz ERP Lite</div>
        <div className="center text-xs text-gray-500 mb-2">{user?.businessId ? 'Business' : 'Store'}</div>

        <div className="line" />

        <div className="row">
          <span>Date:</span>
          <span>{formatDateTime(sale.createdAt)}</span>
        </div>
        <div className="row">
          <span>Receipt:</span>
          <span className="bold">{sale.saleNumber}</span>
        </div>
        <div className="row">
          <span>Cashier:</span>
          <span>{sale.cashier ? `${sale.cashier.firstName} ${sale.cashier.lastName}` : 'N/A'}</span>
        </div>
        {sale.customer && (
          <div className="row">
            <span>Customer:</span>
            <span>{sale.customer.firstName} {sale.customer.lastName || ''}</span>
          </div>
        )}

        <div className="line" />

        <div className="bold mb-1">Items</div>
        {sale.items.map((item, i) => (
          <div key={i} className="item-row">
            <div className="flex justify-between">
              <span className="item-name">{item.product?.name || 'Product'}</span>
              <span>{formatCurrency(Number(item.totalPrice))}</span>
            </div>
            <div className="item-detail">
              {item.quantity} x {formatCurrency(Number(item.unitPrice))}
            </div>
          </div>
        ))}

        <div className="line" />

        <div className="row">
          <span>Subtotal:</span>
          <span>{formatCurrency(Number(sale.subtotal))}</span>
        </div>
        {Number(sale.discountAmount) > 0 && (
          <div className="row text-red-600">
            <span>Discount:</span>
            <span>-{formatCurrency(Number(sale.discountAmount))}</span>
          </div>
        )}
        <div className="row total-row">
          <span>TOTAL:</span>
          <span>{formatCurrency(Number(sale.totalAmount))}</span>
        </div>

        <div className="line" />

        <div className="row">
          <span>Payment:</span>
          <span className="bold">{sale.paymentMethod}</span>
        </div>

          {sale.paymentMethod === 'CREDIT' && sale.customer && (
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <div className="row bold">
              <span>Credit Sale</span>
            </div>
            <div className="row">
              <span>Outstanding:</span>
              <span>{formatCurrency(Number((sale.customer as Record<string, unknown>)?.creditBalance || 0))}</span>
            </div>
            {sale.dueDate && (
              <div className="row">
                <span>Due Date:</span>
                <span>{new Date(sale.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        )}

        <div className="line" />

        <div className="footer">
          <p>Thank you for your purchase!</p>
          <p className="mt-1">SmartBiz ERP Lite</p>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer className="mr-2 h-4 w-4" />
          Print Receipt
        </Button>
      </div>
    </div>
  );
}
