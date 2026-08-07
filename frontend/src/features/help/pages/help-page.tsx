import { HelpCircle, Package, Warehouse, ShoppingCart, Users, Settings } from 'lucide-react';

const sections = [
  {
    icon: Package,
    title: 'Product Management',
    description: 'Add, edit, and organize your products with categories, units, and pricing.',
  },
  {
    icon: Warehouse,
    title: 'Inventory',
    description: 'Track stock levels, receive inventory, and manage low-stock alerts.',
  },
  {
    icon: ShoppingCart,
    title: 'Sales & Expenses',
    description: 'Record sales transactions and track business expenses.',
  },
  {
    icon: Users,
    title: 'Customer Credit',
    description: 'Manage customer accounts, credit limits, and payment tracking.',
  },
  {
    icon: Settings,
    title: 'System Settings',
    description: 'Configure your business profile, preferences, and integrations.',
  },
];

export function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">
          Learn how to use SmartBiz ERP to manage your business.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title} className="rounded-lg border p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <section.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{section.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{section.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-dashed p-8 text-center">
        <HelpCircle className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <h3 className="mt-3 text-sm font-semibold">Need more help?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact your system administrator for additional support.
        </p>
      </div>
    </div>
  );
}
