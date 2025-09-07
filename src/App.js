import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { LoginScreen } from './components/LoginScreen';
import { MainApp } from './components/MainApp';
import { AppProvider } from './contexts/AppContext';
export default function App() {
    const [appState, setAppState] = useState('onboarding');
    const [userType, setUserType] = useState(null);
    const [isDark, setIsDark] = useState(true);
    const handleStateChange = (newState, type) => {
        setAppState(newState);
        if (type)
            setUserType(type);
    };
    return (_jsx(AppProvider, { children: _jsx("div", { className: `min-h-screen ${isDark ? 'dark' : ''}`, children: _jsxs("div", { className: "bg-background text-foreground transition-colors duration-300", children: [appState === 'onboarding' && (_jsx(OnboardingScreen, { onComplete: () => handleStateChange('login') })), appState === 'login' && (_jsx(LoginScreen, { onLogin: (type) => handleStateChange('app', type), onBack: () => handleStateChange('onboarding') })), appState === 'app' && userType && (_jsx(MainApp, { userType: userType, isDark: isDark, setIsDark: setIsDark, onLogout: () => handleStateChange('login') }))] }) }) }));
}
