'use client';

import Link from 'next/link';
import { Lock, Home } from 'lucide-react';

interface AccessDeniedProps {
  title: string;
  message: string;
}

export default function AccessDenied({ title, message }: AccessDeniedProps) {
  return (
    <div className="flex h-screen min-h-screen items-center justify-center">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 inline-block rounded-full border-2 border-yellow-200 bg-yellow-100 p-6 shadow-lg dark:border-yellow-800 dark:bg-yellow-900/50">
          <Lock className="h-12 w-12 animate-pulse text-yellow-500" />
        </div>
        <div className="mb-6 space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">{message}</p>
        </div>
        <div className="flex justify-center gap-3 text-center">
          <Link
            href="/dashboard/"
            className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex transform items-center gap-2 rounded-md border px-4 py-2 font-semibold shadow-md transition-all duration-200 hover:scale-105"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
