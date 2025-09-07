import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, collection, query, where, onSnapshot, orderBy, updateDoc } from 'firebase/firestore';
const AppContext = createContext(undefined);
export function AppProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    // Set up notifications listener
    useEffect(() => {
        if (!currentUser?.id)
            return;
        const q = query(collection(db, 'notifications'), where('userId', 'in', [currentUser.id, 'all_students']), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const notificationsList = [];
            querySnapshot.forEach((doc) => {
                notificationsList.push({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate()
                });
            });
            setNotifications(notificationsList);
        });
        return () => unsubscribe();
    }, [currentUser?.id]);
    // Mark notification as read
    const markNotificationAsRead = async (notificationId) => {
        try {
            await updateDoc(doc(db, 'notifications', notificationId), {
                read: true
            });
        }
        catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };
    // Set up auth state listener
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                // User is signed in
                try {
                    // Get user data from Firestore
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setCurrentUser({
                            id: user.uid,
                            name: userData.name || user.displayName || 'User',
                            email: user.email || '',
                            type: userData.type || 'student',
                            skills: userData.skills || [],
                            company: userData.company,
                            bio: userData.bio,
                            location: userData.location,
                            phone: userData.phone
                        });
                    }
                    else {
                        // Create user document if it doesn't exist
                        await setDoc(doc(db, 'users', user.uid), {
                            name: user.displayName || 'New User',
                            email: user.email,
                            type: 'student',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        });
                        setCurrentUser({
                            id: user.uid,
                            name: user.displayName || 'New User',
                            email: user.email || '',
                            type: 'student'
                        });
                    }
                }
                catch (error) {
                    console.error('Error getting user data:', error);
                }
            }
            else {
                // User is signed out
                setCurrentUser(null);
            }
            setLoading(false);
        });
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);
    // Update Firestore when currentUser changes
    useEffect(() => {
        if (currentUser?.id) {
            const updateUserDoc = async () => {
                try {
                    await setDoc(doc(db, 'users', currentUser.id), {
                        ...currentUser,
                        updatedAt: new Date()
                    }, { merge: true });
                }
                catch (error) {
                    console.error('Error updating user data:', error);
                }
            };
            updateUserDoc();
        }
    }, [currentUser]);
    const value = {
        currentUser,
        setCurrentUser,
        loading,
        notifications,
        markNotificationAsRead
    };
    if (loading) {
        return _jsx("div", { children: "Loading..." }); // Or your loading component
    }
    return (_jsx(AppContext.Provider, { value: value, children: children }));
}
export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
