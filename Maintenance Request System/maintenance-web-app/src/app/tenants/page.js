"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseTools/firebase';
import withAuth from '../components/authWrapper';
import HomeButton from "@/app/components/homeButton";

const TenantsPage = () => {
    const [tenants, setTenants] = useState([]);
    const [newTenant, setNewTenant] = useState({
        name: '',
        phone: '',
        email: '',
        checkInDate: '',
        checkOutDate: '',
        apartmentNumber: '',
    });
    const [selectedTenantId, setSelectedTenantId] = useState(null);

    const fetchTenants = async () => {
        const tenantCollection = collection(db, 'users');
        const tenantSnapshot = await getDocs(tenantCollection);

        const tenantList = tenantSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(tenant => tenant.userType === 'tenant');

        setTenants(tenantList);
    };

    const handleAddTenant = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'users'), {
                ...newTenant,
                userType: 'tenant',
                phone: Number(newTenant.phone),
                apartmentNumber: Number(newTenant.apartmentNumber),
                checkInDate: Timestamp.fromDate(new Date(newTenant.checkInDate)),
                checkOutDate: Timestamp.fromDate(new Date(newTenant.checkOutDate)),
            });
            resetForm();
            fetchTenants();
        } catch (error) {
            console.log("Error adding tenant:", error);
        }
    };

    const handleUpdateTenant = async (e) => {
        e.preventDefault();
        if (selectedTenantId) {
            const tenantDoc = doc(db, 'users', selectedTenantId);
            await updateDoc(tenantDoc, {
                ...newTenant,
                phone: Number(newTenant.phone),
                apartmentNumber: Number(newTenant.apartmentNumber),
                checkInDate: Timestamp.fromDate(new Date(newTenant.checkInDate)),
                checkOutDate: Timestamp.fromDate(new Date(newTenant.checkOutDate)),
            });
            resetForm();
            setSelectedTenantId(null);
            fetchTenants();
        }
    };

    const handleDeleteTenant = async (id) => {
        const tenantDoc = doc(db, 'users', id);
        await deleteDoc(tenantDoc);
        setSelectedTenantId(null);
        fetchTenants();
    };

    const resetForm = () => {
        setNewTenant({ name: '', phone: '', email: '', checkInDate: '', checkOutDate: '', apartmentNumber: '' });
        setSelectedTenantId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTenant(prevState => ({ ...prevState, [name]: value }));
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    return (
        <div>
            <h1>Manage Tenants</h1>

            <form onSubmit={selectedTenantId ? handleUpdateTenant : handleAddTenant}>
                <input type="text" name="name" placeholder="Name" value={newTenant.name} onChange={handleInputChange}
                       required/>
                <input type="number" name="phone" placeholder="Phone Number" value={newTenant.phone}
                       onChange={handleInputChange} required/>
                <input type="email" name="email" placeholder="Email" value={newTenant.email}
                       onChange={handleInputChange} required/>
                <input type="datetime-local" name="checkInDate" placeholder="Check-In Date"
                       value={newTenant.checkInDate} onChange={handleInputChange} required/>
                <input type="datetime-local" name="checkOutDate" placeholder="Check-Out Date"
                       value={newTenant.checkOutDate} onChange={handleInputChange} required/>
                <input type="number" name="apartmentNumber" placeholder="Apartment Number"
                       value={newTenant.apartmentNumber} onChange={handleInputChange} required/>
                <button type="submit">{selectedTenantId ? 'Update Tenant' : 'Add Tenant'}</button>
                {selectedTenantId && <button type="button" onClick={resetForm}>Cancel</button>} {/* Cancel button */}
            </form>

            <h2>Existing Tenants</h2>
            <div>
                {tenants.map(tenant => (
                    <div key={tenant.id}>
                        <p>{tenant.name} (Apartment: {tenant.apartmentNumber})</p>
                        <button onClick={() => {
                            setNewTenant({
                                name: tenant.name,
                                phone: tenant.phone,
                                email: tenant.email,
                                checkInDate: new Date(tenant.checkInDate.seconds * 1000).toISOString().slice(0, 16),
                                checkOutDate: new Date(tenant.checkOutDate.seconds * 1000).toISOString().slice(0, 16),
                                apartmentNumber: tenant.apartmentNumber,
                            });
                            setSelectedTenantId(tenant.id);
                        }}>
                            Edit
                        </button>
                        <button onClick={() => handleDeleteTenant(tenant.id)}>Delete</button>
                    </div>
                ))}
            </div>
            <br/>
            <HomeButton/>
        </div>
    );
};

export default withAuth(TenantsPage, ['manager']);

