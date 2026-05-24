// ── STATE ────────────────────────────────────────────────────────────────────
let state = {
  usuario: null,
  pedidos: [],
  proveedores: [],
  insumos: [],
  currentPedidoFilter: 'todos'
};

// ── UTILS ─────────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const fmt = n => n ? '$' + Math.round(n).toLocaleString('es-CL') : '—';
const today = () => new Date().toISOString().split('T')[0];
const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function badgeEstado(e) {
  const map = {
    camino: ['badge-info','En camino'],
    parcial: ['badge-warn','Parcial'],
    completo: ['badge-gray','Completo'],
    pagado: ['badge-ok','Pagado'],
    pendiente: ['badge-gray','Pendiente']
  };
  const [cls, label] = map[e] || ['badge-gray', e];
  return `<span class="badge ${cls}">${label}</span>`;
}

async function api(method, url, body) {
  const opts = { method, headers: {'Content-Type':'application/json'} };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  return r.json();
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
async function init() {
  const me = await api('GET', '/api/me');
  $('loading').style.display = 'none';
  if (me.ok) {
    state.usuario = me.usuario;
    showApp();
  } else {
    $('login-screen').style.display = 'flex';
  }
}

async function doLogin() {
  const nombre = $('login-user').value.trim();
  const password = $('login-pass').value;
  const r = await api('POST', '/api/login', { nombre, password });
  if (r.ok) { state.usuario = r.usuario; $('login-screen').style.display = 'none'; showApp(); }
  else { $('login-err').style.display = 'block'; }
}

$('login-pass').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

async function doLogout() {
  await api('POST', '/api/logout');
  location.reload();
}

async function showApp() {
  $('app').style.display = 'flex';
  $('header-username').textContent = state.usuario.nombre;
  const now = new Date();
  $('resumen-mes').textContent = months[now.getMonth()] + ' ' + now.getFullYear();
  await Promise.all([loadInsumos(), loadProveedores()]);
  loadResumen();
  populateCompSelect();
}

// ── SCREENS ───────────────────────────────────────────────────────────────────
function showScreen(id, btn) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  $('screen-' + id).classList.add('active');
  btn.classList.add('active');
  if (id === 'pedidos') loadPedidos();
  if (id === 'proveedores') renderProveedores();
  if (id === 'config') renderInsumos();
  if (id === 'resumen') loadResumen();
}

// ── RESUMEN ───────────────────────────────────────────────────────────────────
async function loadResumen() {
  const d = await api('GET', '/api/resumen');
  $('resumen-metrics').innerHTML = `
    <div class="metric-card alert"><div class="metric-label">Por pagar</div><div class="metric-value">${fmt(d.porPagar)}</div></div>
    <div class="metric-card"><div class="metric-label">Pedidos activos</div><div class="metric-value" style="color:var(--brown-mid)">${d.pendientes}</div></div>
    <div class="metric-card"><div class="metric-label">Sin pagar</div><div class="metric-value" style="color:var(--red)">${d.sinPagar}</div></div>
    <div class="metric-card"><div class="metric-label">Proveedores</div><div class="metric-value" style="color:var(--text-mid)">${d.proveedores}</div></div>
  `;
  if (!d.ultimos.length) { $('resumen-list').innerHTML = '<div class="empty"><p>Sin pedidos aún. ¡Crea el primero!</p></div>'; return; }
  $('resumen-list').innerHTML = d.ultimos.map(p => pedidoCard(p)).join('');
}

// ── PEDIDOS ───────────────────────────────────────────────────────────────────
async function loadPedidos() {
  const data = await api('GET', '/api/pedidos');
  state.pedidos = data;
  renderPedidos();
}

function renderPedidos() {
  const f = state.currentPedidoFilter;
  let list = state.pedidos;
  if (f === 'mp') list = list.filter(p => p.insumo_tipo === 'mp');
  else if (f === 'pkg') list = list.filter(p => p.insumo_tipo === 'pkg');
  else if (f === 'completo') list = list.filter(p => p.estado === 'completo');
  else if (f === 'parcial') list = list.filter(p => p.estado === 'parcial');
  if (!list.length) { $('pedidos-list').innerHTML = '<div class="empty"><p>No hay pedidos aquí aún.</p></div>'; return; }
  $('pedidos-list').innerHTML = list.map(p => pedidoCard(p, true)).join('');
}

function filterPedidos(cat, btn) {
  document.querySelectorAll('#pills-pedidos .pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  state.currentPedidoFilter = cat;
  renderPedidos();
}

function pedidoCard(p, withActions = false) {
  const pct = p.cantidad > 0 ? Math.min(100, Math.round((p.recibido / p.cantidad) * 100)) : 0;
  const barColor = p.estado === 'pagado' ? 'var(--green)' : p.estado === 'completo' ? '#185FA5' : 'var(--brown-light)';
  const pendPago = p.precio_total ? p.precio_total - p.pagado : null;
  const factTag = p.nro_factura ? `<span style="font-family:'DM Mono',monospace;font-size:11px">${p.nro_factura}</span>` : '<span style="color:var(--text-light);font-size:11px">sin factura</span>';
  const acciones = withActions ? `
    <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">
      <button class="btn-ghost" onclick="openPedidoDetalle(${p.id})">Ver detalle</button>
      ${p.estado !== 'pagado' ? `<button class="btn-ghost" onclick="openRegistrarRecepcion(${p.id})">+ Recepción</button>` : ''}
      ${(p.estado === 'completo' || p.estado === 'parcial') && p.precio_total && p.pagado < p.precio_total ? `<button class="btn-ghost" onclick="openRegistrarPago(${p.id})">+ Pago</button>` : ''}
    </div>` : '';
  return `<div class="card">
    <div class="card-header">
      <div class="card-row">
        <span class="card-title">${p.insumo_nombre || '—'}</span>
        ${badgeEstado(p.estado)}
      </div>
      <span class="card-sub">${p.proveedor_nombre || '—'} · ${factTag}</span>
    </div>
    <div class="card-body">
      <div class="prog-label">
        <span>${p.recibido} / ${p.cantidad} ${p.unidad}</span>
        <span style="color:${pendPago && pendPago > 0 ? 'var(--red)' : 'var(--green)'}">
          ${p.precio_unitario ? fmt(p.precio_unitario)+'/'+p.unidad+' · ' : ''}${p.precio_total ? fmt(p.precio_total) : ''}
        </span>
      </div>
      <div class="prog-wrap"><div class="prog-bar" style="width:${pct}%;background:${barColor}"></div></div>
      ${acciones}
    </div>
  </div>`;
}

// ── DETALLE PEDIDO ────────────────────────────────────────────────────────────
async function openPedidoDetalle(id) {
  const pedido = state.pedidos.find(p => p.id === id);
  if (!pedido) return;
  const receps = await api('GET', `/api/pedidos/${id}/recepciones`);
  const pct = pedido.cantidad > 0 ? Math.min(100, Math.round((pedido.recibido / pedido.cantidad) * 100)) : 0;
  $('pedido-detalle-content').innerHTML = `
    <div class="sheet-handle"></div>
    <p class="sheet-title">${pedido.insumo_nombre}</p>
    <p class="sheet-sub">${pedido.proveedor_nombre} · ${badgeEstado(pedido.estado)}</p>

    <div class="banco-box" style="margin-bottom:14px">
      <div class="banco-row"><span class="banco-key">Cantidad pedida</span><span class="banco-val" style="font-family:'DM Sans',sans-serif">${pedido.cantidad} ${pedido.unidad}</span></div>
      <div class="banco-row"><span class="banco-key">Precio unitario</span><span class="banco-val">${pedido.precio_unitario ? fmt(pedido.precio_unitario)+'/'+pedido.unidad : '—'}</span></div>
      <div class="banco-row"><span class="banco-key">Total factura</span><span class="banco-val">${fmt(pedido.precio_total)}</span></div>
      <div class="banco-row"><span class="banco-key">Nro. factura</span><span class="banco-val" style="font-family:'DM Mono',monospace">${pedido.nro_factura || '—'}</span></div>
      <div class="banco-row"><span class="banco-key">Vencimiento</span><span class="banco-val" style="font-family:'DM Sans',sans-serif;color:${pedido.fecha_vencimiento ? 'var(--orange)' : 'inherit'}">${pedido.fecha_vencimiento || '—'}</span></div>
      <div class="banco-row" style="border:none"><span class="banco-key">Pagado</span><span class="banco-val" style="color:var(--green)">${fmt(pedido.pagado)}</span></div>
    </div>

    <div style="margin-bottom:6px">
      <div class="prog-label"><span>Recibido: ${pedido.recibido} / ${pedido.cantidad} ${pedido.unidad}</span><span>${pct}%</span></div>
      <div class="prog-wrap"><div class="prog-bar" style="width:${pct}%"></div></div>
    </div>

    <div class="section-h" style="font-size:15px">Recepciones</div>
    ${receps.length ? `<div class="receps-list">${receps.map(r => `
      <div class="recep-item">
        <span style="font-weight:500">${r.cantidad} ${pedido.unidad}</span>
        <span style="color:var(--text-mid);font-size:12px">${r.fecha}</span>
        ${r.observaciones ? `<span style="color:var(--text-light);font-size:11px">${r.observaciones}</span>` : ''}
      </div>`).join('')}</div>` : '<p style="font-size:13px;color:var(--text-light);margin-bottom:12px">Sin recepciones aún.</p>'}

    <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
      <button class="btn btn-secondary" style="flex:1" onclick="closeSheet('sheet-pedido-detalle')">Cerrar</button>
      ${pedido.estado !== 'pagado' ? `<button class="btn btn-primary" style="flex:1" onclick="closeSheet('sheet-pedido-detalle');openRegistrarRecepcion(${id})">+ Recepción</button>` : ''}
    </div>
  `;
  openSheet('sheet-pedido-detalle');
}

// ── REGISTRAR RECEPCIÓN ───────────────────────────────────────────────────────
function openRegistrarRecepcion(pedidoId) {
  const p = state.pedidos.find(x => x.id === pedidoId);
  $('pedido-detalle-content').innerHTML = `
    <div class="sheet-handle"></div>
    <p class="sheet-title">Registrar recepción</p>
    <p class="sheet-sub">${p.insumo_nombre} · ${p.proveedor_nombre}</p>
    <div style="background:#FDF9F4;border-radius:var(--radius-sm);padding:10px 13px;margin-bottom:14px;font-size:13px;color:var(--text-mid)">
      Recibido hasta ahora: <strong>${p.recibido} de ${p.cantidad} ${p.unidad}</strong>
    </div>
    <div class="form-grid">
      <div class="form-field"><label class="form-label">Cantidad recibida</label><input class="form-input" type="number" id="r-cantidad" placeholder="${p.cantidad - p.recibido}" /></div>
      <div class="form-field"><label class="form-label">Fecha recepción</label><input class="form-input" type="date" id="r-fecha" value="${today()}" /></div>
    </div>
    <div class="form-field"><label class="form-label">Observaciones</label><input class="form-input" type="text" id="r-obs" placeholder="Ej: Faltaron unidades..." /></div>
    <div class="btn-row">
      <button class="btn btn-secondary" onclick="closeSheet('sheet-pedido-detalle')">Cancelar</button>
      <button class="btn btn-primary" onclick="guardarRecepcion(${pedidoId})">Guardar recepción</button>
    </div>
  `;
  openSheet('sheet-pedido-detalle');
}

async function guardarRecepcion(pedidoId) {
  const cantidad = parseFloat($('r-cantidad').value);
  if (!cantidad || cantidad <= 0) { alert('Ingresa una cantidad válida'); return; }
  await api('POST', `/api/pedidos/${pedidoId}/recepciones`, {
    cantidad, fecha: $('r-fecha').value, observaciones: $('r-obs').value || null
  });
  closeSheet('sheet-pedido-detalle');
  await loadPedidos();
  loadResumen();
}

// ── REGISTRAR PAGO ────────────────────────────────────────────────────────────
function openRegistrarPago(pedidoId) {
  const p = state.pedidos.find(x => x.id === pedidoId);
  const prov = state.proveedores.find(x => x.id === p.proveedor_id);
  const pendiente = p.precio_total - p.pagado;
  $('pedido-detalle-content').innerHTML = `
    <div class="sheet-handle"></div>
    <p class="sheet-title">Registrar pago</p>
    <p class="sheet-sub">${p.proveedor_nombre} · ${p.nro_factura || 'sin factura'}</p>
    ${prov && prov.nro_cuenta ? `
    <div class="banco-box" style="margin-bottom:14px">
      <p style="font-size:10px;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Datos para transferencia</p>
      <div class="banco-row"><span class="banco-key">Banco</span><span class="banco-val" style="font-family:'DM Sans',sans-serif">${prov.banco || '—'}</span></div>
      <div class="banco-row"><span class="banco-key">Tipo cuenta</span><span class="banco-val" style="font-family:'DM Sans',sans-serif">${prov.tipo_cuenta || '—'}</span></div>
      <div class="banco-row">
        <span class="banco-key">Nro. cuenta</span>
        <div style="display:flex;align-items:center;gap:6px">
          <span class="banco-val">${prov.nro_cuenta}</span>
          <button class="copy-btn" onclick="copiar(this,'${prov.nro_cuenta}')">Copiar</button>
        </div>
      </div>
      <div class="banco-row" style="border:none">
        <span class="banco-key">RUT titular</span>
        <div style="display:flex;align-items:center;gap:6px">
          <span class="banco-val">${prov.rut_cuenta || '—'}</span>
          ${prov.rut_cuenta ? `<button class="copy-btn" onclick="copiar(this,'${prov.rut_cuenta}')">Copiar</button>` : ''}
        </div>
      </div>
    </div>` : ''}
    <div class="form-grid">
      <div class="form-field"><label class="form-label">Monto a pagar (CLP)</label><input class="form-input" type="number" id="pg-monto" value="${pendiente}" /></div>
      <div class="form-field"><label class="form-label">Fecha de pago</label><input class="form-input" type="date" id="pg-fecha" value="${today()}" /></div>
    </div>
    <div class="form-field"><label class="form-label">Nro. transferencia (opcional)</label><input class="form-input" type="text" id="pg-nro" placeholder="202605XXXXXX" /></div>
    <div class="btn-row">
      <button class="btn btn-secondary" onclick="closeSheet('sheet-pedido-detalle')">Cancelar</button>
      <button class="btn btn-primary" onclick="guardarPago(${pedidoId})">✓ Confirmar pago</button>
    </div>
  `;
  openSheet('sheet-pedido-detalle');
}

async function guardarPago(pedidoId) {
  const monto = parseFloat($('pg-monto').value);
  if (!monto || monto <= 0) { alert('Ingresa un monto válido'); return; }
  await api('POST', `/api/pedidos/${pedidoId}/pagos`, {
    monto, fecha: $('pg-fecha').value, nro_transferencia: $('pg-nro').value || null
  });
  closeSheet('sheet-pedido-detalle');
  await loadPedidos();
  loadResumen();
}

// ── PROVEEDORES ───────────────────────────────────────────────────────────────
async function loadProveedores() {
  state.proveedores = await api('GET', '/api/proveedores');
}

function renderProveedores(filter = 'todos', search = '') {
  let list = state.proveedores;
  if (filter !== 'todos') list = list.filter(p => p.tipo === filter);
  if (search) {
    const q = search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    list = list.filter(p => (p.nombre+' '+p.contacto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q));
  }
  const mp = list.filter(p => p.tipo === 'mp');
  const pkg = list.filter(p => p.tipo === 'pkg');
  let html = '';
  if (filter === 'todos' || filter === 'mp') {
    if (mp.length) html += `<div class="cat-div">Materias primas</div>` + mp.map(provCard).join('');
  }
  if (filter === 'todos' || filter === 'pkg') {
    if (pkg.length) html += `<div class="cat-div">Packaging</div>` + pkg.map(provCard).join('');
  }
  $('proveedores-list').innerHTML = html || '<div class="empty"><p>No hay proveedores aquí.</p></div>';
}

function provCard(p) {
  const ini = p.nombre.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase();
  const cls = p.tipo === 'mp' ? 'avatar-mp' : 'avatar-pkg';
  return `<div class="card" onclick="openFicha(${p.id})" style="cursor:pointer">
    <div class="card-header" style="display:flex;gap:11px;align-items:center;padding-bottom:8px">
      <div class="avatar ${cls}">${ini}</div>
      <div style="flex:1">
        <div class="card-row" style="margin-bottom:1px">
          <span class="card-title">${p.nombre}</span>
          <span class="badge ${p.tipo === 'mp' ? 'badge-mp' : 'badge-pkg'}" style="font-size:9px">${p.tipo === 'mp' ? 'Mat. prima' : 'Packaging'}</span>
        </div>
        <span class="card-sub">${p.contacto || ''}${p.banco ? ' · ' + p.banco : ''}</span>
      </div>
      <svg width="14" height="14" fill="none" stroke="var(--text-light)" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
    </div>
  </div>`;
}

function searchProveedores(q) { renderProveedores(state.provFilter || 'todos', q); }
function filterProveedores(f, btn) {
  document.querySelectorAll('#pills-prov .pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  state.provFilter = f;
  renderProveedores(f);
}

function openFicha(id) {
  const p = state.proveedores.find(x => x.id === id);
  if (!p) return;
  const ini = p.nombre.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase();
  $('ficha-content').innerHTML = `
    <div class="sheet-handle"></div>
    <div style="display:flex;align-items:center;gap:13px;margin-bottom:18px">
      <div class="avatar ${p.tipo === 'mp' ? 'avatar-mp' : 'avatar-pkg'}" style="width:46px;height:46px;font-size:14px">${ini}</div>
      <div>
        <p style="font-family:'DM Serif Display',serif;font-size:20px;color:var(--brown)">${p.nombre}</p>
        <span class="badge ${p.tipo === 'mp' ? 'badge-mp' : 'badge-pkg'}">${p.tipo === 'mp' ? 'Materia prima' : 'Packaging'}</span>
      </div>
    </div>

    <div class="form-section-title" style="margin-bottom:9px">👤 Contacto</div>
    <div class="banco-box" style="margin-bottom:14px">
      ${p.contacto ? `<div class="banco-row"><span class="banco-key">Nombre</span><span>${p.contacto}</span></div>` : ''}
      ${p.telefono ? `<div class="banco-row"><span class="banco-key">Teléfono</span><span>${p.telefono}</span></div>` : ''}
      ${p.email ? `<div class="banco-row"><span class="banco-key">Email</span><span style="color:#1A5FB4;font-size:12px">${p.email}</span></div>` : ''}
      ${p.rut ? `<div class="banco-row"><span class="banco-key">RUT</span><span class="banco-val">${p.rut}</span></div>` : ''}
      ${p.pago_condicion ? `<div class="banco-row" style="border:none"><span class="banco-key">Pago habitual</span><span>${p.pago_condicion}</span></div>` : '<div class="banco-row" style="border:none"><span class="banco-key" style="color:var(--text-light)">Sin datos de contacto</span></div>'}
    </div>

    ${p.nro_cuenta ? `
    <div class="form-section-title" style="margin-bottom:9px">🏦 Datos para transferencia</div>
    <div class="banco-box" style="margin-bottom:14px">
      ${p.banco ? `<div class="banco-row"><span class="banco-key">Banco</span><span>${p.banco}</span></div>` : ''}
      ${p.tipo_cuenta ? `<div class="banco-row"><span class="banco-key">Tipo cuenta</span><span>${p.tipo_cuenta}</span></div>` : ''}
      <div class="banco-row">
        <span class="banco-key">Nro. cuenta</span>
        <div style="display:flex;align-items:center;gap:6px">
          <span class="banco-val">${p.nro_cuenta}</span>
          <button class="copy-btn" onclick="copiar(this,'${p.nro_cuenta}')">Copiar</button>
        </div>
      </div>
      ${p.rut_cuenta ? `<div class="banco-row"><span class="banco-key">RUT titular</span><div style="display:flex;align-items:center;gap:6px"><span class="banco-val">${p.rut_cuenta}</span><button class="copy-btn" onclick="copiar(this,'${p.rut_cuenta}')">Copiar</button></div></div>` : ''}
      ${p.email_comprobante ? `<div class="banco-row" style="border:none"><span class="banco-key">Email comprobante</span><div style="display:flex;align-items:center;gap:6px"><span style="font-size:11px;color:#1A5FB4">${p.email_comprobante}</span><button class="copy-btn" onclick="copiar(this,'${p.email_comprobante}')">Copiar</button></div></div>` : ''}
    </div>` : ''}

    ${p.notas ? `<div class="form-section-title" style="margin-bottom:9px">📝 Notas</div>
    <div style="background:#FDF9F4;border-radius:var(--radius-sm);padding:11px 13px;font-size:13px;color:var(--text-mid);margin-bottom:14px">${p.notas}</div>` : ''}

    <div class="btn-row">
      <button class="btn btn-secondary" onclick="closeSheet('sheet-ficha');openNuevoProveedor(${p.id})">Editar</button>
      <button class="btn btn-primary" onclick="closeSheet('sheet-ficha');openNuevoPedido(${p.id})">Nuevo pedido ↗</button>
    </div>
    <button class="btn btn-secondary" style="width:100%;margin-top:8px" onclick="closeSheet('sheet-ficha')">Cerrar</button>
  `;
  openSheet('sheet-ficha');
}

function openNuevoProveedor(editId) {
  const fields = ['nombre','tipo','contacto','telefono','email','rut','pago_condicion','banco','tipo_cuenta','nro_cuenta','rut_cuenta','email_comprobante','notas'];
  fields.forEach(f => {
    const el = $('prov-' + f.replace('_','-').replace('_','-'));
    if (el) el.value = '';
  });
  $('prov-edit-id').value = '';
  $('prov-sheet-title').textContent = 'Agregar proveedor';
  if (editId) {
    const p = state.proveedores.find(x => x.id === editId);
    if (p) {
      $('prov-edit-id').value = p.id;
      $('prov-sheet-title').textContent = 'Editar proveedor';
      $('prov-nombre').value = p.nombre || '';
      $('prov-tipo').value = p.tipo || '';
      $('prov-contacto').value = p.contacto || '';
      $('prov-tel').value = p.telefono || '';
      $('prov-email').value = p.email || '';
      $('prov-rut').value = p.rut || '';
      $('prov-pago').value = p.pago_condicion || '';
      $('prov-banco').value = p.banco || '';
      $('prov-tipo-cuenta').value = p.tipo_cuenta || '';
      $('prov-nro-cuenta').value = p.nro_cuenta || '';
      $('prov-rut-cuenta').value = p.rut_cuenta || '';
      $('prov-email-comp').value = p.email_comprobante || '';
      $('prov-notas').value = p.notas || '';
    }
  }
  openSheet('sheet-proveedor');
}

async function guardarProveedor() {
  const nombre = $('prov-nombre').value.trim();
  const tipo = $('prov-tipo').value;
  if (!nombre || !tipo) { alert('Nombre y tipo son obligatorios'); return; }
  const body = {
    nombre, tipo,
    contacto: $('prov-contacto').value,
    telefono: $('prov-tel').value,
    email: $('prov-email').value,
    rut: $('prov-rut').value,
    pago_condicion: $('prov-pago').value,
    banco: $('prov-banco').value,
    tipo_cuenta: $('prov-tipo-cuenta').value,
    nro_cuenta: $('prov-nro-cuenta').value,
    rut_cuenta: $('prov-rut-cuenta').value,
    email_comprobante: $('prov-email-comp').value,
    notas: $('prov-notas').value
  };
  const editId = $('prov-edit-id').value;
  if (editId) await api('PUT', `/api/proveedores/${editId}`, body);
  else await api('POST', '/api/proveedores', body);
  closeSheet('sheet-proveedor');
  await loadProveedores();
  renderProveedores();
  populateProvSelect();
}

// ── INSUMOS ───────────────────────────────────────────────────────────────────
async function loadInsumos() {
  state.insumos = await api('GET', '/api/insumos');
  populateInsumoSelect();
  populateCompSelect();
}

function renderInsumos(filter = 'todos') {
  let list = state.insumos;
  if (filter !== 'todos') list = list.filter(i => i.tipo === filter);
  const mp = list.filter(i => i.tipo === 'mp');
  const pkg = list.filter(i => i.tipo === 'pkg');
  let html = '';
  if (filter === 'todos' || filter === 'mp') {
    if (mp.length) html += `<div class="cat-div">Materias primas</div>` + mp.map(insumoRow).join('');
  }
  if (filter === 'todos' || filter === 'pkg') {
    if (pkg.length) html += `<div class="cat-div">Packaging</div>` + pkg.map(insumoRow).join('');
  }
  $('insumos-list').innerHTML = html || '<div class="empty"><p>No hay insumos. ¡Agrega el primero!</p></div>';
}

function insumoRow(i) {
  return `<div class="card" style="margin-bottom:8px">
    <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;padding-bottom:10px">
      <div>
        <span class="card-title">${i.nombre}</span>
        <div style="margin-top:2px"><span class="tag">${i.unidad}</span><span class="badge ${i.tipo === 'mp' ? 'badge-mp' : 'badge-pkg'}" style="font-size:9px;margin-left:4px">${i.tipo === 'mp' ? 'Mat. prima' : 'Packaging'}</span></div>
      </div>
      <button class="btn-ghost" onclick="openNuevoInsumo(${i.id})">Editar</button>
    </div>
  </div>`;
}

function filterInsumos(f, btn) {
  document.querySelectorAll('#pills-ins .pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  renderInsumos(f);
}

function openNuevoInsumo(editId) {
  $('ins-edit-id').value = '';
  $('ins-nombre').value = '';
  $('ins-tipo').value = '';
  $('ins-unidad').value = 'kg';
  $('ins-sheet-title').textContent = 'Agregar insumo';
  if (editId) {
    const i = state.insumos.find(x => x.id === editId);
    if (i) {
      $('ins-edit-id').value = i.id;
      $('ins-sheet-title').textContent = 'Editar insumo';
      $('ins-nombre').value = i.nombre;
      $('ins-tipo').value = i.tipo;
      $('ins-unidad').value = i.unidad;
    }
  }
  openSheet('sheet-insumo');
}

async function guardarInsumo() {
  const nombre = $('ins-nombre').value.trim();
  const tipo = $('ins-tipo').value;
  const unidad = $('ins-unidad').value;
  if (!nombre || !tipo) { alert('Nombre y tipo son obligatorios'); return; }
  const editId = $('ins-edit-id').value;
  if (editId) await api('PUT', `/api/insumos/${editId}`, { nombre, tipo, unidad });
  else await api('POST', '/api/insumos', { nombre, tipo, unidad });
  closeSheet('sheet-insumo');
  await loadInsumos();
  renderInsumos();
}

// ── NUEVO PEDIDO ──────────────────────────────────────────────────────────────
function populateInsumoSelect() {
  const sel = $('p-insumo');
  const mp = state.insumos.filter(i => i.tipo === 'mp');
  const pkg = state.insumos.filter(i => i.tipo === 'pkg');
  sel.innerHTML = '<option value="">— Selecciona insumo —</option>';
  if (mp.length) { const g = document.createElement('optgroup'); g.label = 'Materias primas'; mp.forEach(i => { const o = document.createElement('option'); o.value = i.id; o.textContent = i.nombre; o.dataset.unidad = i.unidad; g.appendChild(o); }); sel.appendChild(g); }
  if (pkg.length) { const g = document.createElement('optgroup'); g.label = 'Packaging'; pkg.forEach(i => { const o = document.createElement('option'); o.value = i.id; o.textContent = i.nombre; o.dataset.unidad = i.unidad; g.appendChild(o); }); sel.appendChild(g); }
}

function populateProvSelect(proveedorId = null) {
  const sel = $('p-proveedor');
  const mp = state.proveedores.filter(p => p.tipo === 'mp');
  const pkg = state.proveedores.filter(p => p.tipo === 'pkg');
  sel.innerHTML = '<option value="">— Selecciona proveedor —</option>';
  if (mp.length) { const g = document.createElement('optgroup'); g.label = 'Materias primas'; mp.forEach(p => { const o = document.createElement('option'); o.value = p.id; o.textContent = p.nombre; g.appendChild(o); }); sel.appendChild(g); }
  if (pkg.length) { const g = document.createElement('optgroup'); g.label = 'Packaging'; pkg.forEach(p => { const o = document.createElement('option'); o.value = p.id; o.textContent = p.nombre; g.appendChild(o); }); sel.appendChild(g); }
  if (proveedorId) sel.value = proveedorId;
}

function onInsumoChange() {
  const sel = $('p-insumo');
  const opt = sel.options[sel.selectedIndex];
  const unidad = opt.dataset.unidad || 'kg';
  $('p-unidad').value = unidad;
  $('p-unidad-label').textContent = unidad;
}

function openNuevoPedido(proveedorId = null) {
  pedidoStep(1);
  $('p-insumo').value = '';
  $('p-cantidad').value = '';
  $('p-unidad').value = '';
  $('p-notas').value = '';
  $('p-nro-fact').value = '';
  $('p-precio-unit').value = '';
  $('p-precio-total').value = '';
  $('p-fecha').value = today();
  $('p-entrega').value = '';
  $('p-fecha-fact').value = today();
  populateProvSelect(proveedorId);
  openSheet('sheet-pedido');
}

function pedidoStep(n) {
  ['ps1','ps2','ps3','ps4','ps-ok'].forEach(id => { const el = $(id); if(el) el.style.display = 'none'; });
  const target = n === 'ok' ? 'ps-ok' : 'ps' + n;
  $(target).style.display = 'block';
}

function toggleFactura(v) {
  $('campos-factura').style.display = v === 'si' ? 'block' : 'none';
  $('sin-factura-msg').style.display = v === 'no' ? 'block' : 'none';
}

function toggleRecepFields(v) {
  $('recep-fields').style.display = v === 'nada' ? 'none' : 'block';
  if (v === 'completo') {
    $('p-cant-recep').value = $('p-cantidad').value;
    updateRecepProg();
  }
}

function updateRecepProg() {
  const cant = parseFloat($('p-cantidad').value) || 0;
  const recep = parseFloat($('p-cant-recep').value) || 0;
  const pct = cant > 0 ? Math.min(100, Math.round(recep/cant*100)) : 0;
  $('recep-prog-bar').style.width = pct + '%';
  $('recep-prog-label').textContent = recep + ' / ' + cant + ' ' + ($('p-unidad').value || '');
}

function togglePagoFields(v) {
  $('pago-fields').style.display = v === 'pagado' ? 'block' : 'none';
  if (v === 'pagado') {
    $('p-fecha-pago').value = today();
    $('p-monto-pago').value = $('p-precio-total').value;
  }
}

function calcTotal() {
  const unit = parseFloat($('p-precio-unit').value);
  const cant = parseFloat($('p-cantidad').value);
  if (unit && cant) $('p-precio-total').value = Math.round(unit * cant);
}

function calcUnit() {
  const total = parseFloat($('p-precio-total').value);
  const cant = parseFloat($('p-cantidad').value);
  if (total && cant) $('p-precio-unit').value = Math.round(total / cant);
}

async function guardarPedido() {
  const insumo_id = $('p-insumo').value;
  const proveedor_id = $('p-proveedor').value;
  const cantidad = parseFloat($('p-cantidad').value);
  if (!insumo_id || !proveedor_id || !cantidad) { alert('Completa insumo, proveedor y cantidad'); return; }

  const body = {
    insumo_id, proveedor_id, cantidad,
    unidad: $('p-unidad').value || 'kg',
    precio_unitario: parseFloat($('p-precio-unit').value) || null,
    precio_total: parseFloat($('p-precio-total').value) || null,
    fecha_pedido: $('p-fecha').value,
    fecha_entrega_estimada: $('p-entrega').value || null,
    nro_factura: $('p-nro-fact').value || null,
    fecha_factura: $('p-fecha-fact').value || null,
    fecha_vencimiento: $('p-vence').value || null,
    notas: $('p-notas').value || null
  };
  const r = await api('POST', '/api/pedidos', body);

  // Recepción inicial si aplica
  const estadoRecep = $('p-estado-recep').value;
  if (estadoRecep !== 'nada') {
    const cantRecep = estadoRecep === 'completo' ? cantidad : (parseFloat($('p-cant-recep').value) || null);
    if (cantRecep) {
      await api('POST', `/api/pedidos/${r.id}/recepciones`, {
        cantidad: cantRecep,
        fecha: $('p-fecha-recep').value || today(),
        observaciones: $('p-obs-recep').value || null
      });
    }
  }

  // Pago inicial si aplica
  const estadoPago = document.querySelector('#ps4 select').value;
  if (estadoPago === 'pagado') {
    const montoPago = parseFloat($('p-monto-pago').value);
    if (montoPago) {
      await api('POST', `/api/pedidos/${r.id}/pagos`, {
        monto: montoPago,
        fecha: $('p-fecha-pago').value || today(),
        nro_transferencia: $('p-nro-transfer').value || null
      });
    }
  }

  pedidoStep('ok');
  await loadPedidos();
  loadResumen();
  populateCompSelect();
}

// ── COMPARADOR ────────────────────────────────────────────────────────────────
function populateCompSelect() {
  const sel = $('comp-select');
  if (!sel) return;
  const mp = state.insumos.filter(i => i.tipo === 'mp');
  const pkg = state.insumos.filter(i => i.tipo === 'pkg');
  sel.innerHTML = '<option value="">— Selecciona —</option>';
  if (mp.length) { const g = document.createElement('optgroup'); g.label = 'Materias primas'; mp.forEach(i => { const o = document.createElement('option'); o.value = i.id; o.textContent = i.nombre; g.appendChild(o); }); sel.appendChild(g); }
  if (pkg.length) { const g = document.createElement('optgroup'); g.label = 'Packaging'; pkg.forEach(i => { const o = document.createElement('option'); o.value = i.id; o.textContent = i.nombre; g.appendChild(o); }); sel.appendChild(g); }
}

async function loadComparador(insumoId) {
  if (!insumoId) { $('comp-result').innerHTML = ''; return; }
  const data = await api('GET', `/api/comparador/${insumoId}`);
  const ins = state.insumos.find(i => i.id == insumoId);
  if (!data.length) {
    $('comp-result').innerHTML = '<div class="empty"><p>Aún no hay pedidos con precio para este insumo. Cuando registres pedidos con precio, aparecerán aquí automáticamente.</p></div>';
    return;
  }
  const clases = ['price-best','price-mid','price-high'];
  $('comp-result').innerHTML = `
    <div class="card" style="padding:0;overflow:hidden">
      <table class="comp-table">
        <thead><tr><th>Proveedor</th><th>Precio/${ins?.unidad||'u'}</th><th>Último pedido</th><th></th></tr></thead>
        <tbody>
          ${data.map((r,i) => `<tr>
            <td style="font-weight:500">${r.proveedor}</td>
            <td class="${clases[i]||'price-high'}">${fmt(r.precio_unitario)}</td>
            <td style="color:var(--text-light);font-size:12px">${r.fecha_pedido||'—'}</td>
            <td>${i===0?'<span class="badge badge-ok" style="font-size:9px">+ barato</span>':''}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    ${data.length >= 2 ? `<div class="ahorro-box">💡 Si pides 50 ${ins?.unidad||'u'} a <strong>${data[0].proveedor}</strong> en vez de <strong>${data[1].proveedor}</strong>, ahorras <strong>${fmt((data[1].precio_unitario - data[0].precio_unitario)*50)}</strong>.</div>` : ''}
  `;
}

// ── SHEETS ────────────────────────────────────────────────────────────────────
function openSheet(id) { $(id).classList.add('open'); }
function closeSheet(id) { $(id).classList.remove('open'); }

document.querySelectorAll('.sheet-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
});

// ── COPY ──────────────────────────────────────────────────────────────────────
function copiar(btn, texto) {
  navigator.clipboard.writeText(texto).catch(()=>{});
  btn.textContent = '✓';
  btn.classList.add('copied');
  setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('copied'); }, 1500);
}

// ── BOOT ──────────────────────────────────────────────────────────────────────
init();
