import React from 'react';
import { useLanguageStore } from '@/hooks/use-language';
import { LucideIcon } from 'lucide-react';

interface RTLIconProps extends Omit<React.SVGAttributes<SVGElement>, 'end'> {
  /**
   * The Lucide icon component to render with automatic RTL handling
   */
  icon: LucideIcon;
  
  /**
   * Whether to flip the icon horizontally in RTL mode
   */
  flip?: boolean;
  
  /**
   * Additional class name to apply to the icon
   */
  className?: string;
  
  /**
   * Whether the icon should be placed at the end (right in LTR, left in RTL)
   */
  end?: boolean;
  
  /**
   * Spacing to add (in the correct direction based on RTL/LTR)
   */
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * RTLIcon component that automatically handles RTL icon display
 * It will:
 * 1. Add the correct margin based on text direction
 * 2. Optionally flip directional icons in RTL mode
 * 3. Apply consistent spacing regardless of text direction
 */
export function RTLIcon({
  icon: Icon,
  flip = false,
  className = '',
  end = false,
  spacing = 'sm',
  ...props
}: RTLIconProps) {
  const { direction } = useLanguageStore();
  const isRtl = direction === 'rtl';
  
  const spacingClassMap = {
    none: '',
    xs: isRtl ? (end ? 'mr-1' : 'ml-1') : (end ? 'ml-1' : 'mr-1'),
    sm: isRtl ? (end ? 'mr-2' : 'ml-2') : (end ? 'ml-2' : 'mr-2'),
    md: isRtl ? (end ? 'mr-3' : 'ml-3') : (end ? 'ml-3' : 'mr-3'),
    lg: isRtl ? (end ? 'mr-4' : 'ml-4') : (end ? 'ml-4' : 'mr-4'),
  };
  
  const spacingClass = spacing !== 'none' ? spacingClassMap[spacing] : '';
  const flipClass = isRtl && flip ? 'rtl-flip' : '';
  
  const combinedClassName = `${spacingClass} ${flipClass} ${className}`.trim();
  
  return <Icon className={combinedClassName} {...props} />;
}

// List of icons that should typically be flipped in RTL mode
export const RTL_FLIPPED_ICONS = [
  'ArrowRight',
  'ArrowLeft',
  'ChevronRight',
  'ChevronLeft', 
  'ChevronsRight',
  'ChevronsLeft',
  'ArrowRightFromLine',
  'ArrowLeftFromLine',
  'ArrowRightToLine',
  'ArrowLeftToLine',
  'MoveRight',
  'MoveLeft',
  'Forward',
  'Backward',
  'Redo',
  'Undo',
  'Reply',
  'Share',
  'CornerRightUp',
  'CornerLeftUp',
  'CornerRightDown',
  'CornerLeftDown',
  'SkipBack',
  'SkipForward',
  'PanelLeftOpen',
  'PanelRightOpen',
  'PanelLeftClose',
  'PanelRightClose',
];