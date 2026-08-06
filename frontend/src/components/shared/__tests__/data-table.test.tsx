import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataTable, type Column } from '@/components/shared/data-table';

interface TestRow {
  id: string;
  name: string;
  value: number;
  [key: string]: unknown;
}

const columns: Column<TestRow>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'value', header: 'Value', sortable: true },
];

const data: TestRow[] = [
  { id: '1', name: 'Alpha', value: 100 },
  { id: '2', name: 'Beta', value: 200 },
  { id: '3', name: 'Gamma', value: 150 },
];

describe('DataTable', () => {
  it('renders table headers', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('renders data rows', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText('No data found.')).toBeInTheDocument();
  });

  it('renders custom empty message', () => {
    render(<DataTable columns={columns} data={[]} emptyMessage="No products found." />);
    expect(screen.getByText('No products found.')).toBeInTheDocument();
  });

  it('displays pagination info', () => {
    render(<DataTable columns={columns} data={data} pageSize={2} />);
    expect(screen.getByText(/Showing 1 to 2 of 3 entries/)).toBeInTheDocument();
  });
});
