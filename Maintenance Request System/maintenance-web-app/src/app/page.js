"use client";

import Link from 'next/link';
import { useAuth } from '@/firebaseTools/auth.js';
import LogoutButton from "@/app/components/logoutButton";

export default function Home() {
    const { user, role } = useAuth();

    return (
        <div>
            <h1>Welcome to the Maintenance Request System</h1>
            {user && <LogoutButton />}
            {role !== 'tenant' && role !== 'manager' &&
            <Link href={"/login"}>
                <button>Staff Login</button>
            </Link>
            }
            <Link href={user ? "/request-form" : "/login"}>
                <button>Make a Maintenance Request</button>
            </Link>
        </div>
    );
}