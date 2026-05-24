const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ── SIMPLE JSON DATABASE ──────────────────────────────────────────────────────
const DB_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || __dirname;
const DB_PATH = path.join(DB_DIR, 'delart-db.json');

function loadDB() {
  if (!fs.existsSync(DB_PATH)) return null;
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch { return null; }
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function getDB() {
  let db = loadDB();
  if (!db) {
    db = {
      usuarios: [
        { id: 1, nombre: 'maria', password: 'delart2026', rol: 'admin' },
        { id: 2, nombre: 'compras', password: 'delart2026', rol: 'usuario' }
      ],
      insumos: [
        { id: 1, nombre: 'Cacao en polvo', tipo: 'mp', unidad: 'kg', activo: true },
        { id: 2, nombre: 'Manteca de cacao', tipo: 'mp', unidad: 'kg', activo: true },
        { id: 3, nombre: 'Azúcar rubia', tipo: 'mp', unidad: 'kg', activo: true },
        { id: 4, nombre: 'Leche en polvo', tipo: 'mp', unidad: 'kg', activo: true },
        { id: 5, nombre: 'Vainilla', tipo: 'mp', unidad: 'kg', activo: true },
        { id: 6, nombre: 'Cajas kraft 100g', tipo: 'pkg', unidad: 'unidades', activo: true },
        { id: 7, nombre: 'Cinta satinada', tipo: 'pkg', unidad: 'rollos', activo: true },
        { id: 8, nombre: 'Bolsas celofán', tipo: 'pkg', unidad: 'unidades', activo: true }
      ],
      proveedores: [
        { id: 1, nombre: 'CacaoChile', tipo: 'mp', contacto: 'Jorge Pérez', telefono: '+56 9 8812 3456', email: 'contacto@cacaochile.cl', rut: '76.543.210-8', pago_condicion: '30 días', banco: 'Banco de Chile', tipo_cuenta: 'Cuenta corriente', nro_cuenta: '00-123-45678-09', rut_cuenta: '76.543.210-8', email_comprobante: 'pagos@cacaochile.cl', notas: 'Despacha martes y jueves. Pedido mínimo 20 kg.', activo: true },
        { id: 2, nombre: 'Comercial Norte', tipo: 'mp', contacto: 'Ana González', telefono: '+56 9 7723 9900', email: 'ana@comercialnorte.cl', rut: '76.111.222-3', pago_condicion: '30 días', banco: 'BancoEstado', tipo_cuenta: 'Cuenta corriente', nro_cuenta: '12345678', rut_cuenta: '76.111.222-3', email_comprobante: 'pagos@comercialnorte.cl', notas: '', activo: true },
        { id: 3, nombre: 'LácteosRM', tipo: 'mp', contacto: 'Mario Silva', telefono: '+56 9 9900 1122', email: 'mario@lacteosrm.cl', rut: '76.333.444-5', pago_condicion: 'Contra entrega', banco: 'BCI', tipo_cuenta: 'Cuenta corriente', nro_cuenta: '87654321', rut_cuenta: '76.333.444-5', email_comprobante: '', notas: '', activo: true },
        { id: 4, nombre: 'Packaging Express', tipo: 'pkg', contacto: 'Valentina Rojas', telefono: '+56 9 6644 2211', email: 'ventas@packexp.cl', rut: '77.890.123-4', pago_condicion: '30 días', banco: 'BCI', tipo_cuenta: 'Cuenta corriente', nro_cuenta: '12345678', rut_cuenta: '77.890.123-4', email_comprobante: 'pagos@packexp.cl', notas: 'Pedido mínimo $50.000.', activo: true }
      ],
      pedidos: [],
      recepciones: [],
      pagos: [],
      _nextId: { insumos: 9, proveedores: 5, pedidos: 1, recepciones: 1, pagos: 1 }
    };
    saveDB(db);
  }
  return db;
}

function nextId(db, table) {
  if (!db._nextId[table]) db._nextId[table] = 1;
  return db._nextId[table]++;
}

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'delart-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

function requireAuth(req, res, next) {
  if (req.session && req.session.usuario) return next();
  res.status(401).json({ error: 'No autenticado' });
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const db = getDB();
  const { nombre, password } = req.body;
  const user = db.usuarios.find(u => u.nombre === nombre && u.password === password);
  if (!user) return res.json({ ok: false, error: 'Usuario o contraseña incorrectos' });
  req.session.usuario = { id: user.id, nombre: user.nombre, rol: user.rol };
  res.json({ ok: true, usuario: req.session.usuario });
});

app.post('/api/logout', (req, res) => { req.session.destroy(); res.json({ ok: true }); });
app.get('/api/me', (req, res) => {
  if (req.session.usuario) res.json({ ok: true, usuario: req.session.usuario });
  else res.json({ ok: false });
});

// ── INSUMOS ───────────────────────────────────────────────────────────────────
app.get('/api/insumos', requireAuth, (req, res) => {
  const db = getDB();
  res.json(db.insumos.filter(i => i.activo).sort((a,b) => a.tipo.localeCompare(b.tipo) || a.nombre.localeCompare(b.nombre)));
});

app.post('/api/insumos', requireAuth, (req, res) => {
  const db = getDB();
  const { nombre, tipo, unidad } = req.body;
  const item = { id: nextId(db, 'insumos'), nombre, tipo, unidad: unidad || 'kg', activo: true };
  db.insumos.push(item);
  saveDB(db);
  res.json({ ok: true, id: item.id });
});

app.put('/api/insumos/:id', requireAuth, (req, res) => {
  const db = getDB();
  const idx = db.insumos.findIndex(i => i.id == req.params.id);
  if (idx >= 0) { Object.assign(db.insumos[idx], req.body); saveDB(db); }
  res.json({ ok: true });
});

app.delete('/api/insumos/:id', requireAuth, (req, res) => {
  const db = getDB();
  const idx = db.insumos.findIndex(i => i.id == req.params.id);
  if (idx >= 0) { db.insumos[idx].activo = false; saveDB(db); }
  res.json({ ok: true });
});

// ── PROVEEDORES ───────────────────────────────────────────────────────────────
app.get('/api/proveedores', requireAuth, (req, res) => {
  const db = getDB();
  res.json(db.proveedores.filter(p => p.activo).sort((a,b) => a.tipo.localeCompare(b.tipo) || a.nombre.localeCompare(b.nombre)));
});

app.post('/api/proveedores', requireAuth, (req, res) => {
  const db = getDB();
  const item = { id: nextId(db, 'proveedores'), ...req.body, activo: true };
  db.proveedores.push(item);
  saveDB(db);
  res.json({ ok: true, id: item.id });
});

app.put('/api/proveedores/:id', requireAuth, (req, res) => {
  const db = getDB();
  const idx = db.proveedores.findIndex(p => p.id == req.params.id);
  if (idx >= 0) { Object.assign(db.proveedores[idx], req.body); saveDB(db); }
  res.json({ ok: true });
});

app.delete('/api/proveedores/:id', requireAuth, (req, res) => {
  const db = getDB();
  const idx = db.proveedores.findIndex(p => p.id == req.params.id);
  if (idx >= 0) { db.proveedores[idx].activo = false; saveDB(db); }
  res.json({ ok: true });
});

// ── PEDIDOS ───────────────────────────────────────────────────────────────────
function enrichPedido(pedido, db) {
  const insumo = db.insumos.find(i => i.id == pedido.insumo_id) || {};
  const proveedor = db.proveedores.find(p => p.id == pedido.proveedor_id) || {};
  const recibido = db.recepciones.filter(r => r.pedido_id == pedido.id).reduce((s, r) => s + r.cantidad, 0);
  const pagado = db.pagos.filter(p => p.pedido_id == pedido.id).reduce((s, p) => s + p.monto, 0);
  return { ...pedido, insumo_nombre: insumo.nombre, insumo_tipo: insumo.tipo, proveedor_nombre: proveedor.nombre, recibido, pagado };
}

app.get('/api/pedidos', requireAuth, (req, res) => {
  const db = getDB();
  const list = db.pedidos.map(p => enrichPedido(p, db)).sort((a,b) => b.id - a.id);
  res.json(list);
});

app.post('/api/pedidos', requireAuth, (req, res) => {
  const db = getDB();
  const item = { id: nextId(db, 'pedidos'), ...req.body, estado: 'camino', creado_at: new Date().toISOString() };
  db.pedidos.push(item);
  saveDB(db);
  res.json({ ok: true, id: item.id });
});

app.put('/api/pedidos/:id', requireAuth, (req, res) => {
  const db = getDB();
  const idx = db.pedidos.findIndex(p => p.id == req.params.id);
  if (idx >= 0) { Object.assign(db.pedidos[idx], req.body); saveDB(db); }
  res.json({ ok: true });
});

// ── RECEPCIONES ───────────────────────────────────────────────────────────────
app.get('/api/pedidos/:id/recepciones', requireAuth, (req, res) => {
  const db = getDB();
  res.json(db.recepciones.filter(r => r.pedido_id == req.params.id).sort((a,b) => b.id - a.id));
});

app.post('/api/pedidos/:id/recepciones', requireAuth, (req, res) => {
  const db = getDB();
  const recep = { id: nextId(db, 'recepciones'), pedido_id: parseInt(req.params.id), ...req.body };
  db.recepciones.push(recep);
  // Update estado
  const pedido = db.pedidos.find(p => p.id == req.params.id);
  if (pedido) {
    const totalRecibido = db.recepciones.filter(r => r.pedido_id == pedido.id).reduce((s, r) => s + r.cantidad, 0);
    if (totalRecibido >= pedido.cantidad) pedido.estado = 'completo';
    else if (totalRecibido > 0) pedido.estado = 'parcial';
  }
  saveDB(db);
  const totalRecibido = db.recepciones.filter(r => r.pedido_id == req.params.id).reduce((s, r) => s + r.cantidad, 0);
  res.json({ ok: true, total_recibido: totalRecibido });
});

// ── PAGOS ─────────────────────────────────────────────────────────────────────
app.post('/api/pedidos/:id/pagos', requireAuth, (req, res) => {
  const db = getDB();
  const pago = { id: nextId(db, 'pagos'), pedido_id: parseInt(req.params.id), ...req.body };
  db.pagos.push(pago);
  const pedido = db.pedidos.find(p => p.id == req.params.id);
  if (pedido && pedido.precio_total) {
    const totalPagado = db.pagos.filter(p => p.pedido_id == pedido.id).reduce((s, p) => s + p.monto, 0);
    if (totalPagado >= pedido.precio_total) pedido.estado = 'pagado';
  }
  saveDB(db);
  res.json({ ok: true });
});

// ── COMPARADOR ────────────────────────────────────────────────────────────────
app.get('/api/comparador/:insumo_id', requireAuth, (req, res) => {
  const db = getDB();
  const pedidos = db.pedidos.filter(p => p.insumo_id == req.params.insumo_id && p.precio_unitario);
  const byProv = {};
  pedidos.sort((a,b) => b.id - a.id).forEach(p => {
    const prov = db.proveedores.find(x => x.id == p.proveedor_id);
    if (prov && !byProv[prov.id]) {
      byProv[prov.id] = { proveedor: prov.nombre, proveedor_id: prov.id, precio_unitario: p.precio_unitario, unidad: p.unidad, fecha_pedido: p.fecha_pedido };
    }
  });
  res.json(Object.values(byProv).sort((a,b) => a.precio_unitario - b.precio_unitario));
});

// ── RESUMEN ───────────────────────────────────────────────────────────────────
app.get('/api/resumen', requireAuth, (req, res) => {
  const db = getDB();
  let porPagar = 0;
  db.pedidos.forEach(p => {
    if (p.estado !== 'pagado' && p.precio_total) {
      const pagado = db.pagos.filter(x => x.pedido_id === p.id).reduce((s, x) => s + x.monto, 0);
      porPagar += Math.max(0, p.precio_total - pagado);
    }
  });
  const pendientes = db.pedidos.filter(p => ['camino','parcial'].includes(p.estado)).length;
  const sinPagar = db.pedidos.filter(p => p.estado === 'completo' && p.precio_total).length;
  const proveedores = db.proveedores.filter(p => p.activo).length;
  const ultimos = db.pedidos.slice(-5).reverse().map(p => enrichPedido(p, db));
  res.json({ porPagar, pendientes, sinPagar, proveedores, ultimos });
});

// ── STATIC ────────────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`Del'art Compras corriendo en puerto ${PORT}`));
