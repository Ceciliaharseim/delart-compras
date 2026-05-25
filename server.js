const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'delart-db.json');

// Middleware
app.use(express.json());
app.use(express.static(__dirname));
app.use(session({
  secret: process.env.SESSION_SECRET || 'delart-chocolat-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

// DB helpers
function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return getDefaultDB();
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function getDefaultDB() {
  return {
    users: [
    { id: 1, nombre: 'Cecilia', password: 'compras2026', rol: 'admin' },
{ id: 2, nombre: 'Josefina', password: 'compras2026', rol: 'usuario' }
    ],
    proveedores: [
      { id: 1, nombre: 'CacaoChile', tipo: 'mp', contacto: 'Jorge Pérez', telefono: '+56 9 8812 3456', email: 'contacto@cacaochile.cl', rut: '76.543.210-8', productos: 'Cacao en polvo, Manteca de cacao, Licor de cacao', pago: '30 días', banco: 'Banco de Chile', tipoCuenta: 'Cuenta corriente', numeroCuenta: '00-123-45678-09', rutCuenta: '76.543.210-8', emailTransferencia: 'pagos@cacaochile.cl', notas: 'Despacha martes y jueves. Pedido mínimo 20 kg.', activo: true },
      { id: 2, nombre: 'Comercial Norte', tipo: 'mp', contacto: 'Ana González', telefono: '+56 9 7723 9900', email: 'ana@comercialnorte.cl', rut: '77.123.456-9', productos: 'Azúcar rubia, Harina, Sal', pago: '30 días', banco: 'BancoEstado', tipoCuenta: 'Cuenta corriente', numeroCuenta: '12345678', rutCuenta: '77.123.456-9', emailTransferencia: 'pagos@comercialnorte.cl', notas: '', activo: true },
      { id: 3, nombre: 'LácteosRM', tipo: 'mp', contacto: 'Mario Silva', telefono: '+56 9 9900 1122', email: 'mario@lacteosrm.cl', rut: '78.234.567-0', productos: 'Leche en polvo, Crema, Mantequilla', pago: '60 días', banco: 'Santander', tipoCuenta: 'Cuenta corriente', numeroCuenta: '87654321', rutCuenta: '78.234.567-0', emailTransferencia: 'pagos@lacteosrm.cl', notas: '', activo: true },
      { id: 4, nombre: 'Packaging Express', tipo: 'pkg', contacto: 'Valentina Rojas', telefono: '+56 9 6644 2211', email: 'ventas@packexp.cl', rut: '79.345.678-1', productos: 'Cajas kraft 100g, Cinta satinada, Bolsas celofán', pago: '30 días', banco: 'BCI', tipoCuenta: 'Cuenta corriente', numeroCuenta: '11223344', rutCuenta: '79.345.678-1', emailTransferencia: 'pagos@packexp.cl', notas: 'Pedido mínimo $50.000', activo: true }
    ],
    insumos: [
      { id: 1, nombre: 'Cacao en polvo', tipo: 'mp', unidad: 'kg', activo: true },
      { id: 2, nombre: 'Manteca de cacao', tipo: 'mp', unidad: 'kg', activo: true },
      { id: 3, nombre: 'Licor de cacao', tipo: 'mp', unidad: 'kg', activo: true },
      { id: 4, nombre: 'Azúcar rubia', tipo: 'mp', unidad: 'kg', activo: true },
      { id: 5, nombre: 'Leche en polvo', tipo: 'mp', unidad: 'kg', activo: true },
      { id: 6, nombre: 'Mantequilla', tipo: 'mp', unidad: 'kg', activo: true },
      { id: 7, nombre: 'Cajas kraft 100g', tipo: 'pkg', unidad: 'unidades', activo: true },
      { id: 8, nombre: 'Cinta satinada', tipo: 'pkg', unidad: 'rollos', activo: true },
      { id: 9, nombre: 'Bolsas celofán', tipo: 'pkg', unidad: 'unidades', activo: true }
    ],
    pedidos: [
      { id: 1, insumoId: 1, insumoNombre: 'Cacao en polvo', proveedorId: 1, proveedorNombre: 'CacaoChile', tipo: 'mp', cantidad: 50, unidad: 'kg', precioUnitario: 6400, precioTotal: 320000, fecha: '2026-05-08', entregaEstimada: '2026-05-15', nroFactura: 'F-2026-0312', montoFactura: 320000, fechaFactura: '2026-05-08', fechaVence: '2026-06-07', estado: 'parcial', estadoPago: 'pendiente', cantidadRecibida: 35, recepciones: [{ fecha: '2026-05-12', cantidad: 35, obs: 'Faltan 15 kg, llegan próxima semana' }], pagos: [], notas: '' },
      { id: 2, insumoId: 7, insumoNombre: 'Cajas kraft 100g', proveedorId: 4, proveedorNombre: 'Packaging Express', tipo: 'pkg', cantidad: 500, unidad: 'unidades', precioUnitario: 374, precioTotal: 187000, fecha: '2026-05-08', entregaEstimada: '2026-05-12', nroFactura: 'F-2026-0289', montoFactura: 187000, fechaFactura: '2026-05-08', fechaVence: '2026-05-24', estado: 'completo', estadoPago: 'pendiente', cantidadRecibida: 500, recepciones: [{ fecha: '2026-05-10', cantidad: 500, obs: '' }], pagos: [], notas: '' },
      { id: 3, insumoId: 4, insumoNombre: 'Azúcar rubia', proveedorId: 2, proveedorNombre: 'Comercial Norte', tipo: 'mp', cantidad: 100, unidad: 'kg', precioUnitario: 2972, precioTotal: 297200, fecha: '2026-05-01', entregaEstimada: '2026-05-05', nroFactura: 'F-2026-0271', montoFactura: 297200, fechaFactura: '2026-05-01', fechaVence: '2026-05-31', estado: 'completo', estadoPago: 'pagado', cantidadRecibida: 100, recepciones: [{ fecha: '2026-05-05', cantidad: 100, obs: '' }], pagos: [{ fecha: '2026-05-15', monto: 297200, nroTransferencia: '20260515001' }], notas: '' },
      { id: 4, insumoId: 5, insumoNombre: 'Leche en polvo', proveedorId: 3, proveedorNombre: 'LácteosRM', tipo: 'mp', cantidad: 30, unidad: 'kg', precioUnitario: 6900, precioTotal: 207000, fecha: '2026-05-10', entregaEstimada: '2026-05-18', nroFactura: null, montoFactura: null, fechaFactura: null, fechaVence: null, estado: 'camino', estadoPago: 'pendiente', cantidadRecibida: 0, recepciones: [], pagos: [], notas: '' }
    ]
  };
}

// Auth middleware
function auth(req, res, next) {
  if (req.session.user) return next();
  res.status(401).json({ error: 'No autorizado' });
}

// Init DB
if (!fs.existsSync(DB_PATH)) writeDB(getDefaultDB());

// AUTH
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  req.session.user = { id: user.id, nombre: user.nombre, role: user.role };
  res.json({ ok: true, user: req.session.user });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'No autorizado' });
  res.json(req.session.user);
});

// PROVEEDORES
app.get('/api/proveedores', auth, (req, res) => {
  const db = readDB();
  res.json(db.proveedores.filter(p => p.activo));
});

app.post('/api/proveedores', auth, (req, res) => {
  const db = readDB();
  const nuevo = { id: Date.now(), activo: true, ...req.body };
  db.proveedores.push(nuevo);
  writeDB(db);
  res.json(nuevo);
});

app.put('/api/proveedores/:id', auth, (req, res) => {
  const db = readDB();
  const idx = db.proveedores.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
  db.proveedores[idx] = { ...db.proveedores[idx], ...req.body };
  writeDB(db);
  res.json(db.proveedores[idx]);
});

app.delete('/api/proveedores/:id', auth, (req, res) => {
  const db = readDB();
  const idx = db.proveedores.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
  db.proveedores[idx].activo = false;
  writeDB(db);
  res.json({ ok: true });
});

// INSUMOS
app.get('/api/insumos', auth, (req, res) => {
  const db = readDB();
  res.json(db.insumos.filter(i => i.activo));
});

app.post('/api/insumos', auth, (req, res) => {
  const db = readDB();
  const nuevo = { id: Date.now(), activo: true, ...req.body };
  db.insumos.push(nuevo);
  writeDB(db);
  res.json(nuevo);
});

app.put('/api/insumos/:id', auth, (req, res) => {
  const db = readDB();
  const idx = db.insumos.findIndex(i => i.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
  db.insumos[idx] = { ...db.insumos[idx], ...req.body };
  writeDB(db);
  res.json(db.insumos[idx]);
});

app.delete('/api/insumos/:id', auth, (req, res) => {
  const db = readDB();
  const idx = db.insumos.findIndex(i => i.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
  db.insumos[idx].activo = false;
  writeDB(db);
  res.json({ ok: true });
});

// PEDIDOS
app.get('/api/pedidos', auth, (req, res) => {
  const db = readDB();
  res.json(db.pedidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
});

app.post('/api/pedidos', auth, (req, res) => {
  const db = readDB();
  const nuevo = { id: Date.now(), cantidadRecibida: 0, recepciones: [], pagos: [], estado: 'camino', estadoPago: 'pendiente', ...req.body };
  db.pedidos.push(nuevo);
  writeDB(db);
  res.json(nuevo);
});

app.put('/api/pedidos/:id', auth, (req, res) => {
  const db = readDB();
  const idx = db.pedidos.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
  db.pedidos[idx] = { ...db.pedidos[idx], ...req.body };
  writeDB(db);
  res.json(db.pedidos[idx]);
});

// RECEPCION
app.post('/api/pedidos/:id/recepciones', auth, (req, res) => {
  const db = readDB();
  const idx = db.pedidos.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
  const ped = db.pedidos[idx];
  const recep = { fecha: req.body.fecha, cantidad: Number(req.body.cantidad), obs: req.body.obs || '' };
  ped.recepciones.push(recep);
  ped.cantidadRecibida = ped.recepciones.reduce((s, r) => s + r.cantidad, 0);
  if (ped.cantidadRecibida >= ped.cantidad) ped.estado = 'completo';
  else if (ped.cantidadRecibida > 0) ped.estado = 'parcial';
  else ped.estado = 'camino';
  writeDB(db);
  res.json(ped);
});

// PAGO
app.post('/api/pedidos/:id/pagos', auth, (req, res) => {
  const db = readDB();
  const idx = db.pedidos.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
  const ped = db.pedidos[idx];
  ped.pagos.push({ fecha: req.body.fecha, monto: Number(req.body.monto), nroTransferencia: req.body.nroTransferencia || '' });
  const totalPagado = ped.pagos.reduce((s, p) => s + p.monto, 0);
  if (totalPagado >= (ped.montoFactura || ped.precioTotal)) ped.estadoPago = 'pagado';
  else ped.estadoPago = 'parcial';
  writeDB(db);
  res.json(ped);
});

// COMPARADOR
app.get('/api/comparador', auth, (req, res) => {
  const db = readDB();
  const result = {};
  db.pedidos.filter(p => p.precioUnitario).forEach(p => {
    const key = p.insumoNombre;
    if (!result[key]) result[key] = { insumo: key, unidad: p.unidad, precios: [] };
    const existing = result[key].precios.find(x => x.proveedorNombre === p.proveedorNombre);
    if (!existing || new Date(p.fecha) > new Date(existing.fecha)) {
      if (existing) {
        existing.precio = p.precioUnitario;
        existing.fecha = p.fecha;
      } else {
        result[key].precios.push({ proveedorNombre: p.proveedorNombre, precio: p.precioUnitario, fecha: p.fecha });
      }
    }
  });
  res.json(Object.values(result));
});

// RESUMEN
app.get('/api/resumen', auth, (req, res) => {
  const db = readDB();
  const pedidos = db.pedidos;
  const hoy = new Date();
  const porPagar = pedidos.filter(p => p.estadoPago !== 'pagado' && p.nroFactura)
    .reduce((s, p) => s + ((p.montoFactura || p.precioTotal) - p.pagos.reduce((ps, pg) => ps + pg.monto, 0)), 0);
  const activos = pedidos.filter(p => p.estado !== 'completo' || p.estadoPago !== 'pagado').length;
  const sinPagar = pedidos.filter(p => p.estadoPago === 'pendiente' && p.nroFactura).length;
  const vencenProximo = pedidos.filter(p => {
    if (!p.fechaVence || p.estadoPago === 'pagado') return false;
    const diff = (new Date(p.fechaVence) - hoy) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }).length;
  res.json({ porPagar, activos, sinPagar, vencenProximo, proveedores: db.proveedores.filter(p => p.activo).length });
});

app.listen(PORT, () => console.log(`Del'art Compras corriendo en puerto ${PORT}`));

// Catch-all: serve index.html for any unmatched route
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
