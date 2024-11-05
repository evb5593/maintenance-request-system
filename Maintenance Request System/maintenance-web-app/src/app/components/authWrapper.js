"use client";

import { useAuth } from '@/firebaseTools/auth.js';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

const withAuth = (WrappedComponent, allowedRoles) => {
    return (props) => {
        const { user, role } = useAuth();
        const router = useRouter();
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            if (user !== null) {
                setLoading(false);
                if (!allowedRoles.includes(role)) {
                    router.push('/login');
                }
            }
            else{
                setLoading(false)
            }
        }, [user, role, router]);

        return user && allowedRoles.includes(role) ? <Suspense fallback={<div>Loading...</div>}><WrappedComponent {...props} /></Suspense> : null;
    };
};

export default withAuth;