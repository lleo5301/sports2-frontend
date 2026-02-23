import { DollarSign, Users, CreditCard, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { StatCard } from '@/components/ui/stat-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { Analytics } from './components/analytics'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'

export function Dashboard() {
  return (
    <>
      {/* ===== Sub Nav ===== */}
      <div className='flex h-12 items-center border-b bg-background px-4 sm:px-6 md:px-8'>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <ConfigDrawer />
        </div>
      </div>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button className='w-full sm:w-auto'>Download</Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList className='inline-flex w-auto flex-nowrap'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='reports' disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value='notifications' disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4'>
              <StatCard
                label='Total Revenue'
                value='$45,231.89'
                change='+20.1%'
                trend='up'
                sublabel='from last month'
                icon={<DollarSign className='size-4' />}
              />
              <StatCard
                label='Subscriptions'
                value='+2350'
                change='+180.1%'
                trend='up'
                sublabel='from last month'
                icon={<Users className='size-4' />}
              />
              <StatCard
                label='Sales'
                value='+12,234'
                change='+19%'
                trend='up'
                sublabel='from last month'
                icon={<CreditCard className='size-4' />}
              />
              <StatCard
                label='Active Now'
                value='+573'
                change='+201'
                trend='up'
                sublabel='since last hour'
                icon={<Activity className='size-4' />}
              />
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='min-h-[250px] ps-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics' className='space-y-4'>
            <Analytics />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]
