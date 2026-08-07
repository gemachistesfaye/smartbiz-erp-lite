import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateExpense, useUpdateExpense, useExpenseCategories } from '../hooks/use-expenses';
import type { Expense } from '../hooks/use-expenses';

const expenseSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than zero'),
  description: z.string().min(1, 'Description is required').max(1000),
  date: z.string().min(1, 'Date is required'),
  paymentMethod: z.enum(['CASH', 'MOBILE_MONEY', 'CREDIT']).optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ExpenseForm({ expense, onSuccess, onCancel }: ExpenseFormProps) {
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const { data: categories, isLoading: categoriesLoading } = useExpenseCategories();
  const isEditing = !!expense;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      categoryId: expense?.categoryId || '',
      amount: expense?.amount || 0,
      description: expense?.description || '',
      date: expense?.date ? new Date(expense.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      paymentMethod: (expense?.paymentMethod as 'CASH' | 'MOBILE_MONEY' | 'CREDIT') || 'CASH',
    },
  });

  const onSubmit = (data: ExpenseFormData) => {
    const payload = {
      ...data,
      paymentMethod: data.paymentMethod || 'CASH',
    };

    if (isEditing) {
      updateExpense.mutate(
        { id: expense.id, data: payload },
        { onSuccess: () => onSuccess?.() },
      );
    } else {
      createExpense.mutate(payload, { onSuccess: () => onSuccess?.() });
    }
  };

  const isPending = createExpense.isPending || updateExpense.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="categoryId">Category *</Label>
        {categoriesLoading ? (
          <div className="h-9 bg-muted animate-pulse rounded-md" />
        ) : categories && categories.length > 0 ? (
          <select
            id="categoryId"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            {...register('categoryId')}
            aria-invalid={!!errors.categoryId}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-sm text-muted-foreground">
            No expense categories yet. Create one first.
          </p>
        )}
        {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (ETB) *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            {...register('amount')}
            aria-invalid={!!errors.amount}
          />
          {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            {...register('date')}
            aria-invalid={!!errors.date}
          />
          {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <select
          id="paymentMethod"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          {...register('paymentMethod')}
        >
          <option value="CASH">Cash</option>
          <option value="MOBILE_MONEY">Mobile Money</option>
          <option value="CREDIT">Credit</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Input
          id="description"
          placeholder="What was this expense for?"
          {...register('description')}
          aria-invalid={!!errors.description}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending || (categories && categories.length === 0)}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Update Expense' : 'Save Expense'
          )}
        </Button>
      </div>
    </form>
  );
}
