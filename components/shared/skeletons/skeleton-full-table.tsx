import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SkeletonFullTableProps {
  colCount: number;
  rowCount?: number;
}

export default function SkeletonFullTable({ colCount, rowCount = 5 }: SkeletonFullTableProps) {
  return (
    <Card>
      {/* ---- Card Header ---- */}
      <CardHeader className="flex flex-row items-center justify-between">
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-40" />

        {/* Button Skeleton */}
        <Skeleton className="h-9 w-24 rounded-md" />
      </CardHeader>

      {/* ---- Card Content ---- */}
      <CardContent>
        <Table>
          {/* ---- Table Header ---- */}
          <TableHeader>
            <TableRow>
              {Array.from({ length: colCount }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-5 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* ---- Table Body ---- */}
          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: colCount }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
