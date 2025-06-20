const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

const usersRef = admin.firestore().collection('users');

// 🔐 Create a user with hashed password
exports.createUser = async ({ email, password, name }) => {
  const existing = await usersRef.where('email', '==', email).get();
  if (!existing.empty) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    email,
    name,
    password: hashedPassword,
    provider: 'local', // ✅ Add this
  };

  const userDocRef = await usersRef.add(newUser);
  return { id: userDocRef.id, ...newUser };
};

// 🔑 Find user by email
exports.findUserByEmail = async (email) => {
  const snapshot = await usersRef.where('email', '==', email).limit(1).get();
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

// ✅ Check if password matches
exports.comparePassword = async (rawPassword, hashedPassword) => {
  return await bcrypt.compare(rawPassword, hashedPassword);
};
