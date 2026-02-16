import { Button, ButtonGroup } from '@heroui/react';
import React, { useState, useEffect } from 'react';
/**
 * Depth Chart View Toggle Component
 *
 * Provides toggle buttons for switching between different view modes
 * of the depth chart (List View, Pro View, Sheet View, Sheet View V2).
 */

import { Layers, Users } from 'lucide-react';

/**
 * DepthChartViewToggle - Displays view mode toggle buttons
 * @param {Object} props - Component props
 * @param {string} props.chartViewMode - The currently active view mode ('list', 'enhanced', 'sheet', 'sheetv2')
 * @param {Function} props.onViewModeChange - Callback when user changes view mode (receives view mode string)
 */
export default function DepthChartViewToggle({
  chartViewMode,
  onViewModeChange
}) {
  return (
    <div className="flex justify-center">
      <ButtonGroup variant="bordered" size="sm">
        <Button
          color={chartViewMode === 'list' ? 'primary' : 'default'}
          variant={chartViewMode === 'list' ? 'solid' : 'bordered'}
          onClick={() => onViewModeChange('list')}
        >
          <Layers className="h-4 w-4 mr-2" />
          List View
        </Button>
        <Button
          color={chartViewMode === 'enhanced' ? 'primary' : 'default'}
          variant={chartViewMode === 'enhanced' ? 'solid' : 'bordered'}
          onClick={() => onViewModeChange('enhanced')}
        >
          <Users className="h-4 w-4 mr-2" />
          Pro View
        </Button>
        <Button
          color={chartViewMode === 'sheet' ? 'primary' : 'default'}
          variant={chartViewMode === 'sheet' ? 'solid' : 'bordered'}
          onClick={() => onViewModeChange('sheet')}
        >
          <Layers className="h-4 w-4 mr-2" />
          Sheet View
        </Button>
        <Button
          color={chartViewMode === 'sheetv2' ? 'primary' : 'default'}
          variant={chartViewMode === 'sheetv2' ? 'solid' : 'bordered'}
          onClick={() => onViewModeChange('sheetv2')}
        >
          <Layers className="h-4 w-4 mr-2" />
          Sheet View V2
        </Button>
      </ButtonGroup>
    </div>
  );
}
