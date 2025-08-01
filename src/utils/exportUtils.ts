import type { ChartData, ColorInfo } from '../types/chart.types';

export class ExportUtils {
  static async exportToPNG(chartData: ChartData): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    const cellSize = 20;
    const padding = 40;
    const legendHeight = 100;
    
    canvas.width = chartData.gridSize.width * cellSize + padding * 2;
    canvas.height = chartData.gridSize.height * cellSize + padding * 2 + legendHeight;
    
    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    
    for (let row = 0; row < chartData.gridSize.height; row++) {
      for (let col = 0; col < chartData.gridSize.width; col++) {
        const cell = chartData.cells[row][col];
        const x = col * cellSize + padding;
        const y = row * cellSize + padding;
        
        // Fill cell with color
        ctx.fillStyle = cell.color;
        ctx.fillRect(x, y, cellSize, cellSize);
        
        // Draw border
        ctx.strokeRect(x, y, cellSize, cellSize);
        
        // Draw sequence number
        ctx.fillStyle = this.getContrastColor(cell.color);
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          cell.sequenceNumber.toString(),
          x + cellSize / 2,
          y + cellSize / 2
        );
      }
    }
    
    // Draw legend
    const legendY = canvas.height - legendHeight + 20;
    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Color Legend:', padding, legendY);
    
    // Draw legend with colors from chart data (ensuring exact match)
    chartData.colors.forEach((color, index) => {
      const legendX = padding + (index * 150);
      const legendItemY = legendY + 30;
      
      // Color swatch
      ctx.fillStyle = color.hex;
      ctx.fillRect(legendX, legendItemY, 20, 20);
      ctx.strokeRect(legendX, legendItemY, 20, 20);
      
      // Color info
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.fillText(
        `${index + 1}. ${color.name}`,
        legendX + 25,
        legendItemY + 10
      );
    });
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
  }
  
  static exportToJSON(chartData: ChartData): string {
    return JSON.stringify(chartData, null, 2);
  }
  
  static exportToText(chartData: ChartData): string {
    const { cells, colors, gridSize } = chartData;
    let text = `Crochet Chart - ${gridSize.width}x${gridSize.height}\n`;
    text += '='.repeat(50) + '\n\n';
    
    // Add color legend
    text += 'Colors:\n';
    colors.forEach((color, index) => {
      text += `${index + 1}. ${color.name} (${color.hex})\n`;
    });
    text += '\n';
    
    // Add grid representation
    text += 'Chart (numbers represent sequence length):\n';
    for (let row = 0; row < cells.length; row++) {
      for (let col = 0; col < cells[row].length; col++) {
        const cell = cells[row][col];
        const colorIndex = colors.findIndex(c => c.hex === cell.color) + 1;
        text += `${cell.sequenceNumber}${colorIndex} `;
      }
      text += '\n';
    }
    
    return text;
  }
  
  static async exportToPDF(): Promise<Blob> {
    // For now, we'll create a simple PDF-like structure
    // In a real implementation, you'd use a library like jsPDF
    
    // Create a simple text-based PDF structure
    const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 1000
>>
stream
BT
/F1 12 Tf
72 720 Td
(Crochet Chart Pattern) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000200 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
500
%%EOF
    `;
    
    return new Blob([pdfContent], { type: 'application/pdf' });
  }
  
  private static getContrastColor(hexColor: string): string {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white based on luminance
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }
  
  static generateInstructions(chartData: ChartData): string {
    const { cells, colors } = chartData;
    let instructions = 'Crochet Pattern Instructions\n';
    instructions += '==========================\n\n';
    
    instructions += `Grid Size: ${chartData.gridSize.width} x ${chartData.gridSize.height}\n`;
    instructions += `Total Colors: ${colors.length}\n\n`;
    
    instructions += 'Color Legend:\n';
    colors.forEach((color, index) => {
      instructions += `${index + 1}. ${color.name} (${color.hex})\n`;
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
  
  static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
} 