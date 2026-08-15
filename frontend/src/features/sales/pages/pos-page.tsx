import { useState, useMemo, useCallback } from 'react';
import { Link } from '@tanstack/react-router';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  CheckCircle2,
  CreditCard,
  Banknote,
  Package,
  User,
  ArrowLeft,
  Search,
  FileDown,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useProducts } from '@/features/products/hooks/use-products';
import { useActiveCustomers } from '@/features/customers/hooks/use-customers';
import { useCreateSale } from '@/features/sales/hooks/use-sales';
import { formatCurrency } from '@/lib/utils';
import { Receipt } from '@/components/shared/receipt';
import { Invoice } from '@/components/shared/invoice';
import type { Product, Customer, Sale } from '@/types/models';

interface CartItem {
  productId: string;
  name: string;
  sku?: string;
  sellingPrice: number;
  quantity: number;
  maxStock: number;
  subtotal: number;
}

export function PosPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CREDIT'>('CASH');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [dueDate, setDueDate] = useState('');

  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    search: searchQuery,
    status: 'ACTIVE',
    limit: 50,
  });

  const { data: customersData } = useActiveCustomers();
  const createSale = useCreateSale();

  const products = useMemo(() => productsData?.data || [], [productsData]);
  const customers = useMemo(() => customersData || [], [customersData]);

  const filteredCustomers = useMemo(() => {
    if (!customerSearchQuery) return customers;
    const query = customerSearchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.firstName.toLowerCase().includes(query) ||
        c.lastName?.toLowerCase().includes(query) ||
        c.phone?.includes(query)
    );
  }, [customers, customerSearchQuery]);

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.subtotal, 0),
    [cart]
  );
  const cartTotal = useMemo(
    () => Math.max(0, cartSubtotal - discountAmount),
    [cartSubtotal, discountAmount]
  );
  const cartItemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const addToCart = useCallback(
    (product: Product) => {
      const stock = product.inventory?.quantity ?? 0;
      if (stock <= 0) return;

      setCart((prev) => {
        const existing = prev.find((item) => item.productId === product.id);
        if (existing) {
          const newQty = Math.min(existing.quantity + 1, stock);
          return prev.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: newQty, subtotal: newQty * item.sellingPrice }
              : item
          );
        }
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            sku: product.sku,
            sellingPrice: Number(product.sellingPrice),
            quantity: 1,
            maxStock: stock,
            subtotal: Number(product.sellingPrice),
          },
        ];
      });
    },
    []
  );

  const updateQuantity = useCallback((productId: string, newQty: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item;
          const qty = Math.max(1, Math.min(newQty, item.maxStock));
          return { ...item, quantity: qty, subtotal: qty * item.sellingPrice };
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setDiscountAmount(0);
    setSelectedCustomer(null);
    setPaymentMethod('CASH');
    setDueDate('');
  }, []);

  const handleCheckout = useCallback(() => {
    if (cart.length === 0) return;
    setShowCheckoutDialog(true);
  }, [cart.length]);

  const handleCompleteSale = useCallback(() => {
    if (createSale.isPending) return;

    const payload: {
      paymentMethod: string;
      subtotal: number;
      discountAmount: number;
      totalAmount: number;
      items: { productId: string; quantity: number; unitPrice: number }[];
      customerId?: string;
      dueDate?: string;
    } = {
      paymentMethod,
      subtotal: cartSubtotal,
      discountAmount,
      totalAmount: cartTotal,
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.sellingPrice,
      })),
    };

    if (paymentMethod === 'CREDIT' && selectedCustomer) {
      payload.customerId = selectedCustomer.id;
    }
    if (paymentMethod === 'CREDIT' && dueDate) {
      payload.dueDate = dueDate;
    }

    createSale.mutate(payload, {
      onSuccess: (sale) => {
        setCompletedSale(sale);
        setShowCheckoutDialog(false);
        setShowSuccessDialog(true);
        clearCart();
      },
    });
  }, [
    createSale,
    paymentMethod,
    selectedCustomer,
    dueDate,
    cart,
    cartSubtotal,
    cartTotal,
    discountAmount,
    clearCart,
  ]);

  const getCustomerName = (customer: Customer) =>
    `${customer.firstName} ${customer.lastName || ''}`.trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/sales">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Point of Sale</h1>
            <p className="text-muted-foreground">Create a new sale</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="lg:hidden"
          onClick={() => setShowMobileCart(!showMobileCart)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart ({cartItemCount})
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className={`lg:col-span-3 ${showMobileCart ? 'hidden lg:block' : 'block'}`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Products
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingProducts ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    {searchQuery ? 'No products found matching your search.' : 'No products available.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[calc(100vh-20rem)] overflow-y-auto">
                  {products.map((product) => {
                    const stock = product.inventory?.quantity ?? 0;
                    const isOutOfStock = stock <= 0;
                    const cartItem = cart.find((c) => c.productId === product.id);
                    const inCartQty = cartItem?.quantity ?? 0;

                    return (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        disabled={isOutOfStock}
                        className={`relative flex flex-col items-start p-3 rounded-lg border text-left transition-colors min-h-[8rem] ${
                          isOutOfStock
                            ? 'opacity-50 cursor-not-allowed bg-muted/30'
                            : 'hover:bg-accent hover:border-accent-foreground/20 cursor-pointer'
                        }`}
                      >
                        <div className="w-full flex items-start justify-between gap-2">
                          <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                          {inCartQty > 0 && (
                            <Badge variant="secondary" className="shrink-0 text-xs">
                              {inCartQty} in cart
                            </Badge>
                          )}
                        </div>
                        {product.sku && (
                          <p className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</p>
                        )}
                        <div className="mt-auto pt-2 w-full flex items-end justify-between">
                          <p className="font-bold text-sm">{formatCurrency(Number(product.sellingPrice))}</p>
                          {isOutOfStock ? (
                            <Badge variant="destructive">Out of stock</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              {stock} available
                            </Badge>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className={`lg:col-span-2 ${showMobileCart ? 'block' : 'hidden lg:block'}`}>
          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart
                {cartItemCount > 0 && (
                  <Badge variant="secondary">{cartItemCount} items</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Your cart is empty. Click a product to add it.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-[calc(100vh-32rem)] overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-start gap-3 p-3 rounded-lg border"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(item.sellingPrice)} each
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Max stock: {item.maxStock}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            min={1}
                            max={item.maxStock}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.productId,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="h-8 w-14 text-center text-xs"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.maxStock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <p className="font-medium text-sm">
                            {formatCurrency(item.subtotal)}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatCurrency(cartSubtotal)}</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Discount</label>
                      <Input
                        type="number"
                        min={0}
                        max={cartSubtotal}
                        value={discountAmount || ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setDiscountAmount(Math.min(val, cartSubtotal));
                        }}
                        placeholder="0.00"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-lg">{formatCurrency(cartTotal)}</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Payment Method</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={paymentMethod === 'CASH' ? 'default' : 'outline'}
                          onClick={() => setPaymentMethod('CASH')}
                          className="w-full"
                        >
                          <Banknote className="mr-2 h-4 w-4" />
                          Cash
                        </Button>
                        <Button
                          variant={paymentMethod === 'CREDIT' ? 'default' : 'outline'}
                          onClick={() => setPaymentMethod('CREDIT')}
                          className="w-full"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Credit
                        </Button>
                      </div>
                    </div>

                    {paymentMethod === 'CREDIT' && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">
                          <User className="inline h-4 w-4 mr-1" />
                          Customer (Required for credit)
                        </label>
                        {selectedCustomer ? (
                          <div className="flex items-center justify-between p-2 rounded-md border">
                            <div>
                              <p className="text-sm font-medium">
                                {getCustomerName(selectedCustomer)}
                              </p>
                              {selectedCustomer.phone && (
                                <p className="text-xs text-muted-foreground">
                                  {selectedCustomer.phone}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => setSelectedCustomer(null)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Input
                              placeholder="Search customer by name or phone..."
                              value={customerSearchQuery}
                              onChange={(e) => setCustomerSearchQuery(e.target.value)}
                            />
                            <div className="max-h-40 overflow-y-auto border rounded-md">
                              {filteredCustomers.length === 0 ? (
                                <p className="p-3 text-sm text-muted-foreground text-center">
                                  No customers found
                                </p>
                              ) : (
                                filteredCustomers.map((customer) => (
                                  <button
                                    key={customer.id}
                                    onClick={() => {
                                      setSelectedCustomer(customer);
                                      setCustomerSearchQuery('');
                                    }}
                                    className="w-full flex items-center gap-2 p-2 text-left text-sm hover:bg-accent transition-colors border-b last:border-b-0"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium truncate">
                                        {getCustomerName(customer)}
                                      </p>
                                      {customer.phone && (
                                        <p className="text-xs text-muted-foreground">
                                          {customer.phone}
                                        </p>
                                      )}
                                    </div>
                                    <Badge variant="outline" className="text-xs shrink-0">
                                      Bal: {formatCurrency(customer.creditBalance)}
                                    </Badge>
                                  </button>
                                ))
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {paymentMethod === 'CREDIT' && (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          Due Date *
                        </label>
                        <Input
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {!dueDate && paymentMethod === 'CREDIT' && (
                          <p className="text-xs text-destructive">Due date is required for credit sales</p>
                        )}
                      </div>
                    )}

                    <Button
                      className="w-full min-h-[48px]"
                      size="lg"
                      disabled={cart.length === 0 || (paymentMethod === 'CREDIT' && (!selectedCustomer || !dueDate))}
                      onClick={handleCheckout}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Complete Sale
                    </Button>

                    {cart.length > 0 && (
                      <Button variant="ghost" className="w-full" onClick={clearCart}>
                        Clear Cart
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Sale</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Items</span>
              <span>{cartItemCount} ({cart.length} products)</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(cartSubtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-destructive">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Payment</span>
              <Badge variant={paymentMethod === 'CASH' ? 'default' : 'secondary'}>
                {paymentMethod === 'CASH' ? 'Cash' : 'Credit'}
              </Badge>
            </div>
            {paymentMethod === 'CREDIT' && selectedCustomer && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Customer</span>
                <span>{getCustomerName(selectedCustomer)}</span>
              </div>
            )}
            {paymentMethod === 'CREDIT' && dueDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Due Date</span>
                <span>{new Date(dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCheckoutDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteSale} disabled={createSale.isPending}>
              {createSale.isPending ? 'Processing...' : 'Confirm & Complete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Sale Completed
            </DialogTitle>
          </DialogHeader>
          {completedSale && (
            <Receipt sale={completedSale} />
          )}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowSuccessDialog(false);
                setShowInvoiceDialog(true);
              }}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Invoice
            </Button>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowSuccessDialog(false)}>
              New Sale
            </Button>
            <Link to="/sales" className="w-full sm:w-auto">
              <Button className="w-full">View Sales</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice</DialogTitle>
          </DialogHeader>
          {completedSale && (
            <Invoice sale={completedSale} />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvoiceDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
