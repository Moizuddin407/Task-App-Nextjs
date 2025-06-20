const userModel = require('../models/userModel');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const user = await userModel.createUser({ email, password, name });
    const token = generateToken(user.email);
    res.status(201).json({ token, userEmail: user.email });
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);
    if (!user || !user.password)
      return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await userModel.comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user.email);
    res.status(200).json({ token, userEmail: user.email });
  } catch (err) {
    next(err);
  }
};

exports.googleAuth = async (req, res, next) => {
  try {
    const { token } = req.body;

    const decoded = await admin.auth().verifyIdToken(token);
    const email = decoded.email;
    const name = decoded.name || decoded.displayName || 'Google User';

    const usersRef = admin.firestore().collection('users');
    let userId;

    const existingSnap = await usersRef.where('email', '==', email).limit(1).get();
    if (!existingSnap.empty) {
      userId = existingSnap.docs[0].id;
    } else {
      const newUserRef = await usersRef.add({
        email,
        name,
        provider: 'google',
      });
      userId = newUserRef.id;
    }

    const jwtToken = generateToken(email);

    res.status(200).json({ token: jwtToken, userEmail: email });
  } catch (err) {
    console.error('[GOOGLE OAUTH ERROR]', err.message);
    res.status(401).json({ message: 'Google sign-in failed' });
  }
};
