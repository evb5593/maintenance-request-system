"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/firebaseTools/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserRole } from '@/firebaseTools/userRole.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userRole = await getUserRole(currentUser.uid);
                setUser(currentUser);
                setRole(userRole);
            } else {
                setUser(null);
                setRole(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, role }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);