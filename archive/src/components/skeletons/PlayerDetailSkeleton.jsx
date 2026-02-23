import Skeleton from './Skeleton';

export default function PlayerDetailSkeleton({ animation = 'pulse' }) {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-4">
            {/* Back button */}
            <Skeleton
              variant="rectangular"
              width={160}
              height={48}
              className="rounded-lg"
              animation={animation}
            />
            <div>
              {/* Player name */}
              <Skeleton
                variant="rectangular"
                width={280}
                height={40}
                className="mb-2"
                animation={animation}
              />
              {/* Player info subtitle */}
              <Skeleton
                variant="rectangular"
                width={220}
                height={20}
                animation={animation}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            {/* Edit button */}
            <Skeleton
              variant="rectangular"
              width={120}
              height={48}
              className="rounded-lg"
              animation={animation}
            />
            {/* Delete button */}
            <Skeleton
              variant="rectangular"
              width={140}
              height={48}
              className="rounded-lg"
              animation={animation}
            />
          </div>
        </div>

        {/* Player Overview Cards - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Basic Info Card */}
          <div className="card">
            <div className="card-body">
              <Skeleton
                variant="rectangular"
                width={150}
                height={24}
                className="mb-4"
                animation={animation}
              />
              <div className="space-y-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="flex justify-between">
                    <Skeleton
                      variant="rectangular"
                      width={90}
                      height={16}
                      animation={animation}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={16}
                      animation={animation}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="card">
            <div className="card-body">
              <Skeleton
                variant="rectangular"
                width={170}
                height={24}
                className="mb-4"
                animation={animation}
              />
              <div className="space-y-3">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex items-center">
                    <Skeleton
                      variant="rectangular"
                      width={16}
                      height={16}
                      className="mr-2"
                      animation={animation}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={160}
                      height={14}
                      animation={animation}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status & Medical Card */}
          <div className="card">
            <div className="card-body">
              <Skeleton
                variant="rectangular"
                width={150}
                height={24}
                className="mb-4"
                animation={animation}
              />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton
                    variant="rectangular"
                    width={60}
                    height={16}
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
                <div className="flex items-center">
                  <Skeleton
                    variant="rectangular"
                    width={16}
                    height={16}
                    className="mr-2"
                    animation={animation}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={120}
                    height={14}
                    animation={animation}
                  />
                </div>
                <div>
                  <Skeleton
                    variant="rectangular"
                    width={100}
                    height={14}
                    className="mb-2"
                    animation={animation}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={40}
                    animation={animation}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Batting Stats */}
          <div className="card">
            <div className="card-body">
              <Skeleton
                variant="rectangular"
                width={160}
                height={24}
                className="mb-4"
                animation={animation}
              />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="text-center p-3 bg-content1 rounded-lg">
                    <Skeleton
                      variant="rectangular"
                      width={60}
                      height={32}
                      className="mb-2 mx-auto"
                      animation={animation}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={14}
                      className="mx-auto"
                      animation={animation}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pitching Stats */}
          <div className="card">
            <div className="card-body">
              <Skeleton
                variant="rectangular"
                width={170}
                height={24}
                className="mb-4"
                animation={animation}
              />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="text-center p-3 bg-content1 rounded-lg">
                    <Skeleton
                      variant="rectangular"
                      width={60}
                      height={32}
                      className="mb-2 mx-auto"
                      animation={animation}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={90}
                      height={14}
                      className="mx-auto"
                      animation={animation}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="flex items-center mb-4">
              <Skeleton
                variant="rectangular"
                width={20}
                height={20}
                className="mr-2"
                animation={animation}
              />
              <Skeleton
                variant="rectangular"
                width={100}
                height={24}
                animation={animation}
              />
            </div>
            <Skeleton
              variant="rectangular"
              width="60%"
              height={20}
              className="mb-6"
              animation={animation}
            />

            {/* Report Cards - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="card bg-content1">
                  <div className="card-body">
                    <div className="flex items-center mb-3">
                      <Skeleton
                        variant="rectangular"
                        width={24}
                        height={24}
                        className="mr-3"
                        animation={animation}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={140}
                        height={20}
                        animation={animation}
                      />
                    </div>
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={40}
                      className="mb-4"
                      animation={animation}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={150}
                      height={32}
                      className="rounded-lg"
                      animation={animation}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="divider">
              <Skeleton
                variant="rectangular"
                width={120}
                height={16}
                animation={animation}
              />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Skeleton
                variant="rectangular"
                width={140}
                height={32}
                className="rounded-lg"
                animation={animation}
              />
              <Skeleton
                variant="rectangular"
                width={140}
                height={32}
                className="rounded-lg"
                animation={animation}
              />
            </div>
          </div>
        </div>

        {/* Scouting Reports */}
        <div className="card mb-8">
          <div className="card-body">
            <Skeleton
              variant="rectangular"
              width={200}
              height={24}
              className="mb-4"
              animation={animation}
            />
            <div className="space-y-4">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="border border-divider rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Skeleton
                        variant="rectangular"
                        width={160}
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
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={24}
                      className="rounded-full"
                      animation={animation}
                    />
                  </div>
                  <Skeleton
                    variant="rectangular"
                    width="90%"
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
  );
}
