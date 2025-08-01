import React, { useState, useCallback } from 'react';
import type { ChartData, ChartCell } from '../types/chart.types';

interface ChartDisplayProps {
  chartData: ChartData | null;
  isLoading: boolean;
  error: string | null;
}

export const ChartDisplay: React.FC<ChartDisplayProps> = ({
  chartData,
  isLoading,
  error
}) => {
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [hoveredCell, setHoveredCell] = useState<ChartCell | null>(null);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
  }, []);

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
  const cellSize = Math.max(12, Math.min(25, 500 / Math.max(gridSize.width, gridSize.height))) * zoom;

  return (
    <div className="w-full">
      {/* Minimal Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleZoomOut}
            className="p-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
            title="Zoom out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <span className="text-sm text-gray-600 min-w-[50px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
            title="Zoom in"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
          <button
            onClick={handleResetZoom}
            className="px-3 py-1.5 text-xs bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
        </div>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Show grid</span>
        </label>
      </div>

      {/* Chart Container */}
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
                      hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex
                        ? 'ring-2 ring-blue-500 ring-opacity-50'
                        : ''
                    }`}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: cell.color
                    }}
                    onMouseEnter={() => setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                    title={`Row ${gridSize.height - rowIndex}, Col ${colIndex + 1}: ${cell.sequenceNumber} stitches in ${colors.find(c => c.hex === cell.color)?.name || 'Unknown'} color`}
                  >
                    {showGrid && (
                      <div
                        className="absolute inset-0 border border-gray-300"
                        style={{ borderWidth: 1 }}
                      />
                    )}
                    <div
                      className="absolute inset-0 flex items-center justify-center text-xs font-bold"
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

      {/* Hover Info */}
      {hoveredCell && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Cell:</strong> Row {gridSize.height - hoveredCell.row}, Column {hoveredCell.col + 1}
            <br />
            <strong>Color:</strong> {colors.find(c => c.hex === hoveredCell.color)?.name || 'Unknown'}
            <br />
            <strong>Sequence:</strong> {hoveredCell.sequenceNumber} consecutive stitches
          </div>
        </div>
      )}
    </div>
  );
}; 