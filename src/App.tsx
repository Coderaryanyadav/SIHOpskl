import { useState } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { LoginScreen } from './components/LoginScreen';
import { MainApp } from './components/MainApp';
import { AppProvider } from './contexts/AppContext';

type AppState = 'onboarding' | 'login' | 'app';
type UserType = 'student' | 'employer' | null;

export default function App() {
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [userType, setUserType] = useState<UserType>(null);
  const [isDark, setIsDark] = useState(true);

  const handleStateChange = (newState: AppState, type?: UserType) => {
    setAppState(newState);
    if (type) setUserType(type);
  };

  return (
    <AppProvider>
      <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
        <div className="bg-background text-foreground transition-colors duration-300">
          {appState === 'onboarding' && (
            <OnboardingScreen onComplete={() => handleStateChange('login')} />
          )}
          {appState === 'login' && (
            <LoginScreen 
              onLogin={(type) => handleStateChange('app', type)}
              onBack={() => handleStateChange('onboarding')}
            />
          )}
          {appState === 'app' && userType && (
            <MainApp 
              userType={userType} 
              isDark={isDark}
              setIsDark={setIsDark}
              onLogout={() => handleStateChange('login')}
            />
          )}
        </div>
      </div>
    </AppProvider>
  );
}