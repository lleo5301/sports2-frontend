import Skeleton from './Skeleton'
import SkeletonText from './SkeletonText'
import SkeletonCard from './SkeletonCard'
import SkeletonTable from './SkeletonTable'

export default function GenericPageSkeleton({
  animation = 'pulse',
  contentType = 'cards',
  showHeader = true,
  showDescription = true,
  showActionButton = false,
  itemCount = 6,
  columns = 3
}) {
  // Render content based on contentType
  const renderContent = () => {
    switch (contentType) {
      case 'table':
        return (
          <div className="card">
            <div className="card-body">
              <SkeletonTable
                rows={itemCount}
                columns={4}
                animation={animation}
              />
            </div>
          </div>
        )

      case 'list':
        return (
          <div className="card">
            <div className="card-body">
              <div className="space-y-4">
                {[...Array(itemCount)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-base-200/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Skeleton
                        variant="circular"
                        width={40}
                        height={40}
                        animation={animation}
                      />
                      <div className="flex-1">
                        <Skeleton
                          variant="rectangular"
                          width="40%"
                          height={20}
                          className="mb-2"
                          animation={animation}
                        />
                        <Skeleton
                          variant="rectangular"
                          width="60%"
                          height={16}
                          animation={animation}
                        />
                      </div>
                    </div>
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={32}
                      className="rounded-lg"
                      animation={animation}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'cards':
      default:
        const gridClasses = {
          1: 'grid-cols-1',
          2: 'grid-cols-1 md:grid-cols-2',
          3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }

        const gridClass = gridClasses[columns] || gridClasses[3]

        return (
          <div className={`grid ${gridClass} gap-6`}>
            {[...Array(itemCount)].map((_, index) => (
              <div key={index} className="card">
                <div className="card-body">
                  <Skeleton
                    variant="rectangular"
                    width="70%"
                    height={24}
                    className="mb-4"
                    animation={animation}
                  />
                  <SkeletonText
                    lines={3}
                    spacing="gap-2"
                    animation={animation}
                  />
                  <div className="card-actions justify-end mt-4">
                    <Skeleton
                      variant="rectangular"
                      width={70}
                      height={32}
                      className="rounded-lg"
                      animation={animation}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {showHeader && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton
                  variant="rectangular"
                  width={200}
                  height={36}
                  className="mb-2"
                  animation={animation}
                />
                {showDescription && (
                  <Skeleton
                    variant="rectangular"
                    width={350}
                    height={20}
                    animation={animation}
                  />
                )}
              </div>
              {showActionButton && (
                <Skeleton
                  variant="rectangular"
                  width={140}
                  height={40}
                  className="rounded-lg"
                  animation={animation}
                />
              )}
            </div>
          </div>
        )}

        {/* Content Area */}
        {renderContent()}
      </div>
    </div>
  )
}
