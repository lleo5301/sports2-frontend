# Pines UI Integration

This project has been integrated with [Pines UI](https://github.com/thedevdojo/pines), a beautiful component library built with Tailwind CSS, adapted for React.

## What is Pines UI?

Pines UI is an open-source component library that provides:
- Beautiful, accessible components
- Built with Tailwind CSS for styling
- Modern design system
- Easy to customize and extend
- **React-adapted components** - Custom React wrappers for seamless integration

## Installation

The following packages have been installed:
- Pines UI components (custom React wrappers)
- Tailwind CSS with Pines UI design tokens

## Available Components

The following Pines UI components are available as React components:

### Basic Components
- `Button` - Various button styles and variants
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` - Card layout components
- `Input` - Text input fields
- `Textarea` - Multi-line text input
- `Select` - Dropdown select component
- `Switch` - Toggle switch component

### Display Components
- `Badge` - Status indicators and labels
- `Alert`, `AlertTitle`, `AlertDescription` - Important messages and notifications
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` - Data tables

### Interactive Components
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` - Tabbed content (React state-based)
- `Modal`, `ModalHeader`, `ModalContent`, `ModalFooter` - Modal dialogs

## Usage

### Import Components

```jsx
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Badge,
  // ... other components
} from '../utils/pines'
```

### Basic Example

```jsx
import React from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent } from '../utils/pines'

const MyComponent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is card content</p>
        <Button variant="primary">Click me</Button>
      </CardContent>
    </Card>
  )
}
```

### Button Variants

```jsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
```

### Button Sizes

```jsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Form Components

```jsx
<Input placeholder="Enter text..." />
<Textarea placeholder="Enter message..." rows={4} />
<Select value={value} onChange={handleChange}>
  <option value="">Select option</option>
  <option value="option1">Option 1</option>
</Select>
<Switch checked={checked} onChange={setChecked} />
```

### Badge Variants

```jsx
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

### Modal Example

```jsx
import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalContent, ModalFooter } from '../utils/pines'

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader>
          <h2>Modal Title</h2>
        </ModalHeader>
        <ModalContent>
          <p>Modal content goes here</p>
        </ModalContent>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
```

### Tabs Example (React State-based)

```jsx
import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../utils/pines'

const MyComponent = () => {
  const [activeTab, setActiveTab] = useState('tab1')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p>Content for tab 1</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p>Content for tab 2</p>
      </TabsContent>
    </Tabs>
  )
}
```

## Design System

The components use a consistent design system with CSS variables:

### Colors
- `--primary` - Primary brand color
- `--secondary` - Secondary color
- `--destructive` - Error/danger color
- `--muted` - Muted text color
- `--accent` - Accent color
- `--background` - Background color
- `--foreground` - Text color

### Spacing
- Consistent spacing using Tailwind's spacing scale
- Responsive design with mobile-first approach

### Typography
- Inter font family
- Consistent text sizes and weights
- Proper contrast ratios for accessibility

## Customization

### Modifying Colors

Update the CSS variables in `src/index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  /* ... other variables */
}
```

### Adding New Components

To add new Pines UI components:

1. Add the component to `src/utils/pines.js`
2. Export it from the file
3. Use it in your React components

### Styling Overrides

You can override component styles using the `className` prop:

```jsx
<Button className="bg-red-500 hover:bg-red-600">
  Custom Styled Button
</Button>
```

## Demo Page

Visit `/pines-demo` to see all available components in action. This page showcases:

- All button variants and sizes
- Form elements
- Cards and layouts
- Badges and alerts
- Tables
- Tabs (React state-based)
- Modals
- And more

## Browser Support

- Modern browsers with ES6+ support
- React 18+ compatible
- Tailwind CSS provides responsive design

## Resources

- [Pines UI GitHub Repository](https://github.com/thedevdojo/pines)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)

## Migration from Existing Components

The existing custom components (`.btn`, `.input`, `.card`, etc.) are still available and compatible. You can gradually migrate to Pines UI components:

```jsx
// Old way
<button className="btn btn-primary">Button</button>

// New way
<Button variant="primary">Button</Button>
```

Both approaches work together, so you can migrate at your own pace.

## Key Differences from Original Pines UI

- **React-based**: All components are React components, not Alpine.js
- **State Management**: Uses React hooks for state management
- **No Alpine.js Dependency**: Removed Alpine.js dependency for better React integration
- **TypeScript Ready**: Components are ready for TypeScript usage
- **Better Integration**: Seamless integration with React ecosystem 