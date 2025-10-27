interface RouterShape {
  push: (href: string) => void;
  replace: (href: string) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
  prefetch: (href: string) => void;
}
let router: RouterShape | null = null;

export const setRouter = (routerInstance: RouterShape) => {
  router = routerInstance;
};

export const helperNavigateTo = (path: string) => {
  if (router) {
    router.push(path);
  }
};
