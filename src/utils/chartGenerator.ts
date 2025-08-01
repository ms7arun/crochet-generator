import type { ChartData, Cell, ColorInfo, GridSize } from '../types/chart.types';

export class ChartGenerator {
  generateChart(pixels: string[][], gridSize: GridSize, maxColors: number): ChartData {
    try {
      // Get color information
      const colors = this.getColorInfo(pixels);
      
      // Generate cells with sequence numbers
      const cells = this.generateCells(pixels, colors);
      
      return {
        cells,
        colors,
        gridSize,
        maxColors
      };
    } catch (error) {
      console.error('Chart generation failed:', error);
      throw new Error('Failed to generate chart. Please try again.');
    }
  }

  private generateCells(pixels: string[][], colors: ColorInfo[]): Cell[][] {
    const cells: Cell[][] = [];

    for (let row = 0; row < pixels.length; row++) {
      const cellRow: Cell[] = [];
      let currentColor = '';
      let sequenceNumber = 0;
      
      // Process each row left to right
      for (let col = 0; col < pixels[row].length; col++) {
        const color = pixels[row][col];
        
        if (color !== currentColor) {
          // Color changed, reset sequence
          currentColor = color;
          sequenceNumber = 1;
        } else {
          // Same color, increment sequence
          sequenceNumber++;
        }
        
        cellRow.push({
          color,
          sequenceNumber
        });
      }
      cells.push(cellRow);
    }

    return cells;
  }

  private getColorInfo(pixels: string[][]): ColorInfo[] {
    const colorCount = new Map<string, number>();
    
    // Count occurrences of each color
    for (const row of pixels) {
      for (const color of row) {
        colorCount.set(color, (colorCount.get(color) || 0) + 1);
      }
    }

    // Convert to ColorInfo array and sort by frequency
    return Array.from(colorCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([hex, count]) => ({
        hex,
        name: this.getColorName(hex),
        count,
        yarnSuggestion: this.getYarnSuggestion(hex)
      }));
  }

  private getColorName(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (r === g && g === b) {
      if (r === 0) return 'Black';
      if (r === 255) return 'White';
      return `Gray ${Math.round((r / 255) * 100)}%`;
    }

    // Basic color detection
    if (r > g && r > b) return 'Red';
    if (g > r && g > b) return 'Green';
    if (b > r && b > g) return 'Blue';
    if (r > 200 && g > 200 && b < 100) return 'Yellow';
    if (r > 200 && g < 100 && b > 200) return 'Magenta';
    if (r < 100 && g > 200 && b > 200) return 'Cyan';

    return `Color ${hex}`;
  }

  private getYarnSuggestion(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (r === 0 && g === 0 && b === 0) return 'Black yarn';
    if (r === 255 && g === 255 && b === 255) return 'White yarn';
    
    return 'Matching yarn color';
  }
  
  generateInstructions(chartData: ChartData): string {
    const { cells, colors } = chartData;
    let instructions = 'Crochet Pattern Instructions\n';
    instructions += '==========================\n\n';
    
    instructions += `Grid Size: ${chartData.gridSize.width} x ${chartData.gridSize.height}\n`;
    instructions += `Total Colors: ${colors.length}\n\n`;
    
    instructions += 'Color Legend:\n';
    colors.forEach((color, index) => {
      instructions += `${index + 1}. ${color.name} (${color.hex}) - ${color.yarnSuggestion}\n`;
    });
    
    instructions += '\nRow-by-Row Instructions:\n';
    instructions += '=======================\n\n';
    
    // Generate row-by-row instructions (bottom to top for crochet)
    for (let row = cells.length - 1; row >= 0; row--) {
      instructions += `Row ${cells.length - row}: `;
      const rowInstructions: string[] = [];
      
      for (let col = 0; col < cells[row].length; col++) {
        const cell = cells[row][col];
        const colorIndex = colors.findIndex(c => c.hex === cell.color) + 1;
        rowInstructions.push(`${cell.sequenceNumber} ${colorIndex}`);
      }
      
      instructions += rowInstructions.join(', ') + '\n';
    }
    
    return instructions;
  }
  
  calculateStatistics(chartData: ChartData): {
    totalStitches: number;
    colorBreakdown: Array<{ color: string; count: number; percentage: number }>;
    averageSequenceLength: number;
  } {
    const { cells, colors } = chartData;
    let totalStitches = 0;
    const colorCounts = new Map<string, number>();
    let totalSequenceLength = 0;
    let sequenceCount = 0;
    
    for (const row of cells) {
      for (const cell of row) {
        totalStitches++;
        colorCounts.set(cell.color, (colorCounts.get(cell.color) || 0) + 1);
        
        if (cell.sequenceNumber === 1) {
          sequenceCount++;
        }
        totalSequenceLength += cell.sequenceNumber;
      }
    }
    
    const colorBreakdown = colors.map(color => ({
      color: color.name,
      count: colorCounts.get(color.hex) || 0,
      percentage: ((colorCounts.get(color.hex) || 0) / totalStitches) * 100
    }));
    
    const averageSequenceLength = sequenceCount > 0 ? totalSequenceLength / sequenceCount : 0;
    
    return {
      totalStitches,
      colorBreakdown,
      averageSequenceLength: Math.round(averageSequenceLength * 100) / 100
    };
  }
} 