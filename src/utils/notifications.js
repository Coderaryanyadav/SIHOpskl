import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
export const sendNotification = async (notification) => {
    try {
        await addDoc(collection(db, 'notifications'), {
            ...notification,
            read: false,
            createdAt: serverTimestamp(),
        });
        return true;
    }
    catch (error) {
        console.error('Error sending notification:', error);
        return false;
    }
};
// Helper functions for specific notification types
export const notifyJobMatch = async (userId, jobTitle, jobId) => {
    return sendNotification({
        userId,
        type: 'job_match',
        title: 'New Job Match!',
        message: `You've been matched with a new job: ${jobTitle}`,
        actionUrl: `/jobs/${jobId}`,
    });
};
export const notifyNewMessage = async (userId, senderName, conversationId) => {
    return sendNotification({
        userId,
        type: 'message',
        title: 'New Message',
        message: `You have a new message from ${senderName}`,
        actionUrl: `/messages/${conversationId}`,
    });
};
export const notifyApplicationUpdate = async (userId, jobTitle, status, jobId) => {
    return sendNotification({
        userId,
        type: 'application',
        title: 'Application Update',
        message: `Your application for ${jobTitle} has been ${status}`,
        actionUrl: `/jobs/${jobId}`,
    });
};
export const notifyNewReview = async (userId, reviewerName, jobTitle, jobId) => {
    return sendNotification({
        userId,
        type: 'review',
        title: 'New Review Received',
        message: `${reviewerName} left you a review for ${jobTitle}`,
        actionUrl: `/jobs/${jobId}/reviews`,
    });
};
export const notifyPayment = async (userId, amount, jobTitle) => {
    return sendNotification({
        userId,
        type: 'payment',
        title: 'Payment Received',
        message: `You've received a payment of $${amount.toFixed(2)} for ${jobTitle}`,
        actionUrl: '/earnings',
    });
};
