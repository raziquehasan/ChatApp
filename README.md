# 💬 ChatApp - Real-time Chat Application

A modern, full-stack real-time chat application built with React, Node.js, Socket.io, and MongoDB. Features include instant messaging, audio/video calling, user authentication, and profile management.

![ChatApp Banner](https://img.shields.io/badge/ChatApp-Real--time%20Messaging-blue?style=for-the-badge&logo=chat&logoColor=white)

## ✨ Features

### 💬 **Real-time Messaging**
- ✅ Instant message delivery with Socket.io
- ✅ Sound notifications for new messages
- ✅ Message history and persistence
- ✅ Online user status indicators
- ✅ Typing indicators

### 📞 **Audio & Video Calling**
- ✅ WebRTC-based peer-to-peer calling
- ✅ Audio and video call support
- ✅ Call notifications and controls
- ✅ Mute/unmute and video toggle
- ✅ Call timeout and proper cleanup

### 👤 **User Management**
- ✅ Secure user authentication (JWT)
- ✅ User registration and login
- ✅ Profile management and editing
- ✅ Profile photo upload
- ✅ Password encryption with bcrypt

### 🎨 **Modern UI/UX**
- ✅ Glassmorphism design with Tailwind CSS
- ✅ Responsive layout for all devices
- ✅ Smooth animations and transitions
- ✅ Dark theme with gradient backgrounds
- ✅ Professional component library

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing
- **React Icons** - Icon library

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

### **Real-time Features**
- **WebRTC** - Peer-to-peer audio/video calling
- **Socket.io** - Real-time messaging and signaling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/raziquehasan/ChatApp.git
   cd ChatApp
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/chatapp
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

5. **Start the Application**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm start
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

## 📁 Project Structure

```
ChatApp/
├── backend/
│   ├── Models/
│   │   ├── userSchema.js
│   │   ├── messageSchema.js
│   │   └── conversationModels.js
│   ├── routControlers/
│   │   ├── authControler.js
│   │   ├── messageroutControler.js
│   │   └── userControler.js
│   ├── rout/
│   │   ├── authRout.js
│   │   ├── messageRout.js
│   │   └── userRout.js
│   ├── Socket/
│   │   └── socket.js
│   ├── middleware/
│   │   └── protectRout.js
│   ├── db/
│   │   └── dbConnect.js
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CallModal.jsx
│   │   │   └── CallTest.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── home/
│   │   │   └── components/
│   │   │       ├── MessageContainer.jsx
│   │   │       └── Sidebar.jsx
│   │   ├── login/
│   │   │   └── Login.jsx
│   │   ├── register/
│   │   │   └── Register.jsx
│   │   ├── profile/
│   │   │   └── Profile.jsx
│   │   ├── utils/
│   │   │   └── VerifyUser.jsx
│   │   ├── zustans/
│   │   │   └── useConversation.js
│   │   └── App.jsx
│   ├── public/
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### **Messages**
- `GET /api/message/:id` - Get messages with user
- `POST /api/message/send/:id` - Send message to user

### **Users**
- `GET /api/user/search` - Search users
- `GET /api/user/currentchatters` - Get chat history
- `PUT /api/user/update-profile` - Update user profile
- `POST /api/user/upload-profile-photo` - Upload profile photo

## 🔌 Socket Events

### **Messaging**
- `newMessage` - Real-time message delivery
- `getOnlineUsers` - Online user status updates

### **Calling**
- `call-user` - Initiate audio/video call
- `incoming-call` - Receive call notification
- `accept-call` - Accept incoming call
- `reject-call` - Reject incoming call
- `end-call` - End active call
- `offer` / `answer` - WebRTC signaling
- `ice-candidate` - WebRTC ICE candidates

## 🎯 Key Features Explained

### **Real-time Messaging**
- Messages are instantly delivered using Socket.io
- Sound notifications play when new messages arrive
- Messages are persisted in MongoDB
- Online status is tracked and displayed

### **WebRTC Calling**
- Peer-to-peer audio and video calls
- STUN servers for NAT traversal
- Call signaling through Socket.io
- Media stream management and cleanup

### **Authentication & Security**
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and middleware
- Secure file upload handling

## 🌟 Screenshots

### Login Page
Modern glassmorphism design with gradient backgrounds

### Chat Interface
Clean, intuitive messaging interface with real-time updates

### Video Calling
Full-featured video calling with controls

### Profile Management
Complete profile editing with photo upload

## 🚀 Deployment

### **Render Deployment (Recommended)**

This project is configured for easy deployment on Render using the included `render.yaml` file.

#### **One-Click Deploy**
1. Fork this repository
2. Connect your GitHub account to Render
3. Create a new "Blueprint" on Render
4. Select this repository
5. Render will automatically deploy both frontend and backend

#### **Manual Deployment Steps**

**1. Backend Deployment:**
- Create a new Web Service on Render
- Connect your GitHub repository
- Set build command: `npm install`
- Set start command: `npm start`
- Add environment variables:
  - `NODE_ENV=production`
  - `MONGODB_URI=your_mongodb_connection_string`
  - `JWT_SECRET=your_jwt_secret`

**2. Frontend Deployment:**
- Create a new Static Site on Render
- Set build command: `npm run build --prefix frontend`
- Set publish directory: `frontend/dist`
- Add environment variable:
  - `VITE_SOCKET_URL=https://your-backend-url.onrender.com`

**3. Database Setup:**
- Use Render's managed PostgreSQL or
- Connect to MongoDB Atlas (recommended)

### **Other Platforms**

#### **Frontend (Netlify/Vercel)**
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

#### **Backend (Railway/Heroku)**
```bash
# Set environment variables
# Deploy backend folder
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Razique Hasan**
- GitHub: [@raziquehasan](https://github.com/raziquehasan)
- LinkedIn: [Razique Hasan](https://linkedin.com/in/raziquehasan)

## 🙏 Acknowledgments

- Socket.io for real-time communication
- WebRTC for peer-to-peer calling
- Tailwind CSS for beautiful styling
- React community for amazing tools

## 📞 Support

If you have any questions or need help, please open an issue or contact me directly.

---

⭐ **Star this repository if you found it helpful!** ⭐
