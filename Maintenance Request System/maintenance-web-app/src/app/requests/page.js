"use client";

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebaseTools/firebase';
import withAuth from '../components/authWrapper';
import HomeButton from '../components/HomeButton';

const RequestsList = () => {
    const [requests, setRequests] = useState([]);
    const [filters, setFilters] = useState({
        apartmentNumber: '',
        area: '',
        startDate: '',
        endDate: '',
        status: '',
    });

    const fetchRequests = async () => {
        const requestsQuery = createFilter();
        const querySnapshot = await getDocs(requestsQuery);
        const fetchedRequests = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setRequests(fetchedRequests);
    };

    const createFilter = () => {
        const filterQuery = collection(db, 'requests');
        let q = query(filterQuery);

        if (filters.apartmentNumber) {
            const apartmentNumberFilter = parseInt(filters.apartmentNumber, 10)
            q = query(q, where('apartmentNumber', '==', isNaN(apartmentNumberFilter) ? '' : apartmentNumberFilter));
        }
        if (filters.area) {
            q = query(q, where('area', '==', filters.area));
        }
        if (filters.status) {
            q = query(q, where('status', '==', filters.status));
        }
        if (filters.startDate) {
            q = query(q, where('date', '>=', new Date(filters.startDate)));
        }
        if (filters.endDate) {
            q = query(q, where('date', '<=', new Date(filters.endDate)));
        }

        return q;
    };

    const updateRequestStatus = async (id) => {
        const requestDoc = doc(db, 'requests', id);
        await updateDoc(requestDoc, { status: 'completed' });
        fetchRequests();
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchRequests();
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div>
            <h1>Maintenance Requests</h1>
            <form onSubmit={handleFilterSubmit}>
                <input
                    type="text"
                    name="apartmentNumber"
                    placeholder="Apartment Number"
                    value={filters.apartmentNumber}
                    onChange={handleFilterChange}
                />
                <input
                    type="text"
                    name="area"
                    placeholder="Area (e.g., kitchen, bathroom)"
                    value={filters.area}
                    onChange={handleFilterChange}
                />
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                />
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                />
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
                <button type="submit">Filter</button>
            </form>

            <div>
                {requests.length > 0 ? (
                    requests.map((request) => (
                        <div key={request.id} className="request-item">
                            <p>Apartment Number: {request.apartmentNumber}</p>
                            <p>Area: {request.area}</p>
                            <p>Date: {new Date(request.date.toDate()).toLocaleDateString()}</p>
                            <p>Status: {request.status}</p>
                            <p>Description: {request.description}</p>
                            {request.photo && (
                                <img src={request.photo} alt="Request Image" style={{width: '100px', height: '100px'}}/>
                            )}
                            <br/>
                            {request.status === 'pending' && (
                                <button onClick={() => updateRequestStatus(request.id)}>
                                    Mark as Completed
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No maintenance requests found.</p>
                )}
            </div>
            <br/>
            <HomeButton/>
        </div>
    );
};

export default withAuth(RequestsList, ['staff', 'manager']);