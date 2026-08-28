import type { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';
import { useThemeStore } from '@/features/theme/useThemeStore';

export function AppProviders({ children }: PropsWithChildren) {
  const mode = useThemeStore((s) => s.mode);

  return (
    <>
      {children}
      <Toaster theme={mode} position="top-center" richColors />
    </>
  );
}