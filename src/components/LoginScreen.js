import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, User, Building, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useAppContext } from '../contexts/AppContext';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
export function LoginScreen({ onLogin, onBack }) {
    const [userType, setUserType] = useState('student');
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const { loading } = useAppContext();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        // Basic validation
        if (!email || !password) {
            setError('Please fill in all required fields');
            return;
        }
        if (!isLogin && !name) {
            setError('Please enter your name');
            return;
        }
        try {
            let userCredential;
            if (isLogin) {
                // Sign in user
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            }
            else {
                // Create new user
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const newUser = userCredential.user;
                // Save user details to Firestore
                await setDoc(doc(db, 'users', newUser.uid), {
                    name: name.trim(),
                    email: newUser.email,
                    type: userType,
                    skills: [],
                    company: userType === 'employer' ? name.trim() : undefined,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    bio: '',
                    location: '',
                    phone: ''
                });
            }
            // The onAuthStateChanged in AppProvider will handle the redirect
            // We don't need to manually set the current user here
        }
        catch (error) {
            console.error('Authentication error:', error);
            // More specific error messages
            let errorMessage = 'An error occurred during authentication.';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already in use. Please use a different email or log in.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email. Please sign up first.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password. Please try again.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password should be at least 6 characters long.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
                default:
                    errorMessage = error.message || 'An unexpected error occurred.';
            }
            setError(errorMessage);
        }
    };
    const handleGoogleSignIn = async () => {
        setError(null);
        const provider = new GoogleAuthProvider();
        try {
            // The onAuthStateChanged in AppProvider will handle the user data
            await signInWithPopup(auth, provider);
            // User is signed in via Google
            // No need to manually set user data here as it's handled by the auth state listener
            // The user document will be created in the auth state listener if it doesn't exist
            onLogin(userType);
        }
        catch (error) {
            setError(error.message);
            console.error("Google sign-in error:", error);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [_jsxs("div", { className: "p-6 flex items-center", children: [_jsx(Button, { variant: "ghost", onClick: onBack, className: "mr-4", children: _jsx(ChevronLeft, { className: "w-4 h-4" }) }), _jsx("h1", { className: "text-lg", children: "Welcome to Opskl" })] }), _jsx("div", { className: "flex-1 flex items-center justify-center p-6", children: _jsxs(Card, { className: "w-full max-w-md p-8 space-y-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl text-center", children: isLogin ? 'Sign In' : 'Create Account' }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { variant: userType === 'student' ? 'default' : 'outline', onClick: () => setUserType('student'), className: "flex-1", children: [_jsx(User, { className: "w-4 h-4 mr-2" }), "Student"] }), _jsxs(Button, { variant: userType === 'employer' ? 'default' : 'outline', onClick: () => setUserType('employer'), className: "flex-1", children: [_jsx(Building, { className: "w-4 h-4 mr-2" }), "Employer"] })] }), _jsx("div", { className: "text-center", children: _jsx(Badge, { variant: "secondary", className: "text-xs", children: userType === 'student' ? 'Find flexible work opportunities' : 'Post jobs and find talent' }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [!isLogin && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, transition: { duration: 0.3 }, children: _jsxs("div", { className: "relative", children: [_jsx(User, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { type: "text", placeholder: userType === 'student' ? 'Full name' : 'Company name', value: name, onChange: (e) => setName(e.target.value), className: "pl-10", required: true })] }) })), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { type: "email", placeholder: "Email address", value: email, onChange: (e) => setEmail(e.target.value), className: "pl-10", required: true })] }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { type: showPassword ? 'text' : 'password', placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), className: "pl-10 pr-10", required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground", children: showPassword ? _jsx(EyeOff, { className: "w-4 h-4" }) : _jsx(Eye, { className: "w-4 h-4" }) })] }), _jsx(Button, { type: "submit", className: "w-full", disabled: loading || !email || !password || (!isLogin && !name), children: loading ? (_jsxs("span", { className: "flex items-center justify-center", children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), isLogin ? 'Signing in...' : 'Creating account...'] })) : isLogin ? 'Sign In' : 'Create Account' }), error && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "text-center text-sm text-destructive bg-destructive/10 p-3 rounded-lg", children: error })), _jsxs("div", { className: "relative flex items-center", children: [_jsx("div", { className: "flex-grow border-t border-muted" }), _jsx("span", { className: "flex-shrink mx-4 text-xs text-muted-foreground", children: "OR" }), _jsx("div", { className: "flex-grow border-t border-muted" })] }), _jsx(Button, { variant: "outline", className: "w-full", onClick: handleGoogleSignIn, children: "Sign In with Google" })] }), _jsx("div", { className: "text-center", children: _jsx("button", { onClick: () => setIsLogin(!isLogin), className: "text-sm text-muted-foreground hover:text-foreground transition-colors", children: isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in' }) }), _jsxs("div", { className: "text-center text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg", children: [_jsx("p", { children: "Demo credentials:" }), _jsx("p", { children: "student@demo.com / employer@demo.com" }), _jsx("p", { children: "Password: demo123" })] })] }) })] }));
}
