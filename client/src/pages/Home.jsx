import { Link } from 'react-router-dom';
import { QrCode, Smartphone, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="animate-fade">
            <header style={{ textAlign: 'center', padding: '60px 0' }}>
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="page-title"
                >
                    Premium Accessories for Your Device
                </motion.h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '30px' }}>
                    Quality Mobile Covers & Tempered Glass at Mannat Mobile Shop.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <Link to="/register" className="btn btn-primary">Get Started</Link>
                    <Link to="/login" className="btn" style={{ border: '1px solid var(--glass-border)' }}>Login</Link>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginTop: '40px' }}>
                <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
                    <QrCode size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
                    <h3>Scan & Request</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Simply scan the QR in our shop to browse and request stock instantly.</p>
                </div>
                <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
                    <Smartphone size={48} color="var(--accent)" style={{ marginBottom: '20px' }} />
                    <h3>Wide Range</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Latest covers and tempered glass for all major mobile brands.</p>
                </div>
                <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
                    <ShieldCheck size={48} color="#10b981" style={{ marginBottom: '20px' }} />
                    <h3>Stock Tracking</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Real-time stock updates so you know exactly what's available.</p>
                </div>
            </div>

            <footer style={{ marginTop: '80px', textAlign: 'center', color: 'var(--text-muted)', paddingBottom: '40px' }}>
                <p>© 2026 Mannat Mobile Shop. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
