import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Search, Send, MoreVertical, Briefcase, Loader2, AlertTriangle, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { useAppContext } from '../contexts/AppContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { formatTimestamp } from '../utils/dateUtils';
export function ChatScreen() {
    const { currentUser } = useAppContext();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const messagesEndRef = useRef(null);
    useEffect(() => {
        if (!selectedConversation) {
            setMessages([]);
            return;
        }
        setMessagesLoading(true);
        const messagesCollection = collection(db, 'conversations', selectedConversation.id, 'messages');
        const q = query(messagesCollection, orderBy('timestamp', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(msgs);
            setMessagesLoading(false);
        }, (err) => {
            console.error("Error fetching messages:", err);
            setError('Failed to load messages.');
            setMessagesLoading(false);
        });
        return () => unsubscribe();
    }, [selectedConversation]);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }
        const conversationsCollection = collection(db, 'conversations');
        const q = query(conversationsCollection, where('participantIds', 'array-contains', currentUser.id)
        // orderBy('lastMessage.timestamp', 'desc') // This requires an index
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const convos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort client-side for now
            convos.sort((a, b) => {
                const timeA = a.lastMessage?.timestamp;
                const timeB = b.lastMessage?.timestamp;
                return (timeB?.toMillis() || 0) - (timeA?.toMillis() || 0);
            });
            setConversations(convos);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching conversations:", err);
            setError('Failed to load conversations.');
            setLoading(false);
        });
        return () => unsubscribe();
    }, [currentUser]);
    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedConversation || !currentUser)
            return;
        const now = new Date();
        // Create a temporary message ID for optimistic UI
        const tempMessageId = `temp-${Date.now()}`;
        const newMessage = {
            id: tempMessageId,
            senderId: currentUser.id,
            content: messageInput,
            timestamp: now,
            type: 'text'
        };
        // Optimistically update the UI
        setMessages(prev => [...prev, newMessage]);
        setMessageInput('');
        try {
            // Add the message to Firestore
            const messagesCollection = collection(db, 'conversations', selectedConversation.id, 'messages');
            const docRef = await addDoc(messagesCollection, {
                ...newMessage,
                timestamp: serverTimestamp(),
                read: false
            });
            // Update the conversation's last message
            const conversationRef = doc(db, 'conversations', selectedConversation.id);
            await updateDoc(conversationRef, {
                lastMessage: {
                    content: messageInput,
                    timestamp: serverTimestamp(),
                    type: 'text',
                    read: false
                },
                updatedAt: serverTimestamp(),
                // Make sure participant data is up to date
                participants: selectedConversation.participants.map(p => ({
                    id: p.id,
                    name: p.name,
                    type: p.type,
                    photoURL: p.photoURL
                }))
            });
            // Remove the temporary message and add the real one with server timestamp
            setMessages(prev => {
                const filtered = prev.filter(m => m.id !== newMessage.id);
                return [...filtered, { ...newMessage, id: docRef.id, timestamp: now }];
            });
        }
        catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message. Please try again.');
            // Revert optimistic update on error
            setMessages(prev => prev.filter(m => m.id !== tempMessageId));
        }
    };
    const filteredConversations = conversations.filter(conv => {
        const otherParticipant = conv.participants.find(p => p.id !== currentUser?.id);
        return (otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    if (loading) {
        return (_jsxs("div", { className: "h-full flex flex-col items-center justify-center space-y-4 p-8 text-center", children: [_jsx(Loader2, { className: "w-12 h-12 animate-spin text-primary" }), _jsx("p", { className: "text-muted-foreground", children: "Loading your conversations..." })] }));
    }
    if (conversations.length === 0) {
        return (_jsx("div", { className: "h-full flex items-center justify-center p-8", children: _jsxs("div", { className: "text-center max-w-md mx-auto", children: [_jsx("div", { className: "w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6", children: _jsx(MessageSquare, { className: "w-10 h-10 text-primary" }) }), _jsx("h3", { className: "text-xl font-medium mb-3", children: "No conversations yet" }), _jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "When you match with a job or receive a message, it will appear here. Start applying to jobs to get connected with employers!" }), _jsx(Button, { onClick: () => window.location.href = '/jobs', className: "w-full sm:w-auto mx-auto", children: "Browse Jobs" })] }) }));
    }
    if (error) {
        return (_jsx("div", { className: "h-full flex items-center justify-center p-8", children: _jsxs("div", { className: "text-center max-w-md mx-auto", children: [_jsx("div", { className: "w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(AlertTriangle, { className: "w-8 h-8 text-destructive" }) }), _jsx("h3", { className: "text-lg font-medium text-destructive mb-2", children: "Oops! Something went wrong" }), _jsx("p", { className: "text-muted-foreground text-sm mb-6", children: error }), _jsx(Button, { onClick: () => window.location.reload(), variant: "outline", children: "Refresh Page" })] }) }));
    }
    if (selectedConversation) {
        const chat = selectedConversation;
        const otherParticipant = chat.participants.find(p => p.id !== currentUser?.id);
        return (_jsxs("div", { className: "h-full flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-border flex items-center space-x-3", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedConversation(null), children: "\u2190" }), _jsx(Avatar, { className: "w-10 h-10", children: _jsx(AvatarFallback, { children: otherParticipant?.name.charAt(0) }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-sm", children: otherParticipant?.name }), chat.jobTitle && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Badge, { variant: "outline", className: "text-xs", children: chat.jobTitle }), _jsx(Badge, { variant: chat.status === 'active' ? 'default' : 'secondary', className: "text-xs", children: chat.status })] }))] }), _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(MoreVertical, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messagesLoading ? (_jsx("div", { className: "flex justify-center items-center h-full", children: _jsx(Loader2, { className: "w-6 h-6 animate-spin" }) })) : (messages.map((message) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: `flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-xs p-3 rounded-2xl ${message.senderId === currentUser?.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'}`, children: [_jsx("p", { className: "text-sm", children: message.content }), _jsx("p", { className: `text-xs mt-1 ${message.senderId === currentUser?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`, children: message.timestamp ? formatTimestamp(message.timestamp) : '' })] }) }, message.id)))), _jsx("div", { ref: messagesEndRef })] }), _jsx("div", { className: "p-4 border-t border-border", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx(Input, { placeholder: "Type a message...", value: messageInput, onChange: (e) => setMessageInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSendMessage(), className: "flex-1" }), _jsx(Button, { onClick: handleSendMessage, size: "sm", children: _jsx(Send, { className: "w-4 h-4" }) })] }) })] }));
    }
    return (_jsxs("div", { className: "h-full flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-border", children: [_jsx("h1", { className: "text-lg mb-3", children: "Messages" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { placeholder: "Search conversations...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10" })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto", children: filteredConversations.length === 0 ? (_jsx("div", { className: "flex items-center justify-center h-full text-center p-8", children: _jsxs("div", { children: [_jsx("div", { className: "w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Briefcase, { className: "w-8 h-8 text-muted-foreground" }) }), _jsx("h3", { className: "text-lg mb-2", children: "No conversations yet" }), _jsx("p", { className: "text-muted-foreground text-sm", children: currentUser?.type === 'student'
                                    ? 'Start applying to jobs to connect with employers'
                                    : 'Post jobs to start receiving applications' })] }) })) : (_jsx("div", { className: "p-4 space-y-2", children: filteredConversations.map((chat, index) => (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, children: _jsx(Card, { className: "p-4 cursor-pointer hover:bg-muted/50 transition-colors", onClick: () => setSelectedConversation(chat), children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Avatar, { className: "w-12 h-12", children: _jsx(AvatarFallback, { children: chat.participants.find(p => p.id !== currentUser?.id)?.name.charAt(0) }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("h3", { className: "text-sm truncate", children: chat.participants.find(p => p.id !== currentUser?.id)?.name }), _jsx("div", { className: "flex items-center space-x-2", children: _jsx("span", { className: "text-xs text-muted-foreground", children: formatTimestamp(chat.lastMessage?.timestamp) }) })] }), chat.jobTitle && (_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(Badge, { variant: "outline", className: "text-xs", children: chat.jobTitle }), chat.status && (_jsx(Badge, { variant: chat.status === 'archived' ? 'secondary' : 'default', className: "text-xs", children: chat.status || 'active' }))] })), _jsx("p", { className: "text-sm text-muted-foreground truncate", children: chat.lastMessage?.content })] })] }) }) }, chat.id))) })) })] }));
}
