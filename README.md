# Mannat Mobile Shop - Inventory Management System

A premium MERN stack application for managing mobile accessory inventory (Covers & Tempered Glass) with QR-based access and a stunning glassmorphic UI.

## 🚀 Features

- **Dual Dashboard**: Separate interfaces for Customers and Administrators.
- **QR Code System**: Generate a shop-specific QR code for easy customer access.
- **Inventory Management**: Add, update, and delete products with image uploads.
- **Real-time Search**: Customers can quickly search for their specific phone model.
- **Request System**: Customers can request items; Admins can approve or reject them.
- **User Management**: Admins can block/unblock or delete user accounts.
- **Premium UI**: Modern dark mode with mesh gradients and glassmorphism.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Lucide React (Icons), CSS3 (Custom Design System)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Auth**: JWT (JSON Web Tokens), OTP (Email Verification fallback)
- **File Uploads**: Multer (Local storage)

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd mannat-mobile-shop
```

### 2. Backend Setup
```bash
cd server
npm install
```
- Create a `.env` file in the `server` folder based on `.env.example`.
- Run the server: `npm run dev`

### 3. Frontend Setup
```bash
cd ../client
npm install
npm start
```

## 🔑 Default Admin Account
- **Email**: `ambrosiagaming90@gmail.com`
- **Password**: `Admin@123`

## 📄 License
MIT License
