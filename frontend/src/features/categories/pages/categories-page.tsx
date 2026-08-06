import { FolderTree } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Organize your products by category</p>
        </div>
        <Button>
          <FolderTree className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FolderTree className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Category management coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
