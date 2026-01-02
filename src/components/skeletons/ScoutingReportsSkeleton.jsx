import Skeleton from './Skeleton'

export default function ScoutingReportsSkeleton({ animation = 'pulse' }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Skeleton
            variant="rectangular"
            width={200}
            height={36}
            className="mb-2"
            animation={animation}
          />
          <Skeleton
            variant="rectangular"
            width={320}
            height={20}
            animation={animation}
          />
        </div>
        <Skeleton
          variant="rectangular"
          width={140}
          height={48}
          className="rounded-lg"
          animation={animation}
        />
      </div>

      {/* Search and Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Skeleton
              variant="rectangular"
              width="100%"
              height={48}
              className="rounded-lg"
              animation={animation}
            />
          </div>

          {/* Filter Toggle */}
          <Skeleton
            variant="rectangular"
            width={100}
            height={48}
            className="rounded-lg"
            animation={animation}
          />
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {[...Array(5)].map((_, reportIndex) => (
          <div key={reportIndex} className="card hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Player Info Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Skeleton
                        variant="rectangular"
                        width={180}
                        height={24}
                        className="mb-2"
                        animation={animation}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={280}
                        height={16}
                        animation={animation}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton
                        variant="rectangular"
                        width={45}
                        height={24}
                        className="rounded-full"
                        animation={animation}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={80}
                        height={16}
                        animation={animation}
                      />
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Skeleton
                      variant="rectangular"
                      width={180}
                      height={16}
                      animation={animation}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={160}
                      height={16}
                      animation={animation}
                    />
                  </div>

                  {/* Grades Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
                    {[...Array(6)].map((_, gradeIndex) => (
                      <div key={gradeIndex} className="text-center">
                        <Skeleton
                          variant="rectangular"
                          width={60}
                          height={14}
                          className="mb-1 mx-auto"
                          animation={animation}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={45}
                          height={24}
                          className="rounded-full mx-auto"
                          animation={animation}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Notes Preview */}
                  <div className="mb-4">
                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={16}
                      className="mb-2"
                      animation={animation}
                    />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={16}
                      className="mb-1"
                      animation={animation}
                    />
                    <Skeleton
                      variant="rectangular"
                      width="80%"
                      height={16}
                      animation={animation}
                    />
                  </div>

                  {/* Created By */}
                  <div className="flex items-center">
                    <Skeleton
                      variant="rectangular"
                      width={200}
                      height={16}
                      animation={animation}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2 ml-4">
                  <Skeleton
                    variant="rectangular"
                    width={32}
                    height={32}
                    className="rounded-lg"
                    animation={animation}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={32}
                    height={32}
                    className="rounded-lg"
                    animation={animation}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <nav className="flex items-center space-x-2">
          <Skeleton
            variant="rectangular"
            width={80}
            height={36}
            className="rounded-lg"
            animation={animation}
          />
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={36}
              height={36}
              className="rounded-lg"
              animation={animation}
            />
          ))}
          <Skeleton
            variant="rectangular"
            width={60}
            height={36}
            className="rounded-lg"
            animation={animation}
          />
        </nav>
      </div>

      {/* Results Summary */}
      <div className="text-center text-sm text-gray-500 mt-4">
        <Skeleton
          variant="rectangular"
          width={280}
          height={16}
          className="mx-auto"
          animation={animation}
        />
      </div>
    </div>
  )
}
