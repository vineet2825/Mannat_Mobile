import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/register', formData);
            if (data.otp) {
                console.log('%c🔑 DEV OTP:', 'color: #3b82f6; font-size: 20px; font-weight: bold;', data.otp);
            }
            localStorage.setItem('pendingEmail', formData.email);
            navigate('/verify');
        } catch (err) {
            if (err.response?.data?.otp) {
                console.log('%c🔑 DEV OTP:', 'color: #3b82f6; font-size: 20px; font-weight: bold;', err.response.data.otp);
            }
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>Create Account</h2>
                {error && <div style={{ color: '#ef4444', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                        <UserPlus size={20} /> Register
                    </button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
