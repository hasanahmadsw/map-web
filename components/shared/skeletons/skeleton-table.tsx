import { Skeleton } from "@/components/ui/skeleton";
import { TableRow, TableCell } from "@/components/ui/table";

export default function SkeletonTable({
  colCount,
  rowCount = 5,
  hasActionCol = true,
}: {
  colCount: number;
  rowCount?: number;
  hasActionCol?: boolean;
}) {
  const theColCount = hasActionCol ? colCount - 1 : colCount;

  return (
    <>
      {Array.from({ length: rowCount }).map((_, index) => (
        <TableRow key={index}>
          {Array.from({ length: theColCount }).map((_, index) => (
            <TableCell key={index}>
              <Skeleton className="h-5" />
            </TableCell>
          ))}
          {hasActionCol && (
            <TableCell>
              <div className="flex items-center gap-3">
                <Skeleton className="size-8" />
                <Skeleton className="size-8" />
              </div>
            </TableCell>
          )}
        </TableRow>
      ))}
    </>
  );
}
