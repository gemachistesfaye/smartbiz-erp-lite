import { useParams } from '@tanstack/react-router';
import { useSupplier } from '../hooks/use-suppliers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { ErrorScreen } from '@/components/shared/error-screen';
import { formatDate } from '@/lib/utils';
import { Mail, Phone, MapPin, Building, FileText, ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function SupplierDetailPage() {
  const { supplierId } = useParams({ from: '/dashboard/suppliers/$supplierId' });
  const { data: supplier, isLoading, error } = useSupplier(supplierId);

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen message="Supplier not found" />;
  if (!supplier) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/suppliers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{supplier.name}</h1>
            {supplier.companyName && (
              <p className="text-muted-foreground">{supplier.companyName}</p>
            )}
          </div>
        </div>
        <Badge variant={supplier.status === 'ACTIVE' ? 'default' : 'secondary'}>
          {supplier.status === 'ACTIVE' ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {supplier.contactPerson && (
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-medium">{supplier.contactPerson}</p>
                </div>
              </div>
            )}
            {supplier.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{supplier.phone}</p>
                </div>
              </div>
            )}
            {supplier.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{supplier.email}</p>
                </div>
              </div>
            )}
            {supplier.city && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-medium">{supplier.city}</p>
                </div>
              </div>
            )}
            {supplier.address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{supplier.address}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {supplier.tin && (
              <div>
                <p className="text-sm text-muted-foreground">TIN Number</p>
                <p className="font-medium">{supplier.tin}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">{formatDate(supplier.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{formatDate(supplier.updatedAt)}</p>
            </div>
            {supplier._count && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Purchases</p>
                  <p className="text-2xl font-bold">{supplier._count.purchases}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stock Receivings</p>
                  <p className="text-2xl font-bold">{supplier._count.stockReceivings}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {supplier.notes && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{supplier.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
