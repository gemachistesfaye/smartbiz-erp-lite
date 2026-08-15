import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const BACKUP_VERSION = '1.0';

export interface ImportSummary {
  categories: { created: number; skipped: number };
  units: { created: number; skipped: number };
  products: { created: number; skipped: number };
  suppliers: { created: number; skipped: number };
  customers: { created: number; skipped: number };
  expenseCategories: { created: number; skipped: number };
  sales: { created: number; skipped: number };
  payments: { created: number; skipped: number };
  expenses: { created: number; skipped: number };
  inventory: { created: number; skipped: number };
  inventoryTransactions: { created: number; skipped: number };
  stockReceivings: { created: number; skipped: number };
  stockAdjustments: { created: number; skipped: number };
}

@Injectable()
export class BackupService {
  constructor(private readonly prisma: PrismaService) {}

  async exportBackup(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        name: true,
        slug: true,
        phone: true,
        address: true,
        currency: true,
      },
    });

    const settings = await this.prisma.businessSettings.findUnique({
      where: { businessId },
    });

    const [
      categories,
      units,
      products,
      suppliers,
      customers,
      sales,
      saleItems,
      payments,
      expenses,
      expenseCategories,
      inventory,
      inventoryTransactions,
      stockReceivings,
      stockReceivingItems,
      stockAdjustments,
    ] = await Promise.all([
      this.prisma.category.findMany({ where: { businessId } }),
      this.prisma.unit.findMany({ where: { businessId } }),
      this.prisma.product.findMany({ where: { businessId } }),
      this.prisma.supplier.findMany({ where: { businessId } }),
      this.prisma.customer.findMany({ where: { businessId } }),
      this.prisma.sale.findMany({ where: { businessId } }),
      this.prisma.saleItem.findMany({
        where: { sale: { businessId } },
      }),
      this.prisma.payment.findMany({ where: { businessId } }),
      this.prisma.expense.findMany({ where: { businessId } }),
      this.prisma.expenseCategory.findMany({ where: { businessId } }),
      this.prisma.inventory.findMany({
        where: { product: { businessId } },
      }),
      this.prisma.inventoryTransaction.findMany({ where: { businessId } }),
      this.prisma.stockReceiving.findMany({ where: { businessId } }),
      this.prisma.stockReceivingItem.findMany({
        where: { stockReceiving: { businessId } },
      }),
      this.prisma.stockAdjustment.findMany({ where: { businessId } }),
    ]);

    return {
      version: BACKUP_VERSION,
      timestamp: new Date().toISOString(),
      business,
      settings,
      data: {
        categories,
        units,
        products,
        suppliers,
        customers,
        sales,
        saleItems,
        payments,
        expenses,
        expenseCategories,
        inventory,
        inventoryTransactions,
        stockReceivings,
        stockReceivingItems,
        stockAdjustments,
      },
    };
  }

  async importBackup(businessId: string, backupData: Record<string, any>) {
    if (!backupData || typeof backupData !== 'object') {
      throw new BadRequestException('Invalid backup data format');
    }

    if (!backupData.version || !backupData.data) {
      throw new BadRequestException('Backup missing required fields: version, data');
    }

    if (backupData.version !== BACKUP_VERSION) {
      throw new BadRequestException(
        `Unsupported backup version: ${backupData.version}. Expected: ${BACKUP_VERSION}`,
      );
    }

    const data = backupData.data;
    const summary: ImportSummary = {
      categories: { created: 0, skipped: 0 },
      units: { created: 0, skipped: 0 },
      products: { created: 0, skipped: 0 },
      suppliers: { created: 0, skipped: 0 },
      customers: { created: 0, skipped: 0 },
      expenseCategories: { created: 0, skipped: 0 },
      sales: { created: 0, skipped: 0 },
      payments: { created: 0, skipped: 0 },
      expenses: { created: 0, skipped: 0 },
      inventory: { created: 0, skipped: 0 },
      inventoryTransactions: { created: 0, skipped: 0 },
      stockReceivings: { created: 0, skipped: 0 },
      stockAdjustments: { created: 0, skipped: 0 },
    };

    await this.prisma.$transaction(async (tx) => {
      // Import Expense Categories
      if (Array.isArray(data.expenseCategories)) {
        for (const ec of data.expenseCategories) {
          const existing = await tx.expenseCategory.findFirst({
            where: { businessId, name: ec.name },
          });
          if (existing) {
            summary.expenseCategories.skipped++;
          } else {
            await tx.expenseCategory.create({
              data: {
                businessId,
                name: ec.name,
                isActive: ec.isActive ?? true,
              },
            });
            summary.expenseCategories.created++;
          }
        }
      }

      // Import Categories
      if (Array.isArray(data.categories)) {
        for (const cat of data.categories) {
          const existing = await tx.category.findFirst({
            where: { businessId, name: cat.name },
          });
          if (existing) {
            summary.categories.skipped++;
          } else {
            await tx.category.create({
              data: {
                businessId,
                name: cat.name,
                description: cat.description,
                color: cat.color,
                icon: cat.icon,
                isActive: cat.isActive ?? true,
              },
            });
            summary.categories.created++;
          }
        }
      }

      // Import Units
      if (Array.isArray(data.units)) {
        for (const unit of data.units) {
          const existing = await tx.unit.findFirst({
            where: { businessId, symbol: unit.symbol },
          });
          if (existing) {
            summary.units.skipped++;
          } else {
            await tx.unit.create({
              data: {
                businessId,
                name: unit.name,
                symbol: unit.symbol,
                description: unit.description,
                isActive: unit.isActive ?? true,
              },
            });
            summary.units.created++;
          }
        }
      }

      // Import Suppliers
      if (Array.isArray(data.suppliers)) {
        for (const supplier of data.suppliers) {
          const existing = await tx.supplier.findFirst({
            where: { businessId, name: supplier.name },
          });
          if (existing) {
            summary.suppliers.skipped++;
          } else {
            await tx.supplier.create({
              data: {
                businessId,
                name: supplier.name,
                companyName: supplier.companyName,
                contactPerson: supplier.contactPerson,
                phone: supplier.phone,
                email: supplier.email,
                tin: supplier.tin,
                address: supplier.address,
                city: supplier.city,
                notes: supplier.notes,
                status: supplier.status ?? 'ACTIVE',
                isActive: supplier.isActive ?? true,
              },
            });
            summary.suppliers.created++;
          }
        }
      }

      // Import Customers
      if (Array.isArray(data.customers)) {
        for (const customer of data.customers) {
          const existing = await tx.customer.findFirst({
            where: { businessId, firstName: customer.firstName, lastName: customer.lastName ?? null },
          });
          if (existing) {
            summary.customers.skipped++;
          } else {
            await tx.customer.create({
              data: {
                businessId,
                firstName: customer.firstName,
                lastName: customer.lastName,
                phone: customer.phone,
                email: customer.email,
                address: customer.address,
                creditBalance: customer.creditBalance ?? 0,
                creditLimit: customer.creditLimit,
                status: customer.status ?? 'ACTIVE',
                notes: customer.notes,
              },
            });
            summary.customers.created++;
          }
        }
      }

      // Import Products
      if (Array.isArray(data.products)) {
        for (const product of data.products) {
          const existing = await tx.product.findFirst({
            where: { businessId, name: product.name },
          });
          if (existing) {
            summary.products.skipped++;
          } else {
            // Resolve category and unit by name within the business
            let categoryId: string | null = null;
            if (product.categoryId) {
              const cat = await tx.category.findFirst({
                where: { businessId, name: product.category?.name },
              });
              categoryId = cat?.id ?? null;
            }

            let unitId: string | null = null;
            if (product.unitId) {
              const unit = await tx.unit.findFirst({
                where: { businessId, symbol: product.unit?.symbol },
              });
              unitId = unit?.id ?? null;
            }

            await tx.product.create({
              data: {
                businessId,
                categoryId,
                unitId,
                name: product.name,
                sku: product.sku,
                barcode: product.barcode,
                brand: product.brand,
                description: product.description,
                batchNumber: product.batchNumber,
                expiryDate: product.expiryDate ? new Date(product.expiryDate) : null,
                buyingPrice: product.buyingPrice ?? 0,
                quantityPurchased: product.quantityPurchased ?? 1,
                transportationCost: product.transportationCost ?? 0,
                loadingCost: product.loadingCost ?? 0,
                packagingCost: product.packagingCost ?? 0,
                storageCost: product.storageCost ?? 0,
                laborCost: product.laborCost ?? 0,
                customsCost: product.customsCost ?? 0,
                otherCosts: product.otherCosts ?? 0,
                vatPercentage: product.vatPercentage ?? 0,
                profitPercentage: product.profitPercentage ?? 0,
                sellingPrice: product.sellingPrice ?? 0,
                manualSellingPrice: product.manualSellingPrice ?? false,
                reorderLevel: product.reorderLevel ?? 0,
                maxStock: product.maxStock,
                status: product.status ?? 'ACTIVE',
                isActive: product.isActive ?? true,
              },
            });
            summary.products.created++;
          }
        }
      }

      // Import Sales
      if (Array.isArray(data.sales)) {
        for (const sale of data.sales) {
          const existing = await tx.sale.findFirst({
            where: { businessId, saleNumber: sale.saleNumber },
          });
          if (existing) {
            summary.sales.skipped++;
          } else {
            // Resolve cashier and customer
            const cashier = await tx.user.findFirst({
              where: { businessId, firstName: sale.cashier?.firstName },
            });
            let customerId: string | null = null;
            if (sale.customerId) {
              const customer = await tx.customer.findFirst({
                where: {
                  businessId,
                  firstName: sale.customer?.firstName,
                  lastName: sale.customer?.lastName ?? null,
                },
              });
              customerId = customer?.id ?? null;
            }

            await tx.sale.create({
              data: {
                businessId,
                cashierId: cashier?.id ?? sale.cashierId,
                customerId,
                saleNumber: sale.saleNumber,
                paymentMethod: sale.paymentMethod,
                subtotal: sale.subtotal,
                taxAmount: sale.taxAmount ?? 0,
                discountAmount: sale.discountAmount ?? 0,
                totalAmount: sale.totalAmount,
                amountTendered: sale.amountTendered,
                changeAmount: sale.changeAmount,
                status: sale.status ?? 'COMPLETED',
                notes: sale.notes,
                dueDate: sale.dueDate ? new Date(sale.dueDate) : null,
                clientId: sale.clientId,
                createdAt: sale.createdAt ? new Date(sale.createdAt) : undefined,
              },
            });
            summary.sales.created++;
          }
        }
      }

      // Import Payments
      if (Array.isArray(data.payments)) {
        for (const payment of data.payments) {
          const existing = await tx.payment.findFirst({
            where: { businessId, reference: payment.reference ?? '' },
          });
          if (existing && payment.reference) {
            summary.payments.skipped++;
          } else {
            const user = await tx.user.findFirst({
              where: { businessId, firstName: payment.user?.firstName },
            });
            let customerId: string | null = null;
            if (payment.customerId) {
              const customer = await tx.customer.findFirst({
                where: {
                  businessId,
                  firstName: payment.customer?.firstName,
                  lastName: payment.customer?.lastName ?? null,
                },
              });
              customerId = customer?.id ?? null;
            }

            await tx.payment.create({
              data: {
                businessId,
                saleId: payment.saleId,
                customerId,
                type: payment.type,
                method: payment.method,
                amount: payment.amount,
                reference: payment.reference,
                notes: payment.notes,
                userId: user?.id ?? payment.userId,
                createdAt: payment.createdAt ? new Date(payment.createdAt) : undefined,
              },
            });
            summary.payments.created++;
          }
        }
      }

      // Import Expenses
      if (Array.isArray(data.expenses)) {
        for (const expense of data.expenses) {
          const existing = await tx.expense.findFirst({
            where: { businessId, expenseNumber: expense.expenseNumber },
          });
          if (existing) {
            summary.expenses.skipped++;
          } else {
            const category = await tx.expenseCategory.findFirst({
              where: { businessId, name: expense.category?.name },
            });
            const user = await tx.user.findFirst({
              where: { businessId, firstName: expense.user?.firstName },
            });

            await tx.expense.create({
              data: {
                businessId,
                expenseNumber: expense.expenseNumber,
                categoryId: category?.id ?? expense.categoryId,
                amount: expense.amount,
                description: expense.description,
                date: expense.date ? new Date(expense.date) : new Date(),
                paymentMethod: expense.paymentMethod,
                receiptUrl: expense.receiptUrl,
                userId: user?.id ?? expense.userId,
                createdAt: expense.createdAt ? new Date(expense.createdAt) : undefined,
              },
            });
            summary.expenses.created++;
          }
        }
      }

      // Import Inventory
      if (Array.isArray(data.inventory)) {
        for (const inv of data.inventory) {
          const product = await tx.product.findFirst({
            where: { businessId, name: inv.product?.name },
          });
          if (!product) {
            summary.inventory.skipped++;
            continue;
          }

          const existing = await tx.inventory.findUnique({
            where: { productId: product.id },
          });
          if (existing) {
            summary.inventory.skipped++;
          } else {
            await tx.inventory.create({
              data: {
                productId: product.id,
                quantity: inv.quantity ?? 0,
                reservedQuantity: inv.reservedQuantity ?? 0,
                minThreshold: inv.minThreshold ?? 5,
                maxThreshold: inv.maxThreshold,
                averageCost: inv.averageCost ?? 0,
                inventoryValue: inv.inventoryValue ?? 0,
              },
            });
            summary.inventory.created++;
          }
        }
      }

      // Import Inventory Transactions
      if (Array.isArray(data.inventoryTransactions)) {
        for (const txn of data.inventoryTransactions) {
          const product = await tx.product.findFirst({
            where: { businessId, name: txn.product?.name },
          });
          const user = await tx.user.findFirst({
            where: { businessId, firstName: txn.user?.firstName },
          });
          if (!product || !user) {
            summary.inventoryTransactions.skipped++;
            continue;
          }

          await tx.inventoryTransaction.create({
            data: {
              businessId,
              productId: product.id,
              type: txn.type,
              quantity: txn.quantity,
              quantityBefore: txn.quantityBefore,
              quantityAfter: txn.quantityAfter,
              referenceId: txn.referenceId,
              referenceType: txn.referenceType,
              reason: txn.reason,
              userId: user.id,
              createdAt: txn.createdAt ? new Date(txn.createdAt) : undefined,
            },
          });
          summary.inventoryTransactions.created++;
        }
      }

      // Import Stock Receivings
      if (Array.isArray(data.stockReceivings)) {
        for (const sr of data.stockReceivings) {
          const existing = await tx.stockReceiving.findFirst({
            where: { businessId, purchaseReference: sr.purchaseReference ?? '' },
          });
          if (existing && sr.purchaseReference) {
            summary.stockReceivings.skipped++;
          } else {
            const supplier = sr.supplierId
              ? await tx.supplier.findFirst({
                  where: { businessId, name: sr.supplier?.name },
                })
              : null;
            const user = await tx.user.findFirst({
              where: { businessId, firstName: sr.user?.firstName },
            });

            const createdSr = await tx.stockReceiving.create({
              data: {
                businessId,
                supplierId: supplier?.id ?? null,
                purchaseReference: sr.purchaseReference,
                date: sr.date ? new Date(sr.date) : new Date(),
                subtotal: sr.subtotal ?? 0,
                transportationCost: sr.transportationCost ?? 0,
                packagingCost: sr.packagingCost ?? 0,
                storageCost: sr.storageCost ?? 0,
                laborCost: sr.laborCost ?? 0,
                otherCosts: sr.otherCosts ?? 0,
                totalCost: sr.totalCost ?? 0,
                notes: sr.notes,
                status: sr.status ?? 'DRAFT',
                userId: user?.id ?? sr.userId,
                createdAt: sr.createdAt ? new Date(sr.createdAt) : undefined,
              },
            });

            // Import stock receiving items
            if (Array.isArray(sr.items)) {
              for (const item of sr.items) {
                const product = await tx.product.findFirst({
                  where: { businessId, name: item.product?.name },
                });
                if (product) {
                  await tx.stockReceivingItem.create({
                    data: {
                      stockReceivingId: createdSr.id,
                      productId: product.id,
                      quantity: item.quantity,
                      buyingPrice: item.buyingPrice,
                      totalCost: item.totalCost,
                    },
                  });
                }
              }
            }
            summary.stockReceivings.created++;
          }
        }
      }

      // Import Stock Adjustments
      if (Array.isArray(data.stockAdjustments)) {
        for (const adj of data.stockAdjustments) {
          const product = await tx.product.findFirst({
            where: { businessId, name: adj.product?.name },
          });
          const user = await tx.user.findFirst({
            where: { businessId, firstName: adj.user?.firstName },
          });
          if (!product || !user) {
            summary.stockAdjustments.skipped++;
            continue;
          }

          await tx.stockAdjustment.create({
            data: {
              businessId,
              productId: product.id,
              type: adj.type,
              quantity: adj.quantity,
              reason: adj.reason,
              notes: adj.notes,
              userId: user.id,
              createdAt: adj.createdAt ? new Date(adj.createdAt) : undefined,
            },
          });
          summary.stockAdjustments.created++;
        }
      }
    });

    return {
      message: 'Backup imported successfully',
      summary,
    };
  }
}
