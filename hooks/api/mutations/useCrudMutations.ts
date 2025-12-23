"use client";

import { useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";

type DetailKeyFn = (id: string | number) => readonly unknown[];
type ListsKeyFn = () => readonly unknown[];

type ToastApi = {
  success?: (msg: string) => void;
  error?: (msg: string) => void;
  info?: (msg: string) => void;
};

type ListDataShape<TItem> = {
  items?: TItem[];
  total?: number;
  [k: string]: any;
};

type Cfg<TItem, TCreate, TUpdate, TId extends string | number = string> = {
  /** React Query keys */
  keys: {
    all: readonly unknown[];
    detail: DetailKeyFn;
    /** If available, we will use it to update the lists optimistically */
    lists?: ListsKeyFn;
  };

  /** Service functions */
  service: Partial<{
    create: (input: TCreate) => Promise<TItem>;
    update: (id: TId, input: TUpdate) => Promise<TItem>;
    delete: (id: TId) => Promise<{ message?: string } | any>;
  }>;

  /** How to read the id from an item */
  getId: (item: TItem) => TId;

  /** (optional) Toast */
  toast?: ToastApi;

  /** (optional) Optimistic settings for list caches */
  optimistic?: {
    /** When create: insert the new element into the first list (or all lists). */
    insertIntoLists?: boolean;
    /** When update: update the element inside the lists. */
    updateInLists?: boolean;
    /** When delete: remove the element from the lists. */
    removeFromLists?: boolean;
  };

  /** (optional) Callbacks */
  onCreateSuccess?: (item: TItem) => void;
  onUpdateSuccess?: (item: TItem) => void;
  onDeleteSuccess?: (id: TId) => void;
};

export function useCrudMutations<TItem, TCreate, TUpdate, TId extends string | number = string>(
  cfg: Cfg<TItem, TCreate, TUpdate, TId>,
) {
  const qc = useQueryClient();
  const { keys, service, getId, toast, optimistic } = cfg;

  /** Helpers to update list caches of shape { items, total } */
  const updateAllListCaches = (updater: (data: ListDataShape<TItem>) => ListDataShape<TItem>) => {
    if (!keys.lists) return;
    const listPrefix = keys.lists();
    const queries = qc.getQueriesData<ListDataShape<TItem>>({
      queryKey: listPrefix as QueryKey,
    });

    for (const [qk, data] of queries) {
      if (!data || typeof data !== "object") continue;
      if (!Array.isArray(data.items)) continue;
      const next = updater({ ...data });
      qc.setQueryData(qk, next);
    }
  };

  const create = useMutation({
    mutationFn: service.create ?? (() => Promise.resolve({} as TItem)),
    onSuccess: (created) => {
      const id = getId(created);
      // Update detail directly
      qc.setQueryData(keys.detail(id), created);
      // invalidate globally
      qc.invalidateQueries({ queryKey: keys.all });

      // Optimistic: insert into lists
      if (optimistic?.insertIntoLists && keys.lists) {
        updateAllListCaches((data) => {
          const items = [created, ...data.items!];
          const total = (data.total ?? 0) + 1;
          return { ...data, items, total };
        });
      }

      toast?.success?.("Created successfully");
      cfg.onCreateSuccess?.(created);
    },
    onError: (e: any) => {
      toast?.error?.(e?.message ?? "Create failed");
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: TId; data: TUpdate }) =>
      service.update?.(id, data) ?? Promise.resolve({} as TItem),
    onSuccess: (updated) => {
      const id = getId(updated);
      // Update detail directly
      qc.setQueryData(keys.detail(id), updated);
      // invalidate globally
      qc.invalidateQueries({ queryKey: keys.all });

      // Optimistic: update inside the lists
      if (optimistic?.updateInLists && keys.lists) {
        updateAllListCaches((data) => {
          const items = data.items!.map((x) =>
            getId(x as TItem) === id ? (updated as TItem) : (x as TItem),
          );
          return { ...data, items };
        });
      }

      toast?.success?.("Updated successfully");
      cfg.onUpdateSuccess?.(updated);
    },
    onError: (e: any) => {
      toast?.error?.(e?.message ?? "Update failed");
    },
  });

  const del = useMutation({
    mutationFn: (id: TId) => service.delete?.(id) ?? Promise.resolve({} as TItem),
    onMutate: async (id) => {
      // Optimistic: remove from lists temporarily
      if (optimistic?.removeFromLists && keys.lists) {
        const listPrefix = keys.lists();
        const queries = qc.getQueriesData<ListDataShape<TItem>>({
          queryKey: listPrefix as QueryKey,
        });

        const snapshots: Array<[QueryKey, ListDataShape<TItem> | undefined]> = [];
        for (const [qk, data] of queries) {
          snapshots.push([qk, data]);
          if (!data?.items) continue;
          qc.setQueryData(qk, {
            ...data,
            items: data.items.filter((x) => getId(x as TItem) !== id),
            total: (data.total ?? 0) - 1,
          });
        }
        return { snapshots };
      }
      return { snapshots: [] as any[] };
    },
    onError: (e: any, _id, ctx) => {
      // Return the snapshot in case of failure
      if (ctx?.snapshots) {
        for (const [qk, snapshot] of ctx.snapshots) {
          qc.setQueryData(qk, snapshot);
        }
      }
      toast?.error?.(e?.message ?? "Delete failed");
    },
    onSuccess: (_res, id) => {
      // Clean detail
      qc.removeQueries({ queryKey: keys.detail(id) });
      // invalidate globally
      qc.invalidateQueries({ queryKey: keys.all });
      toast?.success?.("Deleted successfully");
      cfg.onDeleteSuccess?.(id);
    },
  });

  return { create, update, del } as const;
}
