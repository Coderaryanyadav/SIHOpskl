
# Tinder for Work App (Community)

This is a code bundle for Tinder for Work App (Community). The original project is available at [Figma](https://www.figma.com/design/sStfCbnARgqcJ7Tvnll1ku/Tinder-for-Work-App--Community-).

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase account (for deployment)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your Firebase configuration

### Development

Start the development server:
```bash
npm run dev
```

### Building for Production

Create a production build:
```bash
npm run build
```

### Preview Production Build

To preview the production build locally:
```bash
npm run preview
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import your repository into Vercel
3. Vercel will automatically detect the Vite configuration and deploy your app

### Firebase Hosting

1. Install Firebase CLI if you haven't already:
   ```bash
   npm install -g firebase-tools
   ```
2. Login to Firebase:
   ```bash
   firebase login
   ```
3. Initialize Firebase (if not already done):
   ```bash
   firebase init
   ```
4. Build your project:
   ```bash
   npm run build
   ```
5. Deploy to Firebase:
   ```bash
   firebase deploy --only hosting
   ```

## 📦 Build Optimization

The project is configured with:
- Code splitting for better load performance
- Lazy loading of routes
- PWA support for offline functionality
- Bundle analysis with rollup-plugin-visualizer

## 🔧 Troubleshooting

- If you encounter module resolution issues, try:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- For TypeScript errors, ensure all dependencies are properly installed

## 📄 License

This project is licensed under the MIT License.# SIHOpskl
