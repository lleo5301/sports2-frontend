import React from 'react';
import useModalAccessibility from '../hooks/useModalAccessibility';

// Pines UI Component Wrappers for React
export const PinesComponents = {
  // Button component
  Button: ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';

    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'underline-offset-4 hover:underline text-primary'
    };

    const sizes = {
      sm: 'h-9 px-3 rounded-md',
      md: 'h-10 py-2 px-4',
      lg: 'h-11 px-8 rounded-md',
      icon: 'h-10 w-10'
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button className={classes} {...props}>
        {children}
      </button>
    );
  },

  // Card component
  Card: ({ children, className = '', ...props }) => (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
      {children}
    </div>
  ),

  CardHeader: ({ children, className = '', ...props }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
      {children}
    </div>
  ),

  CardTitle: ({ children, className = '', ...props }) => (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  ),

  CardDescription: ({ children, className = '', ...props }) => (
    <p className={`text-sm text-muted-foreground ${className}`} {...props}>
      {children}
    </p>
  ),

  CardContent: ({ children, className = '', ...props }) => (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  ),

  CardFooter: ({ children, className = '', ...props }) => (
    <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  ),

  // Input component
  Input: ({ className = '', ...props }) => (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  ),

  // Textarea component
  Textarea: ({ className = '', ...props }) => (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  ),

  // Badge component
  Badge: ({ children, variant = 'default', className = '', ...props }) => {
    const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

    const variants = {
      default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
      secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
      outline: 'text-foreground'
    };

    const classes = `${baseClasses} ${variants[variant]} ${className}`;

    return (
      <div className={classes} {...props}>
        {children}
      </div>
    );
  },

  // Alert component
  Alert: ({ children, variant = 'default', className = '', ...props }) => {
    const baseClasses = 'relative w-full rounded-lg border p-4';

    const variants = {
      default: 'bg-background text-foreground',
      destructive: 'border-destructive/50 text-destructive dark:border-destructive'
    };

    const classes = `${baseClasses} ${variants[variant]} ${className}`;

    return (
      <div className={classes} {...props}>
        {children}
      </div>
    );
  },

  AlertTitle: ({ children, className = '', ...props }) => (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h5>
  ),

  AlertDescription: ({ children, className = '', ...props }) => (
    <div className={`text-sm [&_p]:leading-relaxed ${className}`} {...props}>
      {children}
    </div>
  ),

  // Table components
  Table: ({ children, className = '', ...props }) => (
    <div className={`relative w-full overflow-auto ${className}`} {...props}>
      <table className="w-full caption-bottom text-sm">
        {children}
      </table>
    </div>
  ),

  TableHeader: ({ children, className = '', ...props }) => (
    <thead className={`[&_tr]:border-b ${className}`} {...props}>
      {children}
    </thead>
  ),

  TableBody: ({ children, className = '', ...props }) => (
    <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props}>
      {children}
    </tbody>
  ),

  TableRow: ({ children, className = '', ...props }) => (
    <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`} {...props}>
      {children}
    </tr>
  ),

  TableHead: ({ children, className = '', ...props }) => (
    <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
      {children}
    </th>
  ),

  TableCell: ({ children, className = '', ...props }) => (
    <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>
      {children}
    </td>
  ),

  // Tabs components
  Tabs: ({ children, defaultValue, value, onValueChange, className = '', ...props }) => {
    const [activeTab, setActiveTab] = React.useState(value || defaultValue || '');

    React.useEffect(() => {
      if (value !== undefined) {
        setActiveTab(value);
      }
    }, [value]);

    const handleTabChange = (newValue) => {
      setActiveTab(newValue);
      if (onValueChange) {
        onValueChange(newValue);
      }
    };

    return (
      <div className={className} {...props}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { activeTab, onTabChange: handleTabChange });
          }
          return child;
        })}
      </div>
    );
  },

  TabsList: ({ children, className = '', ...props }) => (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`} {...props}>
      {children}
    </div>
  ),

  TabsTrigger: ({ children, value, activeTab, onTabChange, className = '', ...props }) => (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${className}`}
      onClick={() => onTabChange && onTabChange(value)}
      data-state={activeTab === value ? 'active' : 'inactive'}
      {...props}
    >
      {children}
    </button>
  ),

  TabsContent: ({ children, value, activeTab, className = '', ...props }) => {
    if (activeTab !== value) return null;

    return (
      <div
        className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },

  // Modal component
  Modal: ({ children, isOpen, onClose, title, className = '', ...props }) => {
    const modalRef = useModalAccessibility(isOpen, onClose);

    if (!isOpen) return null;

    // Generate unique ID for aria-labelledby if title is provided
    const titleId = title ? `modal-title-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          className="fixed inset-0 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        ></div>
        <div
          ref={modalRef}
          className={`relative bg-background rounded-lg shadow-lg max-w-md w-full mx-4 ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  },

  ModalHeader: ({ children, className = '', ...props }) => (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left p-6 ${className}`} {...props}>
      {children}
    </div>
  ),

  ModalContent: ({ children, className = '', ...props }) => (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  ),

  ModalFooter: ({ children, className = '', ...props }) => (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  ),

  // Select component
  Select: ({ children, value, onChange, className = '', ...props }) => (
    <select
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      value={value}
      onChange={onChange}
      {...props}
    >
      {children}
    </select>
  ),

  // Switch component
  Switch: ({ checked, onChange, className = '', ...props }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input ${className}`}
      data-state={checked ? 'checked' : 'unchecked'}
      onClick={() => onChange(!checked)}
      {...props}
    >
      <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" data-state={checked ? 'checked' : 'unchecked'} />
    </button>
  )
};

// Export individual components for easier imports
export const {
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
} = PinesComponents;
