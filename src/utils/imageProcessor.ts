import type { GridSize, ColorInfo } from '../types/chart.types';

interface ProcessingOptions {
  gridSize: GridSize;
  maxColors: number;
  detailedMode?: boolean;
}

export class ImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async processImage(file: File, options: ProcessingOptions): Promise<string[][]> {
    try {
      // Load image
      const img = await this.loadImage(file);
      
      // Resize image to grid dimensions
      const imageData = this.resizeImage(img, options.gridSize);
      
      // Reduce colors based on maxColors
      const processedImageData = this.reduceColors(
        imageData,
        options.maxColors,
        options.detailedMode || false
      );
      
      // Convert to pixel array
      const pixels = this.imageDataToPixels(processedImageData);
      
      return pixels;
    } catch (error) {
      console.error('Image processing failed:', error);
      throw new Error('Failed to process image. Please try again.');
    }
  }

  async loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  resizeImage(img: HTMLImageElement, gridSize: GridSize): ImageData {
    this.canvas.width = gridSize.width;
    this.canvas.height = gridSize.height;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, gridSize.width, gridSize.height);
    
    // Draw and resize image
    this.ctx.drawImage(img, 0, 0, gridSize.width, gridSize.height);
    
    return this.ctx.getImageData(0, 0, gridSize.width, gridSize.height);
  }

  reduceColors(imageData: ImageData, maxColors: number, detailedMode: boolean = false): ImageData {
    if (detailedMode) {
      // In detailed mode, preserve original colors without reduction
      return imageData;
    }
    
    return this.reduceToLimitedColors(imageData, maxColors);
  }

  private convertToOutline(imageData: ImageData): ImageData {
    const pixels = imageData.data;
    const newImageData = new ImageData(imageData.width, imageData.height);
    const newPixels = newImageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // Convert to grayscale using luminance formula
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Create silhouette effect with better threshold
      // Lower threshold for more aggressive outline detection
      const threshold = 100; // More aggressive than 128
      
      if (gray < threshold) {
        // Dark areas become black (the silhouette)
        newPixels[i] = 0;       // R - Black
        newPixels[i + 1] = 0;   // G
        newPixels[i + 2] = 0;   // B
        newPixels[i + 3] = 255; // A
      } else {
        // Light areas become white (background)
        newPixels[i] = 255;     // R - White
        newPixels[i + 1] = 255; // G
        newPixels[i + 2] = 255; // B
        newPixels[i + 3] = 255; // A
      }
    }

    return newImageData;
  }

  private reduceToLimitedColors(imageData: ImageData, maxColors: number): ImageData {
    const pixels = imageData.data;
    const colorMap = new Map<string, number>();
    
    // Count color frequencies
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const colorKey = `${r},${g},${b}`;
      colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
    }

    // Calculate dynamic max colors based on original color count
    const originalColorCount = colorMap.size;
    const dynamicMaxColors = Math.max(2, Math.min(maxColors, Math.floor(originalColorCount / 2)));
    
    // Get top colors based on dynamic calculation
    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, dynamicMaxColors)
      .map(([color]) => color.split(',').map(Number));

    // Replace all pixels with closest color from palette
    const newImageData = new ImageData(imageData.width, imageData.height);
    const newPixels = newImageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      const closestColor = this.findClosestColor([r, g, b], sortedColors);
      
      newPixels[i] = closestColor[0];     // R
      newPixels[i + 1] = closestColor[1]; // G
      newPixels[i + 2] = closestColor[2]; // B
      newPixels[i + 3] = a;               // A
    }

    return newImageData;
  }

  private findClosestColor(target: number[], palette: number[][]): number[] {
    let closestColor = palette[0];
    let minDistance = this.calculateColorDistance(target, palette[0]);

    for (let i = 1; i < palette.length; i++) {
      const distance = this.calculateColorDistance(target, palette[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = palette[i];
      }
    }

    return closestColor;
  }

  private calculateColorDistance(color1: number[], color2: number[]): number {
    const dr = color1[0] - color2[0];
    const dg = color1[1] - color2[1];
    const db = color1[2] - color2[2];
    return dr * dr + dg * dg + db * db;
  }

  imageDataToPixels(imageData: ImageData): string[][] {
    const pixels = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const result: string[][] = [];

    for (let y = 0; y < height; y++) {
      const row: string[] = [];
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        row.push(hex);
      }
      result.push(row);
    }

    return result;
  }

  getColorInfo(pixels: string[][]): ColorInfo[] {
    const colorCount = new Map<string, number>();
    
    // Count occurrences of each color
    for (const row of pixels) {
      for (const color of row) {
        colorCount.set(color, (colorCount.get(color) || 0) + 1);
      }
    }

    // Convert to ColorInfo array
    return Array.from(colorCount.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by frequency
      .map(([hex, count]) => ({
        hex,
        name: this.getColorName(hex),
        count,
        yarnSuggestion: this.getYarnSuggestion(hex)
      }));
  }

  private getColorName(hex: string): string {
    // Simple color naming based on hex values
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
    // This could be expanded with a real yarn database
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (r === 0 && g === 0 && b === 0) return 'Black yarn';
    if (r === 255 && g === 255 && b === 255) return 'White yarn';
    
    return 'Matching yarn color';
  }
} 