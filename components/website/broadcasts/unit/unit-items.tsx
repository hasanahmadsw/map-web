import { CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { BroadcastUnitItem } from '@/types/broadcasts/broadcasts.types';
import { BroadcastUnitItemGroup } from '@/types/broadcasts/broadcast.enums';
import { formatGroup } from './unit-utils';

interface UnitItemsProps {
  groupedItems: Record<string, BroadcastUnitItem[]>;
}

export function UnitItems({ groupedItems }: UnitItemsProps) {
  return (
    <section className="mb-16">
      <div className="space-y-6">
        <div>
          <h2 className="mb-2 text-3xl font-semibold md:text-4xl">Equipment & Items</h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Complete list of equipment and items included in this unit
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedItems).map(([group, items]) => (
            <div key={group} className="space-y-4">
              {group !== 'OTHER' && (
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold md:text-2xl">
                    {formatGroup(group as BroadcastUnitItemGroup)}
                  </h3>
                </div>
              )}
              <div className="glass-card overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[70%]">Item</TableHead>
                      <TableHead className="w-[30%] text-center">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 h-1.5 w-1.5 shrink-0 rounded-full" />
                            {item.title}
                          </div>
                          {item.notes && (
                            <p className="text-muted-foreground mt-1 text-xs">{item.notes}</p>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.qty ? (
                            <Badge variant="outline" className="font-normal">
                              {item.qty}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

