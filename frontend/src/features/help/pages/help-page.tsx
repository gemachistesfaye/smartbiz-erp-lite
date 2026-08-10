import { Link } from '@tanstack/react-router';
import { HelpCircle, Package, Warehouse, ShoppingCart, Users, Settings, LayoutDashboard, BarChart3, CreditCard, ArrowRight } from 'lucide-react';

const sections = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    description: 'Get an overview of your business performance with key metrics and charts.',
    href: '/dashboard',
  },
  {
    icon: Package,
    title: 'Product Management',
    description: 'Add, edit, and organize your products with categories, units, and pricing.',
    href: '/products',
  },
  {
    icon: Warehouse,
    title: 'Inventory',
    description: 'Track stock levels, receive inventory, and manage low-stock alerts.',
    href: '/inventory',
  },
  {
    icon: ShoppingCart,
    title: 'Sales & POS',
    description: 'Record sales transactions, process payments, and manage the point of sale.',
    href: '/pos',
  },
  {
    icon: CreditCard,
    title: 'Customer Credit',
    description: 'Manage customer accounts, credit limits, and payment tracking.',
    href: '/customers',
  },
  {
    icon: Users,
    title: 'User Management',
    description: 'Add users, manage roles, and control access to the system.',
    href: '/users',
  },
  {
    icon: BarChart3,
    title: 'Reports',
    description: 'View detailed reports on sales, inventory, expenses, and profitability.',
    href: '/reports',
  },
  {
    icon: Settings,
    title: 'System Settings',
    description: 'Configure your business profile, currency, tax settings, and receipts.',
    href: '/settings',
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
          <Link
            key={section.title}
            to={section.href}
            className="group rounded-lg border p-6 space-y-3 transition-colors hover:bg-muted/50 hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">{section.title}</h3>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm text-muted-foreground">{section.description}</p>
          </Link>
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
