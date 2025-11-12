export const keysFactory = (entity: string) => ({
  all: [entity] as const,
  lists: () => [entity, "list"] as const,
  list: (params: unknown) => [entity, "list", params] as const,
  details: () => [entity, "detail"] as const,
  detail: (id: string | number) => [entity, "detail", id] as const,
  bySlug: (slug: string) => [entity, "slug", slug] as const,
});
