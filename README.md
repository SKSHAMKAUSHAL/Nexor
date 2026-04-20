<div align="center">

# 🛍️ Nexor Fit

### Modern E-Commerce Platform

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.1.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/Redux-2.2.7-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

[Live Demo](https://shop-with-Nexor Fit.netlify.app/) • [Report Bug](https://github.com/SKSHAMKAUSHAL/Nexor/issues) • [Request Feature](https://github.com/SKSHAMKAUSHAL/Nexor/issues)

</div>

---

## ✨ Features

- 🔐 **Secure Authentication** - Firebase Auth with protected routes
- 🛒 **Smart Shopping Cart** - Redux-powered state manageMant
- 💳 **PayMant Integration** - Razorpay checkout
- 👨‍💼 **Admin Dashboard** - Complete product & order manageMant
- 🌓 **Dark Mode** - Seamless theme switching
- 📱 **Fully Responsive** - Mobile-first design
- 🎨 **Modern UI** - Tailwind CSS with smooth animations
- ❤️ **Wishlist** - Save favorite products
- 🔍 **Advanced Filters** - Search & filter products easily

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/SKSHAMKAUSHAL/Nexor.git

# Navigate to directory
cd Nexor

# Install dependencies
npm install

# Create .env file and add Firebase config
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_auth_domain
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_storage_bucket
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id

# Start developMant server
npm run dev
```

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- Redux Toolkit
- Tailwind CSS
- React Router DOM

**Backend:**
- Firebase Firestore
- Firebase Authentication
- Firebase Storage

**PayMant:**
- Razorpay Integration

## 📂 Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components & routes
├── context/           # Global state manageMant
├── redux/             # Redux store & slices
├── firebase/          # Firebase configuration
└── utils/             # Helper functions
```

## 🔒 Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password)
3. Enable **Firestore Database**
4. Add your Firebase config to `.env` file

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/docuMants {
    match /products/{docuMant=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /orders/{docuMant=**} {
      allow read, write: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 👨‍💼 Admin Access

Update admin email in `src/App.jsx`:

```javascript
if (admin?.user?.email === 'your-admin-email@gmail.com') {
  return children;
}
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start developMant server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🌐 DeployMant

### Netlify (RecomManded)

```bash
npm run build
# Deploy dist/ folder to Netlify
```

Or connect your GitHub repository to Netlify for automatic deployMants.

## 📸 Screenshots

<div align="center">
  <img src="./public/screen6.png" alt="Nexor Fit Screenshot" />
</div>

<div align="center">
  <img src="./public/screen5.png" alt="Nexor Fit Screenshot" />
</div>

<div align="center">
  <img src="./public/screen4.png" alt="Nexor Fit Screenshot" />
</div>

<div align="center">
  <img src="./public/screen3.png" alt="Nexor Fit Screenshot" />
</div>

<div align="center">
  <img src="./public/screen2.png" alt="Nexor Fit Screenshot" />
</div>

<div align="center">
  <img src="./public/screen1.png" alt="Nexor Fit Screenshot" />
</div>
## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sksham Kaushal**

- GitHub: [@SKSHAMKAUSHAL](https://github.com/SKSHAMKAUSHAL)
- Email: skshamkaushal@gmail.com

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

<div align="center">
Made with ❤️ by Sksham Kaushal
</div>
