import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Settings, ShoppingBag, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="nav">
            <Link to="/" className="logo">
                <ShoppingBag size={28} />
                <span>Mannat Mobile Shop</span>
            </Link>
            <div className="nav-links">
                <Link to="/">Home</Link>
                {user ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
                        <button onClick={handleLogout} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
