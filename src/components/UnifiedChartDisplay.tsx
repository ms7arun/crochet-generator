import React, { useState, useCallback } from 'react';
import type { ChartData, ChartCell } from '../types/chart.types';

interface UnifiedChartDisplayProps {
  chartData: ChartData | null;
  isLoading: boolean;
  error: string | null;
  onPixelChange: (row: number, col: number, newColor: string) => void;
  onGlobalColorReplace: (oldColor: string, newColor: string) => void;
  isRetouchMode: boolean;
  setIsRetouchMode: (mode: boolean) => void;
  isGlobalReplaceMode: boolean;
  setIsGlobalReplaceMode: (mode: boolean) => void;
  selectedPixel: { row: number; col: number; color: string } | null;
  setSelectedPixel: (pixel: { row: number; col: number; color: string } | null) => void;
}

export const UnifiedChartDisplay: React.FC<UnifiedChartDisplayProps> = ({
  chartData,
  isLoading,
  error,
  onPixelChange,
  onGlobalColorReplace,
  isRetouchMode,
  setIsRetouchMode,
  isGlobalReplaceMode,
  setIsGlobalReplaceMode,
  selectedPixel,
  setSelectedPixel
}) => {
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedColorForReplace, setSelectedColorForReplace] = useState<string>('');
  const [replacementColor, setReplacementColor] = useState<string>('#000000');

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.3));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
  }, []);

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
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white based on luminance
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating pattern...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-700 font-medium">Error generating chart</p>
          <p className="text-red-600 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <p className="text-gray-600">Upload an image to generate a pattern</p>
        </div>
      </div>
    );
  }

  const { cells, colors, gridSize } = chartData;
  const cellSize = Math.max(10, Math.min(40, 1000 / Math.max(gridSize.width, gridSize.height))) * zoom;

  return (
    <div className="w-full">
      {/* Minimal Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleZoomOut}
            className="p-1.5 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            title="Zoom out"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <span className="text-sm text-gray-700 min-w-[50px] text-center font-medium">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            title="Zoom in"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
          <button
            onClick={handleResetZoom}
            className="px-3 py-1.5 text-xs bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors font-medium text-gray-700"
          >
            Reset
          </button>
        </div>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
            className="text-gray-600 focus:ring-gray-500"
          />
          <span className="text-sm text-gray-700 font-medium">Show grid</span>
        </label>


      </div>

      {/* Chart Container */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-auto">
        <div
          className="relative"
          style={{
            width: gridSize.width * cellSize,
            height: gridSize.height * cellSize,
            minWidth: '100%',
            minHeight: '200px'
          }}
        >
          {/* Row numbers */}
          <div className="absolute left-0 top-0 flex flex-col text-xs text-gray-500 font-mono">
            {Array.from({ length: gridSize.height }, (_, i) => (
              <div
                key={i}
                className="flex items-center justify-center bg-gray-100 border-r border-gray-200"
                style={{ width: 20, height: cellSize }}
              >
                {gridSize.height - i}
              </div>
            ))}
          </div>

          {/* Column numbers */}
          <div className="absolute left-0 top-0 flex text-xs text-gray-500 font-mono">
            {Array.from({ length: gridSize.width }, (_, i) => (
              <div
                key={i}
                className="flex items-center justify-center bg-gray-100 border-b border-gray-200"
                style={{ width: cellSize, height: 20 }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Chart Grid */}
          <div
            className="absolute"
            style={{ left: 20, top: 20 }}
          >
            {cells.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`relative transition-colors duration-200 ${
                      isRetouchMode ? 'cursor-pointer' : ''
                    } ${
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
                    {showGrid && (
                      <div
                        className="absolute inset-0 border border-gray-300"
                        style={{ borderWidth: 1 }}
                      />
                    )}
                    <div
                      className="absolute inset-0 flex items-center justify-center text-xs font-bold opacity-80"
                      style={{
                        color: getContrastColor(cell.color),
                        fontSize: Math.max(6, cellSize * 0.25)
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

      {/* Instructions */}
      {(isRetouchMode || isGlobalReplaceMode) && (
        <div className="p-4 bg-lavender-50 border-2 border-lavender-200 rounded-2xl">
          <p className="text-sm text-lavender-800 font-medium">
            {isRetouchMode && 'Click on any pixel to select it, then choose a new color from the palette below.'}
            {isGlobalReplaceMode && 'Select a color to replace, then choose the new color and click "Replace All".'}
          </p>
        </div>
      )}

      {/* Global Color Replacement */}
      {isGlobalReplaceMode && (
        <div className="p-4 bg-yarn-50 border-2 border-yarn-200 rounded-2xl">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-yarn-800">Replace Color:</span>
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
                  className="px-4 py-2 bg-yarn-600 text-white text-sm rounded-xl hover:bg-yarn-700 transition-all duration-300 font-medium"
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
        <div className="p-4 bg-lavender-50 border-2 border-lavender-200 rounded-2xl">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-lavender-800">Selected Pixel:</span>
              <div className="flex items-center space-x-2">
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: selectedPixel.color }}
                />
                <span className="text-sm text-lavender-700 font-medium">
                  Row {gridSize.height - selectedPixel.row}, Col {selectedPixel.col + 1}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-lavender-800">Choose New Color:</span>
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
              <span className="text-sm font-medium text-lavender-800">Custom Color:</span>
              <input
                type="color"
                onChange={(e) => handleColorSelect(e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}


    </div>
  );
}; 