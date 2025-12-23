import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useRouterWithLoader } from '@/hooks/useRouterWithLoader';
import { authService } from '@/services/auth.service';
import type { Staff } from '@/types/staff.types';
import { deleteCookie, myCookies, readCookieFromDocument, setCookie } from '@/utils/cookies';

interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  data?: Staff;
}

export function useAuth(): UseAuthReturn {
  const router = useRouterWithLoader();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return authService.login({ email, password });
    },
    onSuccess: data => {
      if (data?.accessToken) {
        setCookie(myCookies.auth, data.accessToken);
      }
      queryClient.clear();
    },
  });

  const login = useCallback(
    async (email: string, password: string) => {
      await loginMutation.mutateAsync({ email, password });
    },
    [loginMutation],
  );

  const logout = useCallback(async () => {
    try {
      await deleteCookie(myCookies.auth);
      queryClient.clear();
      router.replace('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, [queryClient, router]);

  const error = useMemo(() => {
    const e = loginMutation.error as unknown as Error | undefined;
    return e?.message ?? null;
  }, [loginMutation.error]);

  return {
    isLoading: loginMutation.isPending,
    error,
    login,
    logout,
  };
}
