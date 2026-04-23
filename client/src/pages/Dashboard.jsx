import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Smartphone, Shield, Clock, CheckCircle, XCircle } from 'lucide-react';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await API.delete('/auth/profile');
                logout();
                navigate('/login');
            } catch (err) {
                alert('Failed to delete account');
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, reqRes] = await Promise.all([
                    API.get('/products'),
                    API.get('/requests/my')
                ]);
                setProducts(prodRes.data);
                setFilteredProducts(prodRes.data);
                setMyRequests(reqRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim() === '') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(p => 
                p.modelName.toLowerCase().includes(value.toLowerCase()) || 
                p.brand.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    };

    const handleRequest = async (productId) => {
        try {
            await API.post('/requests', { productId });
            // Refresh requests
            const { data } = await API.get('/requests/my');
            setMyRequests(data);
            alert('Request submitted successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit request');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Dashboard...</div>;

    return (
        <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="page-title">Welcome, {user.name}</h1>
                <button 
                    onClick={handleDeleteAccount} 
                    className="btn" 
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '8px 15px', borderRadius: '8px' }}
                >
                    Delete Account
                </button>
            </div>
            
            <div style={{ marginTop: '20px', marginBottom: '30px' }}>
                <input 
                    type="text" 
                    placeholder="Search your phone model (e.g. iPhone 15, Samsung S23)..." 
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                        width: '100%',
                        padding: '15px 25px',
                        fontSize: '1.1rem',
                        borderRadius: '15px',
                        border: 'none',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                    }}
                />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                {/* Products List */}
                <div>
                    <h2 style={{ marginBottom: '20px' }}>Available Accessories</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                        {filteredProducts.length === 0 ? (
                            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                                No products found for "{searchTerm}".
                            </p>
                        ) : (
                            filteredProducts.map(product => (
                                <div key={product._id} className="glass-card" style={{ padding: '20px' }}>
                                    {product.image && (
                                        <div style={{ width: '100%', height: '150px', borderRadius: '10px', overflow: 'hidden', marginBottom: '15px' }}>
                                            <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.image}`} alt={product.modelName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ color: 'var(--primary)' }}>{product.brand}</h4>
                                        <h3>{product.modelName}</h3>
                                    </div>
                                    {product.type === 'Cover' ? <Smartphone size={20} color="var(--accent)" /> : <Shield size={20} color="#10b981" />}
                                </div>
                                <p style={{ color: 'var(--text-muted)', margin: '10px 0' }}>Type: {product.type}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                                    <span style={{ color: product.stock > 0 ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                    </span>
                                    <button 
                                        onClick={() => handleRequest(product._id)} 
                                        className="btn btn-primary" 
                                        disabled={product.stock <= 0}
                                        style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                                    >
                                        Request
                                    </button>
                                </div>
                            </div>
                            ))
                        )}
                    </div>
                </div>

                {/* My Requests */}
                <div>
                    <h2 style={{ marginBottom: '20px' }}>My Requests</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {myRequests.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>No requests yet.</p>
                        ) : (
                            myRequests.map(req => (
                                <div key={req._id} className="glass-card" style={{ padding: '15px', borderLeft: `4px solid ${req.status === 'Approved' ? '#10b981' : req.status === 'Rejected' ? '#ef4444' : 'var(--accent)'}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4 style={{ fontSize: '0.9rem' }}>{req.product.modelName} ({req.product.type})</h4>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(req.requestDate).toLocaleDateString()}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}>
                                            {req.status === 'Pending' && <Clock size={14} color="var(--accent)" />}
                                            {req.status === 'Approved' && <CheckCircle size={14} color="#10b981" />}
                                            {req.status === 'Rejected' && <XCircle size={14} color="#ef4444" />}
                                            <span style={{ color: req.status === 'Approved' ? '#10b981' : req.status === 'Rejected' ? '#ef4444' : 'var(--accent)' }}>
                                                {req.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
