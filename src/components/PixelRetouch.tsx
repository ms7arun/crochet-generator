import React, { useState, useCallback } from 'react';
import type { ChartData, ChartCell } from '../types/chart.types';

interface PixelRetouchProps {
  chartData: ChartData | null;
  onPixelChange: (row: number, col: number, newColor: string) => void;
  onGlobalColorReplace: (oldColor: string, newColor: string) => void;
}

export const PixelRetouch: React.FC<PixelRetouchProps> = ({
  chartData,
  onPixelChange,
  onGlobalColorReplace
}) => {
  const [selectedPixel, setSelectedPixel] = useState<ChartCell | null>(null);
  const [isRetouchMode, setIsRetouchMode] = useState(false);
  const [isGlobalReplaceMode, setIsGlobalReplaceMode] = useState(false);
  const [selectedColorForReplace, setSelectedColorForReplace] = useState<string>('');
  const [replacementColor, setReplacementColor] = useState<string>('#000000');

  const handlePixelClick = useCallback((cell: ChartCell, row: number, col: number) => {
    if (isRetouchMode) {
      setSelectedPixel({ ...cell, row, col });
    }
  }, [isRetouchMode]);

  const handleColorSelect = useCallback((color: string) => {
    if (selectedPixel) {
      onPixelChange(selectedPixel.row, selectedPixel.col, color);
      setSelectedPixel(null);
    }
  }, [selectedPixel, onPixelChange]);

  const handleGlobalReplace = useCallback(() => {
    if (selectedColorForReplace && replacementColor) {
      onGlobalColorReplace(selectedColorForReplace, replacementColor);
      setSelectedColorForReplace('');
      setReplacementColor('#000000');
      setIsGlobalReplaceMode(false);
    }
  }, [selectedColorForReplace, replacementColor, onGlobalColorReplace]);

  const getContrastColor = useCallback((hexColor: string): string => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }, []);

  if (!chartData) return null;

  const { cells, colors, gridSize } = chartData;
  const cellSize = Math.max(8, Math.min(20, 400 / Math.max(gridSize.width, gridSize.height)));

  return (
    <div className="space-y-4">
      {/* Mode Controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => {
            setIsRetouchMode(!isRetouchMode);
            setIsGlobalReplaceMode(false);
            setSelectedPixel(null);
          }}
          className={`px-4 py-2 text-sm rounded-md border transition-colors ${
            isRetouchMode
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {isRetouchMode ? 'Exit Retouch' : 'Pixel Retouch'}
        </button>
        
        <button
          onClick={() => {
            setIsGlobalReplaceMode(!isGlobalReplaceMode);
            setIsRetouchMode(false);
            setSelectedPixel(null);
          }}
          className={`px-4 py-2 text-sm rounded-md border transition-colors ${
            isGlobalReplaceMode
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {isGlobalReplaceMode ? 'Exit Replace' : 'Global Replace'}
        </button>
      </div>

      {/* Instructions */}
      {(isRetouchMode || isGlobalReplaceMode) && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {isRetouchMode && 'Click on any pixel to select it, then choose a new color from the palette below.'}
            {isGlobalReplaceMode && 'Select a color to replace, then choose the new color and click "Replace All".'}
          </p>
        </div>
      )}

      {/* Global Color Replacement */}
      {isGlobalReplaceMode && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Replace Color:</span>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColorForReplace(color.hex)}
                    className={`w-8 h-8 rounded border-2 transition-all ${
                      selectedColorForReplace === color.hex
                        ? 'border-blue-500 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            
            {selectedColorForReplace && (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">With:</span>
                <input
                  type="color"
                  value={replacementColor}
                  onChange={(e) => setReplacementColor(e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <button
                  onClick={handleGlobalReplace}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  Replace All
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pixel Retouch Palette */}
      {isRetouchMode && selectedPixel && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Selected Pixel:</span>
              <div className="flex items-center space-x-2">
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: selectedPixel.color }}
                />
                <span className="text-sm text-gray-600">
                  Row {gridSize.height - selectedPixel.row}, Col {selectedPixel.col + 1}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Choose New Color:</span>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => handleColorSelect(color.hex)}
                    className="w-8 h-8 rounded border border-gray-300 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Custom Color:</span>
              <input
                type="color"
                onChange={(e) => handleColorSelect(e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mini Chart for Pixel Selection */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-auto">
        <div
          className="relative"
          style={{
            width: gridSize.width * cellSize,
            height: gridSize.height * cellSize,
            minWidth: '100%',
            minHeight: '200px'
          }}
        >
          {cells.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`relative transition-colors duration-200 cursor-pointer ${
                    isRetouchMode && selectedPixel?.row === rowIndex && selectedPixel?.col === colIndex
                      ? 'ring-2 ring-blue-500 ring-opacity-75'
                      : ''
                  }`}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: cell.color
                  }}
                  onClick={() => handlePixelClick({ ...cell, row: rowIndex, col: colIndex }, rowIndex, colIndex)}
                  title={`Row ${gridSize.height - rowIndex}, Col ${colIndex + 1}: ${cell.sequenceNumber} stitches`}
                >
                  <div
                    className="absolute inset-0 border border-gray-300"
                    style={{ borderWidth: 0.5 }}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                    style={{
                      color: getContrastColor(cell.color),
                      fontSize: Math.max(4, cellSize * 0.2)
                    }}
                  >
                    {cell.sequenceNumber}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
