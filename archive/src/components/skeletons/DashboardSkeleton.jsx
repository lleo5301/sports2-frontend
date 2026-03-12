import { Card } from '@heroui/react';
import Skeleton from './Skeleton';

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

        {/* Grid Layout - 4 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Stat Card 1 - Total Players */}
          <Card className="h-full">
            <Card.Content className="flex flex-col justify-between h-full p-6">
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
            </Card.Content>
          </Card>

          {/* Stat Card 2 - Scouting Reports */}
          <Card className="h-full">
            <Card.Content className="flex flex-col justify-between h-full p-6">
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
            </Card.Content>
          </Card>

          {/* Stat Card 3 - Team Status */}
          <Card className="h-full">
            <Card.Content className="flex flex-col justify-between h-full p-6">
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
            </Card.Content>
          </Card>

          {/* Stat Card 4 - Quick Actions Count */}
          <Card className="h-full">
            <Card.Content className="flex flex-col justify-between h-full p-6">
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
            </Card.Content>
          </Card>

          {/* Recent Players - Large card */}
          <Card className="col-span-1 md:col-span-2">
            <Card.Header className="flex flex-col items-start gap-1 px-6 pt-6 pb-2">
              <div className="flex items-center justify-between w-full">
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
              <div className="mt-2 w-full">
                <Skeleton
                  variant="rectangular"
                  width="70%"
                  height={16}
                  animation={animation}
                />
              </div>
            </Card.Header>
            <Card.Content className="px-6 py-2">
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-content1/50 rounded-xl"
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
            </Card.Content>
          </Card>

          {/* Recent Reports - Large card */}
          <Card className="col-span-1 md:col-span-2">
            <Card.Header className="flex flex-col items-start gap-1 px-6 pt-6 pb-2">
              <div className="flex items-center justify-between w-full">
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
              <div className="mt-2 w-full">
                <Skeleton
                  variant="rectangular"
                  width="60%"
                  height={16}
                  animation={animation}
                />
              </div>
            </Card.Header>
            <Card.Content className="px-6 py-2">
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-content1/50 rounded-xl"
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
            </Card.Content>
          </Card>
        </div>

        {/* Quick Actions - Full width card */}
        <Card className="mb-10">
          <Card.Header className="flex flex-col items-start gap-1 px-6 pt-6 pb-2">
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
            <div className="mt-2 w-full">
              <Skeleton
                variant="rectangular"
                width="40%"
                height={16}
                animation={animation}
              />
            </div>
          </Card.Header>
          <Card.Content className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="p-4 bg-default-100 border border-divider rounded-lg"
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
          </Card.Content>
        </Card>

        {/* Team Statistics Skeleton */}
        <Card>
          <Card.Header className="flex flex-col items-start gap-1 px-6 pt-6 pb-2">
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
          </Card.Header>
          <Card.Content className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="p-4 bg-content1/50 rounded-lg">
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
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
