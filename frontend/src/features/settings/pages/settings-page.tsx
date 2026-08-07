import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Building2, DollarSign, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useSettings,
  useBusinessInfo,
  useUpdateSettings,
  useUpdateBusiness,
} from '../hooks/use-settings';

const settingsSchema = z.object({
  name: z.string().min(1, 'Business name is required').max(200),
  phone: z.string().max(20).optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  currency: z.string().min(1, 'Currency is required').max(3),
  currencySymbol: z.string().min(1, 'Symbol is required').max(5),
  taxRate: z.coerce.number().min(0, 'Tax rate must be non-negative').max(100, 'Tax rate cannot exceed 100%'),
  lowStockThreshold: z.coerce.number().min(0, 'Must be non-negative').int(),
  tinNumber: z.string().max(20).optional().or(z.literal('')),
  vatNumber: z.string().max(20).optional().or(z.literal('')),
  receiptHeader: z.string().max(500).optional().or(z.literal('')),
  receiptFooter: z.string().max(500).optional().or(z.literal('')),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SettingsPage() {
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { data: business, isLoading: businessLoading } = useBusinessInfo();
  const updateSettings = useUpdateSettings();
  const updateBusiness = useUpdateBusiness();

  const isLoading = settingsLoading || businessLoading;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    if (settings && business) {
      reset({
        name: business.name || '',
        phone: business.phone || '',
        address: business.address || '',
        currency: settings.currency || 'ETB',
        currencySymbol: settings.currencySymbol || 'Br',
        taxRate: settings.taxRate || 0,
        lowStockThreshold: settings.lowStockThreshold || 5,
        tinNumber: settings.tinNumber || '',
        vatNumber: settings.vatNumber || '',
        receiptHeader: settings.receiptHeader || '',
        receiptFooter: settings.receiptFooter || '',
      });
    }
  }, [settings, business, reset]);

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  const onSubmit = async (data: SettingsFormData) => {
    const businessPromise = updateBusiness.mutateAsync({
      name: data.name,
      phone: data.phone || undefined,
      address: data.address || undefined,
    });

    const settingsPromise = updateSettings.mutateAsync({
      currency: data.currency,
      currencySymbol: data.currencySymbol,
      taxRate: data.taxRate,
      lowStockThreshold: data.lowStockThreshold,
      tinNumber: data.tinNumber || undefined,
      vatNumber: data.vatNumber || undefined,
      receiptHeader: data.receiptHeader || undefined,
      receiptFooter: data.receiptFooter || undefined,
    });

    await Promise.all([businessPromise, settingsPromise]);
  };

  const isPending = updateSettings.isPending || updateBusiness.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your business configuration and preferences</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-base">Business Information</CardTitle>
                <CardDescription>Your business identity and contact details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name *</Label>
              <Input id="name" placeholder="e.g. SmartBiz Store" {...register('name')} aria-invalid={!!errors.name} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+251911234567" {...register('phone')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Bole, Addis Ababa" {...register('address')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-base">Currency & Tax</CardTitle>
                <CardDescription>Configure your currency and tax settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency *</Label>
                <Input id="currency" placeholder="ETB" maxLength={3} {...register('currency')} aria-invalid={!!errors.currency} />
                {errors.currency && <p className="text-sm text-destructive">{errors.currency.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currencySymbol">Symbol *</Label>
                <Input id="currencySymbol" placeholder="Br" maxLength={5} {...register('currencySymbol')} aria-invalid={!!errors.currencySymbol} />
                {errors.currencySymbol && <p className="text-sm text-destructive">{errors.currencySymbol.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%) *</Label>
                <Input id="taxRate" type="number" step="0.01" min="0" max="100" placeholder="0" {...register('taxRate')} aria-invalid={!!errors.taxRate} />
                {errors.taxRate && <p className="text-sm text-destructive">{errors.taxRate.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input id="lowStockThreshold" type="number" min="0" placeholder="5" {...register('lowStockThreshold')} />
              <p className="text-xs text-muted-foreground">Default alert threshold for low stock notifications</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tinNumber">TIN Number</Label>
                <Input id="tinNumber" placeholder="e.g. 0012345678" maxLength={20} {...register('tinNumber')} />
                <p className="text-xs text-muted-foreground">Tax Identification Number</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vatNumber">VAT Number</Label>
                <Input id="vatNumber" placeholder="e.g. VAT-0012345" maxLength={20} {...register('vatNumber')} />
                <p className="text-xs text-muted-foreground">Value Added Tax registration number</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-base">Receipt Settings</CardTitle>
                <CardDescription>Customize your receipt header and footer</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receiptHeader">Receipt Header</Label>
              <Input id="receiptHeader" placeholder="e.g. SmartBiz Store" maxLength={500} {...register('receiptHeader')} />
              <p className="text-xs text-muted-foreground">Text displayed at the top of receipts</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiptFooter">Receipt Footer</Label>
              <Input id="receiptFooter" placeholder="e.g. Thank you for shopping with us." maxLength={500} {...register('receiptFooter')} />
              <p className="text-xs text-muted-foreground">Text displayed at the bottom of receipts</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending || !isDirty}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
