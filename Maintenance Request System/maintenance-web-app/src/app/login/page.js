"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebaseTools/firebase.js';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/firebaseTools/firebase.js';
import HomeButton from '../components/HomeButton';
import { useEffect } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const submitLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.userType === 'tenant') {
                    router.push('/request-form');
                } else if (userData.userType === 'staff') {
                    router.push('/requests');
                } else if (userData.userType === 'manager') {
                    router.push('/tenants');
                }
            } else {
                console.log("User data not found");
            }
        } catch (error) {
            console.log("Error logging in");
            // add error message to user
        }
    };

    useEffect(() => {
        const checkUserStatus = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.userType === 'tenant') {
                        router.push('/request-form');
                    } else if (userData.userType === 'staff') {
                        router.push('/requests');
                    } else if (userData.userType === 'manager') {
                        router.push('/tenants');
                    }
                }
            }
        };
        checkUserStatus();
    }, [router]);

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={submitLogin}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
            <br/>
            <HomeButton/>
        </div>
    );
};

export default Login;