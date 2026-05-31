const { db } = require("../config/firebase");

class AssistanceRepository {
  async findById(id) {
    if (!db) return null;
    const doc = await db.collection("assistances").doc(id.toString()).get();
    if (!doc.exists) return null;
    
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      toJSON() {
        return { id: doc.id, ...data };
      },
      async save() {
        await db.collection("assistances").doc(doc.id).update({
          hora_salida: this.hora_salida || null,
          estadoId: this.estadoId || null,
          estado: this.estado || null
        });
      }
    };
  }

  async findByWorkerAndDate(workerId, fecha) {
    if (!db) return null;
    const snapshot = await db.collection("assistances")
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
      },
      async save() {
        await db.collection("assistances").doc(doc.id).update({
          hora_salida: this.hora_salida || null,
          estadoId: this.estadoId || null,
          estado: this.estado || null
        });
      }
    };
  }

  async findByWorker(workerId, options = {}) {
    if (!db) return [];
    
    let query = db.collection("assistances").where("workerId", "==", workerId.toString());
    
    const snapshot = await query.get();
    
    const assistances = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const assistance = {
        id: doc.id,
        ...data,
        toJSON() {
          return { id: doc.id, ...data, Worker: assistance.Worker };
        },
        async save() {
          await db.collection("assistances").doc(doc.id).update({
            hora_salida: this.hora_salida || null,
            estadoId: this.estadoId || null,
            estado: this.estado || null
          });
        }
      };
      
      const workerDoc = await db.collection("workers").doc(data.workerId.toString()).get();
      if (workerDoc.exists) {
        assistance.Worker = { id: workerDoc.id, ...workerDoc.data() };
      }
      
      assistances.push(assistance);
    }
    
    assistances.sort((a, b) => b.fecha.localeCompare(a.fecha));
    
    return assistances;
  }

  async findAll(options = {}) {
    if (!db) return [];
    
    let query = db.collection("assistances");
    const snapshot = await query.get();
    
    const assistances = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      if (data.estado && !data.estadoId) {
        data.estadoId = data.estado;
      }
      
      const assistance = {
        id: doc.id,
        ...data,
        toJSON() {
          return { id: doc.id, ...data, Worker: assistance.Worker };
        },
        async save() {
          await db.collection("assistances").doc(doc.id).update({
            hora_salida: this.hora_salida || null,
            estadoId: this.estadoId || null,
            estado: this.estado || null
          });
        }
      };
      
      if (data.workerId) {
        const workerDoc = await db.collection("workers").doc(data.workerId.toString()).get();
        if (workerDoc.exists) {
          assistance.Worker = { id: workerDoc.id, ...workerDoc.data() };
        }
      }
      assistances.push(assistance);
    }
    
    assistances.sort((a, b) => b.fecha.localeCompare(a.fecha));
    return assistances;
  }

  async create(assistanceData) {
    if (!db) return null;
    
    const docRef = db.collection("assistances").doc();
    const data = { ...assistanceData };
    
    if (data.workerId) {
      data.workerId = data.workerId.toString();
    }
    
    if (data.estado && !data.estadoId) {
      data.estadoId = data.estado;
    }
    
    await docRef.set(data);
    const savedAssistance = {
      id: docRef.id,
      ...data,
      toJSON() {
        return { id: docRef.id, ...data };
      },
      async save() {
        await db.collection("assistances").doc(docRef.id).update({
          hora_salida: this.hora_salida || null,
          estadoId: this.estadoId || null,
          estado: this.estado || null
        });
      }
    };
    return savedAssistance;
  }

  async update(id, assistanceData) {
    if (!db) return null;
    const docRef = db.collection("assistances").doc(id.toString());
    const doc = await docRef.get();
    if (!doc.exists) return null;
    
    const data = { ...assistanceData };
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
    const docRef = db.collection("assistances").doc(id.toString());
    const doc = await docRef.get();
    if (!doc.exists) return false;
    await docRef.delete();
    return true;
  }
}

module.exports = new AssistanceRepository();
