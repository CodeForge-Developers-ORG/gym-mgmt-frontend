import * as React from "react"
import { Search, ChevronDown, MoreHorizontal, Filter } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// A simplified custom data table since we aren't installing tanstack/react-table directly for this demo,
// but providing the exact premium look and feel of a complex data table.

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = "Search..."
}: DataTableProps<T>) {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-9 w-full bg-background"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Pending</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((col, i) => (
                <DropdownMenuCheckboxItem key={i} checked>
                  {col.header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="h-12 px-4 align-middle font-medium">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                  {columns.map((col, i) => (
                    <td key={i} className="p-4 align-middle">
                      {col.cell 
                        ? col.cell(row) 
                        : col.accessorKey 
                          ? String(row[col.accessorKey]) 
                          : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing 1 to {data.length} of {data.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
