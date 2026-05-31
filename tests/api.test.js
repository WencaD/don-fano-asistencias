const request = require('supertest');
// Ajusta la ruta a tu archivo app.js o index.js exportado
// const app = require('../backend/index'); 
// NOTA: Para que supertest funcione directo con tu app, index.js debe exportar el app de express.
// Ejemplo: module.exports = app;

// Como demostración, simularemos la URL donde corre tu backend localmente
const API_URL = 'http://localhost:3000/api';

describe('Pruebas Automatizadas de API (Backend)', () => {
  
  let authToken = ''; // Aquí guardaremos el token para rutas protegidas
  let newWorkerId = ''; // Guardaremos el ID del trabajador creado

  // ---------------------------------------------------------
  // 1. PRUEBAS DE AUTENTICACIÓN (Login)
  // ---------------------------------------------------------
  describe('POST /auth/login', () => {
    
    it('Debe iniciar sesión correctamente con credenciales válidas (REQ-001)', async () => {
      const res = await request(API_URL)
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'DonFano2025!'
        });
      
      // Verificamos que el código HTTP sea 200 (OK)
      expect(res.statusCode).toEqual(200);
      
      // Verificamos que la respuesta contenga un token
      expect(res.body).toHaveProperty('token');
      
      // Guardamos el token para las siguientes pruebas
      authToken = res.body.token;
    });

    it('Debe rechazar el inicio de sesión con clave incorrecta (REQ-002)', async () => {
      const res = await request(API_URL)
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'ClaveEquivocada123'
        });
      
      // Verificamos que el código HTTP sea 401 (Unauthorized) o 400
      expect([400, 401]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ---------------------------------------------------------
  // 2. PRUEBAS DE TRABAJADORES (Protegidas con JWT)
  // ---------------------------------------------------------
  describe('Gestión de Trabajadores (Workers)', () => {
    
    it('Debe denegar acceso si no se envía el Token JWT (REQ-018)', async () => {
      const res = await request(API_URL)
        .get('/workers');
      
      // Verificamos protección de ruta
      expect([401, 403]).toContain(res.statusCode);
    });

    it('Debe listar los trabajadores si se envía un Token válido', async () => {
      const res = await request(API_URL)
        .get('/workers')
        .set('Authorization', `Bearer ${authToken}`); // Enviamos el token en el Header
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('Debe crear un nuevo trabajador correctamente (REQ-004)', async () => {
      const workerData = {
        firstName: 'Carlos',
        lastName: 'Prueba',
        dni: '00000001', // Usamos un DNI ficticio
        area_id: 1,
        cargo_id: 1,
        shift_id: 1,
        phone: '999888777'
      };

      const res = await request(API_URL)
        .post('/workers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(workerData);
      
      expect(res.statusCode).toBeLessThan(300); // 200 o 201
      expect(res.body).toHaveProperty('message');
      
      // Si la API retorna el ID creado, lo guardamos para luego eliminarlo
      if (res.body.workerId || res.body.id) {
        newWorkerId = res.body.workerId || res.body.id;
      }
    });

    it('Debe evitar crear un trabajador con DNI duplicado (REQ-005)', async () => {
      const workerData = {
        firstName: 'Otro',
        lastName: 'Usuario',
        dni: '00000001', // El mismo DNI que el anterior
        area_id: 1,
        cargo_id: 1,
        shift_id: 1
      };

      const res = await request(API_URL)
        .post('/workers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(workerData);
      
      // Debe fallar por DNI duplicado
      expect(res.statusCode).toBeGreaterThanOrEqual(400); 
    });
  });

  // ---------------------------------------------------------
  // 3. PRUEBAS DE HEALTHCHECK
  // ---------------------------------------------------------
  describe('GET /health', () => {
    it('El servidor debe responder para verificar que está vivo', async () => {
      // Intenta acceder a una ruta base para ver si el server responde
      const res = await request(API_URL.replace('/api','')).get('/');
      expect(res.statusCode).toBeLessThan(500);
    });
  });

});
