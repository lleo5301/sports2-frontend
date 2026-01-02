import Skeleton from './Skeleton'

export default function TeamsListSkeleton({ animation = 'pulse' }) {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Skeleton
            variant="rectangular"
            width={120}
            height={36}
            className="mb-2"
            animation={animation}
          />
          <Skeleton
            variant="rectangular"
            width={300}
            height={20}
            animation={animation}
          />
        </div>

        {/* My Team Section */}
        <div className="mb-8">
          <Skeleton
            variant="rectangular"
            width={100}
            height={32}
            className="mb-4"
            animation={animation}
          />
          <div className="card bg-primary/10 border-primary">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton
                    variant="rectangular"
                    width={200}
                    height={28}
                    className="mb-2"
                    animation={animation}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={180}
                    height={20}
                    className="mb-2"
                    animation={animation}
                  />
                  <div className="flex gap-4 mt-2">
                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={16}
                      animation={animation}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={120}
                      height={16}
                      animation={animation}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={140}
                      height={16}
                      animation={animation}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Skeleton
                    variant="rectangular"
                    width={100}
                    height={32}
                    className="rounded-lg"
                    animation={animation}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={90}
                    height={32}
                    className="rounded-lg"
                    animation={animation}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Teams Grid */}
        <div className="mb-6">
          <Skeleton
            variant="rectangular"
            width={110}
            height={32}
            className="mb-4"
            animation={animation}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="card-body">
                  {/* Team Title */}
                  <Skeleton
                    variant="rectangular"
                    width="80%"
                    height={24}
                    className="mb-4"
                    animation={animation}
                  />

                  {/* Team Info Fields */}
                  <div className="space-y-2">
                    {/* Program */}
                    <div className="flex justify-between">
                      <Skeleton
                        variant="rectangular"
                        width={60}
                        height={14}
                        animation={animation}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={120}
                        height={14}
                        animation={animation}
                      />
                    </div>

                    {/* Division */}
                    <div className="flex justify-between">
                      <Skeleton
                        variant="rectangular"
                        width={60}
                        height={14}
                        animation={animation}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={80}
                        height={14}
                        animation={animation}
                      />
                    </div>

                    {/* Conference */}
                    <div className="flex justify-between">
                      <Skeleton
                        variant="rectangular"
                        width={80}
                        height={14}
                        animation={animation}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={100}
                        height={14}
                        animation={animation}
                      />
                    </div>

                    {/* Location */}
                    <div className="flex justify-between">
                      <Skeleton
                        variant="rectangular"
                        width={60}
                        height={14}
                        animation={animation}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={110}
                        height={14}
                        animation={animation}
                      />
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="card-actions justify-end mt-4">
                    <Skeleton
                      variant="rectangular"
                      width={60}
                      height={32}
                      className="rounded-lg"
                      animation={animation}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={60}
                      height={32}
                      className="rounded-lg"
                      animation={animation}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Team Button */}
        <div className="mt-8 text-center">
          <Skeleton
            variant="rectangular"
            width={160}
            height={48}
            className="rounded-lg mx-auto"
            animation={animation}
          />
        </div>
      </div>
    </div>
  )
}
