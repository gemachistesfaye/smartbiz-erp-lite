import { ReceiveStockForm } from '../components/receive-stock-form';
import { StockReceivingList } from '../components/stock-receiving-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, ClipboardList } from 'lucide-react';

export function ReceiveStockPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Receive Stock</h1>
        <p className="text-muted-foreground">Manage stock receiving from suppliers</p>
      </div>

      <Tabs defaultValue="receive">
        <TabsList>
          <TabsTrigger value="receive" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Receive Stock
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="receive">
          <ReceiveStockForm />
        </TabsContent>
        <TabsContent value="history">
          <StockReceivingList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
