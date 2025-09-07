import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'motion/react';
import { Calendar, DollarSign, TrendingUp, Clock, Award, MapPin, Briefcase, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useAppContext } from '../contexts/AppContext';
export function Dashboard({ userType }) {
    if (userType === 'student') {
        return _jsx(StudentDashboard, {});
    }
    return _jsx(EmployerDashboard, {});
}
function StudentDashboard() {
    const { currentUser } = useAppContext();
    const recentJobs = [
        {
            id: '1',
            title: 'Barista',
            company: 'Coffee Corner',
            date: '2025-01-15',
            earnings: 72,
            rating: 5,
            status: 'completed'
        },
        {
            id: '2',
            title: 'Dog Walker',
            company: 'Pet Paradise',
            date: '2025-01-14',
            earnings: 45,
            rating: 4,
            status: 'completed'
        }
    ];
    // Recent jobs will be shown directly
    const upcomingJobs = [
        {
            id: '1',
            title: 'Tutoring Assistant',
            company: 'Learn & Grow',
            date: '2025-01-18',
            time: '2:00 PM',
            location: 'University District'
        },
        {
            id: '2',
            title: 'Social Media Content',
            company: 'TrendyBrand',
            date: '2025-01-20',
            time: '10:00 AM',
            location: 'Remote'
        }
    ];
    return (_jsxs("div", { className: "h-full overflow-y-auto p-6 space-y-6", children: [_jsxs("div", { className: "text-center", children: [_jsxs("h1", { className: "text-2xl mb-2", children: ["Hi, ", currentUser?.name?.split(' ')[0] || 'Student', "! \uD83D\uDC4B"] }), _jsx("p", { className: "text-muted-foreground", children: "Here's your work overview" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, children: _jsx(Card, { className: "p-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center", children: _jsx(DollarSign, { className: "w-5 h-5 text-green-600 dark:text-green-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl", children: "$347" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "This month" })] })] }) }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, children: _jsx(Card, { className: "p-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center", children: _jsx(Briefcase, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl", children: "12" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Jobs completed" })] })] }) }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, children: _jsx(Card, { className: "p-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center", children: _jsx(Star, { className: "w-5 h-5 text-yellow-600 dark:text-yellow-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl", children: "4.8" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Average rating" })] })] }) }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, children: _jsx(Card, { className: "p-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center", children: _jsx(Clock, { className: "w-5 h-5 text-purple-600 dark:text-purple-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl", children: "24h" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "This week" })] })] }) }) })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, children: _jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Award, { className: "w-5 h-5 text-primary" }), _jsx("span", { children: "Progress to Bronze Level" })] }), _jsx(Badge, { variant: "outline", children: "8/15 jobs" })] }), _jsx(Progress, { value: 53, className: "mb-2" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Complete 7 more jobs to unlock better opportunities" })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.6 }, children: _jsxs(Card, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { children: "Upcoming Jobs" }), _jsx(Calendar, { className: "w-5 h-5 text-muted-foreground" })] }), _jsx("div", { className: "space-y-3", children: upcomingJobs.map((job) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-muted/30 rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm", children: job.title }), _jsx("p", { className: "text-xs text-muted-foreground", children: job.company }), _jsxs("div", { className: "flex items-center space-x-2 mt-1", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: job.date }), _jsx("span", { className: "text-xs text-muted-foreground", children: "\u2022" }), _jsx("span", { className: "text-xs text-muted-foreground", children: job.time })] })] }), _jsx("div", { className: "text-right", children: _jsxs("div", { className: "flex items-center text-xs text-muted-foreground", children: [_jsx(MapPin, { className: "w-3 h-3 mr-1" }), job.location] }) })] }, job.id))) })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.7 }, children: _jsxs(Card, { className: "p-4", children: [_jsx("h3", { className: "mb-4", children: "Recent Jobs" }), _jsx("div", { className: "space-y-3", children: recentJobs.map((job) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-muted/30 rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm", children: job.title }), _jsx("p", { className: "text-xs text-muted-foreground", children: job.company }), _jsx("p", { className: "text-xs text-muted-foreground", children: job.date })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-sm", children: ["$", job.earnings] }), job.rating && (_jsxs("div", { className: "flex items-center", children: [_jsx(Star, { className: "w-3 h-3 text-yellow-500 fill-current" }), _jsx("span", { className: "text-xs text-muted-foreground ml-1", children: job.rating })] })), _jsx(Badge, { variant: job.status === 'completed' ? 'default' : 'secondary', className: "text-xs mt-1", children: job.status })] })] }, job.id))) })] }) })] }));
}
function EmployerDashboard() {
    const stats = [
        { label: 'Active Jobs', value: '8', icon: Briefcase, color: 'blue' },
        { label: 'Applications', value: '24', icon: TrendingUp, color: 'green' },
        { label: 'Hired This Month', value: '12', icon: Star, color: 'yellow' },
        { label: 'Avg Response Time', value: '2h', icon: Clock, color: 'purple' }
    ];
    const recentJobs = [
        { id: '1', title: 'Barista', applications: 8, status: 'active' },
        { id: '2', title: 'Delivery Driver', applications: 15, status: 'active' },
        { id: '3', title: 'Event Staff', applications: 3, status: 'draft' }
    ];
    return (_jsxs("div", { className: "h-full overflow-y-auto p-6 space-y-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl mb-2", children: "Welcome back! \uD83D\uDC4B" }), _jsx("p", { className: "text-muted-foreground", children: "Manage your job postings and applications" })] }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: stats.map((stat, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 }, children: _jsx(Card, { className: "p-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: `w-10 h-10 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-lg flex items-center justify-center`, children: _jsx(stat.icon, { className: `w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400` }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl", children: stat.value }), _jsx("p", { className: "text-sm text-muted-foreground", children: stat.label })] })] }) }) }, stat.label))) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, children: _jsxs(Card, { className: "p-4", children: [_jsx("h3", { className: "mb-4", children: "Quick Actions" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs(Button, { className: "h-auto p-4 flex flex-col items-center space-y-2", children: [_jsx(Briefcase, { className: "w-6 h-6" }), _jsx("span", { className: "text-sm", children: "Post New Job" })] }), _jsxs(Button, { variant: "outline", className: "h-auto p-4 flex flex-col items-center space-y-2", children: [_jsx(Star, { className: "w-6 h-6" }), _jsx("span", { className: "text-sm", children: "Review Applications" })] })] })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.6 }, children: _jsxs(Card, { className: "p-4", children: [_jsx("h3", { className: "mb-4", children: "Recent Job Posts" }), _jsx("div", { className: "space-y-3", children: recentJobs.map((job) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-muted/30 rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm", children: job.title }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [job.applications, " applications"] })] }), _jsx(Badge, { variant: job.status === 'active' ? 'default' : 'secondary', children: job.status })] }, job.id))) })] }) })] }));
}
