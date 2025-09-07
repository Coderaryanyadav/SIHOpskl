import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Heart, MessageCircle, Briefcase, Star, Calendar, CheckCircle2, Clock, Check, BellOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useNotifications } from '../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';
export function NotificationScreen() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, hasUnread } = useNotifications();
    const [activeTab, setActiveTab] = useState('all');
    const [isMarkingAll, setIsMarkingAll] = useState(false);
    // Map Firestore notifications to our local format
    const mappedNotifications = React.useMemo(() => {
        return notifications.map(notif => {
            // Safely handle the timestamp conversion
            let timestamp = 'Just now';
            if (notif.createdAt) {
                try {
                    let date;
                    const createdAt = notif.createdAt; // Type assertion to handle Firestore timestamp
                    if (createdAt instanceof Date) {
                        date = createdAt;
                    }
                    else if (typeof createdAt === 'string') {
                        date = new Date(createdAt);
                    }
                    else if (createdAt && typeof createdAt === 'object' && 'toDate' in createdAt) {
                        // This is a Firestore timestamp
                        date = createdAt.toDate();
                    }
                    else if (createdAt && typeof createdAt === 'object' && 'seconds' in createdAt) {
                        // This is a Firestore timestamp in { seconds, nanoseconds } format
                        date = new Date(createdAt.seconds * 1000);
                    }
                    else {
                        date = new Date();
                    }
                    if (date && !isNaN(date.getTime())) {
                        timestamp = formatDistanceToNow(date, { addSuffix: true });
                    }
                }
                catch (error) {
                    console.error('Error parsing date:', error);
                }
            }
            // Map notification types to our internal types
            let type = 'reminder'; // Default type
            const notifType = notif.type?.toLowerCase() || '';
            if (['match', 'message', 'job', 'review', 'reminder'].includes(notifType)) {
                type = notifType;
            }
            else if (notifType === 'job_match') {
                type = 'match';
            }
            else if (notifType === 'application') {
                type = 'job';
            }
            else if (notifType === 'payment') {
                type = 'reminder';
            }
            return {
                id: notif.id,
                type,
                title: notif.title || 'New Notification',
                description: notif.message || '',
                timestamp,
                isRead: !!notif.read,
                actionUrl: notif.actionUrl
            };
        });
    }, [notifications]);
    const unreadNotifications = React.useMemo(() => mappedNotifications.filter(n => !n.isRead), [mappedNotifications]);
    const handleMarkAllAsRead = async () => {
        if (isMarkingAll)
            return;
        setIsMarkingAll(true);
        try {
            await markAllAsRead();
        }
        catch (error) {
            console.error('Error marking all as read:', error);
        }
        finally {
            setIsMarkingAll(false);
        }
    };
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'job_match':
                return _jsx(Heart, { className: "w-5 h-5 text-red-500" });
            case 'message':
                return _jsx(MessageCircle, { className: "w-5 h-5 text-blue-500" });
            case 'application':
                return _jsx(Briefcase, { className: "w-5 h-5 text-green-500" });
            case 'review':
                return _jsx(Star, { className: "w-5 h-5 text-yellow-500" });
            case 'payment':
                return _jsx(Calendar, { className: "w-5 h-5 text-purple-500" });
            default:
                return _jsx(Bell, { className: "w-5 h-5 text-muted-foreground" });
        }
    };
    const getNotificationTime = (timestamp) => {
        return (_jsxs("div", { className: "flex items-center text-xs text-muted-foreground mt-1", children: [_jsx(Clock, { className: "w-3 h-3 mr-1" }), timestamp] }));
    };
    return (_jsx("div", { className: "h-full flex flex-col", children: _jsxs("div", { className: "p-4 border-b border-border", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("div", { className: "relative", children: [_jsx(Bell, { className: cn("w-6 h-6", hasUnread ? "text-primary" : "text-muted-foreground") }), hasUnread && (_jsx("span", { className: "absolute -top-1 -right-1 w-2 h-2 rounded-full bg-destructive" }))] }), _jsx("h1", { className: "text-xl font-bold", children: "Notifications" }), hasUnread && (_jsxs(Badge, { variant: "destructive", className: "text-xs", children: [unreadCount, " new"] }))] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: handleMarkAllAsRead, disabled: !hasUnread || isMarkingAll, className: "text-xs flex items-center gap-1", children: isMarkingAll ? (_jsx(_Fragment, { children: _jsx("span", { className: "animate-pulse", children: "Updating..." }) })) : (_jsxs(_Fragment, { children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5 mr-1" }), "Mark all read"] })) })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [_jsxs(TabsTrigger, { value: "all", children: ["All (", mappedNotifications.length, ")"] }), _jsxs(TabsTrigger, { value: "unread", children: ["Unread (", unreadNotifications.length, ")"] })] }), _jsx(TabsContent, { value: "all", className: "mt-4", children: _jsx(AnimatePresence, { children: mappedNotifications.length > 0 ? (_jsx(NotificationList, { notifications: mappedNotifications, onMarkAsRead: markAsRead, getIcon: getNotificationIcon, getTime: getNotificationTime })) : (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "flex flex-col items-center justify-center py-12 text-center", children: [_jsx(BellOff, { className: "w-12 h-12 text-muted-foreground mb-4" }), _jsx("h3", { className: "text-lg font-medium mb-1", children: "No notifications yet" }), _jsx("p", { className: "text-muted-foreground text-sm max-w-md px-4", children: "When you get notifications, they'll appear here. Check back later!" })] })) }) }), _jsx(TabsContent, { value: "unread", className: "mt-4", children: _jsx(AnimatePresence, { children: unreadNotifications.length > 0 ? (_jsx(NotificationList, { notifications: unreadNotifications, onMarkAsRead: markAsRead, getIcon: getNotificationIcon, getTime: getNotificationTime })) : (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "flex flex-col items-center justify-center py-12 text-center", children: [_jsx(CheckCircle2, { className: "w-12 h-12 text-green-500 mb-4" }), _jsx("h3", { className: "text-lg font-medium mb-1", children: "All caught up!" }), _jsx("p", { className: "text-muted-foreground text-sm", children: "You don't have any unread notifications." })] })) }) })] })] }) }));
}
function NotificationList({ notifications, onMarkAsRead, getIcon, getTime }) {
    return (_jsx("div", { className: "flex-1 overflow-y-auto", children: _jsx("div", { className: "space-y-3", children: notifications.map((notification, index) => (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, onClick: () => onMarkAsRead(notification.id), className: "cursor-pointer", children: _jsx(Card, { className: `p-4 transition-colors ${!notification.isRead ? 'border-l-4 border-l-primary bg-primary/5 hover:bg-primary/10' : 'hover:bg-accent/50'}`, children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "flex-shrink-0 mt-1", children: getIcon(notification.type) }), _jsx("div", { className: "flex-1 min-w-0", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: `text-sm ${!notification.isRead ? 'font-medium' : 'text-muted-foreground'}`, children: notification.title }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: notification.description }), getTime(notification.timestamp)] }), _jsxs("div", { className: "flex items-center space-x-1 ml-2", children: [!notification.isRead && (_jsx(Button, { variant: "ghost", size: "sm", className: "h-6 w-6 text-muted-foreground hover:text-foreground", onClick: (e) => {
                                                        e.stopPropagation();
                                                        onMarkAsRead(notification.id);
                                                    }, children: _jsx(Check, { className: "h-3.5 w-3.5" }) })), notification.actionUrl && (_jsx(Button, { variant: "ghost", size: "sm", className: "h-6 text-xs", onClick: (e) => {
                                                        e.stopPropagation();
                                                        // Handle action URL navigation
                                                        if (notification.actionUrl) {
                                                            window.location.href = notification.actionUrl;
                                                        }
                                                    }, children: "View" }))] })] }) })] }) }) }, notification.id))) }) }));
}
