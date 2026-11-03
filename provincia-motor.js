/* Meteorología Cuba — motor de niveles para las páginas por provincia.
   Extraído LITERAL de la portada v40 (datos, umbrales y funciones
   idénticos: calcularPunto, armarProvincia, nieblaZonal, KBDI,
   caché mc5) con un cargador que pide solo los municipios de la
   provincia. Generado por crear_seo.py; no editar a mano. */
"use strict";

const NIVELES = [
  { n:"Verde",    largo:"Verde · Ninguno",        c:"#2ca25f", t:"#ffffff" },
  { n:"Amarillo", largo:"Amarillo · Limitado",    c:"#f2d13c", t:"#3a3205" },
  { n:"Naranja",  largo:"Naranja · Elevado",      c:"#ef8a17", t:"#ffffff" },
  { n:"Rojo",     largo:"Rojo · Significativo",   c:"#d7301f", t:"#ffffff" },
  { n:"Morado",   largo:"Morado · Extremo",       c:"#7a0177", t:"#ffffff" }
];
const SIN_DATOS = { n:"Sin datos", c:"#9aa7ad", t:"#ffffff" };

/* Todos los peligros usan la nomenclatura común de niveles (Verde…Morado). */
function nomNivel(k, n){ return NIVELES[n].n; }
function tituloNivel(k, n){ return NIVELES[n].largo; }

const PROVS = [
  { id:"Pinar del Río",      nom:"Pinar del Río",      lat:22.4175, lon:-83.6981, marN:[0], marS:[1] },
  { id:"Artemisa",           nom:"Artemisa",           lat:22.8100, lon:-82.7600, marN:[2], marS:[3] },
  { id:"La Habana",          nom:"La Habana",          lat:23.1136, lon:-82.3666, marN:[4] },
  { id:"Mayabeque",          nom:"Mayabeque",          lat:22.9639, lon:-82.1458, marN:[5], marS:[6] },
  { id:"Matanzas",           nom:"Matanzas",           lat:23.0419, lon:-81.5775, marN:[7], marS:[8] },
  { id:"Cienfuegos",         nom:"Cienfuegos",         lat:22.1496, lon:-80.4463, marS:[9] },
  { id:"Villa Clara",        nom:"Villa Clara",        lat:22.4067, lon:-79.9650, marN:[10] },
  { id:"Sancti Spíritus",    nom:"Sancti Spíritus",    lat:21.9297, lon:-79.4425, marN:[11], marS:[12] },
  { id:"Ciego de Ávila",     nom:"Ciego de Ávila",     lat:21.8403, lon:-78.7619, marN:[13], marS:[14] },
  { id:"Camagüey",           nom:"Camagüey",           lat:21.3808, lon:-77.9169, marN:[15], marS:[16] },
  { id:"Las Tunas",          nom:"Las Tunas",          lat:20.9617, lon:-76.9511, marN:[17] },
  { id:"Holguín",            nom:"Holguín",            lat:20.8872, lon:-76.2631, marN:[18] },
  { id:"Granma",             nom:"Granma",             lat:20.3792, lon:-76.6433, marS:[19] },
  { id:"Santiago de Cuba",   nom:"Santiago de Cuba",   lat:20.0217, lon:-75.8292, marS:[20] },
  { id:"Guantánamo",         nom:"Guantánamo",         lat:20.1444, lon:-75.1936, marN:[21], marS:[22] },
  { id:"Isla de la Juventud",nom:"Isla de la Juventud",lat:21.8950, lon:-82.8025, marC:[23,24] }
];
const MUNICIPIOS = [["Camagüey", "Camagüey", 21.417, -77.956], ["CarlosManueldeCéspedes", "Camagüey", 21.672, -78.261], ["Esmeralda", "Camagüey", 21.977, -77.736], ["Florida", "Camagüey", 21.473, -78.36], ["Guáimaro", "Camagüey", 21.258, -77.283], ["Jimaguayú", "Camagüey", 21.196, -77.946], ["Minas", "Camagüey", 21.605, -77.569], ["Najasa", "Camagüey", 21.033, -77.824], ["Nuevitas", "Camagüey", 21.647, -77.251], ["SantaCruzdelSur", "Camagüey", 20.872, -78.035], ["Sibanicú", "Camagüey", 21.256, -77.607], ["SierradeCubitas", "Camagüey", 21.683, -77.802], ["Vertientes", "Camagüey", 21.123, -78.326], ["Baraguá", "Ciego de Ávila", 21.691, -78.526], ["Bolivia", "Ciego de Ávila", 22.071, -78.311], ["Chambas", "Ciego de Ávila", 22.051, -78.943], ["Ciegodeávila", "Ciego de Ávila", 21.83, -78.809], ["CiroRedodo", "Ciego de Ávila", 21.937, -78.727], ["Florencia", "Ciego de Ávila", 22.214, -78.859], ["Majagua", "Ciego de Ávila", 21.817, -79.009], ["Morón", "Ciego de Ávila", 22.39, -78.178], ["PrimerodeEnero", "Ciego de Ávila", 21.862, -78.383], ["Venezuela", "Ciego de Ávila", 21.71, -78.837], ["Abreus", "Cienfuegos", 22.184, -80.733], ["AguadadePasajeros", "Cienfuegos", 22.324, -80.77], ["Ciefuegos", "Cienfuegos", 22.1, -80.537], ["Cruces", "Cienfuegos", 22.249, -80.228], ["Cumanayagua", "Cienfuegos", 21.992, -80.216], ["Lajas", "Cienfuegos", 22.412, -80.335], ["Palmira", "Cienfuegos", 22.288, -80.442], ["Rodas", "Cienfuegos", 22.352, -80.589], ["ArroyoNaranjo", "La Habana", 22.998, -82.3], ["Boyeros", "La Habana", 22.99, -82.384], ["CentroHabana", "La Habana", 23.129, -82.366], ["Cerro", "La Habana", 23.101, -82.369], ["Cotorro", "La Habana", 22.991, -82.232], ["DiezdeOctubre", "La Habana", 23.072, -82.339], ["Guanabacoa", "La Habana", 23.054, -82.281], ["LaHabanadelEste", "La Habana", 23.107, -82.144], ["LaHabanaVieja", "La Habana", 23.151, -82.317], ["LaLisa", "La Habana", 23.026, -82.452], ["Marianao", "La Habana", 23.073, -82.383], ["Playa", "La Habana", 23.043, -82.418], ["PlazadelaRevolución", "La Habana", 23.098, -82.425], ["Regla", "La Habana", 23.101, -82.321], ["SanMigueldelPadrón", "La Habana", 23.081, -82.238], ["BartoloméMasó", "Granma", 20.071, -76.951], ["Bayamo", "Granma", 20.423, -76.664], ["BueyArriba", "Granma", 20.133, -76.719], ["Campechuela", "Granma", 20.127, -77.26], ["CautoCristo", "Granma", 20.62, -76.615], ["Guisa", "Granma", 20.184, -76.508], ["Jiguaní", "Granma", 20.406, -76.392], ["Manzanillo", "Granma", 20.247, -77.132], ["MediaLuna", "Granma", 20.084, -77.416], ["Niquero", "Granma", 19.961, -77.545], ["Pilón", "Granma", 19.944, -77.25], ["RíoCauto", "Granma", 20.574, -76.99], ["Yara", "Granma", 20.367, -76.923], ["Baracoa", "Guantánamo", 20.401, -74.619], ["Caimanera", "Guantánamo", 19.978, -75.224], ["ElSalvador", "Guantánamo", 20.334, -75.327], ["Guantánamo", "Guantánamo", 20.286, -75.145], ["Imías", "Guantánamo", 20.179, -74.588], ["Maisí", "Guantánamo", 20.202, -74.284], ["ManuelTames", "Guantánamo", 20.162, -74.955], ["NicetoPérez", "Guantánamo", 20.077, -75.33], ["SanAntoniodelSur", "Guantánamo", 20.145, -74.795], ["Yateras", "Guantánamo", 20.393, -74.891], ["Antilla", "Holguín", 20.843, -75.708], ["Báguanos", "Holguín", 20.816, -76.05], ["Banes", "Holguín", 20.964, -75.74], ["Cacocum", "Holguín", 20.753, -76.47], ["CalixtoGarcía", "Holguín", 20.868, -76.602], ["Cueto", "Holguín", 20.615, -75.94], ["FrakPaís", "Holguín", 20.669, -75.171], ["Gibara", "Holguín", 21.12, -76.254], ["Holguín", "Holguín", 20.899, -76.29], ["Mayarí", "Holguín", 20.633, -75.633], ["Moa", "Holguín", 20.568, -74.877], ["RafaelFreyre", "Holguín", 21.006, -76.019], ["SaguadeTánamo", "Holguín", 20.526, -75.173], ["UrbanoNoris", "Holguín", 20.609, -76.254], ["IsladelaJuventud", "Isla de la Juventud", 21.69, -82.814], ["Alquízar", "Artemisa", 22.748, -82.605], ["Artemisa", "Artemisa", 22.748, -82.798], ["Bauta", "Artemisa", 22.981, -82.522], ["Caimito", "Artemisa", 22.921, -82.604], ["Guanajay", "Artemisa", 22.902, -82.709], ["GüiradeMelena", "Artemisa", 22.741, -82.481], ["Mariel", "Artemisa", 22.962, -82.792], ["SanAntoniodelosBaños", "Artemisa", 22.87, -82.492], ["Amancio", "Las Tunas", 20.832, -77.653], ["Colombia", "Las Tunas", 20.854, -77.466], ["JesúsMenéndez", "Las Tunas", 21.086, -76.542], ["Jobabo", "Las Tunas", 20.829, -77.256], ["LasTunas", "Las Tunas", 20.952, -77.009], ["Majibacoa", "Las Tunas", 20.835, -76.792], ["Manatí", "Las Tunas", 21.259, -77.0], ["PuertoPadre", "Las Tunas", 21.156, -76.722], ["Calimete", "Matanzas", 22.371, -81.001], ["Cárdenas", "Matanzas", 22.999, -81.253], ["CiénagadeZapata", "Matanzas", 22.305, -81.542], ["Colón", "Matanzas", 22.752, -80.836], ["JagüeyGrande", "Matanzas", 22.562, -81.16], ["Jovellanos", "Matanzas", 22.79, -81.188], ["Limonar", "Matanzas", 22.88, -81.485], ["LosArabos", "Matanzas", 22.626, -80.684], ["Martí", "Matanzas", 22.99, -80.837], ["Matanzas", "Matanzas", 23.045, -81.614], ["PedroBetancourt", "Matanzas", 22.69, -81.317], ["Perico", "Matanzas", 22.787, -80.995], ["UnióndeReyes", "Matanzas", 22.677, -81.484], ["Batabanó", "Mayabeque", 22.755, -82.274], ["Bejucal", "Mayabeque", 22.909, -82.339], ["Güines", "Mayabeque", 22.794, -82.0], ["Jaruco", "Mayabeque", 23.057, -81.98], ["Madruga", "Mayabeque", 22.916, -81.798], ["MelenadelSur", "Mayabeque", 22.772, -82.151], ["NuevaPaz", "Mayabeque", 22.692, -81.714], ["Quivicán", "Mayabeque", 22.787, -82.372], ["SanJosédelasLajas", "Mayabeque", 22.904, -82.136], ["SanNicolás", "Mayabeque", 22.771, -81.881], ["SantaCruzdelNorte", "Mayabeque", 23.083, -81.769], ["BahíaHonda", "Artemisa", 22.897, -83.134], ["Candelaria", "Artemisa", 22.729, -82.943], ["ConsolacióndelSur", "Pinar del Río", 22.418, -83.421], ["Guane", "Pinar del Río", 22.229, -84.066], ["LaPalma", "Pinar del Río", 22.731, -83.479], ["LosPalacios", "Pinar del Río", 22.515, -83.209], ["Mantua", "Pinar del Río", 22.334, -84.249], ["MinasdeMatahambre", "Pinar del Río", 22.545, -83.981], ["PinardelRío", "Pinar del Río", 22.355, -83.573], ["SanCristóbal", "Artemisa", 22.645, -83.047], ["SanJuanyMartínez", "Pinar del Río", 22.316, -83.84], ["SanLuis", "Pinar del Río", 22.265, -83.673], ["Sandino", "Pinar del Río", 21.957, -84.349], ["Viñales", "Pinar del Río", 22.623, -83.703], ["Cabaiguán", "Sancti Spíritus", 22.094, -79.527], ["Fomento", "Sancti Spíritus", 22.002, -79.705], ["Jatibonico", "Sancti Spíritus", 21.91, -79.173], ["LaSierpe", "Sancti Spíritus", 21.676, -79.3], ["SanctiSpíritus", "Sancti Spíritus", 21.8, -79.534], ["Taguasco", "Sancti Spíritus", 22.042, -79.321], ["Trinidad", "Sancti Spíritus", 21.832, -79.907], ["Yaguajay", "Sancti Spíritus", 22.265, -79.172], ["Contramaestre", "Santiago de Cuba", 20.304, -76.231], ["Guamá", "Santiago de Cuba", 19.993, -76.522], ["Mella", "Santiago de Cuba", 20.461, -75.952], ["PalmaSoriano", "Santiago de Cuba", 20.238, -76.069], ["SanLuis", "Santiago de Cuba", 20.272, -75.831], ["SantiagodeCuba", "Santiago de Cuba", 20.017, -75.669], ["SegundoFrente", "Santiago de Cuba", 20.451, -75.478], ["Songo-LaMaya", "Santiago de Cuba", 20.215, -75.592], ["TercerFrente", "Santiago de Cuba", 20.155, -76.266], ["Caibarién", "Villa Clara", 22.491, -79.539], ["Camajuaní", "Villa Clara", 22.513, -79.763], ["Cifuentes", "Villa Clara", 22.586, -80.019], ["Corralillo", "Villa Clara", 22.879, -80.518], ["Encrucijada", "Villa Clara", 22.66, -79.811], ["Manicaragua", "Villa Clara", 22.096, -79.949], ["Placetas", "Villa Clara", 22.15, -79.608], ["QuemadodeGüines", "Villa Clara", 22.805, -80.288], ["Ranchuelo", "Villa Clara", 22.38, -80.137], ["Remedios", "Villa Clara", 22.322, -79.549], ["SagualaGrande", "Villa Clara", 22.808, -80.056], ["SantaClara", "Villa Clara", 22.345, -79.942], ["Santo Domingo", "Villa Clara", 22.598, -80.349]];
/* Zona de cada municipio para la NIEBLA (misma longitud y orden que MUNICIPIOS):
   N = costa norte, I = interior, S = costa sur, C = la isla completa (Isla de la
   Juventud). Clasificación por distancia a cada costa, generada desde el propio
   GeoJSON de provincias. La niebla se muestrea por zonas porque no cae igual en
   toda una provincia: es del interior y en las costas suele ni formarse. */
const MUN_ZONA = "IINIIININSINSINISINSNISSSSISISINNNNNNNNNNNNNNNSISNISINNSSIINSIISNSSSNSISIIINNINNNNICSSNNNSNSSSNSIINNINSIINNINNIIISSSNNSSSSSNNSSINSNNSSSSNNIIISSISNISISISIISNNINNIINIINII";
const MUN_PROV = MUNICIPIOS.map(m => PROVS.findIndex(p => p.id === m[1]));
const MARPTS = [[22.80,-84.00],[21.95,-83.60],[23.30,-82.50],[22.45,-82.35],[23.30,-82.37],[23.35,-81.90],[22.50,-81.90],[23.35,-81.20],[21.95,-81.15],[21.95,-80.45],[23.30,-79.85],[22.60,-79.25],[21.70,-79.90],[22.85,-78.45],[20.75,-78.90],[21.75,-77.25],[20.55,-78.00],[21.45,-76.60],[21.25,-75.95],[19.90,-77.45],[19.85,-75.75],[20.55,-74.50],[19.90,-75.20],[22.05,-82.85],[21.55,-82.95]];

var MC2_NOMBRES = ["Camagüey", "Carlos Manuel de Céspedes", "Esmeralda", "Florida", "Guáimaro", "Jimaguayú", "Minas", "Najasa", "Nuevitas", "Santa Cruz del Sur", "Sibanicú", "Sierra de Cubitas", "Vertientes", "Baraguá", "Bolivia", "Chambas", "Ciego de Ávila", "Ciro Redondo", "Florencia", "Majagua", "Morón", "Primero de Enero", "Venezuela", "Abreus", "Aguada de Pasajeros", "Cienfuegos", "Cruces", "Cumanayagua", "Lajas", "Palmira", "Rodas", "Arroyo Naranjo", "Boyeros", "Centro Habana", "Cerro", "Cotorro", "Diez de Octubre", "Guanabacoa", "La Habana del Este", "La Habana Vieja", "La Lisa", "Marianao", "Playa", "Plaza de la Revolución", "Regla", "San Miguel del Padrón", "Bartolomé Masó", "Bayamo", "Buey Arriba", "Campechuela", "Cauto Cristo", "Guisa", "Jiguaní", "Manzanillo", "Media Luna", "Niquero", "Pilón", "Río Cauto", "Yara", "Baracoa", "Caimanera", "El Salvador", "Guantánamo", "Imías", "Maisí", "Manuel Tames", "Niceto Pérez", "San Antonio del Sur", "Yateras", "Antilla", "Báguanos", "Banes", "Cacocum", "Calixto García", "Cueto", "Frank País", "Gibara", "Holguín", "Mayarí", "Moa", "Rafael Freyre", "Sagua de Tánamo", "Urbano Noris", "Isla de la Juventud", "Alquízar", "Artemisa", "Bauta", "Caimito", "Guanajay", "Güira de Melena", "Mariel", "San Antonio de los Baños", "Amancio", "Colombia", "Jesús Menéndez", "Jobabo", "Las Tunas", "Majibacoa", "Manatí", "Puerto Padre", "Calimete", "Cárdenas", "Ciénaga de Zapata", "Colón", "Jagüey Gran de", "Jovellanos", "Limonar", "Los Arabos", "Martí", "Matanzas", "Pedro Betancourt", "Perico", "Unión de Reyes", "Batabanó", "Bejucal", "Güines", "Jaruco", "Madruga", "Melena del Sur", "Nueva Paz", "Quivicán", "San José de las Lajas", "San Nicolás", "Santa Cruz del Norte", "Bahía Honda", "Candelaria", "Consolación del Sur", "Guane", "La Palma", "Los Palacios", "Mantua", "Minas de Matahambre", "Pinar del Río", "San Cristóbal", "San Juan y Martínez", "San Luis", "Sandino", "Viñales", "Cabaiguán", "Fomento", "Jatibonico", "La Sierpe", "Sancti Spíritus", "Taguasco", "Trinidad", "Yaguajay", "Contramaestre", "Guamá", "Mella", "Palma Soriano", "San Luis", "Santiago de Cuba", "Segundo Frente", "Songo-La Maya", "Tercer Frente", "Caibarién", "Camajuaní", "Cifuentes", "Corralillo", "Encrucijada", "Manicaragua", "Placetas", "Quemado de Güines", "Ranchuelo", "Remedios", "Sagua la Grande", "Santa Clara", "Santo Domingo"];

function nomMun(i){ return (MC2_NOMBRES && MC2_NOMBRES[i]) || MUNICIPIOS[i][0]; }

function seg(a, d){ return a.slice(d*24, d*24+24); }
function mx(a){ let m = null; for (const v of a){ if (v != null && (m === null || v > m)) m = v; } return m; }
function mn(a){ let m = null; for (const v of a){ if (v != null && (m === null || v < m)) m = v; } return m; }
function f1(v){ return v == null ? "—" : (Math.round(v*10)/10).toString().replace(".", ","); }
function f0(v){ return v == null ? "—" : Math.round(v).toString(); }
function rainMax(P, d, w){
  let best = 0;
  for (let end = d*24; end < d*24+24; end++){
    let s = 0;
    for (let i = Math.max(0, end-w+1); i <= end; i++) s += (P[i] || 0);
    if (s > best) best = s;
  }
  return best;
}
function havKm(lat1, lon1, lat2, lon2){
  const R = 6371, rad = Math.PI/180;
  const dLa = (lat2-lat1)*rad, dLo = (lon2-lon1)*rad;
  const a = Math.sin(dLa/2)**2 + Math.cos(lat1*rad)*Math.cos(lat2*rad)*Math.sin(dLo/2)**2;
  return 2*R*Math.asin(Math.sqrt(a));
}

const HORA_HAB = (() => { try { const h = parseInt(new Date().toLocaleString("en-US", { timeZone: "America/Havana", hour: "2-digit", hour12: false }), 10); return isNaN(h) ? new Date().getHours() : h % 24; } catch(e){ return new Date().getHours(); } })()

const MC5_TTL = 25 * 60 * 1000;
const mc5Mem = {};
let mc5StoreOk = null;
function mc5Store(){
  if (mc5StoreOk !== null) return mc5StoreOk ? window.localStorage : null;
  try {
    const st = window.localStorage;
    st.setItem("__mc5__", "1"); st.removeItem("__mc5__");
    mc5StoreOk = true; return st;
  } catch(e){ mc5StoreOk = false; return null; }
}
function mc5Hash(s){ let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
function mc5DiaHab(){
  try { return new Date().toLocaleDateString("en-CA", { timeZone: "America/Havana" }); }
  catch(e){ return new Date().toDateString(); }
}
function mc5Get(url){
  const m = mc5Mem[url];
  if (m && Date.now() - m.t < MC5_TTL){ try { return JSON.parse(m.txt); } catch(e){} }
  const st = mc5Store(); if (!st) return null;
  try {
    const raw = st.getItem("mc5|" + mc5Hash(url)); if (!raw) return null;
    const o = JSON.parse(raw);
    if (!o || Date.now() - o.t > MC5_TTL || o.d !== mc5DiaHab()) return null;
    mc5Mem[url] = { t: o.t, txt: o.txt };
    return JSON.parse(o.txt);
  } catch(e){ return null; }
}
function mc5Set(url, j){
  let txt; try { txt = JSON.stringify(j); } catch(e){ return; }
  if (typeof txt !== "string") return;
  mc5Mem[url] = { t: Date.now(), txt };
  const st = mc5Store(); if (!st) return;
  const k = "mc5|" + mc5Hash(url);
  const entrada = JSON.stringify({ t: Date.now(), d: mc5DiaHab(), txt });
  try { st.setItem(k, entrada); }
  catch(e){
    try {
      const viejas = [];
      for (let i = 0; i < st.length; i++){ const kk = st.key(i); if (kk && kk.indexOf("mc5|") === 0 && kk !== k) viejas.push(kk); }
      viejas.forEach(kk => st.removeItem(kk));
      st.setItem(k, entrada);
    } catch(e2){ /* sin caché persistente: queda la de memoria */ }
  }
}
function mc5Sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
/* GET JSON con caché y reintentos ante limitación (HTTP 429) o fallo de red.
   El error final lleva .status cuando el servicio llegó a responder, para
   que la interfaz explique la causa real. */
async function mc5FetchJSON(url, opts){
  opts = opts || {};
  const hit = mc5Get(url);
  if (hit !== null && hit !== undefined) return hit;
  const esperas = opts.esperas || [0, 6000, 20000, 45000];
  let lastErr = null;
  for (let i = 0; i < esperas.length; i++){
    if (esperas[i] > 0){
      if (opts.alReintentar) opts.alReintentar(lastErr);
      await mc5Sleep(esperas[i]);
    }
    try {
      const r = await fetch(url);
      if (r.status === 429){ lastErr = new Error("HTTP 429"); lastErr.status = 429; continue; }
      if (!r.ok){ lastErr = new Error("HTTP " + r.status); lastErr.status = r.status; if (r.status < 500) break; continue; }
      const j = await r.json();
      mc5Set(url, j);
      return j;
    } catch(e){ lastErr = e; }
  }
  throw lastErr || new Error("sin datos");
}

function nivelVisKm(km){ return km < 0.4 ? 4 : km < 1 ? 3 : km < 3 ? 2 : km <= 5 ? 1 : 0; }

function nieblaPunto(H, d){
  const visD = seg(H.visibility, d), prD = seg(H.precipitation, d);
  let iniNie = 3, finNie = 10;
  if (d === 0){
    if (HORA_HAB >= 10) return { sinVentana: true };
    iniNie = Math.max(3, HORA_HAB);
  }
  let visSeca = null, visToda = null;
  for (let i = iniNie; i <= finNie; i++){
    const v = visD[i]; if (v == null) continue;
    if (visToda === null || v < visToda) visToda = v;
    if ((prD[i] ?? 0) < 1 && (visSeca === null || v < visSeca)) visSeca = v;
  }
  if (visToda === null) return null;
  if (visSeca !== null) return { km: visSeca / 1000, conLluvia: false };
  return { km: visToda / 1000, conLluvia: true };
}

function nieblaZonal(idx, pts){
  const peor = {};
  for (let mi = 0; mi < MUNICIPIOS.length; mi++){
    if (MUN_PROV[mi] !== idx) continue;
    const pz = pts[mi] && pts[mi].niebla; if (!pz || pz.km == null) continue;
    const z = MUN_ZONA[mi];
    if (!peor[z] || pz.km < peor[z].km) peor[z] = pz;
  }
  const claves = Object.keys(peor);
  if (!claves.length) return null;
  const zonas = {};
  for (const z of claves){
    const pz = peor[z];
    zonas[z] = { km: pz.km, n: pz.conLluvia ? (pz.km <= 5 ? 1 : 0) : nivelVisKm(pz.km) };
  }
  const n = zonas.I ? zonas.I.n : Math.max(...claves.map(z => zonas[z].n));
  const partes = ["I", "N", "S", "C"].filter(z => zonas[z]).map(z => ZONA_TXT[z] + " " + f1(zonas[z].km) + " km");
  return { n, zonas, det: "Visibilidad mín. por zonas — " + partes.join(" · ") };
}

function calcularPunto(F, d){
  const H = F.hourly, out = {};
  const P = H.precipitation;

  /* Calor extremo — índice de calor máx. del día */
  const ic = mx(seg(H.apparent_temperature, d));
  out.calor = { n: ic === null ? null : (ic >= 47 ? 4 : ic >= 45 ? 3 : ic >= 42 ? 2 : ic >= 39 ? 1 : 0), v: ic };

  /* Frío extremo — sensación térmica MÍN. del día (Amarillo 10-13 °C ·
     Naranja 7-10 · Rojo 4-7 · Morado < 4) */
  const st = mn(seg(H.apparent_temperature, d));
  out.frio = { n: st === null ? null : (st < 4 ? 4 : st < 7 ? 3 : st < 10 ? 2 : st <= 13 ? 1 : 0), v: st };

  /* Lluvia intensa e inundaciones — ventanas móviles */
  const m1 = rainMax(P, d, 1), m3 = rainMax(P, d, 3), m6 = rainMax(P, d, 6),
        m12 = rainMax(P, d, 12), m24 = rainMax(P, d, 24);
  let nl;
  if ((m1 > 50 && m24 >= 150) || m3 >= 75) nl = 4;
  else if (m1 > 50 || m24 >= 100 || m6 >= 100) nl = 3;
  else if ((m1 >= 36 && m1 <= 50) || m12 >= 50 || m6 >= 75) nl = 2;
  else if ((m1 >= 25 && m1 <= 35) || m6 >= 40) nl = 1;
  else nl = 0;
  out.lluvia = { n: nl, m1, m6, m24 };

  /* Viento fuerte: manda el mayor entre la escala de SOSTENIDOS de LABMET
     (35-45 / 45-65 / 65-95 / ≥95 km/h) y la de RACHAS (≥50 / ≥70 / ≥90 /
     ≥100 km/h), más la subregla del sur (≥3 h seguidas del sur a >35 km/h
     sube a Amarillo como mínimo). Umbrales definidos por Jorge. */
  const sust = mx(seg(H.wind_speed_10m, d)), gust = mx(seg(H.wind_gusts_10m, d));
  const dirD = seg(H.wind_direction_10m, d), spdD = seg(H.wind_speed_10m, d);
  let racha = 0, corrida = 0;
  for (let i = 0; i < 24; i++){
    if (dirD[i] != null && spdD[i] != null && dirD[i] >= 157.5 && dirD[i] <= 202.5 && spdD[i] > 35){ corrida++; if (corrida > racha) racha = corrida; }
    else corrida = 0;
  }
  const sur = racha >= 3;
  if (sust === null) out.viento = { n: null, sust, gust, sur, racha };
  else {
    const nS = sust >= 95 ? 4 : sust >= 65 ? 3 : sust >= 45 ? 2 : sust >= 35 ? 1 : 0;
    const nG = (gust == null) ? 0 : gust >= 100 ? 4 : gust >= 90 ? 3 : gust >= 70 ? 2 : gust >= 50 ? 1 : 0;
    let n = Math.max(nS, nG);
    if (sur && n < 1) n = 1;
    out.viento = { n, sust, gust, sur, racha };
  }

  /* Tormentas eléctricas — cobertura según el modelo. La probabilidad por
     sí sola NO sube el nivel (ajuste aprobado por Jorge). El índice interno
     de inestabilidad (CAPE/rachas) se calcula aquí; «Tiempo severo» usa
     su propia regla: granizo y rachas durante la tormenta (criterios v2). */
  const cape = mx(seg(H.cape, d)), gustT = mx(seg(H.wind_gusts_10m, d));
  const codes = seg(H.weather_code, d);
  const hayTor = codes.some(c => c === 95 || c === 96 || c === 99);
  const hayGran = codes.some(c => c === 96 || c === 99);
  let tls = null;
  if (!(cape === null && gustT === null)){
    if (gustT != null && gustT >= 121) tls = 4;
    else if ((gustT != null && gustT >= 93) || (cape != null && cape >= 3000 && hayTor)) tls = 3;
    else if ((cape != null && cape >= 2000 && cape <= 2999) || (gustT != null && gustT >= 50 && gustT <= 92)) tls = 2;
    else if ((cape != null && cape >= 1000 && cape <= 1999) || (gustT != null && gustT >= 40 && gustT <= 49)) tls = 1;
    else tls = 0;
  }
  const horasTor = codes.filter(c => c === 95 || c === 96 || c === 99).length;
  const prob = mx(seg(H.precipitation_probability, d)) || 0;
    /* «Tiempo severo» con el concepto cubano de tormenta local severa
     (criterios v3, ajuste de Jorge del 30-oct-2026): severa = granizo de
     cualquier tamaño o rachas SUPERIORES a 90 km/h DURANTE la tormenta
     (tornado y tromba en la altura: el modelo no los señala). El CAPE no
     entra ni en niveles ni en textos. rachaTor = racha máxima SOLO en
     las horas con tormenta. Pata de viento: 50-74 Amarillo, 75-90
     Naranja, >90 Rojo, >=120 Morado. Pata de granizo: el código de
     granizo SOLO vale Amarillo; para subir necesita el aire frío en
     altura medido EN las horas con granizo: isoterma de 0 °C a 4.500 m
     o menos y temperatura a 500 hPa de -8 °C o menos (una puerta ->
     Naranja; las dos -> Rojo). Morado: granizo en Rojo Y rachas >90. */
  let ne;
  if (horasTor >= 8) ne = 3;
  else if (horasTor >= 4) ne = 2;
  else if (horasTor >= 1) ne = 1;
  else ne = 0;
  out.electricas = { n: ne, horasTor, prob, hayGran };
  const gustosTor = seg(H.wind_gusts_10m, d);
  let rachaTor = null;
  codes.forEach((c, i) => {
    if (c === 95 || c === 96 || c === 99){
      const g = gustosTor[i];
      if (g != null) rachaTor = (rachaTor === null) ? g : Math.max(rachaTor, g);
    }
  });
  const fls = H.freezing_level_height ? seg(H.freezing_level_height, d) : null;
  const t5s = H.temperature_500hPa ? seg(H.temperature_500hPa, d) : null;
  let granPuertas = 0, flMin = null;
  codes.forEach((c, i) => {
    if (c === 96 || c === 99){
      const fl = fls ? fls[i] : null, t5 = t5s ? t5s[i] : null;
      if (fl != null) flMin = (flMin === null) ? fl : Math.min(flMin, fl);
      const n = ((fl != null && fl <= 4500) ? 1 : 0) + ((t5 != null && t5 <= -8) ? 1 : 0);
      if (n > granPuertas) granPuertas = n;
    }
  });
  let nGran = 0;
  if (hayGran) nGran = granPuertas >= 2 ? 3 : granPuertas === 1 ? 2 : 1;
  let nViento = 0;
  if (rachaTor !== null){
    if (rachaTor >= 120) nViento = 4;
    else if (rachaTor > 90) nViento = 3;
    else if (rachaTor >= 75) nViento = 2;
    else if (rachaTor >= 50) nViento = 1;
  }
  let nSev = Math.max(nGran, nViento);
  if (nGran >= 3 && rachaTor !== null && rachaTor > 90) nSev = 4;
  out.severo = { n: nSev, hayGran, rachaTor, granPuertas, flMin };

  /* v17 · Peligro de incendios — ingredientes del punto para el día: la
     humedad relativa mínima y la lluvia total del día. El nivel se calcula
     en el ensamblado, combinándolos con el KBDI del punto (ver cargar). */
  out._rhMin = mn(seg(H.relative_humidity_2m, d));
  let pd = 0, pdOk = false;
  for (const v of seg(P, d)) if (v != null){ pd += v; pdOk = true; }
  out._pDia = pdOk ? pd : null;
  return out;
}

function kbdiSerie(loc){
  if (!loc || !loc.daily || !loc.daily.precipitation_sum || !loc.daily.temperature_2m_max) return null;
  const pr = loc.daily.precipitation_sum, tx = loc.daily.temperature_2m_max;
  let k = 0; const out = [];
  for (let i = 0; i < pr.length; i++){
    const p = pr[i] || 0, t = tx[i];
    if (p > 5) k = Math.max(0, k - (p - 5));
    if (t != null){
      const df = (200 - k) * (0.968 * Math.exp(0.0875 * t + 1.5552) - 8.30) / (1 + 10.88 * Math.exp(-0.001736 * 1300)) / 1000;
      if (df > 0) k = Math.min(200, k + df);
    }
    out.push(k);
  }
  return out;
}

function incendiosPunto(kbdi, rhMin, gust, pDia){
  if (kbdi == null) return { n: null, kbdi: null, rhMin, gust };
  let n = 0;
  if (kbdi >= 75) n = 1;
  if (kbdi >= 120 && (rhMin == null || rhMin <= 55)) n = 2;
  if ((kbdi >= 150 && rhMin != null && rhMin <= 40) || (kbdi >= 120 && rhMin != null && rhMin <= 30 && (gust || 0) >= 40)) n = 3;
  if (kbdi >= 170 && rhMin != null && rhMin <= 30 && (gust || 0) >= 50) n = 4;
  if (pDia != null && pDia >= 10) n = 0;
  else if (pDia != null && pDia >= 5) n = Math.min(n, 1);
  return { n, kbdi: Math.round(kbdi), rhMin, gust };
}

function zonasDe(idx, pts, clave, esPeor){
  const peor = {};
  for (let mi = 0; mi < MUNICIPIOS.length; mi++){
    if (MUN_PROV[mi] !== idx) continue;
    const r = pts[mi] && pts[mi][clave];
    if (!r || r.n == null) continue;
    const z = MUN_ZONA[mi];
    if (!peor[z] || r.n > peor[z].n || (r.n === peor[z].n && esPeor && esPeor(r, peor[z]))) peor[z] = r;
  }
  return peor;
}

function provZonas(idx, pts, clave, fmtValor, titulo, esPeor){
  const zonas = zonasDe(idx, pts, clave, esPeor);
  const claves = Object.keys(zonas);
  if (!claves.length) return { n: null, det: "Sin datos del modelo" };
  const n = Math.max(...claves.map(z => zonas[z].n));
  const partes = ["I", "N", "S", "C"].filter(z => zonas[z]).map(z => ZONA_TXT[z] + " " + fmtValor(zonas[z]));
  return { n, zonas, det: titulo + partes.join(" · ") };
}

function calcularMar(p, d, M){
  const out = {};
  function datosMar(idxs){
    let Hmax = null, Per = null;
    if (M){
      for (const mi of idxs){
        const loc = M[mi]; if (!loc || !loc.hourly) continue;
        const wh = seg(loc.hourly.wave_height, d), wp = seg(loc.hourly.wave_period, d);
        for (let i = 0; i < 24; i++){
          if (wh[i] != null && (Hmax === null || wh[i] > Hmax)){ Hmax = wh[i]; Per = wp[i]; }
        }
      }
    }
    return { Hmax, Per };
  }
  function nivelesMar(Hmax, Per){
    if (Hmax === null) return { oleaje: { n:null, det:"Sin datos del estado del mar" }, resaca: { n:null, det:"Sin datos del estado del mar" } };
    const no = Hmax >= 4.6 ? 4 : Hmax >= 3 ? 3 : Hmax >= 2.1 ? 2 : Hmax >= 1.5 ? 1 : 0;
    let nr;
    if (Hmax > 2.5) nr = 4;
    else if (Hmax > 1.5) nr = 3;
    else if (Hmax > 1.0) nr = 2;
    else if (Hmax >= 0.6 && Per != null && Per >= 8) nr = 1;
    else nr = 0;
    return {
      oleaje: { n:no, det:"H máx " + f1(Hmax) + " m" },
      resaca: { n:nr, det:"Rompientes ≈ " + f1(Hmax) + " m · período " + (Per == null ? "—" : f1(Per)) + " s" }
    };
  }
  out.mar = {};
  for (const [cl, idxs] of [["N", p.marN], ["S", p.marS], ["C", p.marC]]){
    if (!idxs || !idxs.length) continue;
    const dm = datosMar(idxs);
    out.mar[cl] = nivelesMar(dm.Hmax, dm.Per);
  }
  const peorCosta = (k) => {
    let best = null;
    for (const cl of ["N", "S", "C"]){
      const v = out.mar[cl] && out.mar[cl][k];
      if (v && v.n != null && (best === null || v.n > best.n)) best = v;
    }
    return best || { n:null, det:"Sin datos del estado del mar" };
  };
  out.oleaje = peorCosta("oleaje");
  out.resaca = peorCosta("resaca");
  return out;
}

function ciclonPunto(lat, lon, ciclones){
  if (ciclones === null) return { n: null, dist: null };
  let n = 0, dist = null;
  for (const st of ciclones){
    let dmin = Infinity;
    for (const pt of st.pts) dmin = Math.min(dmin, havKm(lat, lon, pt.lat, pt.lon));
    if (dmin > 600) continue;
    const kmh = Math.round(st.kt * 1.852);
    const directo = kmh < 96 ? 2 : kmh < 178 ? 3 : 4;
    const nv = dmin <= 250 ? directo : (kmh >= 96 ? 2 : 1);
    if (nv > n){ n = nv; dist = dmin; }
  }
  return { n, dist };
}

function armarProvincia(idx, d, pts, M, ciclones){
  const p = PROVS[idx], out = {};

  out.calor = provZonas(idx, pts, "calor", r => f1(r.v) + " °C", "Índice de calor por zonas — ", (r, a) => (r.v ?? -99) > (a.v ?? -99));

  out.frio = provZonas(idx, pts, "frio", r => f1(r.v) + " °C", "Sensación mín. por zonas — ", (r, a) => (r.v ?? 99) < (a.v ?? 99));
  if (out.frio.n) out.frio.det = FRIO_DESC[out.frio.n] + " · " + out.frio.det;

  out.lluvia = provZonas(idx, pts, "lluvia", r => f1(r.m24) + " mm", "Lluvia por zonas, en 24 h — ", (r, a) => r.m24 > a.m24);
  if (out.lluvia.zonas){
    const zs = Object.values(out.lluvia.zonas);
    out.lluvia.det += " · máx. en 1 h: " + f1(Math.max(...zs.map(r => r.m1))) + " mm";
    const m6 = Math.max(...zs.map(r => r.m6));
    if (m6 >= 40) out.lluvia.det += " · " + f1(m6) + " mm/6 h";
  }

  out.viento = provZonas(idx, pts, "viento", r => "sost. " + f0(r.sust) + " · racha " + f0(r.gust) + " km/h", "Viento por zonas — ", (r, a) => (r.gust ?? 0) > (a.gust ?? 0));
  if (out.viento.zonas && Object.values(out.viento.zonas).some(r => r.sur))
    out.viento.det += " · sur establecido (≥3 h a más de 35 km/h) en alguna zona";

  out.electricas = provZonas(idx, pts, "electricas", r => f0(r.horasTor) + " h con tormenta", "Tormentas por zonas — ", (r, a) => r.horasTor > a.horasTor);

    /* Tiempo severo por zonas (criterios v3): granizo con su
     isoterma de 0 °C y rachas durante la tormenta; sin CAPE. */
  out.severo = provZonas(idx, pts, "severo", r => r.hayGran ? "granizo en el modelo" + (r.flMin != null ? " · isoterma 0 °C a " + f0(r.flMin) + " m" : "") + (r.rachaTor != null ? " · rachas en tormenta " + f0(r.rachaTor) + " km/h" : "") : (r.rachaTor != null ? "rachas en tormenta hasta " + f0(r.rachaTor) + " km/h" : "tormentas sin rachas fuertes"), "Severidad por zonas — ", (r, a) => (r.rachaTor ?? -1) > (a.rachaTor ?? -1));
  /* Sin descripción técnica por zonas en este fenómeno (decisión de Jorge,
     30-oct-2026): en la lista y la ficha se queda el nivel, su significado
     y la recomendación; el detalle de granizo/isoterma/rachas no se muestra. */
  if (out.severo) out.severo.det = "";
  if (out.electricas.n === 0 && !Object.values(out.electricas.zonas || {}).some(r => r.horasTor > 0)){
    const probMax = Math.max(0, ...Object.values(out.electricas.zonas || {}).map(r => r.prob || 0));
    if (out.electricas.zonas) out.electricas.det = "Sin horas de tormenta según el modelo · prob. máx. " + f0(probMax) + " %";
  }

  /* Niebla: nivel provincial = zona INTERIOR (ver nieblaZonal) */
  const nz = nieblaZonal(idx, pts);
  if (nz) out.niebla = nz;
  else if (pts.some(q => q && q.niebla && q.niebla.sinVentana))
    out.niebla = { n: 0, det: "La ventana de niebla de hoy (3 a 10 a. m.) ya terminó" };
  else out.niebla = { n: null, det: "Sin datos del modelo" };

  out.incendios = provZonas(idx, pts, "incendios", r => "KBDI " + f0(r.kbdi) + " · humedad mín. " + (r.rhMin == null ? "—" : f0(r.rhMin)) + " %", "Sequía del suelo por zonas — ", (r, a) => (r.kbdi ?? -1) > (a.kbdi ?? -1));

  const mar = calcularMar(p, d, M);
  out.mar = mar.mar; out.oleaje = mar.oleaje; out.resaca = mar.resaca;

  /* Ciclones tropicales (NHC): la distancia se mide desde el punto de la
     provincia más cercano al ciclón (antes, solo desde la capital). */
  if (ciclones === null) out.ciclon = { n:null, det:"Sin datos del NHC en este momento" };
  else {
    let mejor = null;
    for (const st of ciclones){
      let dmin = Infinity;
      for (let mi = 0; mi < MUNICIPIOS.length; mi++){
        if (MUN_PROV[mi] !== idx) continue;
        for (const pt of st.pts) dmin = Math.min(dmin, havKm(MUNICIPIOS[mi][2], MUNICIPIOS[mi][3], pt.lat, pt.lon));
      }
      if (dmin <= 600 && (mejor === null || dmin < mejor.dist)) mejor = { st, dist: dmin };
    }
    if (!mejor) out.ciclon = { n:0, det:"Sin ciclón tropical cercano" };
    else {
      const kmh = Math.round(mejor.st.kt * 1.852);
      const directo = kmh < 96 ? 2 : kmh < 178 ? 3 : 4;
      const n = mejor.dist <= 250 ? directo : (kmh >= 96 ? 2 : 1);
      out.ciclon = { n, det: mejor.st.name + " a unos " + f0(mejor.dist) + " km · vientos de " + f0(kmh) + " km/h" };
    }
  }
  return out;
}

function nivelMaximo(res){
  let m = null, clave = null;
  for (const k of PEL_TIERRA){
    const v = res[k];
    if (v && v.n != null && (m === null || v.n > m)){ m = v.n; clave = k; }
  }
  return { n:m, clave };
}

function principalDe(res){
  const t = nivelMaximo(res);
  let mejor = t.clave ? { clave: t.clave, n: t.n, costa: null, det: res[t.clave].det } : null;
  if (res.mar){
    for (const cl of ["N", "S", "C"]){
      const mc = res.mar[cl]; if (!mc) continue;
      for (const k of ["oleaje", "resaca"]){
        const v = mc[k];
        if (v && v.n != null && (mejor === null || v.n > mejor.n))
          mejor = { clave: k, n: v.n, costa: cl, det: v.det };
      }
    }
  }
  return mejor;
}

const ZONA_TXT = { N: "costa norte", I: "interior", S: "costa sur", C: "toda la isla" };

const COSTA_TXT = { N: "costa norte", S: "costa sur", C: "costa" };

const FRIO_DESC = ["", "Madrugada fría", "Madrugada muy fría", "Madrugada notablemente fría",
                   "Frío excepcional · posible helada en zonas bajas del interior"];

const PELIGROS = [
  ["ciclon",     "Ciclones tropicales"],
  ["lluvia",     "Lluvia intensa e inundaciones"],
  ["viento",     "Viento fuerte"],
  ["oleaje",     "Estado del mar"],
  ["resaca",     "Corrientes de resaca"],
  ["calor",      "Calor extremo"],
  ["frio",       "Frío extremo"],
  ["electricas", "Tormentas eléctricas"],
  ["severo",     "Tiempo severo"],
  ["niebla",     "Niebla"],
  ["incendios",  "Peligro de incendios"]
];

const PEL_TIERRA = ["calor", "frio", "lluvia", "viento", "niebla", "electricas", "severo", "incendios", "ciclon"];

const PEL_ORDEN = ["calor","frio","lluvia","viento","oleaje","resaca","niebla","electricas","severo","incendios","ciclon"];

const DIAS_TXT = ["Hoy","Mañana","Pasado mañana"];

const RECO = {
  calor: {
    1: "Sensación de calor fuerte al mediodía y la tarde. Recomendación: toma agua con frecuencia y evita el sol directo en las horas centrales.",
    2: "Sensación de calor muy fuerte; el cuerpo se agota rápido al sol. Recomendación: limita el trabajo al aire libre, descansa a la sombra e hidrátate.",
    3: "Calor agobiante, con riesgo de agotamiento y deshidratación. Recomendación: evita esfuerzos al sol entre las 11 a. m. y las 4 p. m.; atención especial a niños y ancianos.",
    4: "Calor extremo, con peligro real de golpe de calor. Recomendación: no te expongas al sol, busca lugares frescos y cuida a niños, ancianos y enfermos."
  },
  frio: {
    1: "Sensación de frío en la madrugada, inusual para Cuba. Recomendación: abrígate al salir temprano, sobre todo niños y ancianos.",
    2: "Frío notable en la madrugada. Recomendación: usa abrigo y protege a las personas más vulnerables.",
    3: "Frío intenso en la madrugada. Recomendación: abrígate bien, protege a niños, ancianos y mascotas, y ten cuidado con braseros en espacios cerrados.",
    4: "Frío excepcional para Cuba. Recomendación: evita la exposición prolongada y protege a las personas vulnerables y los cultivos sensibles."
  },
  lluvia: {
    1: "Lluvias con acumulados moderados en poco tiempo. Recomendación: precaución en zonas bajas, vados y caminos de tierra.",
    2: "Lluvias fuertes que pueden inundar zonas bajas y de mal drenaje. Recomendación: no cruces corrientes crecidas ni calles inundadas.",
    3: "Lluvias muy fuertes, con inundaciones probables. Recomendación: evita desplazamientos innecesarios y aléjate de ríos y arroyos crecidos.",
    4: "Lluvias extremas, con inundaciones importantes. Recomendación: aléjate de ríos, arroyos y zonas bajas, y sigue las indicaciones de las autoridades locales."
  },
  viento: {
    1: "Viento fuerte por momentos. Recomendación: asegura los objetos sueltos de patios y azoteas.",
    2: "Viento fuerte sostenido, con rachas mayores. Recomendación: asegura techos ligeros y objetos sueltos, y maneja con precaución.",
    3: "Viento muy fuerte, que puede dañar techos débiles y derribar árboles. Recomendación: evita estar bajo árboles, tendidos eléctricos y vallas.",
    4: "Viento destructivo. Recomendación: permanece en un lugar seguro y alejado de las ventanas hasta que pase."
  },
  oleaje: {
    1: "Mar movido, con oleaje moderado. Recomendación: precaución para bañistas y embarcaciones menores.",
    2: "Oleaje fuerte en esta costa. Recomendación: las embarcaciones menores no deben salir y el baño es peligroso.",
    3: "Oleaje muy fuerte, con posibles penetraciones ligeras en las zonas más bajas del litoral. Recomendación: no navegues ni te bañes; aléjate de malecones y rompientes.",
    4: "Oleaje extremo, con inundaciones costeras. Recomendación: aléjate del litoral y sigue las orientaciones de las autoridades locales."
  },
  resaca: {
    1: "Corrientes de resaca presentes. Recomendación: los bañistas deben tener precaución, sobre todo con los niños.",
    2: "Resaca fuerte: las corrientes arrastran mar adentro. Recomendación: no te bañes en esta costa.",
    3: "Resaca muy fuerte y peligrosa. Recomendación: no te bañes; aléjate de rompientes, muelles y espigones.",
    4: "Resaca extrema, con olas que pueden arrastrar personas. Recomendación: no te acerques a la orilla."
  },
  niebla: {
    1: "Visibilidad reducida en la madrugada y las primeras horas. Recomendación: maneja con precaución y con las luces encendidas.",
    2: "Niebla en parte de la provincia, sobre todo del interior. Recomendación: reduce la velocidad y aumenta la distancia con el vehículo de adelante.",
    3: "Niebla densa en la madrugada: la visibilidad cae por debajo de 1 km. Recomendación: evita viajar antes de que se disipe; si tienes que hacerlo, ve despacio y con las luces bajas.",
    4: "Niebla muy densa: visibilidad casi nula por momentos en las zonas señaladas. Recomendación: no viajes hasta que mejore; el riesgo de accidentes es alto."
  },
  electricas: {
    1: "Tormentas eléctricas en parte del día. Recomendación: si escuchas truenos, busca refugio en un lugar cerrado.",
    2: "Tormentas eléctricas frecuentes. Recomendación: evita campos abiertos, el mar y los objetos metálicos mientras dure la tormenta.",
    3: "Tormentas fuertes y prolongadas durante buena parte del día. Recomendación: permanece bajo techo mientras dure la tormenta y evita campos abiertos, el mar y los objetos metálicos."
  },
  severo: {
    1: "Tormentas fuertes, por debajo del nivel severo: rachas de hasta 74 km/h durante la tormenta o granizo pequeño posible. Recomendación: si escuchas truenos, busca refugio en un lugar cerrado y asegura los objetos sueltos.",
    2: "Tormentas muy fuertes: rachas de 75 a 90 km/h durante la tormenta, o granizo con parte del aire frío necesario en altura. Recomendación: permanece bajo techo mientras dure la tormenta y asegura los objetos del exterior.",
    3: "Tormenta local severa según el modelo: granizo de cualquier tamaño con el aire frío en altura necesario (isoterma de 0 °C baja y frío a 500 hPa), o rachas superiores a 90 km/h durante la tormenta. Recomendación: permanece en un lugar seguro, protege vehículos y cultivos del granizo y aléjate de las ventanas.",
    4: "Tormenta local severa con varias señales a la vez: granizo con aire frío en altura y rachas superiores a 90 km/h, o rachas extremas durante la tormenta. Recomendación: permanece en un lugar seguro hasta que pase la tormenta; hay riesgo de daños por el granizo y el viento."
  },
  incendios: {
    1: "El suelo y la hojarasca se están secando: un fuego puede prender y extenderse. Recomendación: no quemes desechos ni hagas fogatas, y apaga bien cualquier brasa.",
    2: "Peligro moderado de incendios: la vegetación seca arde y el viento ayuda a propagar el fuego. Recomendación: evita toda quema al aire libre y avisa si ves humo.",
    3: "Peligro alto de incendios: con el suelo muy seco y el aire seco, el fuego puede salirse de control rápidamente. Recomendación: no hagas quemas bajo ningún concepto y mantén despejados los alrededores de la vivienda.",
    4: "Peligro extremo de incendios: sequía severa, aire muy seco y viento fuerte — cualquier chispa puede iniciar un incendio difícil de contener. Recomendación: evita el fuego en exteriores por completo y avisa de inmediato a los bomberos ante cualquier humo."
  },
  ciclon: {
    1: "Un ciclón tropical se mueve por la región, aún lejos de la provincia. Recomendación: mantente informado; todavía no requiere medidas.",
    2: "Un ciclón tropical se acerca a la provincia. Recomendación: revisa tu plan familiar y sigue las informaciones oficiales y de la Defensa Civil.",
    3: "Un ciclón tropical está afectando o a punto de afectar la provincia. Recomendación: cumple las orientaciones de la Defensa Civil y asegura tu vivienda.",
    4: "Un huracán intenso está sobre la provincia o muy próximo. Recomendación: permanece en un lugar seguro y sigue a la Defensa Civil en todo momento."
  }
}

/* ============ CARGA POR PROVINCIA (adaptación de cargar()) ============ */
async function cargarProvincia(idx){
  const mis = [];
  for (let mi = 0; mi < MUNICIPIOS.length; mi++) if (MUN_PROV[mi] === idx) mis.push(mi);
  const lats = mis.map(mi => MUNICIPIOS[mi][2]).join(","), lons = mis.map(mi => MUNICIPIOS[mi][3]).join(",");
  const urlF = "https://api.open-meteo.com/v1/forecast?latitude=" + lats + "&longitude=" + lons +
    "&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,precipitation_probability,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m,cape,visibility,freezing_level_height,temperature_500hPa&timezone=America%2FHavana&forecast_days=3";
  const mlats = MARPTS.map(q => q[0]).join(","), mlons = MARPTS.map(q => q[1]).join(",");
  const urlM = "https://marine-api.open-meteo.com/v1/marine?latitude=" + mlats + "&longitude=" + mlons +
    "&hourly=wave_height,wave_period&timezone=America%2FHavana&forecast_days=3";
  const urlKB = "https://api.open-meteo.com/v1/forecast?latitude=" + lats + "&longitude=" + lons +
    "&daily=precipitation_sum,temperature_2m_max&timezone=America%2FHavana&past_days=92&forecast_days=3";
  const urlN = "https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather_summary/MapServer/5/query?where=" +
    encodeURIComponent("basin='AL'") + "&outFields=stormname,stormtype,maxwind,lat,lon,tau,stormnum&returnGeometry=false&f=json";

  const pF = mc5FetchJSON(urlF);
  const pM = mc5Sleep(1200).then(() => mc5FetchJSON(urlM, { esperas: [0, 9000] })).catch(() => null);
  const pKB = mc5Sleep(2400).then(() => mc5FetchJSON(urlKB, { esperas: [0, 9000] })).catch(() => null);
  const pN = mc5Sleep(600).then(() => fetch(urlN)).then(r => r.json()).then(j => {
    const storms = {};
    for (const f of (j.features || [])){
      const a = f.attributes;
      if (a.lat == null || a.lon == null) continue;
      const key = (a.stormnum || a.stormname || "?") + "";
      if (!storms[key]) storms[key] = { name: a.stormname || "Ciclón", pts: [], kt: 0 };
      storms[key].pts.push({ lat: a.lat, lon: a.lon });
      if ((a.tau === 0 || a.tau == null) && a.maxwind != null) storms[key].kt = Math.max(storms[key].kt, a.maxwind);
      if (a.maxwind != null && storms[key].kt === 0) storms[key].kt = a.maxwind;
    }
    return Object.values(storms).filter(s => s.pts.length && s.kt > 0);
  }).catch(() => null);

  let datosF = await pF; /* si esto falla, el error sube tal cual (con .status) */
  const datosM0 = await pM;
  const ciclones = await pN;
  const datosKB = await pKB;
  if (datosF && !Array.isArray(datosF)) datosF = [datosF];
  const datosM = (datosM0 && !Array.isArray(datosM0)) ? [datosM0] : datosM0;
  let KB = null;
  if (datosKB){ const a = Array.isArray(datosKB) ? datosKB : [datosKB]; KB = a.map(kbdiSerie); }

  const puntosDia = {}, resultados = [];
  for (let d = 0; d < 3; d++){
    const pts = new Array(MUNICIPIOS.length).fill(null);
    mis.forEach((mi, kk) => {
      const loc = datosF[kk];
      if (!loc || !loc.hourly) return;
      const r = calcularPunto(loc, d);
      const np = nieblaPunto(loc.hourly, d);
      r.niebla = !np ? null
        : np.sinVentana ? { n: 0, sinVentana: true }
        : { km: np.km, conLluvia: np.conLluvia, n: np.conLluvia ? (np.km <= 5 ? 1 : 0) : nivelVisKm(np.km) };
      r.ciclon = ciclonPunto(MUNICIPIOS[mi][2], MUNICIPIOS[mi][3], ciclones);
      const ks = (KB && KB[kk]) ? KB[kk][92 + d] : null;
      r.incendios = incendiosPunto(ks != null ? ks : null, r._rhMin, r.viento ? r.viento.gust : null, r._pDia);
      pts[mi] = r;
    });
    puntosDia[d] = pts;
    const res = armarProvincia(idx, d, pts, datosM, ciclones);
    resultados[d] = { res, max: nivelMaximo(res) };
  }
  const tiempos = (datosF[0] && datosF[0].hourly && datosF[0].hourly.time) || [];
  return { resultados, puntosDia, tiempos };
}

const PEL_NOM = Object.fromEntries(PELIGROS);
window.MC_PROV = { PROVS, MUNICIPIOS, MC2_NOMBRES, nomMun, NIVELES, SIN_DATOS,
  PELIGROS, PEL_TIERRA, PEL_ORDEN, PEL_NOM, RECO, DIAS_TXT,
  principalDe, nivelMaximo, cargarProvincia, f0, f1 };
