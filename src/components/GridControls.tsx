import React, { useState } from 'react';
import type { GridSize } from '../types/chart.types';

interface GridControlsProps {
  gridSize: GridSize;
  onGridSizeChange: (gridSize: GridSize) => void;
  suggestedGridSize?: GridSize;
}

const GRID_SIZE_OPTIONS = [
  { width: 15, height: 15, label: '15x15' },
  { width: 20, height: 20, label: '20x20' },
  { width: 25, height: 25, label: '25x25' },
  { width: 30, height: 30, label: '30x30' },
  { width: 40, height: 40, label: '40x40' },
  { width: 50, height: 50, label: '50x50' },
  { width: 60, height: 60, label: '60x60' },
  { width: 70, height: 70, label: '70x70' },
  { width: 80, height: 80, label: '80x80' },
  { width: 90, height: 90, label: '90x90' },
  { width: 100, height: 100, label: '100x100' }
];

export const GridControls: React.FC<GridControlsProps> = ({
  gridSize,
  onGridSizeChange,
  suggestedGridSize
}) => {
  const [customWidth, setCustomWidth] = useState(gridSize.width.toString());
  const [customHeight, setCustomHeight] = useState(gridSize.height.toString());

  const handleWidthChange = (width: number) => {
    onGridSizeChange({ ...gridSize, width });
    setCustomWidth(width.toString());
  };

  const handleHeightChange = (height: number) => {
    onGridSizeChange({ ...gridSize, height });
    setCustomHeight(height.toString());
  };

  const handlePresetChange = (preset: typeof GRID_SIZE_OPTIONS[0]) => {
    onGridSizeChange({ width: preset.width, height: preset.height });
    setCustomWidth(preset.width.toString());
    setCustomHeight(preset.height.toString());
  };

  const handleCustomWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomWidth(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 10 && numValue <= 100) {
      handleWidthChange(numValue);
    }
  };

  const handleCustomHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomHeight(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 10 && numValue <= 100) {
      handleHeightChange(numValue);
    }
  };

    return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-8">
      {suggestedGridSize && (
        <div className="flex items-center space-x-3">
          <span className="text-sm lg:text-base text-gray-700 font-body font-medium">Suggested:</span>
          <button
            onClick={() => onGridSizeChange(suggestedGridSize)}
            className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors border border-gray-300 font-body"
          >
            {suggestedGridSize.width}×{suggestedGridSize.height}
          </button>
        </div>
      )}

      {/* Custom Input Fields */}
      <div className="flex items-center space-x-3">
        <span className="text-sm lg:text-base font-medium text-gray-700 font-body">Custom:</span>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="10"
            max="100"
            value={customWidth}
            onChange={handleCustomWidthChange}
            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white font-body"
            placeholder="W"
          />
          <span className="text-sm text-gray-500 font-body">×</span>
          <input
            type="number"
            min="10"
            max="100"
            value={customHeight}
            onChange={handleCustomHeightChange}
            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white font-body"
            placeholder="H"
          />
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-3">
        <span className="text-sm lg:text-base font-medium text-gray-700 font-body">Presets:</span>
        <div className="flex flex-wrap gap-2">
          {GRID_SIZE_OPTIONS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetChange(preset)}
              className={`px-3 py-1.5 text-xs rounded-md border transition-colors font-body ${
                gridSize.width === preset.width && gridSize.height === preset.height
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 