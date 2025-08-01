'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function WelcomeToast() {
  useEffect(() => {
    if (window.innerHeight < 650) return;
    if (!document.cookie.includes('welcome-toast=1')) {
      toast('🍍 Welcome to Nyumly!', {
        id: 'welcome-toast',
        duration: Infinity,
        onDismiss: () => {
          document.cookie = 'welcome-toast=1; max-age=31536000; path=/';
        },
        description: (
          <>
            Discover snacks across Africa—one box at a time. Curated with love, delivered with vibes.{' '}
            <a
              href="https://nyumly.com"
              className="text-orange-600 hover:underline"
              target="_blank"
            >
              Try your first bite →
            </a>
          </>
        )
      });
    }
  }, []);

  return null;
}
