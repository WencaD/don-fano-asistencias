const { db } = require("../config/firebase");

class OrganizationRepository {
  async findById(id) {
    if (!db) return null;
    const doc = await db.collection("organizations").doc(id.toString()).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  async findByAlias(alias) {
    if (!db) return null;
    const snapshot = await db.collection("organizations").where("alias", "==", alias).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  async findByName(nombre) {
    if (!db) return null;
    const snapshot = await db.collection("organizations").where("nombre", "==", nombre).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  async findAll(options = {}) {
    if (!db) return [];
    const snapshot = await db.collection("organizations").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async create(organizationData, transaction = null) {
    if (!db) return null;
    let docRef;
    if (organizationData.id) {
      docRef = db.collection("organizations").doc(organizationData.id.toString());
    } else {
      docRef = db.collection("organizations").doc();
    }
    
    const data = { ...organizationData };
    delete data.id;
    
    await docRef.set(data);
    return { id: docRef.id, ...data };
  }

  async update(id, organizationData) {
    if (!db) return null;
    const docRef = db.collection("organizations").doc(id.toString());
    const doc = await docRef.get();
    if (!doc.exists) return null;
    
    const data = { ...organizationData };
    delete data.id;
    
    await docRef.update(data);
    return { id, ...doc.data(), ...data };
  }

  async delete(id) {
    if (!db) return false;
    const docRef = db.collection("organizations").doc(id.toString());
    const doc = await docRef.get();
    if (!doc.exists) return false;
    await docRef.delete();
    return true;
  }
}

module.exports = new OrganizationRepository();
