const QRCode = require('qrcode');

// @desc    Generate QR Code for a URL
// @route   POST /api/qr/generate
exports.generateQR = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        const qrCodeDataUrl = await QRCode.toDataURL(url);
        res.json({ qrCode: qrCodeDataUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
