const { db } = require("../config/firebase");
const CatalogMapper = require("../utils/catalogMapper");

class AssistanceRepository {
  async findById(id) {
    if (!db) return null;
    const doc = await db.collection("assistances").doc(id.toString()).get();
    if (!doc.exists) return null;
    
    const data = doc.data();
    const estadoId = data.estadoId || data.estado || 1;
    data.estadoId = Number(estadoId);
    data.estado = CatalogMapper.getEstadoName(data.estadoId);

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
          estado: this.estadoId || null
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
    const estadoId = data.estadoId || data.estado || 1;
    data.estadoId = Number(estadoId);
    data.estado = CatalogMapper.getEstadoName(data.estadoId);

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
          estado: this.estadoId || null
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
      const estadoId = data.estadoId || data.estado || 1;
      data.estadoId = Number(estadoId);
      data.estado = CatalogMapper.getEstadoName(data.estadoId);

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
            estado: this.estadoId || null
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
      const estadoId = data.estadoId || data.estado || 1;
      data.estadoId = Number(estadoId);
      data.estado = CatalogMapper.getEstadoName(data.estadoId);
      
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
            estado: this.estadoId || null
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
    
    const inputEstado = data.estado;
    let numericId = 1;
    if (typeof inputEstado === "string") {
      numericId = CatalogMapper.getEstadoId(inputEstado);
    } else if (typeof inputEstado === "number") {
      numericId = inputEstado;
    }
    
    data.estadoId = numericId;
    data.estado = numericId;

    await docRef.set(data);

    const returnedData = { ...data };
    returnedData.estado = CatalogMapper.getEstadoName(numericId);

    const savedAssistance = {
      id: docRef.id,
      ...returnedData,
      toJSON() {
        return { id: docRef.id, ...returnedData };
      },
      async save() {
        await db.collection("assistances").doc(docRef.id).update({
          hora_salida: this.hora_salida || null,
          estadoId: this.estadoId || null,
          estado: this.estadoId || null
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
    
    const inputEstado = data.estado;
    if (inputEstado !== undefined) {
      let numericId = 1;
      if (typeof inputEstado === "string") {
        numericId = CatalogMapper.getEstadoId(inputEstado);
      } else if (typeof inputEstado === "number") {
        numericId = inputEstado;
      }
      data.estadoId = numericId;
      data.estado = numericId;
    }
    
    await docRef.update(data);

    const mergedData = { ...doc.data(), ...data };
    const estadoId = mergedData.estadoId || mergedData.estado || 1;
    mergedData.estadoId = Number(estadoId);
    mergedData.estado = CatalogMapper.getEstadoName(mergedData.estadoId);

    return {
      id,
      ...mergedData,
      toJSON() {
        return { id, ...mergedData };
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
