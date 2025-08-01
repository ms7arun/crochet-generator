import { useState, useCallback, useEffect } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { GridControls } from './components/GridControls';
import { ColorModeSelector } from './components/ColorModeSelector';
import { UnifiedChartDisplay } from './components/UnifiedChartDisplay';
import { ExportOptionsComponent } from './components/ExportOptions';
import { YarnWaveBackground } from './components/YarnWaveBackground';
import { ExportUtils } from './utils/exportUtils';
import { useImageProcessing } from './hooks/useImageProcessing';
import { useChartGeneration } from './hooks/useChartGeneration';
import type { GridSize, ColorInfo } from './types/chart.types';

function App() {
  // State management
  const [gridSize, setGridSize] = useState<GridSize>({ width: 30, height: 30 });
  const [maxColors, setMaxColors] = useState(6);
  const [suggestedGridSize, setSuggestedGridSize] = useState<GridSize | undefined>();
  const [customColors, setCustomColors] = useState<Map<string, string>>(new Map());
  const [showGridControls, setShowGridControls] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [detailedMode, setDetailedMode] = useState(false);
  const [isRetouchMode, setIsRetouchMode] = useState(false);
  const [isGlobalReplaceMode, setIsGlobalReplaceMode] = useState(false);
  const [selectedPixel, setSelectedPixel] = useState<{ row: number; col: number; color: string } | null>(null);

  // Custom hooks
  const {
    uploadState,
    handleFileUpload,
    processImage,
    clearUpload,
    suggestGridSize
  } = useImageProcessing();

  const {
    chartState,
    generateChart,
    clearChart
  } = useChartGeneration();

  // Auto-generate chart when settings change
  useEffect(() => {
    if (uploadState.file && !uploadState.isProcessing) {
      handleGenerateChart();
    }
  }, [uploadState.file, gridSize, maxColors, customColors]);

  // Handle image upload and suggest grid size
  const handleFileUploadWithSuggestion = useCallback((file: File) => {
    handleFileUpload(file);
    
    // Create a temporary image to get dimensions for grid size suggestion
    const img = new Image();
    img.onload = () => {
      const suggested = suggestGridSize(img.width, img.height);
      setSuggestedGridSize(suggested);
      setGridSize(suggested);
    };
    img.src = URL.createObjectURL(file);
  }, [handleFileUpload, suggestGridSize]);

  // Handle color changes
  const handleColorChange = useCallback((oldHex: string, newHex: string) => {
    setCustomColors(prev => {
      const newMap = new Map(prev);
      newMap.set(oldHex, newHex);
      return newMap;
    });
  }, []);

  // Handle pixel changes
  const handlePixelChange = useCallback((row: number, col: number, newColor: string) => {
    if (chartState.chartData) {
      const updatedCells = chartState.chartData.cells.map((chartRow, rowIndex) =>
        rowIndex === row
          ? chartRow.map((cell, colIndex) =>
              colIndex === col ? { ...cell, color: newColor } : cell
            )
          : chartRow
      );
      
      // Extract colors for chart regeneration
      const updatedPixels = updatedCells.map(row => row.map(cell => cell.color));
      
      // Trigger chart regeneration with updated data
      generateChart(updatedPixels, gridSize, maxColors);
    }
  }, [chartState.chartData, generateChart, gridSize, maxColors]);

  // Handle global color replacement
  const handleGlobalColorReplace = useCallback((oldColor: string, newColor: string) => {
    if (chartState.chartData) {
      const updatedCells = chartState.chartData.cells.map(row =>
        row.map(cell => ({
          ...cell,
          color: cell.color === oldColor ? newColor : cell.color
        }))
      );
      
      // Extract colors for chart regeneration
      const updatedPixels = updatedCells.map(row => row.map(cell => cell.color));
      
      // Trigger chart regeneration with updated data
      generateChart(updatedPixels, gridSize, maxColors);
    }
  }, [chartState.chartData, generateChart, gridSize, maxColors]);

  // Handle chart generation
  const handleGenerateChart = useCallback(async () => {
    if (!uploadState.file) return;

    try {
      const pixels = await processImage({
        gridSize,
        maxColors,
        detailedMode
      });

      // Apply custom color changes if any
      let processedPixels = pixels;
      if (customColors.size > 0) {
        processedPixels = pixels.map(row => 
          row.map(pixel => customColors.get(pixel) || pixel)
        );
      }

      await generateChart(processedPixels, gridSize, maxColors);
    } catch (error) {
      console.error('Failed to generate chart:', error);
    }
  }, [uploadState.file, gridSize, maxColors, processImage, generateChart, customColors, detailedMode]);

  // Handle clear all
  const handleClearAll = useCallback(() => {
    clearUpload();
    clearChart();
    setSuggestedGridSize(undefined);
    setCustomColors(new Map());
  }, [clearUpload, clearChart]);



  // Handle direct PNG export
  const handlePNGExport = useCallback(async () => {
    if (!chartState.chartData) return;

    setIsExporting(true);
    try {
      const blob = await ExportUtils.exportToPNG(chartState.chartData);
      const filename = `crochet-chart-${chartState.chartData.gridSize.width}x${chartState.chartData.gridSize.height}.png`;
      ExportUtils.downloadBlob(blob, filename);
    } catch (error) {
      console.error('PNG export failed:', error);
      alert('Failed to export PNG. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [chartState.chartData]);

  return (
    <div className="min-h-screen relative bg-gray-50">
      
      {/* Header */}
      <header className="relative z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 lg:px-8 py-6">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl">🧶</div>
                          <div>
                <h1 className="text-3xl font-display text-gray-900 font-semibold">
                  Loveloop ∞
                </h1>

              </div>
          </div>
          <div className="flex items-center space-x-3">
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 w-full px-4 lg:px-8 py-8">
        

        {/* Pattern Generation State - Full Width Layout */}
        <div className="grid lg:grid-cols-6 gap-4 lg:gap-6">
            {/* Left Sidebar - Controls */}
            <div className="lg:col-span-1 space-y-4 lg:space-y-6">
              {/* Image Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Image</h3>
                {uploadState.file && (
                  <div className="relative group">
                    <img
                      src={URL.createObjectURL(uploadState.file)}
                      alt="Uploaded image"
                      className="w-full h-auto rounded-lg border border-gray-200"
                    />
                    {uploadState.isProcessing && (
                      <div className="absolute inset-0 bg-white/90 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
                          <p className="text-gray-600 text-sm">Processing...</p>
                        </div>
                      </div>
                    )}
                    {/* Hover Reset Button */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={handleClearAll}
                        className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg border border-gray-200 hover:bg-white transition-all duration-200 font-medium text-sm shadow-lg"
                      >
                        Reset Image
                      </button>
                    </div>
                  </div>
                )}
                {!uploadState.file && (
                  <div className="text-center py-8">
                    <ImageUpload
                      uploadState={uploadState}
                      onFileUpload={handleFileUploadWithSuggestion}
                      onClear={handleClearAll}
                    />
                  </div>
                )}
              </div>

              {/* Color Settings */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Color Settings</h3>
                <ColorModeSelector
                  maxColors={maxColors}
                  onMaxColorsChange={setMaxColors}
                  detailedMode={detailedMode}
                  onDetailedModeChange={setDetailedMode}
                  colors={chartState.chartData?.colors || []}
                  onColorChange={handleColorChange}
                />
              </div>

              {/* Retouch Tools */}
              {chartState.chartData && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Retouch</h3>
                  <div className="space-y-4">
                    <div>
                      <button
                        onClick={() => {
                          setIsRetouchMode(!isRetouchMode);
                          setIsGlobalReplaceMode(false);
                          setSelectedPixel(null);
                        }}
                        className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                          isRetouchMode
                            ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        {isRetouchMode ? 'Exit Pixel Retouch' : 'Pixel Retouch'}
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        Change the color of a single selected pixel in your pattern.
                      </p>
                    </div>
                    
                    <div>
                      <button
                        onClick={() => {
                          setIsGlobalReplaceMode(!isGlobalReplaceMode);
                          setIsRetouchMode(false);
                          setSelectedPixel(null);
                        }}
                        className={`w-full px-4 py-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                          isGlobalReplaceMode
                            ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        {isGlobalReplaceMode ? 'Exit Global Retouch' : 'Global Retouch'}
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        Replace every occurrence of a selected color with a color of your choice.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Export */}
              {chartState.chartData && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Export</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={handlePNGExport}
                      disabled={isExporting}
                      className="w-full px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      {isExporting ? 'Exporting...' : 'Download PNG'}
                    </button>
                    <button 
                      onClick={() => setShowExportOptions(!showExportOptions)}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      More Options
                    </button>
                  </div>
                  
                  {showExportOptions && (
                    <div className="pt-4 border-t border-gray-200 mt-4">
                      <ExportOptionsComponent chartData={chartState.chartData} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Side - Pattern Display with Grid Settings at Bottom */}
            <div className="lg:col-span-5 order-first lg:order-last">
              <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h3 className="text-xl font-medium text-gray-900">Pattern</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{gridSize.width} × {gridSize.height}</span>
                    {chartState.isGenerating && (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                        <span>Generating...</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="min-h-[300px] sm:min-h-[400px] lg:min-h-[800px] flex items-center justify-center mb-6">
                  <UnifiedChartDisplay
                    chartData={chartState.chartData}
                    isLoading={chartState.isGenerating}
                    error={chartState.error}
                    onPixelChange={handlePixelChange}
                    onGlobalColorReplace={handleGlobalColorReplace}
                    isRetouchMode={isRetouchMode}
                    setIsRetouchMode={setIsRetouchMode}
                    isGlobalReplaceMode={isGlobalReplaceMode}
                    setIsGlobalReplaceMode={setIsGlobalReplaceMode}
                    selectedPixel={selectedPixel}
                    setSelectedPixel={setSelectedPixel}
                  />
                </div>

                {/* Grid Settings - Horizontal Layout at Bottom */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Grid Settings</h3>
                  <GridControls
                    gridSize={gridSize}
                    onGridSizeChange={setGridSize}
                    suggestedGridSize={suggestedGridSize}
                  />
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-white/90 backdrop-blur-sm border-t border-gray-200 px-4 lg:px-8 py-6 mt-12">
        <div className="w-full text-center">
          <p className="text-gray-500 font-body text-sm">
            Made with ❤️ for K from A
          </p>
        </div>
      </footer>

      {/* Error Display */}
      {chartState.error && (
        <div className="fixed bottom-4 right-4 bg-red-50 border-2 border-red-200 rounded-2xl p-4 max-w-sm shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-red-800">Error</span>
          </div>
          <p className="text-red-700 mt-1 text-sm">{chartState.error}</p>
        </div>
      )}
    </div>
  );
}

export default App;
