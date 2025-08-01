import React from 'react';
import type { ColorInfo } from '../types/chart.types';
import { ColorSelector } from './ColorSelector';

interface ColorModeSelectorProps {
  maxColors: number;
  onMaxColorsChange: (maxColors: number) => void;
  detailedMode: boolean;
  onDetailedModeChange: (detailedMode: boolean) => void;
  colors?: ColorInfo[];
  onColorChange?: (oldHex: string, newHex: string) => void;
}

export const ColorModeSelector: React.FC<ColorModeSelectorProps> = ({
  maxColors,
  onMaxColorsChange,
  detailedMode,
  onDetailedModeChange,
  colors = [],
  onColorChange
}) => {
  return (
    <div className="space-y-6">
      {/* Max Colors Slider */}
      <div className="flex items-center space-x-4">
        <span className="text-base font-medium text-gray-700 font-body">Max Colors:</span>
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min="2"
            max="20"
            value={maxColors}
            onChange={(e) => onMaxColorsChange(parseInt(e.target.value))}
            className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            style={{
              background: `linear-gradient(to right, #374151 0%, #374151 ${(maxColors - 2) / 18 * 100}%, #d1d5db ${(maxColors - 2) / 18 * 100}%, #d1d5db 100%)`
            }}
          />
          <span className="text-sm text-gray-700 w-8 font-body font-medium">{maxColors}</span>
        </div>
      </div>

      {/* Detailed Mode Toggle */}
      <div className="flex items-center space-x-4">
        <span className="text-base font-medium text-gray-700 font-body">Detailed Mode:</span>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={detailedMode}
            onChange={(e) => onDetailedModeChange(e.target.checked)}
            className="w-4 h-4 text-gray-600 bg-white border border-gray-300 rounded focus:ring-gray-400 focus:ring-1 transition-colors"
          />
          <span className="text-base text-gray-700 font-body font-medium">Show all individual colors</span>
        </label>
      </div>

      {/* Custom Color Selector (when in detailed mode) */}
      {detailedMode && colors.length > 0 && onColorChange && (
        <div className="pt-4">
          <ColorSelector
            colors={colors}
            onColorChange={onColorChange}
          />
        </div>
      )}

      {/* Mode Description */}
      <div className="text-sm text-gray-600 font-body">
        {detailedMode 
          ? 'Showing all individual colors for maximum control'
          : `Reducing to ${maxColors} dominant colors for manageable patterns`
        }
      </div>
    </div>
  );
}; 