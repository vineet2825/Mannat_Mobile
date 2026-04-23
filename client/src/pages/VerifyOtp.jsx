import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem('pendingEmail');
        if (!storedEmail) {
            navigate('/register');
        } else {
            setEmail(storedEmail);
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/verify', { email, otp });
            login(data);
            localStorage.removeItem('pendingEmail');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <ShieldCheck size={48} color="var(--primary)" />
                    <h2 style={{ marginTop: '20px' }}>Verify Email</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '10px' }}>
                        Enter the 6-digit code sent to <b>{email}</b>
                    </p>
                </div>
                {error && <div style={{ color: '#ef4444', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input 
                            type="text" 
                            placeholder="Enter OTP" 
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value)} 
                            required 
                            maxLength="6"
                            style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                        Verify & Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtp;
