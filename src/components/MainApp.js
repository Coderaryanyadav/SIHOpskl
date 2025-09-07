import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Home, Briefcase, MessageCircle, User, Bell, Plus, BarChart3, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { SwipeInterface } from './SwipeInterface';
import { Dashboard } from './Dashboard';
import { ProfileScreen } from './ProfileScreen';
import { ChatScreen } from './ChatScreen';
import { NotificationScreen } from './NotificationScreen';
import { EmployerPostJob } from './EmployerPostJob';
import { EmployerJobManagement } from './EmployerJobManagement';
import { NotificationBadge } from './NotificationBadge';
export function MainApp({ userType, isDark, setIsDark, onLogout }) {
    const [activeTab, setActiveTab] = useState(userType === 'student' ? 'swipe' : 'dashboard');
    const studentTabs = [
        { id: 'swipe', icon: Home, label: 'Swipe' },
        { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
        { id: 'chat', icon: MessageCircle, label: 'Chat' },
        { id: 'profile', icon: User, label: 'Profile' },
    ];
    const employerTabs = [
        { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
        { id: 'post', icon: Plus, label: 'Post Job' },
        { id: 'jobs', icon: Briefcase, label: 'My Jobs' },
        { id: 'chat', icon: MessageCircle, label: 'Chat' },
        { id: 'profile', icon: User, label: 'Profile' },
    ];
    const tabs = userType === 'student' ? studentTabs : employerTabs;
    const renderContent = () => {
        switch (activeTab) {
            case 'swipe':
                return _jsx(SwipeInterface, {});
            case 'dashboard':
                return _jsx(Dashboard, { userType: userType });
            case 'chat':
                return _jsx(ChatScreen, {});
            case 'profile':
                return _jsx(ProfileScreen, {});
            case 'notifications':
                return _jsx(NotificationScreen, {});
            case 'post':
                return _jsx(EmployerPostJob, {});
            case 'jobs':
                return _jsx(EmployerJobManagement, {});
            default:
                return _jsx("div", { children: "Screen not implemented" });
        }
    };
    return (_jsxs("div", { className: "h-screen flex flex-col bg-background", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border", children: [_jsx("h1", { className: "text-xl", children: "Opskl" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => setActiveTab('notifications'), className: "relative", children: [_jsx(Bell, { className: "w-4 h-4" }), _jsx(NotificationBadge, {})] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsDark(!isDark), children: isDark ? _jsx(Sun, { className: "w-4 h-4" }) : _jsx(Moon, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: onLogout, children: _jsx(LogOut, { className: "w-4 h-4" }) })] })] }), _jsx("div", { className: "flex-1 overflow-hidden", children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: { duration: 0.2 }, className: "h-full", children: renderContent() }, activeTab) }) }), _jsx("div", { className: "border-t border-border bg-card", children: _jsx("div", { className: "flex items-center justify-around p-2", children: tabs.map((tab) => (_jsxs(Button, { variant: activeTab === tab.id ? 'default' : 'ghost', onClick: () => setActiveTab(tab.id), className: "flex-1 flex flex-col items-center p-3 h-auto space-y-1", children: [_jsx(tab.icon, { className: "w-5 h-5" }), _jsx("span", { className: "text-xs", children: tab.label })] }, tab.id))) }) })] }));
}
