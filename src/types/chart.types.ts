export interface GridSize {
  width: number;
  height: number;
}



export interface ColorInfo {
  hex: string;
  name: string;
  count: number;
  yarnSuggestion: string;
}

export interface Cell {
  color: string;
  sequenceNumber: number;
}

export interface ChartCell extends Cell {
  row: number;
  col: number;
}

export interface ChartData {
  cells: Cell[][];
  colors: ColorInfo[];
  gridSize: GridSize;
  maxColors: number;
}

export interface ChartState {
  chartData: ChartData | null;
  isGenerating: boolean;
  error: string | null;
}

export interface ImageUploadState {
  file: File | null;
  isProcessing: boolean;
  error: string | null;
}

export type ExportFormat = 'png' | 'pdf' | 'json' | 'text';

export interface ExportOptions {
  format: ExportFormat;
} 