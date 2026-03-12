/**
 * Barrel export file for depth chart components
 *
 * This file exports all depth chart-related components for cleaner imports.
 * Instead of importing each component individually, you can import them all from this file:
 *
 * import {
 *   CreateDepthChartModal,
 *   AssignPlayerModal,
 *   // ... other components
 * } from '../components/depthchart'
 */

// Modal Components
export { default as CreateDepthChartModal } from './CreateDepthChartModal';
export { default as AssignPlayerModal } from './AssignPlayerModal';
export { default as PermissionsRequestModal } from './PermissionsRequestModal';

// Tab Content Components
export { default as DepthChartHistoryTab } from './DepthChartHistoryTab';
export { default as DepthChartPermissionsTab } from './DepthChartPermissionsTab';

// List View Components
export { default as DepthChartPlayerCard } from './DepthChartPlayerCard';
export { default as DepthChartPositionCard } from './DepthChartPositionCard';
export { default as DepthChartListView } from './DepthChartListView';

// Header and Navigation Components
export { default as DepthChartPageHeader } from './DepthChartPageHeader';
export { default as DepthChartSelector } from './DepthChartSelector';
export { default as DepthChartDetailHeader } from './DepthChartDetailHeader';
export { default as DepthChartViewToggle } from './DepthChartViewToggle';
