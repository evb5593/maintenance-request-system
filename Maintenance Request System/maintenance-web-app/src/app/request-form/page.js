"use client";

import { useState, useRef } from 'react';
import {Timestamp, getDoc, doc, setDoc} from 'firebase/firestore';
import { db } from '@/firebaseTools/firebase';
import withAuth from '../components/authWrapper';
import HomeButton from "@/app/components/homeButton";
import {useAuth} from "@/firebaseTools/auth";

const RequestForm = () => {
    const fileInputRef = useRef(null);
    const { user } = useAuth();
    const [requestData, setRequestData] = useState({
        apartmentNumber: '',
        area: '',
        description: '',
        photo: null,
        status: 'pending'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequestData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setRequestData((prevData) => ({
                    ...prevData,
                    photo: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select an image file.");
            if(fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = user?.uid;
        if (!userId) {
            alert("User is not logged in.");
            return;
        }

        const userRequestDoc = doc(db, 'requests', userId);
        const existingRequest = await getDoc(userRequestDoc);

        if (existingRequest.exists()) {
            alert("You already have a pending request.");
            return;
        }

        const newRequest = {
            ...requestData,
            apartmentNumber: Number(requestData.apartmentNumber),
            date: Timestamp.now(),
        };

        try {
            await setDoc(userRequestDoc, newRequest);
            alert('Request submitted successfully!');
            setRequestData({
                apartmentNumber: '',
                area: '',
                description: '',
                photo: null,
                status: 'pending',
            });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error("Error submitting request:", error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    name="apartmentNumber"
                    placeholder="Apartment Number"
                    value={requestData.apartmentNumber}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="area"
                    placeholder="Area of the Problem"
                    value={requestData.area}
                    onChange={handleInputChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description of the Problem"
                    value={requestData.description}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                />
                {requestData.photo &&
                    <img src={requestData.photo} alt="Preview" style={{width: '100px', height: '100px'}}/>}
                <button type="submit">Submit Request</button>
            </form>
            <br/>
            <HomeButton/>
        </>
    );
};

export default withAuth(RequestForm, ['tenant', 'manager', 'staff']);