import React from 'react';
import { RTLIcon, RTL_FLIPPED_ICONS } from '@/components/ui/rtl-icon';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';
import { useLanguageStore } from '@/hooks/use-language';

interface RTLButtonProps extends ButtonProps {
  /**
   * The icon to show before the button text (or after in RTL mode)
   */
  startIcon?: LucideIcon;
  
  /**
   * The icon to show after the button text (or before in RTL mode)
   */
  endIcon?: LucideIcon;
  
  /**
   * The text content of the button
   */
  children?: React.ReactNode;
  
  /**
   * Whether to use traditional icon placement (don't swap in RTL)
   */
  preserveIconPosition?: boolean;
}

/**
 * RTLButton component that automatically handles RTL text and icon positioning
 */
export function RTLButton({
  startIcon,
  endIcon,
  children,
  preserveIconPosition = false,
  className,
  ...props
}: RTLButtonProps) {
  const { direction } = useLanguageStore();
  const isRtl = direction === 'rtl';
  
  // If in RTL mode and we're not preserving positions, swap the icons
  const actualStartIcon = !isRtl || preserveIconPosition ? startIcon : endIcon;
  const actualEndIcon = !isRtl || preserveIconPosition ? endIcon : startIcon;
  
  // Determine if the icons should be flipped in RTL mode
  const shouldFlipStart = actualStartIcon && RTL_FLIPPED_ICONS.includes(actualStartIcon.name);
  const shouldFlipEnd = actualEndIcon && RTL_FLIPPED_ICONS.includes(actualEndIcon.name);
  
  return (
    <Button className={cn("flex items-center gap-2", className)} {...props}>
      {actualStartIcon && (
        <RTLIcon 
          icon={actualStartIcon} 
          flip={shouldFlipStart}
          spacing="none"
          className="size-4"
        />
      )}
      
      {children}
      
      {actualEndIcon && (
        <RTLIcon 
          icon={actualEndIcon} 
          flip={shouldFlipEnd}
          spacing="none"
          className="size-4"
          end
        />
      )}
    </Button>
  );
}

/**
 * RTLLinkButton with an arrow that properly flips in RTL
 */
export function RTLLinkButton({
  children,
  endIcon = ArrowRight,
  ...props
}: Omit<RTLButtonProps, 'startIcon'> & { endIcon?: LucideIcon }) {
  return (
    <RTLButton
      variant="link"
      endIcon={endIcon}
      {...props}
    >
      {children}
    </RTLButton>
  );
}