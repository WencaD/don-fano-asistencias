const { db } = require("../config/firebase");

class UserRepository {
  async findById(id) {
    if (!db) return null;
    const doc = await db.collection("users").doc(id.toString()).get();
    if (!doc.exists) return null;
    
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      toJSON() {
        return { id: doc.id, ...data };
      },
      async comparePassword(candidatePassword) {
        const bcrypt = require("bcryptjs");
        return await bcrypt.compare(candidatePassword, data.password_hash);
      }
    };
  }

  async findByUsername(username) {
    if (!db) return null;
    const snapshot = await db.collection("users").where("username", "==", username).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      toJSON() {
        return { id: doc.id, ...data };
      },
      async comparePassword(candidatePassword) {
        const bcrypt = require("bcryptjs");
        return await bcrypt.compare(candidatePassword, data.password_hash);
      }
    };
  }

  async findByEmail(email) {
    if (!db) return null;
    const snapshot = await db.collection("users").where("email", "==", email).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      toJSON() {
        return { id: doc.id, ...data };
      },
      async comparePassword(candidatePassword) {
        const bcrypt = require("bcryptjs");
        return await bcrypt.compare(candidatePassword, data.password_hash);
      }
    };
  }

  async findAll(options = {}) {
    if (!db) return [];
    
    let query = db.collection("users");
    const snapshot = await query.get();
    
    const users = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const user = {
        id: doc.id,
        ...data,
        toJSON() {
          return { id: doc.id, ...data };
        }
      };
      
      if (options.include) {
        const workerSnapshot = await db.collection("workers").where("userId", "==", doc.id).limit(1).get();
        if (!workerSnapshot.empty) {
          user.Worker = { id: workerSnapshot.docs[0].id, ...workerSnapshot.docs[0].data() };
        } else {
          user.Worker = null;
        }
      }
      users.push(user);
    }
    
    return users;
  }

  async create(userData, transaction = null) {
    if (!db) return null;
    
    let docRef;
    if (userData.id) {
      docRef = db.collection("users").doc(userData.id.toString());
    } else {
      docRef = db.collection("users").doc();
    }
    
    const data = { ...userData };
    delete data.id;
    
    await docRef.set(data);
    const savedUser = {
      id: docRef.id,
      ...data,
      toJSON() {
        return { id: docRef.id, ...data };
      }
    };
    return savedUser;
  }

  async update(id, userData) {
    if (!db) return null;
    const docRef = db.collection("users").doc(id.toString());
    const doc = await docRef.get();
    if (!doc.exists) return null;
    
    const data = { ...userData };
    delete data.id;
    
    await docRef.update(data);
    return {
      id,
      ...doc.data(),
      ...data,
      toJSON() {
        return { id, ...doc.data(), ...data };
      }
    };
  }

  async delete(id) {
    if (!db) return false;
    const docRef = db.collection("users").doc(id.toString());
    const doc = await docRef.get();
    if (!doc.exists) return false;
    await docRef.delete();
    return true;
  }
}

module.exports = new UserRepository();
