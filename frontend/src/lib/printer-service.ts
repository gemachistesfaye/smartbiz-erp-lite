import toast from 'react-hot-toast';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { Sale, Product } from '@/types/models';
import type { BusinessSettings } from '@/features/settings/hooks/use-settings';

export interface PrinterConfig {
  type: 'browser' | 'network';
  networkUrl?: string;
}

function buildReceiptText(sale: Sale, businessName?: string): string {
  const lines: string[] = [];
  const name = businessName || 'SmartBiz ERP Lite';
  const width = 32;
  const center = (text: string) => text.padStart(Math.floor((width + text.length) / 2)).padEnd(width);
  const divider = '-'.repeat(width);
  const row = (label: string, value: string) =>
    `${label.padEnd(16)}${value.padStart(16)}`;

  lines.push(center(name));
  lines.push(center('Receipt'));
  lines.push(divider);
  lines.push(row('Date:', formatDateTime(sale.createdAt)));
  lines.push(row('Receipt:', sale.saleNumber));
  if (sale.cashier) {
    lines.push(row('Cashier:', `${sale.cashier.firstName} ${sale.cashier.lastName}`));
  }
  if (sale.customer) {
    lines.push(row('Customer:', `${sale.customer.firstName} ${sale.customer.lastName || ''}`.trim()));
  }
  lines.push(divider);
  lines.push(center('Items'));
  lines.push(divider);

  for (const item of sale.items) {
    const name = (item.product?.name || 'Product').substring(0, width - 2);
    lines.push(name);
    lines.push(row(`${item.quantity} x`, formatCurrency(Number(item.unitPrice))));
  }

  lines.push(divider);
  lines.push(row('Subtotal:', formatCurrency(sale.subtotal)));
  if (Number(sale.discountAmount) > 0) {
    lines.push(row('Discount:', `-${formatCurrency(sale.discountAmount)}`));
  }
  lines.push(row('TOTAL:', formatCurrency(sale.totalAmount)));
  lines.push(divider);
  lines.push(row('Payment:', sale.paymentMethod));
  if (sale.paymentMethod === 'CREDIT') {
    lines.push(row('Outstanding:', formatCurrency(sale.totalAmount)));
  }
  lines.push(divider);
  lines.push(center('Thank you!'));

  return lines.join('\n');
}

function buildInvoiceText(sale: Sale, businessName?: string): string {
  const lines: string[] = [];
  const name = businessName || 'SmartBiz ERP Lite';
  const width = 40;
  const center = (text: string) => text.padStart(Math.floor((width + text.length) / 2)).padEnd(width);
  const divider = '-'.repeat(width);
  const row = (label: string, value: string) =>
    `${label.padEnd(22)}${value.padStart(18)}`;

  lines.push(center(name));
  lines.push(center('INVOICE'));
  lines.push(divider);
  lines.push(row('Invoice #:', sale.saleNumber));
  lines.push(row('Date:', formatDateTime(sale.createdAt)));
  if (sale.cashier) {
    lines.push(row('Cashier:', `${sale.cashier.firstName} ${sale.cashier.lastName}`));
  }
  if (sale.customer) {
    lines.push(center('Bill To'));
    lines.push(center(`${sale.customer.firstName} ${sale.customer.lastName || ''}`.trim()));
    if (sale.customer.phone) lines.push(center(sale.customer.phone));
  }
  lines.push(divider);
  lines.push(center('Items'));
  lines.push(divider);

  for (const item of sale.items) {
    const itemName = (item.product?.name || 'Product').substring(0, width - 10);
    lines.push(itemName);
    lines.push(row(`  ${item.quantity} x`, formatCurrency(Number(item.unitPrice))));
  }

  lines.push(divider);
  lines.push(row('Subtotal:', formatCurrency(sale.subtotal)));
  if (sale.discountAmount > 0) {
    lines.push(row('Discount:', `-${formatCurrency(sale.discountAmount)}`));
  }
  if (sale.taxAmount > 0) {
    lines.push(row('Tax:', formatCurrency(sale.taxAmount)));
  }
  lines.push(row('TOTAL:', formatCurrency(sale.totalAmount)));
  lines.push(divider);
  lines.push(row('Payment:', sale.paymentMethod));
  if (sale.paymentMethod === 'CREDIT') {
    lines.push(row('Balance Due:', formatCurrency(sale.totalAmount)));
  }
  lines.push(divider);
  lines.push(center('Thank you for your business!'));

  return lines.join('\n');
}

function buildPriceLabelText(product: Product, businessName?: string, quantity = 1): string {
  const lines: string[] = [];
  const width = 32;
  const center = (text: string) => text.padStart(Math.floor((width + text.length) / 2)).padEnd(width);
  const divider = '-'.repeat(width);

  if (businessName) {
    lines.push(center(businessName));
    lines.push(divider);
  }
  lines.push(center(product.name));
  lines.push(divider);
  lines.push(center(`Price: ${formatCurrency(Number(product.sellingPrice))}`));
  if (product.unit) {
    lines.push(center(`Unit: ${product.unit.name}`));
  }
  if (quantity > 1) {
    lines.push(center(`Qty: ${quantity}`));
  }
  if (product.sku) {
    lines.push(center(`SKU: ${product.sku}`));
  }

  return lines.join('\n');
}

function printViaBrowser(htmlContent: string, title: string): void {
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (!printWindow) {
    toast.error('Popup blocked. Please allow popups for printing.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; font-size: 12px; white-space: pre; padding: 10px; }
      </style>
    </head>
    <body>${htmlContent}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

async function printViaNetwork(text: string, networkUrl: string): Promise<void> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const response = await fetch(networkUrl, {
      method: 'POST',
      body: data,
      headers: { 'Content-Type': 'application/octet-stream' },
    });

    if (!response.ok) {
      throw new Error(`Printer responded with status ${response.status}`);
    }

    toast.success('Sent to printer');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Printing failed';
    toast.error(`Print error: ${message}`);
    throw error;
  }
}

export class PrinterService {
  static async printReceipt(
    sale: Sale,
    config: PrinterConfig,
    businessSettings?: BusinessSettings,
  ): Promise<void> {
    const text = buildReceiptText(sale, businessSettings?.receiptHeader || undefined);

    if (config.type === 'network' && config.networkUrl) {
      await printViaNetwork(text, config.networkUrl);
    } else {
      const html = text.replace(/\n/g, '<br>');
      printViaBrowser(html, `Receipt - ${sale.saleNumber}`);
    }
  }

  static async printInvoice(
    sale: Sale,
    config: PrinterConfig,
    businessSettings?: BusinessSettings,
  ): Promise<void> {
    const text = buildInvoiceText(sale, businessSettings?.receiptHeader || undefined);

    if (config.type === 'network' && config.networkUrl) {
      await printViaNetwork(text, config.networkUrl);
    } else {
      const html = text.replace(/\n/g, '<br>');
      printViaBrowser(html, `Invoice - ${sale.saleNumber}`);
    }
  }

  static async printPriceLabel(
    product: Product,
    quantity: number,
    config: PrinterConfig,
    businessName?: string,
  ): Promise<void> {
    const text = buildPriceLabelText(product, businessName, quantity);

    if (config.type === 'network' && config.networkUrl) {
      await printViaNetwork(text, config.networkUrl);
    } else {
      const html = text.replace(/\n/g, '<br>');
      printViaBrowser(html, `Price Label - ${product.name}`);
    }
  }

  static getAvailablePrinters(): string[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('smartbiz_printer_config');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.networkUrl ? [parsed.networkUrl] : [];
        } catch {
          return [];
        }
      }
    }
    return [];
  }
}
