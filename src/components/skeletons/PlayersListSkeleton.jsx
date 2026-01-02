import Skeleton from './Skeleton'

export default function PlayersListSkeleton({ animation = 'pulse' }) {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton
                variant="rectangular"
                width={120}
                height={36}
                className="mb-2"
                animation={animation}
              />
              <Skeleton
                variant="rectangular"
                width={280}
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
        </div>

        {/* Filters Card */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Filter */}
              <div className="form-control">
                <label className="label">
                  <Skeleton
                    variant="rectangular"
                    width={60}
                    height={14}
                    className="mb-1"
                    animation={animation}
                  />
                </label>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={48}
                  className="rounded-lg"
                  animation={animation}
                />
              </div>

              {/* Position Filter */}
              <div className="form-control">
                <label className="label">
                  <Skeleton
                    variant="rectangular"
                    width={60}
                    height={14}
                    className="mb-1"
                    animation={animation}
                  />
                </label>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={48}
                  className="rounded-lg"
                  animation={animation}
                />
              </div>

              {/* Status Filter */}
              <div className="form-control">
                <label className="label">
                  <Skeleton
                    variant="rectangular"
                    width={50}
                    height={14}
                    className="mb-1"
                    animation={animation}
                  />
                </label>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={48}
                  className="rounded-lg"
                  animation={animation}
                />
              </div>

              {/* School Type Filter */}
              <div className="form-control">
                <label className="label">
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={14}
                    className="mb-1"
                    animation={animation}
                  />
                </label>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={48}
                  className="rounded-lg"
                  animation={animation}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Players Table Card */}
        <div className="card">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                {/* Table Header */}
                <thead>
                  <tr>
                    <th>
                      <Skeleton
                        variant="rectangular"
                        width={60}
                        height={16}
                        animation={animation}
                      />
                    </th>
                    <th>
                      <Skeleton
                        variant="rectangular"
                        width={70}
                        height={16}
                        animation={animation}
                      />
                    </th>
                    <th>
                      <Skeleton
                        variant="rectangular"
                        width={60}
                        height={16}
                        animation={animation}
                      />
                    </th>
                    <th>
                      <Skeleton
                        variant="rectangular"
                        width={70}
                        height={16}
                        animation={animation}
                      />
                    </th>
                    <th>
                      <Skeleton
                        variant="rectangular"
                        width={60}
                        height={16}
                        animation={animation}
                      />
                    </th>
                    <th>
                      <Skeleton
                        variant="rectangular"
                        width={70}
                        height={16}
                        animation={animation}
                      />
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {[...Array(10)].map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {/* Name */}
                      <td>
                        <Skeleton
                          variant="rectangular"
                          width={140}
                          height={18}
                          animation={animation}
                        />
                      </td>
                      {/* Position */}
                      <td>
                        <Skeleton
                          variant="rectangular"
                          width={50}
                          height={24}
                          className="rounded-full"
                          animation={animation}
                        />
                      </td>
                      {/* School */}
                      <td>
                        <Skeleton
                          variant="rectangular"
                          width={120}
                          height={16}
                          animation={animation}
                        />
                      </td>
                      {/* Location */}
                      <td>
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={16}
                          animation={animation}
                        />
                      </td>
                      {/* Status */}
                      <td>
                        <Skeleton
                          variant="rectangular"
                          width={70}
                          height={24}
                          className="rounded-full"
                          animation={animation}
                        />
                      </td>
                      {/* Actions */}
                      <td>
                        <div className="flex space-x-2">
                          <Skeleton
                            variant="rectangular"
                            width={70}
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
                          <Skeleton
                            variant="rectangular"
                            width={60}
                            height={32}
                            className="rounded-lg"
                            animation={animation}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <div className="join">
                <Skeleton
                  variant="rectangular"
                  width={48}
                  height={48}
                  className="rounded-l-lg"
                  animation={animation}
                />
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    width={48}
                    height={48}
                    animation={animation}
                  />
                ))}
                <Skeleton
                  variant="rectangular"
                  width={48}
                  height={48}
                  className="rounded-r-lg"
                  animation={animation}
                />
              </div>
            </div>

            {/* Results Info */}
            <div className="flex justify-center mt-4">
              <Skeleton
                variant="rectangular"
                width={280}
                height={16}
                animation={animation}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
