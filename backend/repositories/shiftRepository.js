const { db } = require("../config/firebase");

class ShiftRepository {
  async findById(id) {
    if (!db) return null;
    const doc = await db.collection("shifts").doc(id.toString()).get();
    if (!doc.exists) return null;
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      toJSON() {
        return { id: doc.id, ...data };
      }
    };
  }

  async findByWorkerAndDate(workerId, fecha) {
    if (!db) return null;
    const snapshot = await db.collection("shifts")
      .where("workerId", "==", workerId.toString())
      .where("fecha", "==", fecha)
      .limit(1)
      .get();
      
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      toJSON() {
        return { id: doc.id, ...data };
      }
    };
  }

  async findAllByWorkerAndDate(workerId, fecha) {
    if (!db) return [];
    const snapshot = await db.collection("shifts")
      .where("workerId", "==", workerId.toString())
      .where("fecha", "==", fecha)
      .get();
      
    const shifts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        toJSON() {
          return { id: doc.id, ...data };
        }
      };
    });
    
    shifts.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
    return shifts;
  }

  async findByWorker(workerId) {
    if (!db) return [];
    const snapshot = await db.collection("shifts")
      .where("workerId", "==", workerId.toString())
      .get();
      
    const shifts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        toJSON() {
          return { id: doc.id, ...data };
        }
      };
    });
    
    shifts.sort((a, b) => {
      const dateCompare = a.fecha.localeCompare(b.fecha);
      if (dateCompare !== 0) return dateCompare;
      return a.hora_inicio.localeCompare(b.hora_inicio);
    });
    return shifts;
  }

  async deleteByWorkerAndDate(workerId, fecha) {
    if (!db) return 0;
    const shifts = await this.findAllByWorkerAndDate(workerId, fecha);
    if (shifts.length === 0) return 0;
    
    for (const shift of shifts) {
      await db.collection("shifts").doc(shift.id).delete();
    }
    
    return shifts.length;
  }

  async findAll() {
    if (!db) return [];
    const snapshot = await db.collection("shifts").get();
    
    const shifts = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const shift = {
        id: doc.id,
        ...data,
        toJSON() {
          return { id: doc.id, ...data, Worker: shift.Worker };
        }
      };
      
      if (data.workerId) {
        const workerDoc = await db.collection("workers").doc(data.workerId.toString()).get();
        if (workerDoc.exists) {
          shift.Worker = { id: workerDoc.id, ...workerDoc.data() };
        }
      }
      shifts.push(shift);
    }
    
    shifts.sort((a, b) => {
      const dateCompare = b.fecha.localeCompare(a.fecha);
      if (dateCompare !== 0) return dateCompare;
      return a.hora_inicio.localeCompare(b.hora_inicio);
    });
    return shifts;
  }

  async create(shiftData) {
    if (!db) return null;
    const docRef = db.collection("shifts").doc();
    const data = { ...shiftData };
    
    if (data.workerId) {
      data.workerId = data.workerId.toString();
    }
    
    await docRef.set(data);
    const savedShift = {
      id: docRef.id,
      ...data,
      toJSON() {
        return { id: docRef.id, ...data };
      }
    };
    return savedShift;
  }

  async update(id, shiftData) {
    if (!db) return null;
    const docRef = db.collection("shifts").doc(id.toString());
    const doc = await docRef.get();
    if (!doc.exists) return null;
    
    const data = { ...shiftData };
    delete data.id;
    
    if (data.workerId) {
      data.workerId = data.workerId.toString();
    }
    
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
    const docRef = db.collection("shifts").doc(id.toString());
    const doc = await docRef.get();
    if (!doc.exists) return false;
    await docRef.delete();
    return true;
  }
}

module.exports = new ShiftRepository();
