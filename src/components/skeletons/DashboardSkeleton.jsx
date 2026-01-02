import Skeleton from './Skeleton'
import SkeletonText from './SkeletonText'

export default function DashboardSkeleton({ animation = 'pulse' }) {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Skeleton
            variant="rectangular"
            width="250px"
            height={40}
            className="mb-3"
            animation={animation}
          />
          <Skeleton
            variant="rectangular"
            width="400px"
            height={24}
            animation={animation}
          />
        </div>

        {/* Bento Grid Layout - 4 Stat Cards */}
        <div className="bento-grid mb-10">
          {/* Stat Card 1 - Total Players */}
          <div className="bento-sm card">
            <div className="card-body flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <Skeleton
                  variant="rectangular"
                  width={48}
                  height={48}
                  className="rounded-xl"
                  animation={animation}
                />
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={24}
                  className="rounded-full"
                  animation={animation}
                />
              </div>
              <div className="mt-4">
                <Skeleton
                  variant="rectangular"
                  width={60}
                  height={40}
                  className="mb-2"
                  animation={animation}
                />
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={16}
                  animation={animation}
                />
              </div>
              <div className="mt-3">
                <Skeleton
                  variant="rectangular"
                  width={90}
                  height={16}
                  animation={animation}
                />
              </div>
            </div>
          </div>

          {/* Stat Card 2 - Scouting Reports */}
          <div className="bento-sm card">
            <div className="card-body flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <Skeleton
                  variant="rectangular"
                  width={48}
                  height={48}
                  className="rounded-xl"
                  animation={animation}
                />
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={24}
                  className="rounded-full"
                  animation={animation}
                />
              </div>
              <div className="mt-4">
                <Skeleton
                  variant="rectangular"
                  width={60}
                  height={40}
                  className="mb-2"
                  animation={animation}
                />
                <Skeleton
                  variant="rectangular"
                  width={120}
                  height={16}
                  animation={animation}
                />
              </div>
              <div className="mt-3">
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={16}
                  animation={animation}
                />
              </div>
            </div>
          </div>

          {/* Stat Card 3 - Team Status */}
          <div className="bento-sm card">
            <div className="card-body flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <Skeleton
                  variant="rectangular"
                  width={48}
                  height={48}
                  className="rounded-xl"
                  animation={animation}
                />
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={24}
                  className="rounded-full"
                  animation={animation}
                />
              </div>
              <div className="mt-4">
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={40}
                  className="mb-2"
                  animation={animation}
                />
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={16}
                  animation={animation}
                />
              </div>
              <div className="mt-3">
                <Skeleton
                  variant="rectangular"
                  width={110}
                  height={16}
                  animation={animation}
                />
              </div>
            </div>
          </div>

          {/* Stat Card 4 - Quick Actions Count */}
          <div className="bento-sm card">
            <div className="card-body flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <Skeleton
                  variant="rectangular"
                  width={48}
                  height={48}
                  className="rounded-xl"
                  animation={animation}
                />
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={24}
                  className="rounded-full"
                  animation={animation}
                />
              </div>
              <div className="mt-4">
                <Skeleton
                  variant="rectangular"
                  width={40}
                  height={40}
                  className="mb-2"
                  animation={animation}
                />
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={16}
                  animation={animation}
                />
              </div>
              <div className="mt-3">
                <Skeleton
                  variant="rectangular"
                  width={90}
                  height={16}
                  animation={animation}
                />
              </div>
            </div>
          </div>

          {/* Recent Players - Large card */}
          <div className="bento-lg card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton
                    variant="rectangular"
                    width={20}
                    height={20}
                    animation={animation}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={120}
                    height={24}
                    animation={animation}
                  />
                </div>
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={32}
                  className="rounded-lg"
                  animation={animation}
                />
              </div>
              <div className="mt-2">
                <Skeleton
                  variant="rectangular"
                  width="70%"
                  height={16}
                  animation={animation}
                />
              </div>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-base-200/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton
                        variant="circular"
                        width={40}
                        height={40}
                        animation={animation}
                      />
                      <div>
                        <Skeleton
                          variant="rectangular"
                          width={120}
                          height={18}
                          className="mb-2"
                          animation={animation}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={160}
                          height={14}
                          animation={animation}
                        />
                      </div>
                    </div>
                    <Skeleton
                      variant="rectangular"
                      width={60}
                      height={24}
                      className="rounded-full"
                      animation={animation}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Reports - Large card */}
          <div className="bento-lg card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton
                    variant="rectangular"
                    width={20}
                    height={20}
                    animation={animation}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={120}
                    height={24}
                    animation={animation}
                  />
                </div>
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={32}
                  className="rounded-lg"
                  animation={animation}
                />
              </div>
              <div className="mt-2">
                <Skeleton
                  variant="rectangular"
                  width="60%"
                  height={16}
                  animation={animation}
                />
              </div>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-base-200/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton
                        variant="circular"
                        width={40}
                        height={40}
                        animation={animation}
                      />
                      <div>
                        <Skeleton
                          variant="rectangular"
                          width={120}
                          height={18}
                          className="mb-2"
                          animation={animation}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={14}
                          animation={animation}
                        />
                      </div>
                    </div>
                    <Skeleton
                      variant="rectangular"
                      width={40}
                      height={28}
                      className="rounded-lg"
                      animation={animation}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Full width card */}
        <div className="card card-glass mb-10">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Skeleton
                variant="rectangular"
                width={20}
                height={20}
                animation={animation}
              />
              <Skeleton
                variant="rectangular"
                width={120}
                height={24}
                animation={animation}
              />
            </div>
            <div className="mt-2">
              <Skeleton
                variant="rectangular"
                width="40%"
                height={16}
                animation={animation}
              />
            </div>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="p-4 bg-white border border-base-300 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <Skeleton
                      variant="rectangular"
                      width={36}
                      height={36}
                      className="rounded-lg"
                      animation={animation}
                    />
                    <div className="flex-1">
                      <Skeleton
                        variant="rectangular"
                        width="80%"
                        height={20}
                        className="mb-2"
                        animation={animation}
                      />
                      <Skeleton
                        variant="rectangular"
                        width="60%"
                        height={14}
                        animation={animation}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Statistics Skeleton */}
        <div className="card">
          <div className="card-header">
            <Skeleton
              variant="rectangular"
              width={180}
              height={28}
              className="mb-2"
              animation={animation}
            />
            <Skeleton
              variant="rectangular"
              width="50%"
              height={16}
              animation={animation}
            />
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="p-4 bg-base-200/50 rounded-lg">
                  <Skeleton
                    variant="rectangular"
                    width={100}
                    height={20}
                    className="mb-3"
                    animation={animation}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={60}
                    height={32}
                    className="mb-2"
                    animation={animation}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="70%"
                    height={14}
                    animation={animation}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
