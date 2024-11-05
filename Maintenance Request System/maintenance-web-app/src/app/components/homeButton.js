"use client";

import { useRouter } from 'next/navigation';

const HomeButton = () => {
    const router = useRouter();

    const navigateHome = () => {
        router.push('/');
    };

    return (
        <button onClick={navigateHome}>
            Go to Home Page
        </button>
    );
};

export default HomeButton;