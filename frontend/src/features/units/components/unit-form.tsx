import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateUnit, useUpdateUnit } from '../hooks/use-units';
import type { Unit } from '@/types/models';

const unitSchema = z.object({
  name: z.string().min(1, 'Unit name is required').max(50, 'Name must be 50 characters or less'),
  symbol: z.string().min(1, 'Symbol is required').max(10, 'Symbol must be 10 characters or less'),
  description: z.string().optional(),
});

type UnitFormData = z.infer<typeof unitSchema>;

interface UnitFormProps {
  unit?: Unit;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UnitForm({ unit, onSuccess, onCancel }: UnitFormProps) {
  const createUnit = useCreateUnit();
  const updateUnit = useUpdateUnit();
  const isEditing = !!unit;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      name: unit?.name || '',
      symbol: unit?.symbol || '',
      description: unit?.description || '',
    },
  });

  const onSubmit = (data: UnitFormData) => {
    if (isEditing) {
      updateUnit.mutate(
        { id: unit.id, data },
        { onSuccess: () => onSuccess?.() },
      );
    } else {
      createUnit.mutate(data, { onSuccess: () => onSuccess?.() });
    }
  };

  const isPending = createUnit.isPending || updateUnit.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Unit Name *</Label>
        <Input
          id="name"
          placeholder="e.g. Kilogram"
          {...register('name')}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="symbol">Symbol / Abbreviation *</Label>
        <Input
          id="symbol"
          placeholder="e.g. kg"
          {...register('symbol')}
          aria-invalid={!!errors.symbol}
        />
        {errors.symbol && <p className="text-sm text-destructive">{errors.symbol.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Optional description"
          {...register('description')}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Update Unit' : 'Create Unit'
          )}
        </Button>
      </div>
    </form>
  );
}
