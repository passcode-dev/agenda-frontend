import React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

const spinnerVariants = cva('flex-col items-center justify-center', {
  variants: {
    show: {
      true: 'flex',
      false: 'hidden',
    },
  },
  defaultVariants: {
    show: true,
  },
});

const loaderVariants = cva('animate-spin', {
  variants: {
    size: {
      small: 'w-6 h-6', // Tamanhos ajustados para Tailwind
      medium: 'w-8 h-8',
      large: 'w-12 h-12',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export function Spinner({ size, show = true, children, className, message }) {
  return (
    <span className={spinnerVariants({ show })}>
      {/* Aplica a cor primária do tema */}
      <Loader2
        className={cn(loaderVariants({ size }), 'text-primary', className)} // Usa text-primary do Tailwind
      />
      {message && <p className="text-muted-foreground mt-2">{message}</p>} {/* Cor de texto do tema */}
      {children}
    </span>
  );
}
