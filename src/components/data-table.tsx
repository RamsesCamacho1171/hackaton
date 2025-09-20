// components/data-table.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { StockStatusKey } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";

export type MedicineRow = {
  id: string;
  name: string;
  presentation?: string;
  unitPrice: number;
  qty: number;
  status: StockStatusKey;
};

const columns: ColumnDef<MedicineRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <HeaderButton onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Medicamento
      </HeaderButton>
    ),
    cell: ({ row }) => <div className="font-medium text-zinc-900">{row.original.name}</div>,
  },
  {
    accessorKey: "presentation",
    header: () => <span>Presentación</span>,
    cell: ({ row }) => <span className="text-zinc-600">{row.original.presentation ?? "—"}</span>,
  },
  {
    accessorKey: "qty",
    header: ({ column }) => (
      <HeaderButton onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Cantidad
      </HeaderButton>
    ),
    cell: ({ row }) => <span className="tabular-nums">{row.original.qty}</span>,
  },
  {
    id: "status",
    header: () => <span>Estado</span>,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    enableSorting: false,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Acciones</span>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-right">
        <Link
          href={`/comprar/${row.original.id}`}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-3 text-xs font-medium text-white hover:bg-indigo-700"
        >
          Comprar más
        </Link>
      </div>
    ),
  },
];

export function DataTable({
  data,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
}: {
  data: MedicineRow[];
  pageSize?: number;
  pageSizeOptions?: number[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [{ pageIndex, pageSize: ps }, setPagination] = React.useState({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination: { pageIndex, pageSize: ps } },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Resetear a la página 0 si cambian los datos (ej. al filtrar por hospital)
  React.useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [data.length]);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 text-zinc-700">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 text-left">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-zinc-500">
                No hay resultados con los filtros actuales.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-zinc-100 hover:bg-zinc-50/60">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginador */}
      <div className="flex flex-col gap-3 border-t border-zinc-200 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-zinc-600">
          Página <strong>{table.getState().pagination.pageIndex + 1}</strong> de{" "}
          <strong>{table.getPageCount() || 1}</strong> —{" "}
          {data.length} registros
        </div>

        <div className="flex items-center gap-2">
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Tamaño de página"
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n} / pág.
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <PagerButton onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              «
            </PagerButton>
            <PagerButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              ‹
            </PagerButton>
            <PagerButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              ›
            </PagerButton>
            <PagerButton onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              »
            </PagerButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-zinc-700 hover:text-zinc-900"
    >
      {children}
      <ArrowUpDown size={14} className="opacity-60" />
    </button>
  );
}

function PagerButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}
