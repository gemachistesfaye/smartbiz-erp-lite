import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type {
  SalesReportData,
  InventoryReportData,
  CustomerCreditData,
  ExpenseReportData,
  ProfitabilityData,
} from '@/features/reports/hooks/use-reports';
import type { ReportFilters } from '@/features/reports/hooks/use-reports';
import { formatCurrency, formatDate } from '@/lib/utils';

interface InvoiceData {
  saleNumber: string;
  createdAt: string;
  customer?: { firstName: string; lastName?: string; phone?: string; address?: string };
  cashier?: { firstName: string; lastName: string };
  items: Array<{
    product?: { name: string; sku?: string };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  amountTendered?: number;
  changeAmount?: number;
  status: string;
  dueDate?: string;
}

function addPdfHeader(doc: jsPDF, title: string, businessName?: string): void {
  const pageWidth = doc.internal.pageSize.getWidth();

  if (businessName) {
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(businessName, pageWidth / 2, 20, { align: 'center' });
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, businessName ? 30 : 20, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Generated: ${dateStr}`, pageWidth / 2, businessName ? 37 : 27, { align: 'center' });
  doc.setTextColor(0);
}

function addPageNumbers(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text('SmartBiz ERP Lite', 14, pageHeight - 10);
  }
  doc.setTextColor(0);
}

export function exportSalesReportToPDF(data: SalesReportData, filters: ReportFilters): void {
  const doc = new jsPDF();
  addPdfHeader(doc, 'Sales Report');

  let y = 44;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (filters.range) {
    doc.text(`Period: ${filters.range}`, 14, y);
    y += 6;
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 14, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Total Revenue', formatCurrency(data.summary.totalRevenue)],
      ['Total Sales', String(data.summary.totalSales)],
      ['Average Sale', formatCurrency(data.summary.averageSale)],
      ['Cash Sales', formatCurrency(data.summary.cashSales)],
      ['Credit Sales', formatCurrency(data.summary.creditSales)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [13, 138, 188] },
    styles: { fontSize: 9 },
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  if (data.topProducts.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Top Selling Products', 14, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [['#', 'Product', 'Category', 'Qty Sold', 'Revenue', '% of Sales']],
      body: data.topProducts.map((p, i) => [
        String(i + 1),
        p.name,
        p.category,
        String(p.quantitySold),
        formatCurrency(p.revenue),
        `${p.percentageOfSales}%`,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [13, 138, 188] },
      styles: { fontSize: 8 },
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  }

  if (data.categoryBreakdown.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Sales by Category', 14, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [['Category', 'Quantity', 'Revenue', 'Percentage']],
      body: data.categoryBreakdown.map((c) => [
        c.name,
        String(c.quantity),
        formatCurrency(c.revenue),
        `${c.percentage}%`,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [13, 138, 188] },
      styles: { fontSize: 8 },
    });
  }

  addPageNumbers(doc);
  doc.save(`sales-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportInventoryReportToPDF(data: InventoryReportData): void {
  const doc = new jsPDF('l');
  addPdfHeader(doc, 'Inventory Report');

  let y = 44;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 14, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Total Products', String(data.summary.totalProducts)],
      ['Total Stock Quantity', String(data.summary.totalStockQuantity)],
      ['Inventory Value', data.summary.totalValue !== null ? formatCurrency(data.summary.totalValue) : 'N/A'],
      ['Low Stock Products', String(data.summary.lowStockProducts)],
      ['Out of Stock Products', String(data.summary.outOfStockProducts)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [13, 138, 188] },
    styles: { fontSize: 9 },
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  if (data.products.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Product Details', 14, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [['Product', 'SKU', 'Category', 'Current Stock', 'Min Stock', 'Unit Cost', 'Value', 'Status']],
      body: data.products.map((p) => [
        p.name,
        p.sku || '-',
        p.category,
        String(p.currentStock),
        String(p.minimumStock),
        formatCurrency(p.unitCost),
        formatCurrency(p.inventoryValue),
        p.status === 'out_of_stock' ? 'Out of Stock' : p.status === 'low_stock' ? 'Low Stock' : 'In Stock',
      ]),
      theme: 'grid',
      headStyles: { fillColor: [13, 138, 188] },
      styles: { fontSize: 7 },
    });
  }

  addPageNumbers(doc);
  doc.save(`inventory-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportCustomerCreditReportToPDF(data: CustomerCreditData): void {
  const doc = new jsPDF();
  addPdfHeader(doc, 'Customer Credit Report');

  let y = 44;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 14, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Total Outstanding', formatCurrency(data.summary.totalOutstanding)],
      ['Customers with Credit', String(data.summary.customerCount)],
      ['Approaching Limit', String(data.summary.approachingLimit)],
      ['Exceeded Limit', String(data.summary.exceededLimit)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [13, 138, 188] },
    styles: { fontSize: 9 },
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  if (data.customers.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer Details', 14, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [['Customer', 'Phone', 'Credit Limit', 'Outstanding', 'Available Credit', 'Status']],
      body: data.customers.map((c) => [
        c.name,
        c.phone || '-',
        c.creditLimit ? formatCurrency(c.creditLimit) : 'No limit',
        formatCurrency(c.outstanding),
        c.availableCredit !== null ? formatCurrency(c.availableCredit) : 'Unlimited',
        c.status === 'exceeded_limit' ? 'Exceeded' : c.status === 'approaching_limit' ? 'Near Limit' : 'Healthy',
      ]),
      theme: 'grid',
      headStyles: { fillColor: [13, 138, 188] },
      styles: { fontSize: 8 },
    });
  }

  addPageNumbers(doc);
  doc.save(`customer-credit-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportExpenseReportToPDF(data: ExpenseReportData, profitability?: ProfitabilityData): void {
  const doc = new jsPDF();
  addPdfHeader(doc, 'Expense Report');

  let y = 44;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 14, y);
  y += 8;

  const summaryRows: string[][] = [
    ['Total Expenses', formatCurrency(data.summary.totalExpenses)],
    ['Expense Count', String(data.summary.expenseCount)],
  ];

  if (profitability) {
    summaryRows.push(['Revenue', formatCurrency(profitability.revenue)]);
    summaryRows.push(['Estimated Profit', formatCurrency(profitability.estimatedProfit)]);
  }

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: summaryRows,
    theme: 'grid',
    headStyles: { fillColor: [13, 138, 188] },
    styles: { fontSize: 9 },
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  if (data.byCategory.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Expenses by Category', 14, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [['Category', 'Total Amount', 'Count', 'Percentage']],
      body: data.byCategory.map((c) => [
        c.name,
        formatCurrency(c.totalAmount),
        String(c.count),
        data.summary.totalExpenses > 0
          ? `${Math.round((c.totalAmount / data.summary.totalExpenses) * 100)}%`
          : '0%',
      ]),
      theme: 'grid',
      headStyles: { fillColor: [13, 138, 188] },
      styles: { fontSize: 9 },
    });
  }

  addPageNumbers(doc);
  doc.save(`expense-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportProfitabilityReportToPDF(data: ProfitabilityData): void {
  const doc = new jsPDF();
  addPdfHeader(doc, 'Profitability Report');

  let y = 44;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Financial Summary', 14, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Total Revenue', formatCurrency(data.revenue)],
      ['Total Expenses', formatCurrency(data.expenses)],
      ['Estimated Profit', formatCurrency(data.estimatedProfit)],
      ['Expense Data Available', data.hasExpenseData ? 'Yes' : 'No'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [13, 138, 188] },
    styles: { fontSize: 10 },
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  const margin = doc.internal.pageSize.getWidth() - 28;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Profitability', margin, y, { align: 'right' });
  y += 8;

  doc.setFontSize(20);
  doc.setTextColor(data.estimatedProfit >= 0 ? 0 : 220);
  doc.text(formatCurrency(data.estimatedProfit), margin, y, { align: 'right' });
  doc.setTextColor(0);

  if (!data.hasExpenseData) {
    y += 14;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120);
    doc.text(
      'Note: Expense tracking is not fully configured. Profit estimate is based on revenue only.',
      14,
      y
    );
    doc.setTextColor(0);
  }

  addPageNumbers(doc);
  doc.save(`profitability-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportInvoiceToPDF(invoice: InvoiceData, businessName?: string): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(businessName || 'SmartBiz ERP Lite', 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('INVOICE', pageWidth - 14, 20, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`Invoice #: ${invoice.saleNumber}`, pageWidth - 14, 28, { align: 'right' });
  doc.text(`Date: ${formatDate(invoice.createdAt)}`, pageWidth - 14, 34, { align: 'right' });
  doc.text(`Status: ${invoice.status}`, pageWidth - 14, 40, { align: 'right' });

  let y = 48;

  if (invoice.customer) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('Bill To:', 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(`${invoice.customer.firstName} ${invoice.customer.lastName || ''}`.trim(), 14, y);
    y += 5;
    if (invoice.customer.phone) {
      doc.text(invoice.customer.phone, 14, y);
      y += 5;
    }
    if (invoice.customer.address) {
      doc.text(invoice.customer.address, 14, y);
      y += 5;
    }
  }

  if (invoice.cashier) {
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.text('Cashier:', 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(`${invoice.cashier.firstName} ${invoice.cashier.lastName}`, 14, y);
  }

  y += 12;

  autoTable(doc, {
    startY: y,
    head: [['#', 'Product', 'Qty', 'Unit Price', 'Total']],
    body: invoice.items.map((item, i) => [
      String(i + 1),
      item.product?.name || 'Product',
      String(item.quantity),
      formatCurrency(Number(item.unitPrice)),
      formatCurrency(Number(item.totalPrice)),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [13, 138, 188] },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 10 },
      2: { cellWidth: 20, halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
    },
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  const rightX = pageWidth - 14;
  const labelX = pageWidth - 70;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  doc.text('Subtotal:', labelX, y);
  doc.text(formatCurrency(invoice.subtotal), rightX, y, { align: 'right' });
  y += 6;

  if (invoice.discountAmount > 0) {
    doc.text('Discount:', labelX, y);
    doc.text(`-${formatCurrency(invoice.discountAmount)}`, rightX, y, { align: 'right' });
    y += 6;
  }

  if (invoice.taxAmount > 0) {
    doc.text('Tax:', labelX, y);
    doc.text(formatCurrency(invoice.taxAmount), rightX, y, { align: 'right' });
    y += 6;
  }

  doc.setDrawColor(0);
  doc.line(labelX, y, rightX, y);
  y += 6;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', labelX, y);
  doc.text(formatCurrency(invoice.totalAmount), rightX, y, { align: 'right' });
  y += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  doc.text('Payment Method:', labelX, y);
  doc.text(invoice.paymentMethod.replace('_', ' '), rightX, y, { align: 'right' });
  y += 6;

  if (invoice.paymentMethod === 'CREDIT') {
    doc.setFont('helvetica', 'bold');
    doc.text('Outstanding Balance:', labelX, y);
    doc.text(formatCurrency(invoice.totalAmount), rightX, y, { align: 'right' });
    y += 6;
    if (invoice.dueDate) {
      doc.setFont('helvetica', 'normal');
      doc.text('Due Date:', labelX, y);
      doc.text(new Date(invoice.dueDate).toLocaleDateString(), rightX, y, { align: 'right' });
      y += 6;
    }
  }

  if (invoice.amountTendered !== undefined) {
    doc.setFont('helvetica', 'normal');
    doc.text('Amount Tendered:', labelX, y);
    doc.text(formatCurrency(invoice.amountTendered), rightX, y, { align: 'right' });
    y += 6;
    doc.text('Change:', labelX, y);
    doc.text(formatCurrency(invoice.changeAmount || 0), rightX, y, { align: 'right' });
  }

  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text('Thank you for your business!', pageWidth / 2, footerY, { align: 'center' });
  doc.text('Generated by SmartBiz ERP Lite', pageWidth / 2, footerY + 5, { align: 'center' });

  addPageNumbers(doc);
  doc.save(`invoice-${invoice.saleNumber}.pdf`);
}
