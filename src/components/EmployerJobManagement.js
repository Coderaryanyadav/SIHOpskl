import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Search, Filter, MoreVertical, Users, Eye, Edit, Trash2, Play, Pause, DollarSign, MapPin, Clock, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAppContext } from '../contexts/AppContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
export function EmployerJobManagement() {
    const { currentUser } = useAppContext();
    const [jobs, setJobs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    // Handle job selection
    const handleSelectJob = (jobId) => {
        const job = jobs.find(j => j.id === jobId) || null;
        setSelectedJob(job);
    };
    useEffect(() => {
        if (!currentUser)
            return;
        const jobsCollection = collection(db, 'jobs');
        const q = query(jobsCollection, where('employerId', '==', currentUser.id));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const jobList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setJobs(jobList);
        }, (err) => {
            console.error("Error fetching jobs:", err);
        });
        return () => unsubscribe();
    }, [currentUser]);
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'default';
            case 'draft':
                return 'secondary';
            case 'paused':
                return 'outline';
            case 'completed':
                return 'secondary';
            default:
                return 'secondary';
        }
    };
    const getApplicationStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'secondary';
            case 'reviewed':
                return 'outline';
            case 'accepted':
                return 'default';
            case 'rejected':
                return 'destructive';
            default:
                return 'secondary';
        }
    };
    const filteredJobs = jobs.filter(job => job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const activeJobs = filteredJobs.filter(job => job.status === 'active');
    const draftJobs = filteredJobs.filter(job => job.status === 'draft');
    const completedJobs = filteredJobs.filter(job => job.status === 'completed');
    if (selectedJob) {
        const job = selectedJob;
        const [applications, setApplications] = useState([]);
        const [applicationsLoading, setApplicationsLoading] = useState(true);
        const handleUpdateStatus = async (applicationId, status) => {
            const appDocRef = doc(db, 'applications', applicationId);
            try {
                await updateDoc(appDocRef, { status });
            }
            catch (error) {
                console.error("Error updating application status:", error);
            }
        };
        useEffect(() => {
            setApplicationsLoading(true);
            const appsCollection = collection(db, 'applications');
            const q = query(appsCollection, where('jobId', '==', job.id));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const appList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setApplications(appList);
                setApplicationsLoading(false);
            });
            return () => unsubscribe();
        }, [job.id]);
        return (_jsxs("div", { className: "h-full flex flex-col", children: [_jsx("div", { className: "p-4 border-b border-border", children: _jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedJob(null), children: "\u2190 Back" }), _jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-lg", children: job.title }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [job.applicants?.length || 0, " applications"] })] }), _jsx(Badge, { variant: getStatusColor(job.status), children: job.status })] }) }), _jsx("div", { className: "flex-1 overflow-y-auto p-4", children: _jsx("div", { className: "space-y-3", children: applicationsLoading ? (_jsx("div", { className: "flex justify-center items-center h-full", children: _jsx(Loader2, { className: "w-6 h-6 animate-spin" }) })) : (applications.map((application, index) => _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, children: _jsx(Card, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-sm", children: application.studentName.charAt(0) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm", children: application.studentName }), _jsx("div", { className: "flex items-center space-x-2 text-xs text-muted-foreground", children: _jsxs("span", { children: ["Applied ", application.appliedAt.toDate().toLocaleDateString()] }) })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Badge, { variant: getApplicationStatusColor(application.status), children: application.status }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(MoreVertical, { className: "w-4 h-4" }) }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsx(DropdownMenuItem, { children: "View Profile" }), _jsx(DropdownMenuItem, { children: "Send Message" }), _jsx(DropdownMenuItem, { onClick: () => handleUpdateStatus(application.id, 'accepted'), children: "Accept Application" }), _jsx(DropdownMenuItem, { className: "text-destructive", onClick: () => handleUpdateStatus(application.id, 'rejected'), children: "Reject" })] })] })] })] }) }) }, application.id))) }) })] }));
    }
    return (_jsx("div", { className: "h-full flex flex-col", children: _jsxs("div", { className: "p-4 border-b border-border", children: [_jsx("h1", { className: "text-lg mb-4", children: "Job Management" }), _jsxs("div", { className: "flex space-x-2 mb-4", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { placeholder: "Search jobs...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10" })] }), _jsxs(Button, { variant: "outline", children: [_jsx(Filter, { className: "w-4 h-4 mr-2" }), "Filter"] })] }), _jsxs(Tabs, { defaultValue: "active", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [_jsxs(TabsTrigger, { value: "active", children: ["Active (", activeJobs.length, ")"] }), _jsxs(TabsTrigger, { value: "draft", children: ["Draft (", draftJobs.length, ")"] }), _jsxs(TabsTrigger, { value: "completed", children: ["Completed (", completedJobs.length, ")"] })] }), _jsx(TabsContent, { value: "active", className: "mt-4", children: _jsx(JobList, { jobs: activeJobs, onSelectJob: handleSelectJob, getStatusColor: getStatusColor }) }), _jsx(TabsContent, { value: "draft", className: "mt-4", children: _jsx(JobList, { jobs: draftJobs, onSelectJob: handleSelectJob, getStatusColor: getStatusColor }) }), _jsx(TabsContent, { value: "completed", className: "mt-4", children: _jsx(JobList, { jobs: completedJobs, onSelectJob: handleSelectJob, getStatusColor: getStatusColor }) })] })] }) }));
}
function JobList({ jobs, onSelectJob, getStatusColor }) {
    if (jobs.length === 0) {
        return (_jsx("div", { className: "flex items-center justify-center h-32 text-center", children: _jsxs("div", { children: [_jsx("div", { className: "w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3", children: _jsx(Users, { className: "w-6 h-6 text-muted-foreground" }) }), _jsx("p", { className: "text-muted-foreground text-sm", children: "No jobs found" })] }) }));
    }
    return (_jsx("div", { className: "flex-1 overflow-y-auto", children: _jsx("div", { className: "p-4 space-y-3", children: jobs.map((job, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, children: _jsxs(Card, { className: "p-4 cursor-pointer hover:bg-muted/50 transition-colors", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("h3", { className: "text-sm", children: job.title }), job.isUrgent && (_jsx(Badge, { variant: "destructive", className: "text-xs", children: "Urgent" }))] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Badge, { variant: getStatusColor(job.status), children: job.status }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(MoreVertical, { className: "w-4 h-4" }) }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsxs(DropdownMenuItem, { onClick: () => onSelectJob(job.id), children: [_jsx(Eye, { className: "w-4 h-4 mr-2" }), "View Applications"] }), _jsxs(DropdownMenuItem, { children: [_jsx(Edit, { className: "w-4 h-4 mr-2" }), "Edit Job"] }), job.status === 'active' ? (_jsxs(DropdownMenuItem, { children: [_jsx(Pause, { className: "w-4 h-4 mr-2" }), "Pause Job"] })) : (_jsxs(DropdownMenuItem, { children: [_jsx(Play, { className: "w-4 h-4 mr-2" }), "Activate Job"] })), _jsxs(DropdownMenuItem, { className: "text-destructive", children: [_jsx(Trash2, { className: "w-4 h-4 mr-2" }), "Delete Job"] })] })] })] })] }), _jsxs("div", { className: "flex items-center space-x-4 text-sm text-muted-foreground mb-3", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(MapPin, { className: "w-4 h-4 mr-1" }), job.location] }), _jsxs("div", { className: "flex items-center", children: [_jsx(DollarSign, { className: "w-4 h-4 mr-1" }), "$", job.hourlyRate, "/hr"] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "w-4 h-4 mr-1" }), job.duration] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "flex items-center space-x-2", children: _jsx(Badge, { variant: "outline", className: "text-xs", children: job.category }) }), _jsxs("div", { className: "flex items-center space-x-2 text-sm text-muted-foreground", children: [_jsx(Users, { className: "w-4 h-4" }), _jsxs("span", { children: [job.applicants?.length || 0, " applications"] })] })] }), _jsx("div", { className: "mt-3 pt-3 border-t border-border", children: _jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [_jsxs("span", { children: ["Posted ", job.createdAt?.toDate().toLocaleDateString()] }), _jsx(Button, { variant: "link", size: "sm", className: "h-auto p-0 text-xs", onClick: () => onSelectJob(job.id), children: "View Details \u2192" })] }) })] }) }, job.id))) }) }));
}
