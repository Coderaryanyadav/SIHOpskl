import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from "framer-motion";
import { X, MapPin, DollarSign, Clock, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
const categories = [
    'Food Service', 'Retail', 'Pet Care', 'Education', 'Events',
    'Marketing', 'Delivery', 'Cleaning', 'Tech Support', 'Other'
];
const durations = ['1-2 hours', '3-4 hours', '5-8 hours', 'Full day', 'Multi-day'];
export function FilterModal({ open, onClose, onApplyFilters, initialFilters }) {
    const [radius, setRadius] = useState([initialFilters.radius || 10]);
    const [payRange, setPayRange] = useState([initialFilters.minPay || 15, initialFilters.maxPay || 30]);
    const [selectedCategories, setSelectedCategories] = useState(initialFilters.categories || []);
    const [urgentOnly, setUrgentOnly] = useState(initialFilters.urgentOnly || false);
    const [remoteWork, setRemoteWork] = useState(initialFilters.remoteWork || false);
    const [selectedDurations, setSelectedDurations] = useState(initialFilters.duration || []);
    const toggleCategory = (category) => {
        setSelectedCategories(prev => prev.includes(category)
            ? prev.filter(c => c !== category)
            : [...prev, category]);
    };
    const toggleDuration = (duration) => {
        setSelectedDurations(prev => prev.includes(duration)
            ? prev.filter(d => d !== duration)
            : [...prev, duration]);
    };
    const handleApply = () => {
        const filters = {
            radius: radius[0],
            minPay: payRange[0],
            maxPay: payRange[1],
            categories: selectedCategories,
            urgentOnly,
            remoteWork,
            duration: selectedDurations
        };
        onApplyFilters(filters);
    };
    const clearFilters = () => {
        setRadius([10]);
        setPayRange([15, 30]);
        setSelectedCategories([]);
        setUrgentOnly(false);
        setRemoteWork(false);
        setSelectedDurations([]);
    };
    if (!open)
        return null;
    return (_jsx(motion.div, { className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose, children: _jsxs(motion.div, { className: "w-full max-w-md bg-background rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden", initial: { y: '100%', opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: '100%', opacity: 0 }, transition: { type: 'spring', damping: 25, stiffness: 500 }, onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-border", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Filter, { className: "w-5 h-5" }), _jsx("h2", { className: "text-lg", children: "Filters" })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: onClose, children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "p-6 max-h-96 overflow-y-auto space-y-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [_jsx(MapPin, { className: "w-4 h-4 text-muted-foreground" }), _jsxs("span", { children: ["Distance: ", radius[0], "km"] })] }), _jsx(Slider, { value: radius, onValueChange: setRadius, max: 50, min: 1, step: 1, className: "w-full" }), _jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mt-2", children: [_jsx("span", { children: "1km" }), _jsx("span", { children: "50km" })] })] }), _jsx(Separator, {}), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [_jsx(DollarSign, { className: "w-4 h-4 text-muted-foreground" }), _jsxs("span", { children: ["Pay: $", payRange[0], " - $", payRange[1], "/hour"] })] }), _jsx(Slider, { value: payRange, onValueChange: setPayRange, max: 50, min: 10, step: 1, className: "w-full" }), _jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mt-2", children: [_jsx("span", { children: "$10" }), _jsx("span", { children: "$50+" })] })] }), _jsx(Separator, {}), _jsxs("div", { children: [_jsx("h3", { className: "mb-3", children: "Categories" }), _jsx("div", { className: "flex flex-wrap gap-2", children: categories.map((category) => (_jsx(Badge, { variant: selectedCategories.includes(category) ? 'default' : 'outline', className: "cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors", onClick: () => toggleCategory(category), children: category }, category))) })] }), _jsx(Separator, {}), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2 mb-3", children: [_jsx(Clock, { className: "w-4 h-4 text-muted-foreground" }), _jsx("span", { children: "Duration" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: durations.map((duration) => (_jsx(Badge, { variant: selectedDurations.includes(duration) ? 'default' : 'outline', className: "cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors", onClick: () => toggleDuration(duration), children: duration }, duration))) })] }), _jsx(Separator, {}), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Urgent jobs only" }), _jsx(Switch, { checked: urgentOnly, onCheckedChange: setUrgentOnly })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Include remote work" }), _jsx(Switch, { checked: remoteWork, onCheckedChange: setRemoteWork })] })] })] }), _jsx("div", { className: "p-6 pt-4 border-t border-border bg-card", children: _jsxs("div", { className: "flex space-x-3", children: [_jsx(Button, { variant: "outline", onClick: clearFilters, className: "flex-1", children: "Clear All" }), _jsx(Button, { onClick: handleApply, className: "flex-1", children: "Apply Filters" })] }) })] }) }));
}
