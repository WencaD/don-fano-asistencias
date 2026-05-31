const { db } = require("../config/firebase");

class UserRepository {
  _mapUser(id, data) {
    if (!data) return null;
    const catalogService = require("../services/catalogService");
    
    // Si el rol es numérico, lo convertimos a string ('ADMIN', 'WORKER', etc.)
    let roleName = data.role;
    if (roleName !== undefined && roleName !== null) {
      if (typeof roleName === 'number' || (!isNaN(roleName) && !isNaN(parseFloat(roleName)))) {
        roleName = catalogService.getRoleName(parseInt(roleName));
      } else {
        roleName = roleName.toString().toUpperCase();
      }
    } else {
      roleName = 'WORKER';
    }

    const mapped = {
      id: id.toString(),
      ...data,
      role: roleName,
      toJSON() {
        return { id: id.toString(), ...data, role: roleName };
      }
    };

    mapped.comparePassword = async function(candidatePassword) {
      const bcrypt = require("bcryptjs");
      return await bcrypt.compare(candidatePassword, data.password_hash);
    };

    return mapped;
  }

  async findById(id) {
    if (!db) return null;
    const doc = await db.collection("users").doc(id.toString()).get();
    if (!doc.exists) return null;
    return this._mapUser(doc.id, doc.data());
  }

  async findByUsername(username) {
    if (!db) return null;
    const snapshot = await db.collection("users").where("username", "==", username).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return this._mapUser(doc.id, doc.data());
  }

  async findByEmail(email) {
    if (!db) return null;
    const snapshot = await db.collection("users").where("email", "==", email).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return this._mapUser(doc.id, doc.data());
  }

  async findAll(options = {}) {
    if (!db) return [];
    
    let query = db.collection("users");
    const snapshot = await query.get();
    
    const users = [];
    for (const doc of snapshot.docs) {
      const user = this._mapUser(doc.id, doc.data());
      
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
    return this._mapUser(docRef.id, data);
  }

  async update(id, userData) {
    if (!db) return null;
    const docRef = db.collection("users").doc(id.toString());
    const doc = await docRef.get();
    if (!doc.exists) return null;
    
    const data = { ...userData };
    delete data.id;
    
    await docRef.update(data);
    const updatedData = { ...doc.data(), ...data };
    return this._mapUser(id, updatedData);
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

