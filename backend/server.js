// ✅ Load Firebase and ENV first
require('dotenv').config();
const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase connected successfully!');
  } catch (error) {
    console.error('Firebase connection failed:', error);
    process.exit(1);
  }
}

// ✅ App setup
const express = require('express');
const cors = require('cors');
const app = express();

// ✅ Middleware (CORS & JSON parsing first)
app.use(cors());
app.use(express.json());

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
