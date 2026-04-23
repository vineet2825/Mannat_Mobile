import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { Plus, Trash2, Edit2, Check, X, QrCode as QrIcon } from 'lucide-react';

const AdminPanel = () => {
    const [products, setProducts] = useState([]);
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [newProduct, setNewProduct] = useState({ brand: '', modelName: '', type: 'Cover', stock: 0 });
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your ADMIN account? This will remove all your access.')) {
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
        fetchData();
    }, []);

    const fetchData = async () => {
        const [prodRes, reqRes, userRes] = await Promise.all([
            API.get('/products'),
            API.get('/requests'),
            API.get('/auth/users')
        ]);
        setProducts(prodRes.data);
        setRequests(reqRes.data);
        setUsers(userRes.data);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('brand', newProduct.brand);
        formData.append('modelName', newProduct.modelName);
        formData.append('type', newProduct.type);
        formData.append('stock', newProduct.stock);
        if (newProduct.image) {
            formData.append('image', newProduct.image);
        }

        try {
            await API.post('/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowAddModal(false);
            setNewProduct({ brand: '', modelName: '', type: 'Cover', stock: 0, image: null });
            fetchData();
        } catch (err) {
            alert('Failed to add product');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await API.delete(`/products/${id}`);
            fetchData();
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await API.put(`/requests/${id}`, { status });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    const handleToggleBlock = async (userId) => {
        try {
            await API.put(`/auth/users/${userId}/block`);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to block user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to PERMANENTLY delete this user? All their data will be removed.')) {
            try {
                await API.delete(`/auth/users/${userId}`);
                fetchData();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    const generateShopQR = async () => {
        const websiteUrl = window.location.origin;
        try {
            const { data } = await API.post('/qr/generate', { url: websiteUrl });
            setQrCode(data.qrCode);
        } catch (err) {
            alert('Failed to generate QR');
        }
    };

    return (
        <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 className="page-title">Admin Management</h1>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        onClick={handleDeleteAccount} 
                        className="btn" 
                        style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '8px 15px', borderRadius: '8px' }}
                    >
                        Delete Account
                    </button>
                    <button onClick={generateShopQR} className="btn btn-accent">
                        <QrIcon size={20} /> Generate Shop QR
                    </button>
                    <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                        <Plus size={20} /> Add Product
                    </button>
                </div>
            </div>

            {qrCode && (
                <div className="glass-card" style={{ padding: '20px', textAlign: 'center', marginBottom: '30px' }}>
                    <h3>Your Shop QR Code</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>Print this and place it in your shop for customers to scan.</p>
                    <img src={qrCode} alt="Shop QR" style={{ width: '200px', border: '10px solid white', borderRadius: '10px' }} />
                    <div style={{ marginTop: '10px' }}>
                        <a href={qrCode} download="shop-qr.png" className="btn btn-primary">Download QR</a>
                        <button onClick={() => setQrCode('')} className="btn" style={{ marginLeft: '10px' }}>Close</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* Stock Management */}
                <div className="glass-card" style={{ padding: '25px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Inventory Management</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '12px' }}>Image</th>
                                <th style={{ padding: '12px' }}>Model</th>
                                <th style={{ padding: '12px' }}>Type</th>
                                <th style={{ padding: '12px' }}>Stock</th>
                                <th style={{ padding: '12px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '12px' }}>
                                        {p.image ? (
                                            <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${p.image}`} alt="Product" style={{ width: '40px', height: '40px', borderRadius: '5px', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '40px', height: '40px', borderRadius: '5px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>No Img</div>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px' }}>{p.brand} {p.modelName}</td>
                                    <td style={{ padding: '12px' }}>{p.type}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ color: p.stock < 5 ? '#ef4444' : 'inherit' }}>{p.stock}</span>
                                    </td>
                                    <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleDeleteProduct(p._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Request Management */}
                <div className="glass-card" style={{ padding: '25px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Customer Requests</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {requests.filter(r => r.status === 'Pending').length === 0 && <p style={{ color: 'var(--text-muted)' }}>No pending requests.</p>}
                        {requests.map(req => (
                            <div key={req._id} className="glass-card" style={{ padding: '15px', background: 'rgba(15, 23, 42, 0.3)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        {req.product.image && (
                                            <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${req.product.image}`} alt="Prod" style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} />
                                        )}
                                        <div>
                                            <h4 style={{ color: 'var(--primary)' }}>{req.user.name}</h4>
                                        <p style={{ fontSize: '0.9rem' }}>{req.product.brand} {req.product.modelName} ({req.product.type})</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.user.email}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {req.status === 'Pending' ? (
                                            <>
                                                <button onClick={() => handleUpdateStatus(req._id, 'Approved')} className="btn btn-primary" style={{ padding: '8px', background: '#10b981' }}>
                                                    <Check size={18} />
                                                </button>
                                                <button onClick={() => handleUpdateStatus(req._id, 'Rejected')} className="btn btn-primary" style={{ padding: '8px', background: '#ef4444' }}>
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <span style={{ color: req.status === 'Approved' ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                                                {req.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Management Section */}
            <div className="glass-card" style={{ padding: '25px', marginTop: '30px' }}>
                <h2 style={{ marginBottom: '20px' }}>User Management</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '12px' }}>Name</th>
                                <th style={{ padding: '12px' }}>Email</th>
                                <th style={{ padding: '12px' }}>Role</th>
                                <th style={{ padding: '12px' }}>Status</th>
                                <th style={{ padding: '12px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '12px' }}>{u.name}</td>
                                    <td style={{ padding: '12px' }}>{u.email}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ 
                                            background: u.role === 'admin' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                            color: u.role === 'admin' ? '#a855f7' : 'inherit',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem'
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ color: u.isBlocked ? '#ef4444' : '#10b981', fontWeight: '600' }}>
                                            {u.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        {u.role !== 'admin' && (
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button 
                                                    onClick={() => handleToggleBlock(u._id)} 
                                                    className="btn" 
                                                    style={{ 
                                                        padding: '6px 12px', 
                                                        fontSize: '0.8rem',
                                                        background: u.isBlocked ? '#10b981' : '#ef4444',
                                                        color: 'white',
                                                        flex: 1
                                                    }}
                                                >
                                                    {u.isBlocked ? 'Unblock' : 'Block'}
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteUser(u._id)} 
                                                    style={{ 
                                                        background: 'rgba(239, 68, 68, 0.1)', 
                                                        border: 'none', 
                                                        color: '#ef4444', 
                                                        cursor: 'pointer',
                                                        padding: '6px 10px',
                                                        borderRadius: '6px',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: 'rgba(15, 23, 42, 1)', 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'flex-start', 
                    alignItems: 'center', 
                    zIndex: 3000,
                    padding: '40px 20px',
                    overflowY: 'auto'
                }}>
                    <div style={{ width: '100%', maxWidth: '600px', padding: '20px 0 100px 0' }} className="animate-fade">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                            <h1 style={{ color: 'var(--primary)', margin: 0 }}>Add New Product</h1>
                            <button onClick={() => setShowAddModal(false)} className="btn" style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 20px' }}>Close</button>
                        </div>
                        
                        <form onSubmit={handleAddProduct}>
                            <div className="input-group" style={{ marginBottom: '25px' }}>
                                <label style={{ color: 'white', display: 'block', marginBottom: '10px', fontSize: '1.1rem' }}>Brand</label>
                                <input type="text" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} required style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '15px', fontSize: '1rem', width: '100%' }} />
                            </div>
                            <div className="input-group" style={{ marginBottom: '25px' }}>
                                <label style={{ color: 'white', display: 'block', marginBottom: '10px', fontSize: '1.1rem' }}>Model Name</label>
                                <input type="text" value={newProduct.modelName} onChange={e => setNewProduct({...newProduct, modelName: e.target.value})} required style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '15px', fontSize: '1rem', width: '100%' }} />
                            </div>
                            <div className="input-group" style={{ marginBottom: '25px' }}>
                                <label style={{ color: 'white', display: 'block', marginBottom: '10px', fontSize: '1.1rem' }}>Type</label>
                                <select value={newProduct.type} onChange={e => setNewProduct({...newProduct, type: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '15px', fontSize: '1rem', width: '100%' }}>
                                    <option value="Cover">Cover</option>
                                    <option value="Tempered">Tempered Glass</option>
                                </select>
                            </div>
                            <div className="input-group" style={{ marginBottom: '25px' }}>
                                <label style={{ color: 'white', display: 'block', marginBottom: '10px', fontSize: '1.1rem' }}>Stock Quantity</label>
                                <input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} required style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '15px', fontSize: '1rem', width: '100%' }} />
                            </div>
                            <div className="input-group" style={{ marginBottom: '40px' }}>
                                <label style={{ color: 'white', display: 'block', marginBottom: '10px', fontSize: '1.1rem' }}>Cover Image (Optional)</label>
                                <input type="file" onChange={e => setNewProduct({...newProduct, image: e.target.files[0]})} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '15px', fontSize: '1rem', width: '100%' }} accept="image/*" />
                            </div>
                            
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '18px', fontSize: '1.1rem', fontWeight: '600' }}>Add Product</button>
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn" style={{ flex: 1, padding: '18px', background: 'rgba(255,255,255,0.1)', color: 'white' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
