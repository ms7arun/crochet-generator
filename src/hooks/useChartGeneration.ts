import { useState, useCallback } from 'react';
import { ChartGenerator } from '../utils/chartGenerator';
import type { ChartData, GridSize, ChartState } from '../types/chart.types';

export const useChartGeneration = () => {
  const [chartState, setChartState] = useState<ChartState>({
    chartData: null,
    isGenerating: false,
    error: null
  });

  const chartGenerator = new ChartGenerator();

  const generateChart = useCallback(async (
    pixels: string[][],
    gridSize: GridSize,
    maxColors: number
  ) => {
    setChartState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const chartData = chartGenerator.generateChart(pixels, gridSize, maxColors);
      setChartState({
        chartData,
        isGenerating: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate chart';
      setChartState({
        chartData: null,
        isGenerating: false,
        error: errorMessage
      });
      throw error;
    }
  }, [chartGenerator]);

  const clearChart = useCallback(() => {
    setChartState({
      chartData: null,
      isGenerating: false,
      error: null
    });
  }, []);

  return {
    chartState,
    generateChart,
    clearChart
  };
}; 