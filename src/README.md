# 🚀 Opskl - Tinder for Work (Complete Version)

A fully functional job matching platform that connects students with employers through an intuitive swipe-based interface. Built with React, TypeScript, and modern web technologies.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0.0-blue.svg)

## ✨ Features

### 🎯 **Student Features**
- **🔥 Swipe Interface** - Tinder-style job browsing with gesture controls
- **🎯 Smart Matching** - AI-powered job recommendations based on skills and preferences  
- **💰 Earnings Tracking** - Comprehensive income analytics and payment history
- **⭐ Rating System** - Build reputation through employer reviews
- **💬 Real-time Chat** - Direct messaging with potential employers
- **📊 Dashboard** - Track progress, earnings, and job statistics
- **👤 Profile Management** - Showcase skills, experience, and availability
- **🔔 Notifications** - Instant alerts for matches, messages, and opportunities

### 💼 **Employer Features**
- **📝 Easy Job Posting** - Streamlined job creation with preview functionality
- **👥 Applicant Management** - Review and manage candidate applications
- **💬 Direct Communication** - Chat with potential hires
- **📊 Analytics Dashboard** - Track hiring metrics and performance
- **🔍 Talent Discovery** - Browse qualified student profiles
- **💼 Company Profile** - Build employer brand and showcase company culture
- **⚙️ Job Management** - Manage active listings, pause, edit, or delete posts

### 🎨 **User Experience**
- **📱 Mobile-First Design** - Optimized for mobile with responsive layout
- **🎭 Smooth Animations** - Motion-powered transitions and micro-interactions
- **🌙 Dark Theme** - Eye-friendly dark mode design
- **⚡ Fast Performance** - Optimized loading and rendering
- **♿ Accessibility** - Screen reader support and keyboard navigation

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Custom CSS Variables
- **Animations**: Motion (Framer Motion successor)
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Build Tool**: Vite with hot module replacement
- **Code Quality**: ESLint, TypeScript strict mode

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+ or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd opskl-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Type check
npm run type-check

# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── SwipeInterface.tsx    # Job swiping functionality
│   ├── Dashboard.tsx         # Analytics dashboard
│   ├── ChatScreen.tsx        # Messaging interface
│   ├── ProfileScreen.tsx     # Profile management
│   └── ...
├── styles/
│   └── globals.css      # Global styles and design tokens
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## 🎮 How It Works

### For Students
1. **Onboarding** - Select user type and set preferences
2. **Browse Jobs** - Swipe through curated job opportunities
3. **Apply Instantly** - Swipe right to apply, left to pass
4. **Connect** - Chat directly with employers
5. **Track Earnings** - Monitor income and job performance

### For Employers  
1. **Post Jobs** - Create detailed job listings with requirements
2. **Review Applications** - Manage incoming student applications
3. **Connect** - Message qualified candidates
4. **Hire** - Complete the hiring process through the platform
5. **Track Performance** - Monitor hiring success and metrics

## 🎨 Design System

- **Colors**: Custom dark theme with accessible contrast ratios
- **Typography**: Inter font with optimized readability
- **Spacing**: 8-point grid system for consistent layouts
- **Components**: Reusable UI components with consistent styling
- **Animations**: Smooth, purposeful motion design

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

### Code Style

- **TypeScript** - Strict mode enabled for type safety
- **ESLint** - Configured for React and TypeScript
- **Component Architecture** - Modular, reusable components
- **State Management** - React hooks and context

## 📱 Mobile Optimization

- **Touch Gestures** - Native-like swipe interactions
- **Safe Area Support** - iPhone notch compatibility  
- **Performance** - Optimized for mobile devices
- **Offline Support** - Service worker for offline functionality
- **Progressive Web App** - Installable on mobile devices

## 🔮 Future Enhancements

- **Supabase Integration** - Real-time database and authentication
- **Push Notifications** - Native mobile notifications
- **Payment Processing** - Integrated payment system
- **Advanced Matching** - ML-powered job recommendations
- **Video Profiles** - Video introductions and interviews
- **Geolocation** - Location-based job matching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 📧 Contact

- **Email**: contact@opskl.com
- **Website**: https://opskl.com
- **GitHub**: [@opskl](https://github.com/opskl)

---

**Built with ❤️ for the future of work**