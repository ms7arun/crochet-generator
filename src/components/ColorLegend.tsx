import React from 'react';
import type { ChartData } from '../types/chart.types';

interface ColorLegendProps {
  chartData: ChartData | null;
}

export const ColorLegend: React.FC<ColorLegendProps> = ({ chartData }) => {
  if (!chartData) {
    return (
      <div className="w-full p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Color Legend
        </h3>
        <p className="text-gray-600 text-sm">
          Upload an image to see the color legend and yarn suggestions.
        </p>
      </div>
    );
  }

  const { colors, gridSize } = chartData;
  const totalCells = gridSize.width * gridSize.height;

  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Color Legend
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Colors used in your crochet pattern with yarn suggestions.
        </p>
      </div>

      <div className="space-y-3">
        {colors.map((color, index) => (
          <div
            key={color.hex}
            className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3 flex-1">
              <div
                className="w-8 h-8 rounded-lg border border-gray-300"
                style={{ backgroundColor: color.hex }}
                title={color.hex}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-800">
                    {index + 1}. {color.name}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    {color.hex}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {color.yarnSuggestion}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-800">
                {color.count}
              </div>
              <div className="text-xs text-gray-500">
                {((color.count / totalCells) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Pattern Statistics</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Grid Size</div>
            <div className="font-medium text-gray-800">
              {gridSize.width} × {gridSize.height}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Total Stitches</div>
            <div className="font-medium text-gray-800">
              {totalCells}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Colors Used</div>
            <div className="font-medium text-gray-800">
              {colors.length}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Most Used Color</div>
            <div className="font-medium text-gray-800">
              {colors[0]?.name || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Yarn Requirements</h4>
        <div className="space-y-2 text-sm">
          {colors.map((color) => (
            <div key={color.hex} className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-gray-700">{color.name}</span>
              </div>
              <span className="text-gray-600">
                ~{Math.ceil(color.count / 10)}g (estimate)
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-3">
          * Yarn amounts are estimates based on typical crochet stitch sizes.
          Actual requirements may vary based on your tension and yarn weight.
        </p>
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Tips</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Work from bottom to top (row 1 is at the bottom)</li>
          <li>• Numbers in cells show consecutive stitches of the same color</li>
          <li>• Use the same yarn weight for consistent results</li>
          <li>• Consider using stitch markers for complex patterns</li>
        </ul>
      </div>
    </div>
  );
}; 