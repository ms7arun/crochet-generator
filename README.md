# Loveloop ∞ - Pattern Generator

Transform your favorite images into beautiful crochet patterns with customizable settings and export options.

## 🚀 Features

- **Image Upload**: Drag & drop or click to upload images (JPEG, PNG, GIF, WebP)
- **Multiple Color Modes**:
  - **Outline**: Clean black silhouette perfect for pixel art crafts
  - **Medium Colors**: Reduced colors for manageable patterns
  - **Custom Colors**: Full control with individual color editing
- **Grid Controls**: Adjustable grid size from 10x10 to 80x80
- **Export Options**: PNG, PDF, JSON, and TXT formats
- **Responsive Design**: Works on desktop and mobile devices
- **PWA Support**: Install as a native app
- **Accessibility**: Full keyboard navigation and screen reader support

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Image Processing**: HTML5 Canvas API
- **PWA**: Service Worker + Manifest

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm 8+

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/crochet-pattern-generator.git
   cd crochet-pattern-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Build & Deployment

### Development

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment Options

#### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### 2. Netlify

```bash
# Build the project
npm run build

# Deploy to Netlify
# Upload the 'dist' folder to Netlify
```

#### 3. GitHub Pages

```bash
# Add to package.json scripts
"deploy": "npm run build && gh-pages -d dist"

# Install gh-pages
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

#### 4. Docker

```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🎯 Usage

### Basic Workflow

1. **Upload Image**: Drag & drop or click to upload an image
2. **Adjust Grid**: Use the range sliders to set grid size
3. **Choose Color Mode**: Select from Outline, Medium, or Custom
4. **Customize Colors**: Edit individual colors in Custom mode
5. **Export Pattern**: Download as PNG or use other export formats

### Color Modes

- **Outline**: Creates a black silhouette on white background
- **Medium**: Reduces colors to half for manageable patterns
- **Custom**: Preserves original colors with editing capabilities

### Export Formats

- **PNG**: High-quality image with color legend
- **PDF**: Pattern instructions and data
- **JSON**: Complete pattern data for programmatic use
- **TXT**: Human-readable pattern instructions

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=Crochet Pattern Generator
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://api.example.com
```

### Build Configuration

The build is configured in `vite.config.ts` with:
- ES2015 target for broad browser support
- Code splitting for optimal loading
- Terser minification
- Source maps disabled for production

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## 📱 PWA Features

The app includes Progressive Web App features:
- Installable on mobile devices
- Offline functionality
- App-like experience
- Push notifications (configurable)

## ♿ Accessibility

- Full keyboard navigation
- Screen reader support
- High contrast mode support
- Focus management
- ARIA labels and roles

## 🔒 Security

- File type validation
- File size limits (10MB max)
- Client-side processing (no server uploads)
- XSS protection
- CSP headers

## 📊 Performance

- Lazy loading of components
- Image optimization
- Code splitting
- Service worker caching
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Write comprehensive tests
- Follow accessibility guidelines
- Maintain responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- Tailwind CSS for the utility-first styling
- HTML5 Canvas API for image processing

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/crochet-pattern-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/crochet-pattern-generator/discussions)
- **Email**: support@crochet-pattern-generator.com

## 🔄 Changelog

### v1.0.0
- Initial release
- Basic image processing
- Three color modes
- Export functionality
- PWA support
- Accessibility features

---

Made with ❤️ by the Crochet Pattern Generator Team
