"use client";

import { useRouter } from 'next/navigation';
import { signOut } from "firebase/auth";
import { auth } from '@/firebaseTools/firebase.js';

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.log("Error logging out:", error);
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;