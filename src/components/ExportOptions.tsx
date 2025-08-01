import React, { useState } from 'react';
import type { ChartData } from '../types/chart.types';
import type { ExportOptions } from '../types/chart.types';
import { ExportUtils } from '../utils/exportUtils';

interface ExportOptionsProps {
  chartData: ChartData | null;
}

const EXPORT_FORMATS = [
  { value: 'png' as const, label: 'PNG', icon: '🖼️' },
  { value: 'pdf' as const, label: 'PDF', icon: '📄' },
  { value: 'json' as const, label: 'JSON', icon: '📊' },
  { value: 'text' as const, label: 'TXT', icon: '📝' }
];

export const ExportOptionsComponent: React.FC<ExportOptionsProps> = ({ chartData }) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportOptions['format']>('png');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!chartData) return;

    setIsExporting(true);

    try {
      let blob: Blob;
      let filename: string;

      switch (selectedFormat) {
        case 'png': {
          blob = await ExportUtils.exportToPNG(chartData);
          filename = `crochet-chart-${chartData.gridSize.width}x${chartData.gridSize.height}.png`;
          break;
        }
        case 'pdf': {
          blob = await ExportUtils.exportToPDF();
          filename = `crochet-pattern-${chartData.gridSize.width}x${chartData.gridSize.height}.pdf`;
          break;
        }
        case 'json': {
          const jsonData = ExportUtils.exportToJSON(chartData);
          blob = new Blob([jsonData], { type: 'application/json' });
          filename = `crochet-data-${chartData.gridSize.width}x${chartData.gridSize.height}.json`;
          break;
        }
        case 'text': {
          const textData = ExportUtils.exportToText(chartData);
          blob = new Blob([textData], { type: 'text/plain' });
          filename = `crochet-pattern-${chartData.gridSize.width}x${chartData.gridSize.height}.txt`;
          break;
        }
        default:
          throw new Error('Unsupported export format');
      }

      ExportUtils.downloadBlob(blob, filename);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export chart. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!chartData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-yarn-700 font-body">Format:</span>
        <div className="flex space-x-3">
          {EXPORT_FORMATS.map((format) => (
            <button
              key={format.value}
              onClick={() => setSelectedFormat(format.value)}
              className={`px-4 py-3 text-sm rounded-2xl border-2 transition-all duration-300 font-body ${
                selectedFormat === format.value
                  ? 'bg-lavender-100 border-lavender-300 text-lavender-700 shadow-md'
                  : 'bg-white border-beige-200 text-beige-600 hover:bg-beige-50 hover:border-lavender-300 hover:text-lavender-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{format.icon}</span>
                <span>{format.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-beige-600 font-body">
          Export as {selectedFormat.toUpperCase()} file
        </span>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="btn-stitch px-6 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Exporting...</span>
            </div>
          ) : (
            'Export'
          )}
        </button>
      </div>
    </div>
  );
}; 