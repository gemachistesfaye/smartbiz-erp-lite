import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRecordPayment } from '../hooks/use-customers';

const paymentSchema = z.object({
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  method: z.enum(['CASH', 'MOBILE_MONEY', 'CREDIT']),
  reference: z.string().max(100).optional(),
  notes: z.string().optional(),
  paymentDate: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  customerId: string;
  outstandingBalance: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PaymentForm({ customerId, outstandingBalance, onSuccess, onCancel }: PaymentFormProps) {
  const recordPayment = useRecordPayment();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: undefined,
      method: 'CASH',
      reference: '',
      notes: '',
      paymentDate: new Date().toISOString().split('T')[0],
    },
  });

  const paymentAmount = watch('amount') || 0;
  const remainingBalance = outstandingBalance - paymentAmount;

  const onSubmit = (data: PaymentFormData) => {
    recordPayment.mutate(
      {
        customerId,
        data: {
          ...data,
          reference: data.reference || undefined,
          notes: data.notes || undefined,
        },
      },
      { onSuccess: () => onSuccess?.() },
    );
  };

  const isPending = recordPayment.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Balance</span>
            <span className="font-medium">Br {outstandingBalance.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Payment Amount</span>
            <span className="font-medium text-primary">Br {paymentAmount.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex justify-between border-t pt-2 text-sm">
            <span className="text-muted-foreground">Remaining Balance</span>
            <span className={`font-bold ${remainingBalance <= 0 ? 'text-green-600' : ''}`}>
              Br {remainingBalance.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Payment Amount (ETB) *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            max={outstandingBalance}
            placeholder="0.00"
            {...register('amount')}
            aria-invalid={!!errors.amount}
          />
          {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="method">Payment Method *</Label>
          <select
            id="method"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            {...register('method')}
          >
            <option value="CASH">Cash</option>
            <option value="MOBILE_MONEY">Mobile Money</option>
            <option value="CREDIT">Credit</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentDate">Payment Date</Label>
          <Input id="paymentDate" type="date" {...register('paymentDate')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reference">Reference</Label>
          <Input id="reference" placeholder="Optional reference number" {...register('reference')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Input id="notes" placeholder="Optional payment notes" {...register('notes')} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending || paymentAmount <= 0}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Recording...
            </>
          ) : (
            'Record Payment'
          )}
        </Button>
      </div>
    </form>
  );
}
