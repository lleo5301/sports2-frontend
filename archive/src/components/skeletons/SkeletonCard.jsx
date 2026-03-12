import { Card } from '@heroui/react';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';

export default function SkeletonCard({
  size = 'sm',
  showHeader = true,
  showFooter = false,
  headerHeight = 24,
  contentLines = 3,
  footerContent = false,
  className = '',
  animation = 'pulse'
}) {
  // Size mapping to Tailwind grid column spans
  const sizeClasses = {
    sm: 'col-span-1',
    md: 'col-span-1 md:col-span-2',
    lg: 'col-span-1 md:col-span-2 row-span-2',
    wide: 'col-span-1 md:col-span-3',
    tall: 'col-span-1 row-span-2',
    full: 'col-span-1 md:col-span-4'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.sm;

  return (
    <Card className={`${sizeClass} ${className}`}>
      {/* Card Header */}
      {showHeader && (
        <Card.Header>
          <Skeleton
            variant="rectangular"
            height={headerHeight}
            width="60%"
            animation={animation}
          />
        </Card.Header>
      )}

      {/* Card Content */}
      <Card.Content>
        <SkeletonText
          lines={contentLines}
          spacing="gap-3"
          animation={animation}
        />
      </Card.Content>

      {/* Card Footer */}
      {showFooter && (
        <Card.Footer>
          {footerContent ? (
            footerContent
          ) : (
            <div className="flex gap-2 w-full">
              <Skeleton
                variant="rectangular"
                height={32}
                width={80}
                animation={animation}
              />
              <Skeleton
                variant="rectangular"
                height={32}
                width={80}
                animation={animation}
              />
            </div>
          )}
        </Card.Footer>
      )}
    </Card>
  );
}
