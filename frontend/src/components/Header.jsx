
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header(){
  const navigate = useNavigate();

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
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return(
    <>
      <nav className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Dashboard</h1>
          <div className="space-x-3">
            {window.location.pathname === "/dashboard" ? (
              <Link to="/dashboard/reports" className="text-gray-700 hover:text-blue-600">
                Reports
              </Link>
            ) : (
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                Profile
              </Link>
            )}
            {/* <Link to="/dashboard/reports" className="text-gray-700 hover:text-blue-600">Reports</Link> */}
            <button onClick={logout} className="text-red-600 hover:underline cursor-pointer">Logout</button>
          </div>
        </div>
      </nav>
    </>
  );
}