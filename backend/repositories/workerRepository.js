const { db } = require("../config/firebase");

class WorkerRepository {
  async findById(id, includeUser = false) {
    if (!db) return null;
    const doc = await db.collection("workers").doc(id.toString()).get();
    if (!doc.exists) return null;
    
    const data = doc.data();
    const worker = {
      id: doc.id,
      ...data,
      get(options) {
        if (options && options.plain) {
          return { id: doc.id, ...data, User: worker.User };
        }
        return this;
      }
    };
    
    if (includeUser && data.userId) {
      const userDoc = await db.collection("users").doc(data.userId.toString()).get();
      if (userDoc.exists) {
        worker.User = { id: userDoc.id, ...userDoc.data() };
      }
    }
    
    return worker;
  }

  async findByQRToken(qrToken) {
    if (!db) return null;
    const snapshot = await db.collection("workers").where("qr_token", "==", qrToken).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      get(options) {
        if (options && options.plain) {
          return { id: doc.id, ...data };
        }
        return this;
      }
    };
  }

  async findAll(includeUser = false) {
    if (!db) return [];
    const snapshot = await db.collection("workers").get();
    
    const workers = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const worker = {
        id: doc.id,
        ...data,
        get(options) {
          if (options && options.plain) {
            return { id: doc.id, ...data, User: worker.User };
          }
          return this;
        }
      };
      
      if (includeUser && data.userId) {
        const userDoc = await db.collection("users").doc(data.userId.toString()).get();
        if (userDoc.exists) {
          worker.User = { id: userDoc.id, ...userDoc.data() };
        }
      }
      workers.push(worker);
    }
    
    return workers;
  }

  async create(workerData, transaction = null) {
    if (!db) return null;
    let docRef;
    if (workerData.id) {
      docRef = db.collection("workers").doc(workerData.id.toString());
    } else {
      docRef = db.collection("workers").doc();
    }
    
    const data = { ...workerData };
    delete data.id;
    
    await docRef.set(data);
    const savedWorker = {
      id: docRef.id,
      ...data,
      get(options) {
        if (options && options.plain) {
          return { id: docRef.id, ...data };
        }
        return this;
      }
    };
    return savedWorker;
  }

  async update(id, workerData) {
    if (!db) return null;
    const docRef = db.collection("workers").doc(id.toString());
    const doc = await docRef.get();
    if (!doc.exists) return null;
    
    const data = { ...workerData };
    delete data.id;
    
    await docRef.update(data);
    return {
      id,
      ...doc.data(),
      ...data,
      get(options) {
        if (options && options.plain) {
          return { id, ...doc.data(), ...data };
        }
        return this;
      }
    };
  }

  async delete(id) {
    if (!db) return false;
    const docRef = db.collection("workers").doc(id.toString());
    const doc = await docRef.get();
    if (!doc.exists) return false;
    await docRef.delete();
    return true;
  }

  async findByUserId(userId) {
    if (!db) return null;
    const snapshot = await db.collection("workers").where("userId", "==", userId).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      get(options) {
        if (options && options.plain) {
          return { id: doc.id, ...data };
        }
        return this;
      }
    };
  }
}

module.exports = new WorkerRepository();
