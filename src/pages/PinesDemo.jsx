import { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Select,
  Switch
} from '../utils/pines.jsx';
import {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  SkeletonAvatar,
  DashboardSkeleton,
  GenericPageSkeleton
} from '../components/skeletons';

const PinesDemo = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Pines UI Components</h1>
          <p className="text-muted-foreground text-lg">
            A beautiful component library built with Tailwind CSS and React
          </p>
        </div>

        {/* Buttons Section */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Various button styles and variants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="destructive">Destructive Button</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small Button</Button>
              <Button size="md">Medium Button</Button>
              <Button size="lg">Large Button</Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>Input fields, textareas, and form controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Text Input</label>
                <Input placeholder="Enter your text here..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Select</label>
                <Select value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
                  <option value="">Select an option</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Textarea</label>
              <Textarea placeholder="Enter your message here..." rows={4} />
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={switchValue} onChange={setSwitchValue} />
              <span className="text-sm">Toggle switch</span>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is the card content. You can put any content here.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
              <CardDescription>With different content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cards are great for organizing content into digestible sections.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Primary Action</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third Card</CardTitle>
              <CardDescription>More card examples</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You can use cards to display information in a structured way.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm">Secondary</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Badges and Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>Status indicators and labels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
              <CardDescription>Important messages and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTitle>Default Alert</AlertTitle>
                <AlertDescription>
                  This is a default alert message with some important information.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTitle>Destructive Alert</AlertTitle>
                <AlertDescription>
                  This is a destructive alert for error messages or warnings.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Table</CardTitle>
            <CardDescription>Data display in tabular format</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Pitcher</TableCell>
                  <TableCell>
                    <Badge variant="default">Active</Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">Edit</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>Catcher</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Inactive</Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">Edit</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mike Johnson</TableCell>
                  <TableCell>Outfielder</TableCell>
                  <TableCell>
                    <Badge variant="destructive">Injured</Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">Edit</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
            <CardDescription>Organize content into tabs</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <p className="text-sm text-muted-foreground">
                  This is the overview tab content. You can put any content here.
                </p>
              </TabsContent>
              <TabsContent value="analytics" className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Analytics content goes here. Charts and data visualizations.
                </p>
              </TabsContent>
              <TabsContent value="reports" className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Reports and detailed information can be displayed here.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Modal */}
        <Card>
          <CardHeader>
            <CardTitle>Modal</CardTitle>
            <CardDescription>Overlay dialogs and popups</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
              <ModalHeader>
                <CardTitle>Modal Title</CardTitle>
                <CardDescription>This is a modal dialog example</CardDescription>
              </ModalHeader>
              <ModalContent>
                <p className="text-sm text-muted-foreground">
                  This is the modal content. You can put any content here including forms,
                  images, or other components.
                </p>
              </ModalContent>
              <ModalFooter>
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setModalOpen(false)}>
                  Confirm
                </Button>
              </ModalFooter>
            </Modal>
          </CardContent>
        </Card>

        {/* Skeleton Components */}
        <Card>
          <CardHeader>
            <CardTitle>Skeleton Components</CardTitle>
            <CardDescription>Loading placeholders that maintain layout structure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Base Skeleton Variants */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Base Skeleton Variants</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Text variant (default):</p>
                  <Skeleton className="w-full max-w-md" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Rectangular variant:</p>
                  <Skeleton variant="rectangular" width="200px" height="100px" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Circular variant:</p>
                  <Skeleton variant="circular" width="80px" height="80px" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Custom sizes:</p>
                  <div className="flex gap-2 items-center">
                    <Skeleton width="100px" height="20px" />
                    <Skeleton width="150px" height="20px" />
                    <Skeleton width="200px" height="20px" />
                  </div>
                </div>
              </div>
            </div>

            {/* Animation Options */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Animation Options</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Pulse animation (default):</p>
                  <Skeleton className="w-full max-w-md" animation="pulse" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Shimmer animation:</p>
                  <Skeleton className="w-full max-w-md" animation="shimmer" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">No animation:</p>
                  <Skeleton className="w-full max-w-md" animation="none" />
                </div>
              </div>
            </div>

            {/* SkeletonText */}
            <div>
              <h3 className="text-lg font-semibold mb-3">SkeletonText</h3>
              <p className="text-sm text-muted-foreground mb-3">Simulates paragraph text with multiple lines</p>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">3 lines (default):</p>
                  <SkeletonText />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">5 lines with custom spacing:</p>
                  <SkeletonText lines={5} spacing="8px" />
                </div>
              </div>
            </div>

            {/* SkeletonAvatar */}
            <div>
              <h3 className="text-lg font-semibold mb-3">SkeletonAvatar</h3>
              <p className="text-sm text-muted-foreground mb-3">Avatar placeholders in different sizes</p>
              <div className="flex gap-4 items-end">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Small (40px)</p>
                  <SkeletonAvatar size="sm" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Medium (80px)</p>
                  <SkeletonAvatar size="md" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Large (96px)</p>
                  <SkeletonAvatar size="lg" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Combined with SkeletonText:</p>
                <div className="flex items-center gap-3">
                  <SkeletonAvatar size="md" />
                  <div className="flex-1">
                    <SkeletonText lines={2} />
                  </div>
                </div>
              </div>
            </div>

            {/* SkeletonCard */}
            <div>
              <h3 className="text-lg font-semibold mb-3">SkeletonCard</h3>
              <p className="text-sm text-muted-foreground mb-3">Card placeholders with header, content, and footer</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SkeletonCard size="md" />
                <SkeletonCard size="md" showFooter={true} contentLines={4} />
              </div>
            </div>

            {/* SkeletonTable */}
            <div>
              <h3 className="text-lg font-semibold mb-3">SkeletonTable</h3>
              <p className="text-sm text-muted-foreground mb-3">Table placeholders with configurable rows and columns</p>
              <SkeletonTable rows={5} columns={4} />
            </div>

            {/* Page Skeletons */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Page-Specific Skeletons</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Complete page layouts for zero layout shift on load
              </p>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="overview">Dashboard</TabsTrigger>
                  <TabsTrigger value="analytics">Generic</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                  <div className="border border-border rounded-lg p-4 bg-card">
                    <p className="text-sm text-muted-foreground mb-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">DashboardSkeleton</code> - Matches the dashboard page layout
                    </p>
                    <div className="max-h-96 overflow-auto">
                      <DashboardSkeleton />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="analytics" className="mt-4">
                  <div className="border border-border rounded-lg p-4 bg-card">
                    <p className="text-sm text-muted-foreground mb-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">GenericPageSkeleton</code> - Flexible skeleton for various page types
                    </p>
                    <div className="max-h-96 overflow-auto">
                      <GenericPageSkeleton contentType="cards" columns={3} itemCount={6} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Available Page Skeletons:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li><code className="text-xs">DashboardSkeleton</code> - Dashboard page with bento grid</li>
                  <li><code className="text-xs">PlayersListSkeleton</code> - Players list with filters and table</li>
                  <li><code className="text-xs">PlayerDetailSkeleton</code> - Player detail page layout</li>
                  <li><code className="text-xs">TeamsListSkeleton</code> - Teams page with card grid</li>
                  <li><code className="text-xs">ScoutingReportsSkeleton</code> - Scouting reports page</li>
                  <li><code className="text-xs">GenericPageSkeleton</code> - Flexible for cards, lists, or tables</li>
                </ul>
              </div>
            </div>

            {/* Usage Examples */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Usage Examples</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Basic Skeleton:</p>
                  <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                    {`import { Skeleton } from './components/skeletons'

<Skeleton width="200px" height="20px" />
<Skeleton variant="circular" width="80px" height="80px" />
<Skeleton variant="rectangular" width="100%" height="200px" />`}
                  </pre>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Page Loading State:</p>
                  <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                    {`import { DashboardSkeleton } from './components/skeletons'

function Dashboard() {
  const { data, loading } = useQuery(GET_DASHBOARD_DATA)

  if (loading) return <DashboardSkeleton />

  return <div>{/* actual content */}</div>
}`}
                  </pre>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Generic Page Skeleton:</p>
                  <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                    {`import { GenericPageSkeleton } from './components/skeletons'

// Table view
<GenericPageSkeleton contentType="table" columns={5} itemCount={10} />

// Card grid
<GenericPageSkeleton contentType="cards" columns={3} itemCount={9} />

// List view
<GenericPageSkeleton contentType="list" itemCount={8} />`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div>
              <Alert>
                <AlertTitle>Best Practices</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                    <li>Use page-specific skeletons for full-page loading states</li>
                    <li>Use base skeleton components for partial updates or small sections</li>
                    <li>Match skeleton structure to actual content for zero layout shift</li>
                    <li>Keep spinners for small inline loading states (buttons, modals)</li>
                    <li>All skeletons respect reduced-motion preferences</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Pines UI provides beautiful, accessible components built with Tailwind CSS and React.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Badge variant="outline">Tailwind CSS</Badge>
            <Badge variant="outline">React</Badge>
            <Badge variant="outline">TypeScript Ready</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinesDemo;
