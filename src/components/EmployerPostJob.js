import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
// Remove unused motion import
import { MapPin, DollarSign, Clock, Plus, X, CheckCircle, Eye, Send, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { useAppContext } from '../contexts/AppContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
export function EmployerPostJob() {
    const { currentUser } = useAppContext();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        hourlyRate: '',
        location: '',
        duration: '',
        startTime: '',
        category: '',
        skills: [],
        isUrgent: false,
        requirements: []
    });
    const [newSkill, setNewSkill] = useState('');
    const [newRequirement, setNewRequirement] = useState('');
    const [formError, setFormError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const categories = [
        'Food Service', 'Retail', 'Pet Care', 'Education', 'Events',
        'Marketing', 'Delivery', 'Cleaning', 'Tech Support', 'Other'
    ];
    const durations = ['1-2 hours', '3-4 hours', '5-8 hours', 'Full day', 'Multi-day'];
    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };
    const removeSkill = (skill) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }));
    };
    const addRequirement = () => {
        if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
            setFormData(prev => ({
                ...prev,
                requirements: [...prev.requirements, newRequirement.trim()]
            }));
            setNewRequirement('');
        }
    };
    const removeRequirement = (requirement) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.filter(r => r !== requirement)
        }));
    };
    const validateForm = () => {
        if (!currentUser)
            return 'You must be logged in to post a job.';
        if (!formData.title.trim())
            return 'Job title is required.';
        if (!formData.description.trim())
            return 'Job description is required.';
        if (!formData.hourlyRate)
            return 'Hourly rate is required.';
        if (isNaN(parseFloat(formData.hourlyRate)) || parseFloat(formData.hourlyRate) <= 0)
            return 'Please enter a valid hourly rate.';
        if (!formData.location.trim())
            return 'Location is required.';
        if (!formData.duration)
            return 'Duration is required.';
        if (!formData.category)
            return 'Category is required.';
        if (formData.skills.length === 0)
            return 'Please add at least one required skill.';
        return undefined;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            console.error('No user logged in');
            setFormError('You must be logged in to post a job');
            return;
        }
        const error = validateForm();
        if (error) {
            setFormError(error);
            return;
        }
        setIsSubmitting(true);
        try {
            const jobData = {
                ...formData,
                company: currentUser.company || currentUser.name || 'Unknown Company',
                employerId: currentUser.id,
                status: 'active',
                postedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                applicants: [],
                applications: 0,
                views: 0
            };
            await addDoc(collection(db, 'jobs'), jobData);
            // Reset form
            setFormData({
                title: '',
                description: '',
                hourlyRate: '',
                location: '',
                duration: '',
                startTime: '',
                category: '',
                skills: [],
                isUrgent: false,
                requirements: []
            });
            setIsSubmitted(true);
            setFormError(null);
        }
        catch (error) {
            console.error('Error posting job:', error);
            let errorMessage = 'Failed to post job. Please try again.';
            if (error && typeof error === 'object' && 'code' in error) {
                if (error.code === 'permission-denied') {
                    errorMessage = 'You do not have permission to post jobs.';
                }
                else if (error.code === 'unavailable') {
                    errorMessage = 'Network error. Please check your connection and try again.';
                }
            }
            setFormError(errorMessage);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (isSubmitted) {
        return (_jsx("div", { className: "h-full flex items-center justify-center", children: _jsxs("div", { className: "text-center p-8 max-w-md w-full", children: [_jsx("div", { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(CheckCircle, { className: "w-8 h-8 text-green-600" }) }), _jsx("h2", { className: "text-2xl font-bold mb-2", children: "Job Posted Successfully!" }), _jsx("p", { className: "text-muted-foreground mb-6", children: "Your job listing has been created and is now visible to job seekers." }), _jsx(Button, { onClick: () => setIsSubmitted(false), children: "Post Another Job" })] }) }));
    }
    if (showPreview) {
        return (_jsxs("div", { className: "h-full overflow-y-auto", children: [_jsxs("div", { className: "p-4 border-b border-border flex items-center justify-between", children: [_jsx("div", { className: "flex items-center space-x-2", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowPreview(false), children: "\u2190 Back to Edit" }) }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { variant: "outline", onClick: () => setShowPreview(false), disabled: isSubmitting, children: "Back to Edit" }), _jsx(Button, { onClick: (e) => {
                                        e.preventDefault();
                                        const form = document.querySelector('form');
                                        if (form) {
                                            const formEvent = new Event('submit', { cancelable: true });
                                            form.dispatchEvent(formEvent);
                                        }
                                    }, disabled: isSubmitting, type: "button", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Posting..."] })) : (_jsxs(_Fragment, { children: [_jsx(Send, { className: "w-4 h-4 mr-2" }), "Post Job"] })) })] })] }), _jsx("div", { className: "p-6", children: _jsxs(Card, { className: "max-w-md mx-auto", children: [_jsxs("div", { className: "h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative", children: [_jsx("div", { className: "absolute inset-0 bg-black/20" }), formData.isUrgent && (_jsx(Badge, { className: "absolute top-3 left-3 bg-destructive text-destructive-foreground", children: "Urgent" }))] }), _jsxs("div", { className: "p-4 space-y-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg mb-1", children: formData.title || 'Job Title' }), _jsx("p", { className: "text-sm text-muted-foreground", children: currentUser?.company || currentUser?.name || 'Your Company' })] }), _jsxs("div", { className: "flex items-center space-x-4 text-sm text-muted-foreground", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(MapPin, { className: "w-4 h-4 mr-1" }), formData.location || 'Location'] }), _jsxs("div", { className: "flex items-center", children: [_jsx(DollarSign, { className: "w-4 h-4 mr-1" }), "$", formData.hourlyRate || '0', "/hr"] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "w-4 h-4 mr-1" }), formData.duration || 'Duration'] })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [formData.category && (_jsx(Badge, { variant: "secondary", children: formData.category })), formData.skills.slice(0, 2).map((skill) => (_jsx(Badge, { variant: "outline", className: "text-xs", children: skill }, skill))), formData.skills.length > 2 && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: ["+", formData.skills.length - 2] }))] }), _jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: formData.description || 'Job description will appear here...' })] })] }) })] }));
    }
    return (_jsxs("div", { className: "h-full overflow-y-auto", children: [_jsxs("div", { className: "p-4 border-b border-border flex items-center justify-between", children: [_jsx("h1", { className: "text-lg", children: "Post New Job" }), _jsx("div", { className: "flex space-x-2", children: _jsxs(Button, { variant: "outline", onClick: () => setShowPreview(true), children: [_jsx(Eye, { className: "w-4 h-4 mr-2" }), "Preview"] }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-6", children: [_jsxs(Card, { className: "p-4", children: [_jsx("h3", { className: "mb-4", children: "Basic Information" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "title", children: "Job Title *" }), _jsx(Input, { id: "title", placeholder: "e.g., Barista, Dog Walker, Event Assistant", value: formData.title, onChange: (e) => setFormData(prev => ({ ...prev, title: e.target.value })), required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "category", children: "Category *" }), _jsxs(Select, { value: formData.category, onValueChange: (value) => setFormData(prev => ({ ...prev, category: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select a category" }) }), _jsx(SelectContent, { children: categories.map((category) => (_jsx(SelectItem, { value: category, children: category }, category))) })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "description", children: "Job Description *" }), _jsx(Textarea, { id: "description", placeholder: "Describe the job duties, work environment, and what you're looking for...", value: formData.description, onChange: (e) => setFormData(prev => ({ ...prev, description: e.target.value })), rows: 4, required: true })] })] })] }), _jsxs(Card, { className: "p-4", children: [_jsx("h3", { className: "mb-4", children: "Compensation & Schedule" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "hourlyRate", children: "Hourly Rate ($) *" }), _jsxs("div", { className: "relative", children: [_jsx(DollarSign, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { id: "hourlyRate", type: "number", placeholder: "18", value: formData.hourlyRate, onChange: (e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value })), className: "pl-10", min: "0", step: "0.50", required: true })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "duration", children: "Duration" }), _jsxs(Select, { value: formData.duration, onValueChange: (value) => setFormData(prev => ({ ...prev, duration: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select duration" }) }), _jsx(SelectContent, { children: durations.map((duration) => (_jsx(SelectItem, { value: duration, children: duration }, duration))) })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "location", children: "Location *" }), _jsxs("div", { className: "relative", children: [_jsx(MapPin, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { id: "location", placeholder: "e.g., Downtown, 123 Main St", value: formData.location, onChange: (e) => setFormData(prev => ({ ...prev, location: e.target.value })), className: "pl-10", required: true })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "startTime", children: "Start Time" }), _jsxs("div", { className: "relative", children: [_jsx(Calendar, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { id: "startTime", type: "datetime-local", value: formData.startTime, onChange: (e) => setFormData(prev => ({ ...prev, startTime: e.target.value })), className: "pl-10" })] })] })] }), _jsxs("div", { className: "mt-4 flex items-center justify-between", children: [_jsx(Label, { htmlFor: "urgent", children: "Mark as urgent" }), _jsx(Switch, { id: "urgent", checked: formData.isUrgent, onCheckedChange: (checked) => setFormData(prev => ({ ...prev, isUrgent: checked })) })] })] }), _jsxs(Card, { className: "p-4", children: [_jsx("h3", { className: "mb-4", children: "Required Skills" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex space-x-2", children: [_jsx(Input, { placeholder: "Add a skill...", value: newSkill, onChange: (e) => setNewSkill(e.target.value), onKeyPress: (e) => e.key === 'Enter' && (e.preventDefault(), addSkill()) }), _jsx(Button, { type: "button", onClick: addSkill, children: _jsx(Plus, { className: "w-4 h-4" }) })] }), formData.skills.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2", children: formData.skills.map((skill) => (_jsxs(Badge, { variant: "outline", className: "cursor-pointer", children: [skill, _jsx("button", { type: "button", onClick: () => removeSkill(skill), className: "ml-2 hover:text-destructive", children: _jsx(X, { className: "w-3 h-3" }) })] }, skill))) }))] })] }), _jsxs(Card, { className: "p-4", children: [_jsx("h3", { className: "mb-4", children: "Job Requirements" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex space-x-2", children: [_jsx(Input, { placeholder: "Add a requirement...", value: newRequirement, onChange: (e) => setNewRequirement(e.target.value), onKeyPress: (e) => e.key === 'Enter' && (e.preventDefault(), addRequirement()) }), _jsx(Button, { type: "button", onClick: addRequirement, children: _jsx(Plus, { className: "w-4 h-4" }) })] }), formData.requirements.length > 0 && (_jsx("div", { className: "space-y-2", children: formData.requirements.map((requirement, index) => (_jsxs("div", { className: "flex items-center justify-between p-2 bg-muted/30 rounded", children: [_jsx("span", { className: "text-sm", children: requirement }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => removeRequirement(requirement), children: _jsx(X, { className: "w-4 h-4" }) })] }, index))) }))] })] }), formError && (_jsx("div", { className: "text-center text-sm text-destructive bg-destructive/10 p-3 rounded-lg", children: formError })), _jsxs("div", { className: "flex space-x-3", children: [_jsx(Button, { type: "button", variant: "outline", className: "flex-1", children: "Save as Draft" }), _jsx(Button, { type: "submit", className: "flex-1", children: "Post Job" })] })] })] }));
}
