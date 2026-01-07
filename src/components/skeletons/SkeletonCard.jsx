import Skeleton from './Skeleton'
import SkeletonText from './SkeletonText'

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
  // Size mapping to bento grid classes
  const sizeClasses = {
    sm: 'bento-sm',
    md: 'bento-md',
    lg: 'bento-lg',
    wide: 'bento-wide',
    tall: 'bento-tall',
    full: 'bento-full'
  }

  const sizeClass = sizeClasses[size] || sizeClasses.sm

  return (
    <div className={`card bento-item ${sizeClass} ${className}`}>
      {/* Card Header */}
      {showHeader && (
        <div className="card-header">
          <Skeleton
            variant="rectangular"
            height={headerHeight}
            width="60%"
            animation={animation}
          />
        </div>
      )}

      {/* Card Content */}
      <div className="card-content">
        <SkeletonText
          lines={contentLines}
          spacing="gap-3"
          animation={animation}
        />
      </div>

      {/* Card Footer */}
      {showFooter && (
        <div className="card-footer">
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
        </div>
      )}
    </div>
  )
}
