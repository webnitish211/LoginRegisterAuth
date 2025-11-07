import { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api/v1';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    const fetchMe = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load profile');
        setProfile(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [API_BASE, navigate]);


  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>

      <div className="container mx-auto px-6 py-8">
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {profile && (
          <div className="bg-white rounded-xl shadow p-6 max-w-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile</h2>
            <div className="space-y-2 text-gray-700">
              <div><span className="font-medium">Name:</span> {profile.name}</div>
              <div><span className="font-medium">Email:</span> {profile.email}</div>
              <div><span className="font-medium">User ID:</span> {profile.id}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


