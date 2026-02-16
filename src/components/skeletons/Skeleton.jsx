export default function Skeleton({
  variant = 'rectangular',
  width,
  height,
  className = '',
  animation = 'pulse'
}) {
  const baseClasses = 'bg-base-300';

  // Variant-specific classes
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  // Animation classes
  const animationClasses = {
    pulse: 'animate-skeleton-pulse',
    shimmer: 'shimmer',
    none: ''
  };

  // Build style object
  const style = {};
  if (width) {
    style.width = typeof width === 'number' ? `${width}px` : width;
  }
  if (height) {
    style.height = typeof height === 'number' ? `${height}px` : height;
  }

  // Set default dimensions for circular variant
  if (variant === 'circular' && !width && !height) {
    style.width = '40px';
    style.height = '40px';
  }

  const combinedClasses = [
    baseClasses,
    variantClasses[variant] || variantClasses.rectangular,
    animationClasses[animation] || animationClasses.pulse,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={combinedClasses}
      style={style}
      aria-busy="true"
      aria-live="polite"
    />
  );
}
