import { useRef } from 'react';
import { Printer, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { useBusinessInfo } from '@/features/settings/hooks/use-settings';
import type { Sale } from '@/types/models';
import { exportInvoiceToPDF } from '@/lib/pdf-export';

interface InvoiceProps {
  sale: Sale;
}

export function Invoice({ sale }: InvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { data: businessInfo } = useBusinessInfo();

  const handlePrint = () => {
    const content = invoiceRef.current;
    if (!content) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${sale.saleNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 13px; padding: 30px; color: #333; }
          .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #0D8ABC; padding-bottom: 20px; }
          .business-name { font-size: 22px; font-weight: bold; color: #0D8ABC; }
          .invoice-title { font-size: 28px; font-weight: bold; text-align: right; color: #0D8ABC; }
          .invoice-meta { text-align: right; font-size: 12px; color: #666; margin-top: 8px; }
          .info-row { display: flex; gap: 40px; margin-bottom: 25px; }
          .info-block h3 { font-size: 11px; text-transform: uppercase; color: #999; margin-bottom: 5px; letter-spacing: 0.5px; }
          .info-block p { font-size: 13px; line-height: 1.6; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #0D8ABC; color: white; padding: 10px 12px; text-align: left; font-size: 12px; }
          th:nth-child(3), th:nth-child(4), th:nth-child(5) { text-align: right; }
          td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px; }
          td:nth-child(3), td:nth-child(4), td:nth-child(5) { text-align: right; }
          tr:hover { background: #f9f9f9; }
          .totals { display: flex; justify-content: flex-end; margin-bottom: 20px; }
          .totals-box { width: 280px; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
          .totals-row.total { border-top: 2px solid #333; padding-top: 10px; margin-top: 5px; font-size: 16px; font-weight: bold; }
          .totals-row.discount { color: #dc2626; }
          .payment-info { background: #f5f5f5; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
          .payment-info h3 { font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 8px; }
          .credit-notice { background: #fef3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 6px; margin-top: 10px; }
          .credit-notice strong { color: #856404; }
          .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 11px; color: #999; }
          @media print { body { padding: 15px; } }
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

  const handleExportPDF = () => {
    exportInvoiceToPDF(
      {
        saleNumber: sale.saleNumber,
        createdAt: sale.createdAt,
        customer: sale.customer
          ? { firstName: sale.customer.firstName, lastName: sale.customer.lastName, phone: sale.customer.phone }
          : undefined,
        cashier: sale.cashier,
        items: sale.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
        subtotal: sale.subtotal,
        taxAmount: sale.taxAmount,
        discountAmount: sale.discountAmount,
        totalAmount: sale.totalAmount,
        paymentMethod: sale.paymentMethod,
        amountTendered: sale.amountTendered,
        changeAmount: sale.changeAmount,
        status: sale.status,
        dueDate: sale.dueDate,
      },
      businessInfo?.name
    );
  };

  return (
    <div className="space-y-4">
      <div ref={invoiceRef} className="bg-white text-black p-6 max-w-[700px] mx-auto">
        <div className="header">
          <div>
            <div className="business-name">{businessInfo?.name || 'SmartBiz ERP Lite'}</div>
            {businessInfo?.phone && <div className="text-xs text-gray-500 mt-1">{businessInfo.phone}</div>}
            {businessInfo?.address && <div className="text-xs text-gray-500">{businessInfo.address}</div>}
          </div>
          <div>
            <div className="invoice-title">INVOICE</div>
            <div className="invoice-meta">
              <div><strong>Invoice #:</strong> {sale.saleNumber}</div>
              <div><strong>Date:</strong> {formatDateTime(sale.createdAt)}</div>
              <div><strong>Status:</strong> {sale.status}</div>
            </div>
          </div>
        </div>

        <div className="info-row">
          {sale.customer && (
            <div className="info-block">
              <h3>Bill To</h3>
              <p>
                {sale.customer.firstName} {sale.customer.lastName || ''}
              </p>
              {sale.customer.phone && <p>{sale.customer.phone}</p>}
            </div>
          )}
          {sale.cashier && (
            <div className="info-block">
              <h3>Served By</h3>
              <p>{sale.cashier.firstName} {sale.cashier.lastName}</p>
            </div>
          )}
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.product?.name || 'Product'}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(Number(item.unitPrice))}</td>
                <td>{formatCurrency(Number(item.totalPrice))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="totals">
          <div className="totals-box">
            <div className="totals-row">
              <span>Subtotal</span>
              <span>{formatCurrency(sale.subtotal)}</span>
            </div>
            {sale.discountAmount > 0 && (
              <div className="totals-row discount">
                <span>Discount</span>
                <span>-{formatCurrency(sale.discountAmount)}</span>
              </div>
            )}
            {sale.taxAmount > 0 && (
              <div className="totals-row">
                <span>Tax</span>
                <span>{formatCurrency(sale.taxAmount)}</span>
              </div>
            )}
            <div className="totals-row total">
              <span>Total</span>
              <span>{formatCurrency(sale.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="payment-info">
          <h3>Payment Information</h3>
          <div className="totals-row">
            <span>Payment Method</span>
            <span className="font-semibold">{sale.paymentMethod.replace('_', ' ')}</span>
          </div>
          {sale.amountTendered !== undefined && (
            <>
              <div className="totals-row">
                <span>Amount Tendered</span>
                <span>{formatCurrency(sale.amountTendered)}</span>
              </div>
              <div className="totals-row">
                <span>Change</span>
                <span>{formatCurrency(sale.changeAmount || 0)}</span>
              </div>
            </>
          )}
          {sale.paymentMethod === 'CREDIT' && (
            <div className="credit-notice">
              <strong>Credit Sale</strong><br />
              <span>Total: {formatCurrency(sale.totalAmount)}</span><br />
              {sale.dueDate && (
                <>
                  <span>Due: {new Date(sale.dueDate).toLocaleDateString()}</span>
                  <br />
                </>
              )}
            </div>
          )}
        </div>

        <div className="footer">
          <p>Thank you for your business!</p>
          <p className="mt-1">{businessInfo?.name || 'SmartBiz ERP Lite'}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer className="mr-2 h-4 w-4" />
          Print Invoice
        </Button>
        <Button onClick={handleExportPDF} variant="outline" size="sm">
          <FileDown className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>
    </div>
  );
}
