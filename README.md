# 💬 ConnectAt – Real-Time Chat App

**ConnectAt** is a real-time, responsive chat application where authenticated users can securely **send messages**, **share images/videos**, and stay connected. It uses **Firebase** for real-time database and authentication, and **Cloudinary** for optimized image/video uploads.

🔗 **Live Demo:** [connect-at.vercel.app](https://connect-at.vercel.app)  

---

## ✨ Features

- 🔐 **Firebase Authentication** (email/password login)
- 💬 Real-time **1-to-1 chat messaging**
- 🖼️ **Image & video upload** support via Cloudinary
- 📱 Fully **responsive UI** for mobile and desktop
- 🧪 Message **status and feedback** with toast notifications
- ⚡ Optimized media loading with **lazy loading** and transformations
- 🌙 Smooth UI with **Lottie animations** and Tailwind CSS

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- TailwindCSS
- React Router
- Toastify
- Lottie

**Backend/Services:**
- Firebase Realtime Database
- Firebase Authentication
- Cloudinary (Image/Video storage and optimization)

**Deployment:**
- Vercel (Frontend)

---

## 📸 Screenshots

 <img width="789" height="575" alt="work-1" src="https://github.com/user-attachments/assets/d065c623-92ec-4603-91e1-f7032927b652" />

---

## 📦 Getting Started (Local Setup)

### 1. Clone the Repository

```bash
git clone https://github.com/Cyrus253/ConnectAt.git
cd ConnectAt

npm install

create .env file add these---

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_DATABASE_URL=your_firebase_db_url
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

 check upload.js file for more....
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset,your_cloud_name

npm run dev

