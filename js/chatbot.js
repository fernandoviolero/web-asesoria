/* AGEgrupo Asesor — asistente informativo (sin API, funciona 100% en el navegador) */
(function () {
  'use strict';

  /* ───────── Datos de la gestoría ───────── */
  const DATA = {
    nombre: 'José Fernando Violero Flores',
    marca: 'AGEgrupo Asesor',
    tel: '667 576 959',
    telHref: 'tel:667576959',
    wa: 'https://wa.me/34667576959?text=' + encodeURIComponent('Hola José Fernando, vengo de la web y me gustaría hacer una consulta.'),
    email: 'jf.grupoasesor@gmail.com',
    direccion: 'C/ Paloma, 29 · 13610 Campo de Criptana (Ciudad Real)',
    maps: 'https://maps.google.com/?q=Calle+Paloma+29,+Campo+de+Criptana,+Ciudad+Real',
    linkedin: 'https://www.linkedin.com/in/fernando-violero-05987385',
    horario: 'Lunes a viernes, de 09:00 a 14:00 y de 16:00 a 19:00.'
  };

  const A = {
    call: { label: 'Llamar ' + DATA.tel, href: DATA.telHref, cls: 'is-primary' },
    wa: { label: 'WhatsApp', href: DATA.wa, cls: 'is-wa', ext: true },
    mail: { label: 'Email', href: 'mailto:' + DATA.email },
    maps: { label: 'Cómo llegar', href: DATA.maps, ext: true },
    li: { label: 'LinkedIn', href: DATA.linkedin, ext: true },
    services: { label: 'Ver servicios', href: '#servicios', internal: true }
  };

  /* ───────── Intenciones ─────────
     kw: raíces de palabras (sin tildes). Se puntúa cuántas aparecen.
     reply: función o string con HTML sencillo. */
  const INTENTS = [
    {
      id: 'horario', prio: 3,
      kw: ['horario', 'hora', 'abiert', 'abre', 'abren', 'cierr', 'cerrad', 'atiend', 'sabado', 'domingo', 'fin de semana', 'tarde', 'manana', 'festivo'],
      reply: () => {
        const s = window.AGE_officeStatus ? window.AGE_officeStatus() : null;
        const estado = s ? `<p><strong>${s.open ? '🟢' : '🔴'} ${s.text}.</strong></p>` : '';
        return estado + `<p>El horario de la oficina es <strong>${DATA.horario}</strong> Sábados y domingos cerrado.</p>`;
      },
      actions: [], chips: ['¿Dónde está la oficina?', 'Pedir una consulta', 'Hablar con José Fernando']
    },
    {
      id: 'direccion', prio: 3,
      kw: ['direccion', 'donde', 'ubicac', 'oficina', 'despacho', 'calle', 'paloma', 'llegar', 'llego', 'llega', 'como voy', 'como ir', 'mapa', 'localiz', 'criptana', 'sitio', 'encontrar', 'aparcar', 'parking', 'google maps'],
      reply: `<p>La oficina está en <strong>${DATA.direccion}</strong>, en el centro de Campo de Criptana.</p><p>Es una casa blanca con la puerta enmarcada en piedra. Tienes una foto de la fachada más abajo en la web.</p>`,
      actions: ['maps'], chips: ['¿Qué horario tenéis?', '¿Atendéis fuera de Criptana?', 'Hablar con José Fernando']
    },
    {
      id: 'zona', prio: 2,
      kw: ['zona', 'alcazar', 'tomelloso', 'ciudad real', 'toledo', 'cobertura', 'madrid', 'online', 'distancia', 'telematic', 'lejos', 'otro pueblo', 'otra ciudad', 'desplaz', 'provincia', 'castilla'],
      reply: `<p>Sí. Aunque la oficina está en Campo de Criptana, trabaja con clientes de toda <strong>Castilla-La Mancha</strong> y buena parte de la gestión se hace a distancia (teléfono, WhatsApp y email).</p><p>Cuéntale dónde estás y te dice cómo organizarlo.</p>`,
      actions: [], chips: ['¿Qué servicios ofrecéis?', '¿Cuánto cuesta?', 'Hablar con José Fernando']
    },
    {
      id: 'telefono', prio: 2,
      kw: ['telefono', 'llamar', 'llamo', 'numero', 'movil', 'contact', 'hablar con', 'hablar', 'ponerme en contacto', 'hablar con jose fernando'],
      reply: `<p>Puedes llamar directamente a José Fernando al <strong>${DATA.tel}</strong>.</p><p>${DATA.horario} Si te viene mejor, escríbele por WhatsApp o por email.</p>`,
      actions: ['call', 'wa', 'mail'], chips: ['¿Qué horario tenéis?', '¿Dónde está la oficina?']
    },
    {
      id: 'whatsapp', prio: 2,
      kw: ['whatsapp', 'wasap', 'wassap', 'guasap', 'wpp', 'mensaje', 'escribir', 'chatear'],
      reply: `<p>Claro, puedes escribirle por WhatsApp al <strong>${DATA.tel}</strong>. Te dejo el enlace directo con un mensaje ya preparado.</p>`,
      actions: ['wa', 'call'], chips: ['¿Qué servicios ofrecéis?', '¿Qué horario tenéis?']
    },
    {
      id: 'email', prio: 2,
      kw: ['email', 'e-mail', 'correo', 'mail', 'gmail'],
      reply: `<p>El correo es <strong>${DATA.email}</strong>. Si es algo urgente, mejor una llamada o un WhatsApp: suele responder antes.</p>`,
      actions: ['mail', 'wa', 'call'], chips: ['¿Qué horario tenéis?']
    },
    {
      id: 'linkedin', prio: 2,
      kw: ['linkedin', 'linkedln', 'perfil', 'redes', 'red social', 'instagram', 'facebook'],
      reply: `<p>Puedes ver el perfil profesional de José Fernando en LinkedIn. También aparece en el directorio empresarial del Ayuntamiento de Campo de Criptana.</p>`,
      actions: ['li'], chips: ['¿Quién es José Fernando?', '¿Qué servicios ofrecéis?']
    },
    {
      id: 'fiscal', prio: 2,
      kw: ['fiscal', 'iva', 'irpf', 'renta', 'impuesto', 'hacienda', 'declaraci', 'trimestr', 'modelo', '303', '130', '390', 'sociedades', 'tribut', 'deduc', 'factura', 'agencia tributaria', 'requerimiento', 'sancion', 'multa'],
      reply: `<p>Sí, la <strong>asesoría fiscal</strong> es uno de los pilares del despacho: declaraciones de IVA e IRPF, modelos trimestrales y anuales, Impuesto de Sociedades, declaración de la renta y planificación fiscal para pagar lo justo.</p><p>Si tienes un requerimiento o una duda concreta de Hacienda, lo mejor es que se lo cuentes directamente.</p>`,
      actions: [], chips: ['¿Cuánto cuesta?', 'Soy autónomo', 'Tengo una empresa', 'Hablar con José Fernando']
    },
    {
      id: 'laboral', prio: 2,
      kw: ['laboral', 'nomina', 'contrat', 'seguridad social', 'trabajador', 'emplead', 'despid', 'finiquito', 'erte', 'baja', 'alta de un', 'plantilla', 'convenio', 'vacaciones', 'seguro social', 'tc1', 'tc2'],
      reply: `<p>Sí. En <strong>asesoría laboral</strong> lleva nóminas, contratos, altas y bajas en la Seguridad Social, despidos y finiquitos, ERTE y cualquier gestión con tus trabajadores.</p>`,
      actions: [], chips: ['¿Cuánto cuesta?', '¿Qué documentación necesito?', 'Hablar con José Fernando']
    },
    {
      id: 'contable', prio: 2,
      kw: ['contab', 'libros', 'cuentas anuales', 'balance', 'facturacion', 'ingresos y gastos', 'registro de', 'asientos'],
      reply: `<p>Sí. Lleva la <strong>contabilidad</strong> completa: libros obligatorios, cuentas anuales, balances y seguimiento de ingresos y gastos, tanto de autónomos como de sociedades.</p>`,
      actions: [], chips: ['¿Cuánto cuesta?', 'Tengo una empresa', 'Hablar con José Fernando']
    },
    {
      id: 'mercantil', prio: 2,
      kw: ['mercantil', 'sociedad', 'constitu', 'crear una empresa', 'crear empresa', 'montar una empresa', 'montar empresa', 'escritura', 'registro mercantil', 'estatuto', 'socio', 'sl', 's.l', 'limitada', 'administrador', 'empresa nueva', 'tengo una empresa'],
      reply: `<p>Sí. Se encarga de la <strong>gestión mercantil</strong>: constitución de sociedades, estatutos, cambios de administrador o de socios, y el depósito de cuentas en el Registro Mercantil.</p><p>Si estás pensando en crear una empresa, en la primera consulta te explica si te conviene más una SL o darte de alta como autónomo.</p>`,
      actions: [], chips: ['¿Cuánto cuesta?', 'Pedir una consulta', 'Hablar con José Fernando']
    },
    {
      id: 'autonomos', prio: 2,
      kw: ['autonom', 'darme de alta', 'dar de alta', 'alta en', 'cuota', 'reta', 'emprend', 'empezar', 'negocio', 'freelance', 'por mi cuenta', 'actividad'],
      reply: `<p>Sí, trabaja con muchos <strong>autónomos</strong>: alta en Hacienda y Seguridad Social, gestión de la cuota, declaraciones trimestrales, renta y todo el papeleo del día a día.</p><p>Si vas a empezar, la primera consulta es sin compromiso y te explica exactamente qué necesitas.</p>`,
      actions: [], chips: ['¿Cuánto cuesta?', '¿Qué documentación necesito?', 'Hablar con José Fernando']
    },
    {
      id: 'precio', prio: 4,
      kw: ['precio', 'cuanto cuesta', 'cuanto cobr', 'cuanto vale', 'tarifa', 'honorario', 'presupuesto', 'coste', 'cost', 'barato', 'caro', 'mensual', 'al mes', 'gratis', 'gratuit', 'pagar'],
      reply: `<p>Los honorarios dependen de tu caso: no es lo mismo un autónomo sin trabajadores que una SL con plantilla. Por eso no hay una tarifa única.</p><p>Lo que sí puedo decirte es que la <strong>primera consulta es sin compromiso</strong> y que los precios son transparentes: sabrás qué pagas y por qué antes de empezar.</p>`,
      actions: [], chips: ['Pedir una consulta', 'Soy autónomo', 'Tengo una empresa', 'Hablar con José Fernando']
    },
    {
      id: 'cita', prio: 2,
      kw: ['cita', 'consulta', 'reunion', 'visita', 'quedar', 'reserv', 'agenda', 'primera'],
      reply: `<p>Perfecto. Para pedir tu primera consulta (sin compromiso) llama al <strong>${DATA.tel}</strong> o escribe por WhatsApp y os ponéis de acuerdo en el día y la hora.</p><p>Puede ser en la oficina de Campo de Criptana o por teléfono.</p>`,
      actions: ['call', 'wa'], chips: ['¿Qué horario tenéis?', '¿Qué documentación necesito?']
    },
    {
      id: 'documentacion', prio: 1,
      kw: ['document', 'papeles', 'que necesito', 'que tengo que llevar', 'llevar', 'traer', 'dni', 'certificado'],
      reply: `<p>Depende de la gestión, pero para una primera consulta suele bastar con tu <strong>DNI</strong> y, si ya tienes actividad, las últimas declaraciones o facturas que tengas a mano.</p><p>No te preocupes por reunirlo todo: en la primera llamada te dice exactamente qué hace falta.</p>`,
      actions: [], chips: ['Pedir una consulta', 'Hablar con José Fernando']
    },
    {
      id: 'quien', prio: 1, weight: 0.6,
      kw: ['quien', 'jose fernando', 'fernando', 'violero', 'experiencia', 'anos', 'años', 'sobre vosotros', 'quienes sois', 'titul', 'colegi', 'trayectoria', 'curriculum', 'perfil profesional', 'formacion'],
      reply: `<p><strong>${DATA.nombre}</strong> es asesor fiscal, contable y laboral y el titular de ${DATA.marca}, su propio despacho en Campo de Criptana (Ciudad Real).</p><p>Lleva <strong>más de 30 años</strong> asesorando a autónomos, pymes y sociedades de la comarca y de toda Castilla-La Mancha: impuestos, contabilidad, nóminas, constitución de sociedades y trámites con Hacienda, Seguridad Social y Registro Mercantil.</p><p>Trabaja como profesional independiente, así que el cliente habla siempre con él, no con un comercial ni con un departamento. Puedes ver su perfil profesional en LinkedIn y su ficha en el directorio empresarial del Ayuntamiento de Campo de Criptana.</p>`,
      actions: ['li'], chips: ['¿Por qué es de fiar?', '¿Qué servicios ofrecéis?', 'Pedir una consulta', 'Hablar con José Fernando']
    },
    {
      id: 'fiable', prio: 3,
      kw: ['fiable', 'fiar', 'confianza', 'confiar', 'garantia', 'seriedad', 'serio', 'recomend', 'opiniones', 'resenas', 'reseñas', 'por que elegir', 'por que vosotros', 'por que el', 'mejor asesor', 'buen asesor', 'referencias', 'reputacion', 'de calidad', 'top', 'competente', 'bueno', 'elegir', 'escoger', 'contratar', 'quedarme con', 'por que os'],
      reply: `<p>Te doy motivos concretos, no adjetivos:</p><p>• <strong>Más de 30 años en activo</strong> con el mismo despacho, en un pueblo donde todo el mundo se conoce. Eso solo se sostiene si los clientes repiten y recomiendan.<br>• <strong>Trato directo con el asesor.</strong> Tu empresa la lleva José Fernando personalmente: conoce tu caso, tus plazos y tu historial, no un gestor distinto cada trimestre.<br>• <strong>Gestión integral en un solo sitio:</strong> fiscal, contable, laboral y mercantil. Nada se pierde entre departamentos.<br>• <strong>Actualización permanente</strong> en normativa fiscal y laboral, que cambia cada año.<br>• <strong>Honorarios transparentes:</strong> sabes qué pagas y por qué antes de empezar.</p><p>Y lo más fiable de todo: la <strong>primera consulta es sin compromiso</strong>. Cuéntale tu caso, escucha qué te propone y decide tú.</p>`,
      actions: ['li'], chips: ['Tengo una empresa grande', '¿Cuánto cuesta?', 'Pedir una consulta', 'Hablar con José Fernando']
    },
    {
      id: 'empresa_grande', prio: 3,
      kw: ['empresa top', 'empresa grande', 'gran empresa', 'grupo de empresas', 'holding', 'varias empresas', 'facturacion alta', 'mucha facturacion', 'muchos trabajadores', 'plantilla grande', 'escalar', 'crecer mucho', 'empresa seria', 'empresa importante', 'nivel alto', 'exigente'],
      reply: `<p>Para una empresa con volumen lo que necesitas es alguien que lleve <strong>Impuesto de Sociedades, IVA, nóminas de plantilla, cuentas anuales y el Registro Mercantil</strong> con rigor y sin retrasos, y que esté localizable cuando surge un requerimiento. Eso es exactamente lo que hace José Fernando desde hace más de 30 años.</p><p>Lo honesto es que cada empresa es distinta: número de trabajadores, sociedades del grupo, sector. Lo mejor es una reunión (en la oficina o por teléfono) en la que le expliques la estructura de tu empresa y te diga con claridad cómo la llevaría y con qué honorarios.</p>`,
      actions: ['call', 'wa'], chips: ['¿Por qué es de fiar?', '¿Qué servicios ofrecéis?', '¿Dónde está la oficina?']
    },
    {
      id: 'urgente', prio: 1,
      kw: ['urgente', 'urgencia', 'plazo', 'se me pasa', 'ultimo dia', 'hoy mismo', 'rapido', 'prisa', 'termina'],
      reply: `<p>Si tienes un plazo encima, lo mejor es <strong>llamar directamente</strong>. Si está fuera de horario, manda un WhatsApp explicando de qué se trata y te responde en cuanto pueda.</p>`,
      actions: ['call', 'wa'], chips: ['¿Qué horario tenéis?']
    },
    {
      id: 'servicios', prio: 0, weight: 0.5,
      kw: ['servicio', 'que haceis', 'que hace', 'que ofrec', 'ayud', 'gestion', 'tramite', 'hacen', 'podeis', 'puede', 'lleva', 'ofrece', 'especial', 'trabaj', 'en que'],
      reply: `<p>El despacho ofrece una gestión integral para autónomos y empresas:</p><p>• <strong>Fiscal:</strong> IVA, IRPF, renta, Sociedades y modelos trimestrales.<br>• <strong>Contable:</strong> contabilidad, libros y cuentas anuales.<br>• <strong>Laboral:</strong> nóminas, contratos, altas y bajas.<br>• <strong>Mercantil:</strong> constitución y cambios en sociedades.<br>• <strong>Autónomos:</strong> alta, cuota y gestión del día a día.<br>• <strong>Trámites</strong> con Hacienda, Seguridad Social y Registro Mercantil.</p>`,
      actions: ['services'], chips: ['Soy autónomo', 'Tengo una empresa', '¿Cuánto cuesta?', 'Hablar con José Fernando']
    },
    {
      id: 'gracias', prio: 0, weight: 0.6,
      kw: ['gracias', 'perfecto', 'genial', 'estupendo', 'vale', 'ok', 'okey', 'de acuerdo', 'entendido', 'muy bien', 'thank'],
      reply: `<p>¡De nada! Si necesitas algo más, aquí estoy.</p>`,
      actions: [], chips: ['¿Qué servicios ofrecéis?', '¿Dónde está la oficina?', 'Hablar con José Fernando']
    },
    {
      id: 'despedida', prio: 0, weight: 0.6,
      kw: ['adios', 'hasta luego', 'chao', 'chau', 'nos vemos', 'hasta pronto', 'bye'],
      reply: `<p>¡Hasta pronto! Que tengas un buen día.</p>`,
      actions: [], chips: []
    },
    {
      id: 'saludo', prio: 0, weight: 0.3,
      kw: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'que tal', 'saludos', 'ey'],
      reply: `<p>¡Hola! Soy el asistente de ${DATA.marca}. Puedo contarte qué servicios ofrece el despacho, el horario, dónde está la oficina o cómo contactar con José Fernando. ¿Qué necesitas?</p>`,
      actions: [], chips: ['¿Qué servicios ofrecéis?', '¿Qué horario tenéis?', '¿Dónde está la oficina?', '¿Cuánto cuesta?']
    }
  ];

  const FALLBACK = {
    reply: `<p>No estoy seguro de haber entendido tu pregunta. Soy un asistente informativo y solo puedo ayudarte con los servicios, el horario, la dirección y el contacto del despacho.</p><p>Para tu caso concreto, lo mejor es que hables directamente con José Fernando:</p>`,
    actions: ['call', 'wa', 'mail'],
    chips: ['¿Qué servicios ofrecéis?', '¿Qué horario tenéis?', '¿Dónde está la oficina?', '¿Cuánto cuesta?']
  };

  /* ───────── Utilidades ───────── */
  const norm = s => s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:()"']/g, ' ')
    .replace(/\s+/g, ' ').trim();

  function match(text) {
    const t = ' ' + norm(text) + ' ';
    let best = null, bestScore = 0;
    for (const it of INTENTS) {
      let score = 0;
      const w = it.weight || 1;
      for (const k of it.kw) {
        const kk = norm(k);
        if (kk.length <= 2) { if (t.includes(' ' + kk + ' ')) score += w; }
        else if (t.includes(kk)) score += (kk.includes(' ') ? 2 : 1) * w;
      }
      if (score > 0) {
        const total = score * 10 + it.prio;
        if (total > bestScore) { bestScore = total; best = it; }
      }
    }
    return best;
  }

  /* ───────── UI ───────── */
  const launcher = document.getElementById('chat-launcher');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const log = document.getElementById('chat-log');
  const chipsBox = document.getElementById('chat-chips');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const badge = document.getElementById('chat-badge');
  if (!launcher || !panel) return;

  let opened = false, busy = false;

  function open() {
    document.body.classList.add('chat-open');
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('is-open'));
    launcher.setAttribute('aria-expanded', 'true');
    launcher.setAttribute('aria-label', 'Cerrar asistente');
    badge.classList.add('is-hidden');
    if (!opened) { opened = true; welcome(); }
    setTimeout(() => input.focus({ preventScroll: true }), 300);
  }
  function close() {
    document.body.classList.remove('chat-open');
    panel.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', 'Abrir asistente');
    setTimeout(() => { if (!panel.classList.contains('is-open')) panel.hidden = true; }, 350);
  }
  launcher.addEventListener('click', () => panel.classList.contains('is-open') ? close() : open());
  document.querySelectorAll('[data-open-chat]').forEach(b => b.addEventListener('click', () => {
    open();
    launcher.classList.add('is-pulse'); setTimeout(() => launcher.classList.remove('is-pulse'), 1200);
  }));
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('is-open')) close(); });

  function scrollBottom() { log.scrollTop = log.scrollHeight; requestAnimationFrame(() => { log.scrollTop = log.scrollHeight; }); }

  function addUser(text) {
    const el = document.createElement('div');
    el.className = 'msg msg--user';
    el.textContent = text;
    log.appendChild(el); scrollBottom();
  }

  function addBot(html, actions = [], chips = []) {
    const typing = document.createElement('div');
    typing.className = 'msg msg--bot msg--typing';
    typing.innerHTML = '<i></i><i></i><i></i>';
    log.appendChild(typing); scrollBottom();
    setChips([]);
    busy = true;
    const delay = Math.min(1300, 450 + html.length * 3);
    setTimeout(() => {
      typing.remove();
      const el = document.createElement('div');
      el.className = 'msg msg--bot';
      el.innerHTML = html;
      if (actions.length) {
        const box = document.createElement('div');
        box.className = 'msg__actions';
        actions.forEach(key => {
          const a = A[key]; if (!a) return;
          const link = document.createElement('a');
          link.href = a.href; link.textContent = a.label;
          if (a.cls) link.className = a.cls;
          if (a.ext) { link.target = '_blank'; link.rel = 'noopener'; }
          if (a.internal) link.addEventListener('click', close);
          box.appendChild(link);
        });
        el.appendChild(box);
      }
      log.appendChild(el); scrollBottom();
      setChips(chips);
      busy = false;
    }, delay);
  }

  function setChips(list) {
    chipsBox.innerHTML = '';
    list.forEach(txt => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = txt;
      b.addEventListener('click', () => send(txt));
      chipsBox.appendChild(b);
    });
  }

  function respond(text) {
    const it = match(text);
    if (!it) { addBot(FALLBACK.reply, FALLBACK.actions, FALLBACK.chips); return; }
    const html = typeof it.reply === 'function' ? it.reply() : it.reply;
    addBot(html, it.actions, it.chips);
  }

  function send(text) {
    text = (text || '').trim();
    if (!text || busy) return;
    addUser(text);
    input.value = '';
    respond(text);
  }

  // No dependemos del envío del formulario (algunos visores lo bloquean)
  form.addEventListener('submit', e => { e.preventDefault(); send(input.value); });
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); send(input.value); } });
  form.querySelector('button').addEventListener('click', e => { e.preventDefault(); send(input.value); });

  function welcome() {
    const s = window.AGE_officeStatus ? window.AGE_officeStatus() : null;
    const estado = s ? `<p>${s.open ? '🟢' : '🔴'} ${s.text}.</p>` : '';
    addBot(
      `<p>¡Hola! Soy el asistente de <strong>${DATA.marca}</strong>, el despacho de ${DATA.nombre} en Campo de Criptana.</p>${estado}<p>Pregúntame por los servicios, el horario, la dirección o cómo contactar. Si prefieres, escribe tu duda con tus palabras.</p>`,
      [],
      ['¿Qué servicios ofrecéis?', '¿Qué horario tenéis?', '¿Dónde está la oficina?', '¿Cuánto cuesta?', 'Soy autónomo', 'Hablar con José Fernando']
    );
  }
})();
