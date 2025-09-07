import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Zap, Users, Star, MapPin } from 'lucide-react';
import { Button } from './ui/button';
const onboardingSteps = [
    {
        icon: _jsx(Zap, { className: "w-16 h-16 text-primary" }),
        title: "Swipe to Find Work",
        description: "Discover job opportunities with a simple swipe. Right for interested, left to pass.",
        color: "from-blue-500 to-purple-600"
    },
    {
        icon: _jsx(Users, { className: "w-16 h-16 text-primary" }),
        title: "Connect Instantly",
        description: "Match with employers and start conversations immediately when there's mutual interest.",
        color: "from-purple-600 to-pink-600"
    },
    {
        icon: _jsx(Star, { className: "w-16 h-16 text-primary" }),
        title: "Build Your Reputation",
        description: "Complete jobs, earn reviews, and unlock better opportunities as you build your profile.",
        color: "from-pink-600 to-orange-600"
    },
    {
        icon: _jsx(MapPin, { className: "w-16 h-16 text-primary" }),
        title: "Work Near You",
        description: "Find jobs in your area with smart location-based matching and flexible radius settings.",
        color: "from-orange-600 to-yellow-600"
    }
];
export function OnboardingScreen({ onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const nextStep = () => {
        if (currentStep < onboardingSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
        else {
            onComplete();
        }
    };
    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    return (_jsxs("div", { className: "h-screen bg-background relative overflow-hidden", children: [_jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${onboardingSteps[currentStep].color} opacity-10` }), _jsxs("div", { className: "relative z-10 h-full flex flex-col", children: [_jsx("div", { className: "p-6", children: _jsx("div", { className: "w-full bg-muted rounded-full h-1", children: _jsx(motion.div, { className: "bg-primary h-1 rounded-full", initial: { width: "0%" }, animate: { width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }, transition: { duration: 0.3 } }) }) }), _jsx("div", { className: "flex-1 flex items-center justify-center px-8", children: _jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { className: "text-center max-w-sm", initial: { opacity: 0, x: 100 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -100 }, transition: { duration: 0.3 }, children: [_jsx(motion.div, { className: "mb-8 flex justify-center", initial: { scale: 0, rotate: -180 }, animate: { scale: 1, rotate: 0 }, transition: { delay: 0.1, duration: 0.5, type: "spring" }, children: onboardingSteps[currentStep].icon }), _jsx(motion.h2, { className: "text-2xl mb-4", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2, duration: 0.4 }, children: onboardingSteps[currentStep].title }), _jsx(motion.p, { className: "text-muted-foreground leading-relaxed", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3, duration: 0.4 }, children: onboardingSteps[currentStep].description })] }, currentStep) }) }), _jsxs("div", { className: "p-8 flex justify-between items-center", children: [_jsxs(Button, { variant: "ghost", onClick: prevStep, disabled: currentStep === 0, className: "opacity-60 hover:opacity-100 transition-opacity", children: [_jsx(ChevronLeft, { className: "w-4 h-4 mr-2" }), "Back"] }), _jsx("div", { className: "flex space-x-2", children: onboardingSteps.map((_, index) => (_jsx(motion.div, { className: `w-2 h-2 rounded-full transition-colors ${index === currentStep ? 'bg-primary' : 'bg-muted'}`, whileHover: { scale: 1.2 } }, index))) }), _jsxs(Button, { onClick: nextStep, className: "bg-primary hover:bg-primary/90", children: [currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next', _jsx(ChevronRight, { className: "w-4 h-4 ml-2" })] })] })] })] }));
}
