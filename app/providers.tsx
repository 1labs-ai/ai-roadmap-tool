'use client';

import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import { ReactNode, useMemo } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  
  const convex = useMemo(() => {
    if (!convexUrl) {
      console.warn('NEXT_PUBLIC_CONVEX_URL not set');
      return null;
    }
    return new ConvexReactClient(convexUrl);
  }, [convexUrl]);

  // If no Convex URL, just render with Clerk
  if (!convex) {
    return (
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        afterSignOutUrl="/"
      >
        {children}
      </ClerkProvider>
    );
  }

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      afterSignOutUrl="/"
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
