import { useRouter } from "next/navigation";
import nProgress from "nprogress";

export const useRouterWithLoader = () => {
  const router = useRouter();

  const push = (href: string, options?: Parameters<typeof router.push>[1]): void => {
    nProgress.start();
    router.push(href, options);
  };

  const replace = (href: string, options?: Parameters<typeof router.replace>[1]): void => {
    nProgress.start();
    router.replace(href, options);
  };

  return {
    back: router.back,
    forward: router.forward,
    prefetch: router.prefetch,
    refresh: router.refresh,
    push,
    replace,
  };
};
