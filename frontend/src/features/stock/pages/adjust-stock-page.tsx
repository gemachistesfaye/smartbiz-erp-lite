import { AdjustStockForm } from '../components/adjust-stock-form';
import { AdjustStockHistory } from '../components/adjust-stock-history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SlidersHorizontal, History } from 'lucide-react';

export function AdjustStockPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Adjust Stock</h1>
        <p className="text-muted-foreground">Increase, decrease, or correct inventory levels</p>
      </div>

      <Tabs defaultValue="adjust">
        <TabsList>
          <TabsTrigger value="adjust" className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Adjust Stock
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Adjustment History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="adjust">
          <AdjustStockForm />
        </TabsContent>
        <TabsContent value="history">
          <AdjustStockHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
