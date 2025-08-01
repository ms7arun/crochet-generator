import React, { useState } from 'react';
import type { ColorInfo } from '../types/chart.types';

interface ColorSelectorProps {
  colors: ColorInfo[];
  onColorChange: (oldHex: string, newHex: string) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  onColorChange
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleColorChange = (oldHex: string, newHex: string) => {
    onColorChange(oldHex, newHex);
    setSelectedColor(null);
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-yarn-700 font-body">Colors:</span>
      <div className="flex space-x-3">
        {colors.slice(0, 6).map((color) => (
          <div key={color.hex} className="relative">
            <div
              className="w-8 h-8 rounded-2xl border-2 border-beige-200 cursor-pointer hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg"
              style={{ backgroundColor: color.hex }}
              onClick={() => setSelectedColor(color.hex)}
              title={`${color.name} (${color.count} pixels)`}
            />
            {selectedColor === color.hex && (
              <div className="absolute top-10 left-0 z-10 bg-white border-2 border-lavender-200 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => handleColorChange(color.hex, e.target.value)}
                    className="w-10 h-10 border-2 border-lavender-300 rounded-2xl cursor-pointer"
                  />
                  <button
                    onClick={() => setSelectedColor(null)}
                    className="text-xs text-beige-600 hover:text-yarn-600 transition-colors font-body"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-xs text-beige-500 mt-2 font-body">
                  {color.name} ({color.count} pixels)
                </p>
              </div>
            )}
          </div>
        ))}
        {colors.length > 6 && (
          <span className="text-xs text-beige-500 self-center font-body">+{colors.length - 6}</span>
        )}
      </div>
    </div>
  );
}; 