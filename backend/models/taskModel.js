const admin = require('firebase-admin');
const tasksRef = admin.firestore().collection('tasks');

exports.createTask = async ({ title, description, userEmail }) => {
  const taskDoc = await tasksRef.add({ title, description, userEmail });
  return { id: taskDoc.id, title, description, userEmail };
};

exports.getAllTasksForUser = async (userEmail) => {
  const snap = await tasksRef.where('userEmail', '==', userEmail).get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

exports.updateTask = async (taskId, data, userEmail) => {
  const doc = await tasksRef.doc(taskId).get();
  if (!doc.exists || doc.data().userEmail !== userEmail) {
    throw new Error('Task not found or unauthorized');
  }
  await tasksRef.doc(taskId).update(data);
  return { id: taskId, ...data };
};

exports.deleteTask = async (taskId, userEmail) => {
  const doc = await tasksRef.doc(taskId).get();
  if (!doc.exists || doc.data().userEmail !== userEmail) {
    throw new Error('Task not found or unauthorized');
  }
  await tasksRef.doc(taskId).delete();
};
