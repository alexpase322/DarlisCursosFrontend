import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
    ArrowLeft, ArrowRight, Download, RefreshCw, Check, X,
    AlertCircle, Copy, Sparkles
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTRUCTOR DE PUBLICACIONES
// Flujo de 7 pasos (Objetivo → Idea → Ángulo → Hook → Desarrollo → Cierre → CTA)
// más una pantalla de resumen. Todo se guarda solo.
// ─────────────────────────────────────────────────────────────────────────────

const CLAVE = "arquitecta:constructor-publicaciones:v1";

// ── Capa de guardado ─────────────────────────────────────────────────────────
// Aislada a propósito: para guardar en la plataforma en vez del navegador,
// solo se cambian estas dos funciones.
async function saveData(datos) {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
}
async function loadData() {
    try {
        const crudo = localStorage.getItem(CLAVE);
        return crudo ? JSON.parse(crudo) : null;
    } catch {
        return null;
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// CONTENIDO DE LA CLASE  ·  ⚠️ TEXTOS PENDIENTES DE REEMPLAZAR
//
// Todo lo que sigue son ejemplos provisionales. El guion pedía "los ejemplos
// exactos del video", pero ese texto no llegó. Está todo aquí junto y en un
// solo bloque para que sustituirlo sea copiar y pegar, sin tocar nada más.
// ═════════════════════════════════════════════════════════════════════════════

const OBJETIVOS = [
    { id: "conectar", nombre: "Conectar", pregunta: "¿Quiero que me conozcan y se identifiquen conmigo?" },
    { id: "posicionar", nombre: "Posicionar", pregunta: "¿Quiero mostrar que sé de lo que hablo?" },
    { id: "convertir", nombre: "Convertir", pregunta: "¿Quiero que hagan algo después de verme?" }
];

// Un mismo tema, tres publicaciones distintas según el objetivo.
const EJEMPLO_OBJETIVOS = {
    tema: "Creación de contenido",
    piezas: [
        { objetivo: "Conectar", texto: "Los dos años que publiqué sin que nadie me viera, y qué aprendí de eso." },
        { objetivo: "Posicionar", texto: "Las 3 razones por las que tu contenido no vende, aunque tenga buenas vistas." },
        { objetivo: "Convertir", texto: "Te dejo la plantilla con la que armo mi calendario del mes. Escríbeme y te la mando." }
    ]
};

// De tema general a idea específica.
const EJEMPLOS_IDEA = [
    { general: "Creación de contenido", especifico: "Por qué publicar todos los días te está haciendo daño" },
    { general: "Maternidad y negocio", especifico: "Cómo organizo mi semana de trabajo con dos niños en casa" }
];

const ANGULOS = [
    { id: "error", nombre: "Error", icono: "✕", ejemplo: "El error que cometí durante dos años: publicar sin saber para quién." },
    { id: "historia", nombre: "Historia", icono: "❝", ejemplo: "El mes que no vendí nada y lo que cambió después." },
    { id: "opinion", nombre: "Opinión", icono: "✦", ejemplo: "No creo en publicar todos los días. Te digo por qué." },
    { id: "tutorial", nombre: "Tutorial", icono: "☰", ejemplo: "Cómo armar tu calendario de contenido de la semana en 20 minutos." },
    { id: "problema", nombre: "Problema", icono: "!", ejemplo: "Si no sabes qué publicar, el problema no es la creatividad." },
    { id: "resultado", nombre: "Resultado", icono: "↑", ejemplo: "De 3 mensajes al mes a 40, cambiando solo una cosa." },
    { id: "objecion", nombre: "Objeción", icono: "?", ejemplo: "\"No tengo tiempo para crear contenido\". Vamos a hablar de eso." }
];

// Hook sugerido según el ángulo elegido.
const HOOKS = {
    error: { tipo: "Problema", texto: "Llevas meses publicando y no pasa nada. Te digo por qué." },
    historia: { tipo: "Identificación", texto: "Si alguna vez sentiste que hablabas sola en internet, esto es para ti." },
    opinion: { tipo: "Opinión", texto: "Lo que voy a decir no le va a gustar a mucha gente." },
    tutorial: { tipo: "Curiosidad", texto: "Hay una forma de dejar listo tu contenido de la semana en una sola sentada." },
    problema: { tipo: "Problema", texto: "No sabes qué publicar, y no es porque te falten ideas." },
    resultado: { tipo: "Resultado", texto: "Pasé de 3 mensajes al mes a 40. Cambié una sola cosa." },
    objecion: { tipo: "Identificación", texto: "\"No tengo tiempo\". Te entiendo, yo decía lo mismo." }
};

// Estructura del desarrollo según el ángulo.
const DESARROLLOS = {
    problema:  ["Problema", "Explicación", "Solución"],
    historia:  ["Conflicto", "Aprendizaje"],
    error:     ["Consecuencia", "Corrección"],
    tutorial:  ["Paso 1", "Paso 2", "Paso 3"],
    resultado: ["Antes", "Proceso", "Después"],
    opinion:   ["Problema", "Explicación", "Solución"],
    objecion:  ["Problema", "Explicación", "Solución"]
};

const REENGANCHES = [
    "Aquí viene el error que nadie te explicó",
    "Esto es lo que nadie me había explicado"
];

const CIERRE_CONTRASTE = {
    no: "Escríbeme al DM y te paso la plantilla.",
    si: "Publicar sin rumbo cansa. Ordenar tus temas es lo que hace que dejes de improvisar."
};

const CTAS = [
    { id: "conexion", nombre: "Conexión", ejemplo: "Cuéntame en comentarios si te ha pasado." },
    { id: "posicionamiento", nombre: "Posicionamiento", ejemplo: "Guarda esto para cuando no sepas qué publicar." },
    { id: "comunidad", nombre: "Comunidad", ejemplo: "Etiqueta a esa amiga que lleva meses queriendo empezar." },
    { id: "crecimiento", nombre: "Crecimiento", ejemplo: "Sígueme si quieres aprender a ordenar tu contenido." },
    { id: "leads", nombre: "Leads", ejemplo: "Escribe PILARES y te mando la plantilla al DM." },
    { id: "conversion", nombre: "Conversión", ejemplo: "Las puertas del programa se abren el lunes. El enlace está en mi perfil." }
];

// ═════════════════════════════════════════════════════════════════════════════

const PASOS = [
    "Tu idea y tu objetivo", "Afina tu idea", "Elige tu ángulo", "Tu Hook",
    "Tu Desarrollo", "Tu Cierre", "Tu CTA", "Tu publicación"
];

const nuevaVersion = () => ({
    id: `v_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    angulo: null, hook: "", desarrollo: {}, cierre: "", ctaTipo: null, ctaTexto: ""
});

// tema, objetivo e idea son compartidos; el resto vive en cada versión, que es
// lo que permite construir dos publicaciones distintas de una misma idea.
const estadoInicial = () => ({
    tema: "", objetivo: null, idea: "",
    versiones: [nuevaVersion()],
    actual: 0
});

const C = {
    ivory: "#F7F3EF", nude: "#F1E2D9", blush: "#E9C9C5", lavanda: "#D6C5D8",
    vino: "#6B2B3A", coral: "#E8A6A0", suave: "#8A6A70", tenue: "#A8807F"
};

function ConstructorPublicaciones() {
    const [datos, setDatos] = useState(null);
    const [paso, setPaso] = useState(1);
    const [aviso, setAviso] = useState("");
    const [copiado, setCopiado] = useState(null);
    const [pestana, setPestana] = useState(0);
    const guardadoRef = useRef(null);
    const datosRef = useRef(null);

    useEffect(() => {
        loadData().then(g => setDatos(g || estadoInicial()));
    }, []);

    useEffect(() => { datosRef.current = datos; }, [datos]);

    // Autoguardado: 1s después de la última tecla.
    useEffect(() => {
        if (!datos) return;
        clearTimeout(guardadoRef.current);
        guardadoRef.current = setTimeout(() => saveData(datos), 1000);
        return () => clearTimeout(guardadoRef.current);
    }, [datos]);

    // Red de seguridad si cierra antes de que salte el temporizador. Sin
    // dependencias: si dependiera de `datos`, su limpieza correría en cada
    // tecla y guardaría siempre, anulando el debounce.
    useEffect(() => {
        const alSalir = () => { if (datosRef.current) saveData(datosRef.current); };
        window.addEventListener("beforeunload", alSalir);
        return () => { window.removeEventListener("beforeunload", alSalir); alSalir(); };
    }, []);

    useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [paso]);

    const v = datos?.versiones[datos.actual];
    const angulo = useMemo(() => ANGULOS.find(a => a.id === v?.angulo) || null, [v]);

    const faltantes = useMemo(() => {
        if (!datos || !v) return [];
        const campos = [
            [!datos.tema.trim(), "el tema"],
            [!datos.objetivo, "el objetivo"],
            [!datos.idea.trim(), "la idea específica"],
            [!v.angulo, "el ángulo"],
            [!v.hook.trim(), "el hook"],
            [!Object.values(v.desarrollo || {}).some(x => (x || "").trim()), "el desarrollo"],
            [!v.cierre.trim(), "el cierre"],
            [!v.ctaTexto.trim(), "el CTA"]
        ];
        return campos.filter(([falta]) => falta).map(([, n]) => n);
    }, [datos, v]);

    const ir = useCallback((destino) => {
        // No se bloquea el avance, pero al llegar al resumen se avisa de lo que falta.
        if (destino === 8 && faltantes.length) {
            setAviso(`Te falta ${faltantes.join(", ")}. Puedes seguir y completarlo después, tu guion se guarda igual.`);
        } else {
            setAviso("");
        }
        setPaso(destino);
    }, [faltantes]);

    if (!datos) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: C.ivory }}>
                <p className="animate-pulse" style={{ color: C.vino }}>Preparando tu constructor…</p>
            </div>
        );
    }

    const set = (campo, valor) => setDatos(d => ({ ...d, [campo]: valor }));
    const setV = (campo, valor) => setDatos(d => ({
        ...d,
        versiones: d.versiones.map((ver, i) => (i === d.actual ? { ...ver, [campo]: valor } : ver))
    }));
    const setDesarrollo = (etiqueta, valor) => setDatos(d => ({
        ...d,
        versiones: d.versiones.map((ver, i) =>
            i === d.actual ? { ...ver, desarrollo: { ...ver.desarrollo, [etiqueta]: valor } } : ver)
    }));

    // Conserva tema e idea, abre una versión nueva y vuelve al paso del ángulo.
    const probarOtroAngulo = () => {
        setDatos(d => ({ ...d, versiones: [...d.versiones, nuevaVersion()], actual: d.versiones.length }));
        setAviso("");
        setPaso(3);
    };

    const copiar = (texto, id) => {
        navigator.clipboard?.writeText(texto);
        setCopiado(id);
        setTimeout(() => setCopiado(null), 1800);
    };

    const etiquetasDesarrollo = DESARROLLOS[v.angulo] || DESARROLLOS.problema;
    const construidas = datos.versiones.filter(ver => ver.angulo);

    return (
        <div className="min-h-screen" style={{ background: C.ivory }}>
            <Estilos />

            <div className="max-w-3xl mx-auto px-4 py-10 cons">

                <header className="text-center mb-8">
                    <p className="tracking-[0.25em] text-[11px] font-semibold mb-3" style={{ color: C.tenue }}>
                        ARQUITECTA DE TU PROPIO ÉXITO
                    </p>
                    <h1 className="cons-serif text-4xl md:text-5xl" style={{ color: C.vino }}>
                        Vamos a construir tu publicación
                    </h1>
                </header>

                <Progreso paso={paso} onIr={ir} />

                {aviso && (
                    <div className="flex items-start gap-3 rounded-2xl p-4 mb-6 no-print" style={{ background: C.nude }}>
                        <AlertCircle size={18} className="shrink-0 mt-0.5" style={{ color: C.vino }} />
                        <p className="text-sm flex-1 leading-relaxed" style={{ color: C.vino }}>{aviso}</p>
                        <button type="button" onClick={() => setAviso("")} aria-label="Cerrar" className="opacity-50 hover:opacity-100" style={{ color: C.vino }}>
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Recordatorio del ángulo elegido, a partir del paso 4 */}
                {angulo && paso > 3 && paso < 8 && (
                    <div className="flex items-center gap-2 mb-5 text-sm no-print" style={{ color: C.suave }}>
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0"
                            style={{ background: C.coral, color: C.vino }}>{angulo.icono}</span>
                        Estás construyendo desde el ángulo <strong style={{ color: C.vino }}>{angulo.nombre}</strong>
                    </div>
                )}

                {/* ── PASO 1 ── */}
                {paso === 1 && (
                    <Panel>
                        <Titulo>¿Sobre qué tema general quieres hablar?</Titulo>
                        <input
                            type="text" value={datos.tema} onChange={e => set("tema", e.target.value)}
                            placeholder="Ej: creación de contenido, maternidad y negocio"
                            className="w-full rounded-2xl px-4 py-3 text-sm outline-none campo mb-8"
                            style={{ background: C.ivory, color: C.vino, border: `1px solid ${C.nude}` }}
                        />

                        <Titulo>¿Y qué quieres lograr con esta publicación?</Titulo>
                        <div className="grid sm:grid-cols-3 gap-3 mb-8">
                            {OBJETIVOS.map(o => {
                                const sel = datos.objetivo === o.id;
                                return (
                                    <button key={o.id} type="button" onClick={() => set("objetivo", o.id)}
                                        className="text-left rounded-2xl p-4 transition-all"
                                        style={sel
                                            ? { background: C.coral, color: C.vino, boxShadow: "0 6px 18px rgba(232,166,160,.4)" }
                                            : { background: C.ivory, color: C.suave, border: `1px solid ${C.nude}` }}>
                                        <p className="cons-serif text-lg mb-1" style={{ color: C.vino }}>{o.nombre}</p>
                                        <p className="text-xs leading-relaxed">{o.pregunta}</p>
                                    </button>
                                );
                            })}
                        </div>

                        <Ejemplo titulo={`Un mismo tema — "${EJEMPLO_OBJETIVOS.tema}" — da tres publicaciones distintas`}>
                            <div className="space-y-3">
                                {EJEMPLO_OBJETIVOS.piezas.map(p => (
                                    <div key={p.objetivo}>
                                        <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: C.tenue }}>{p.objetivo}</p>
                                        <p className="text-sm leading-relaxed" style={{ color: C.vino }}>{p.texto}</p>
                                    </div>
                                ))}
                            </div>
                        </Ejemplo>
                    </Panel>
                )}

                {/* ── PASO 2 ── */}
                {paso === 2 && (
                    <Panel>
                        {datos.tema.trim() && (
                            <p className="text-sm mb-5" style={{ color: C.suave }}>
                                Tu tema: <strong style={{ color: C.vino }}>{datos.tema}</strong>
                            </p>
                        )}
                        <Titulo>¿Cuál es la idea específica?</Titulo>
                        <p className="text-sm mb-4 leading-relaxed" style={{ color: C.suave }}>
                            No el tema general, el ángulo exacto de HOY. Mientras más específica,
                            más fácil crear el contenido.
                        </p>
                        <textarea
                            value={datos.idea} onChange={e => set("idea", e.target.value)}
                            rows={3} placeholder="Ej: Por qué publicar todos los días te está haciendo daño"
                            className="w-full rounded-2xl p-4 text-sm leading-relaxed outline-none resize-y campo mb-8"
                            style={{ background: C.ivory, color: C.vino, border: `1px solid ${C.nude}` }}
                        />
                        <Ejemplo titulo="De tema general a idea específica">
                            <div className="space-y-3">
                                {EJEMPLOS_IDEA.map((e, i) => (
                                    <div key={i} className="flex flex-wrap items-center gap-2 text-sm">
                                        <span style={{ color: C.tenue }}>{e.general}</span>
                                        <ArrowRight size={13} style={{ color: C.coral }} />
                                        <span style={{ color: C.vino }}>{e.especifico}</span>
                                    </div>
                                ))}
                            </div>
                        </Ejemplo>
                    </Panel>
                )}

                {/* ── PASO 3 ── */}
                {paso === 3 && (
                    <Panel>
                        <Titulo>Elige tu ángulo</Titulo>
                        <p className="text-sm mb-6 leading-relaxed" style={{ color: C.suave }}>
                            La misma idea cambia por completo según desde dónde la cuentes. Elige uno.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {ANGULOS.map(a => {
                                const sel = v.angulo === a.id;
                                return (
                                    <button key={a.id} type="button" onClick={() => setV("angulo", a.id)}
                                        className="text-left rounded-2xl p-4 transition-all"
                                        style={sel
                                            ? { background: "#FFFFFF", border: `2px solid ${C.coral}`, boxShadow: "0 0 0 4px rgba(232,166,160,.22)" }
                                            : { background: C.ivory, border: `1px solid ${C.nude}` }}>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
                                                style={{ background: sel ? C.coral : "#FFFFFF", color: C.vino, border: `1px solid ${C.blush}` }}>
                                                {a.icono}
                                            </span>
                                            <p className="cons-serif text-lg" style={{ color: C.vino }}>{a.nombre}</p>
                                            {sel && <Check size={16} className="ml-auto" style={{ color: C.coral }} />}
                                        </div>
                                        <p className="text-xs leading-relaxed" style={{ color: C.suave }}>{a.ejemplo}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </Panel>
                )}

                {/* ── PASO 4 ── */}
                {paso === 4 && (
                    <Panel>
                        <Titulo>Construye tu Hook</Titulo>
                        <p className="text-sm mb-5 leading-relaxed" style={{ color: C.suave }}>
                            Su única función: detener el scroll y generar curiosidad.
                        </p>
                        {angulo && HOOKS[angulo.id] && (
                            <Ejemplo titulo={`Hook de ${HOOKS[angulo.id].tipo}, para el ángulo ${angulo.nombre}`}>
                                <p className="text-sm leading-relaxed" style={{ color: C.vino }}>{HOOKS[angulo.id].texto}</p>
                            </Ejemplo>
                        )}
                        <div className="mt-6">
                            <textarea
                                value={v.hook} onChange={e => setV("hook", e.target.value)}
                                rows={3} placeholder="Escribe tu Hook"
                                className="w-full rounded-2xl p-4 text-sm leading-relaxed outline-none resize-y campo"
                                style={{ background: C.ivory, color: C.vino, border: `1px solid ${C.nude}` }}
                            />
                            <p className="text-xs mt-3 leading-relaxed" style={{ color: C.tenue }}>
                                No es para engañar. Lo que prometas aquí, lo tienes que cumplir en el desarrollo.
                            </p>
                        </div>
                    </Panel>
                )}

                {/* ── PASO 5 ── */}
                {paso === 5 && (
                    <Panel>
                        <Titulo>Construye tu Desarrollo</Titulo>
                        <p className="text-sm mb-6 leading-relaxed" style={{ color: C.suave }}>
                            {angulo
                                ? <>Para el ángulo <strong style={{ color: C.vino }}>{angulo.nombre}</strong>, esta es la estructura que funciona.</>
                                : "Esta es la estructura general."}
                        </p>
                        <div className="space-y-4">
                            {etiquetasDesarrollo.map(et => (
                                <div key={et}>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: C.tenue }}>{et}</label>
                                    <textarea
                                        value={v.desarrollo[et] || ""} onChange={e => setDesarrollo(et, e.target.value)}
                                        rows={3} placeholder={`Escribe aquí tu ${et.toLowerCase()}`}
                                        className="w-full rounded-2xl p-4 text-sm leading-relaxed outline-none resize-y campo"
                                        style={{ background: C.ivory, color: C.vino, border: `1px solid ${C.nude}` }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-7 rounded-2xl p-5" style={{ background: C.lavanda }}>
                            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: C.vino }}>
                                Frases de reenganche
                            </p>
                            <div className="space-y-2">
                                {REENGANCHES.map((f, i) => (
                                    <button key={i} type="button" onClick={() => copiar(f, `r${i}`)}
                                        className="w-full flex items-center gap-3 text-left rounded-xl px-3 py-2.5 text-sm transition-colors"
                                        style={{ background: "#FFFFFF", color: C.vino }}>
                                        <span className="flex-1">{f}</span>
                                        {copiado === `r${i}`
                                            ? <Check size={15} className="shrink-0" style={{ color: C.coral }} />
                                            : <Copy size={15} className="shrink-0 opacity-40" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Panel>
                )}

                {/* ── PASO 6 ── */}
                {paso === 6 && (
                    <Panel>
                        <Titulo>Construye tu Cierre</Titulo>
                        <div className="rounded-2xl p-5 mb-6" style={{ background: C.blush }}>
                            <p className="cons-serif text-lg mb-1" style={{ color: C.vino }}>El cierre NO es el CTA.</p>
                            <p className="text-sm leading-relaxed" style={{ color: C.vino }}>
                                Aterriza tu idea, sin pedir nada todavía.
                            </p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3 mb-7">
                            <div className="rounded-2xl p-4" style={{ background: C.ivory, border: `1px solid ${C.nude}` }}>
                                <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: C.tenue }}>Esto NO es un cierre</p>
                                <p className="text-sm leading-relaxed line-through" style={{ color: C.suave }}>{CIERRE_CONTRASTE.no}</p>
                            </div>
                            <div className="rounded-2xl p-4" style={{ background: "#FFFFFF", border: `1px solid ${C.coral}` }}>
                                <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: C.tenue }}>Esto sí</p>
                                <p className="text-sm leading-relaxed" style={{ color: C.vino }}>{CIERRE_CONTRASTE.si}</p>
                            </div>
                        </div>
                        <textarea
                            value={v.cierre} onChange={e => setV("cierre", e.target.value)}
                            rows={3} placeholder="Escribe tu Cierre"
                            className="w-full rounded-2xl p-4 text-sm leading-relaxed outline-none resize-y campo"
                            style={{ background: C.ivory, color: C.vino, border: `1px solid ${C.nude}` }}
                        />
                    </Panel>
                )}

                {/* ── PASO 7 ── */}
                {paso === 7 && (
                    <Panel>
                        <Titulo>Elige tu CTA</Titulo>
                        <p className="text-sm mb-6 leading-relaxed" style={{ color: C.suave }}>
                            El CTA no siempre es “cómprame ya”. Depende de lo que quieres que la persona haga.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3 mb-6">
                            {CTAS.map(c => {
                                const sel = v.ctaTipo === c.id;
                                return (
                                    <button key={c.id} type="button" onClick={() => setV("ctaTipo", c.id)}
                                        className="text-left rounded-2xl p-4 transition-all"
                                        style={sel
                                            ? { background: "#FFFFFF", border: `2px solid ${C.coral}`, boxShadow: "0 0 0 4px rgba(232,166,160,.22)" }
                                            : { background: C.ivory, border: `1px solid ${C.nude}` }}>
                                        <p className="cons-serif text-base mb-1" style={{ color: C.vino }}>{c.nombre}</p>
                                        <p className="text-xs leading-relaxed" style={{ color: C.suave }}>{c.ejemplo}</p>
                                    </button>
                                );
                            })}
                        </div>
                        {v.ctaTipo && (
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: C.tenue }}>
                                    Tu versión de este CTA
                                </label>
                                <textarea
                                    value={v.ctaTexto} onChange={e => setV("ctaTexto", e.target.value)}
                                    rows={2} placeholder="Escríbelo con tus palabras"
                                    className="w-full rounded-2xl p-4 text-sm leading-relaxed outline-none resize-y campo"
                                    style={{ background: C.ivory, color: C.vino, border: `1px solid ${C.nude}` }}
                                />
                            </div>
                        )}
                    </Panel>
                )}

                {/* ── PASO 8 · RESUMEN ── */}
                {paso === 8 && (
                    <div>
                        {construidas.length === 0 ? (
                            <Panel>
                                <Titulo>Todavía no elegiste un ángulo</Titulo>
                                <p className="text-sm mb-6" style={{ color: C.suave }}>
                                    Vuelve al paso 3 y elige desde dónde vas a contar tu idea.
                                </p>
                                <Boton onClick={() => ir(3)}>Ir al paso 3</Boton>
                            </Panel>
                        ) : (
                            <>
                                {construidas.length > 1 && (
                                    <div className="flex flex-wrap gap-2 mb-5 no-print">
                                        {construidas.map((ver, i) => {
                                            const a = ANGULOS.find(x => x.id === ver.angulo);
                                            const act = pestana === i;
                                            return (
                                                <button key={ver.id} type="button" onClick={() => setPestana(i)}
                                                    className="px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all"
                                                    style={act
                                                        ? { background: C.coral, color: C.vino }
                                                        : { background: "#FFFFFF", color: C.suave, border: `1px solid ${C.nude}` }}>
                                                    Versión {i + 1} · {a?.nombre}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                <Panel>
                                    <div className="text-center mb-7">
                                        <Sparkles size={26} className="mx-auto mb-3" style={{ color: C.coral }} />
                                        <h2 className="cons-serif text-2xl mb-1" style={{ color: C.vino }}>¡Ya la tienes completa!</h2>
                                        <p className="text-sm" style={{ color: C.suave }}>Este es tu guion, listo para grabar o escribir.</p>
                                    </div>
                                    <Guion datos={datos} version={construidas[Math.min(pestana, construidas.length - 1)]} />
                                </Panel>

                                <div className="flex flex-col sm:flex-row gap-3 mt-6 no-print">
                                    <button type="button" onClick={() => window.print()}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold"
                                        style={{ background: C.coral, color: C.vino, boxShadow: "0 6px 20px rgba(232,166,160,.35)" }}>
                                        <Download size={18} /> Descargar mi guion
                                    </button>
                                    <button type="button" onClick={probarOtroAngulo}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold"
                                        style={{ background: "#FFFFFF", color: C.vino, border: `1px solid ${C.coral}` }}>
                                        <RefreshCw size={17} /> Probar otro ángulo con esta idea
                                    </button>
                                </div>
                                <p className="text-xs text-center mt-3 no-print" style={{ color: C.tenue }}>
                                    Al descargar se abre la ventana de impresión: elige <strong>Guardar como PDF</strong>.
                                </p>
                            </>
                        )}
                    </div>
                )}

                {/* Navegación */}
                <div className="flex items-center justify-between gap-3 mt-8 no-print">
                    <button type="button" onClick={() => ir(Math.max(1, paso - 1))} disabled={paso === 1}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold disabled:opacity-30"
                        style={{ color: C.vino }}>
                        <ArrowLeft size={17} /> Atrás
                    </button>
                    {paso < 8 && (
                        <button type="button" onClick={() => ir(paso + 1)}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold"
                            style={{ background: C.coral, color: C.vino }}>
                            {paso === 7 ? "Ver mi publicación" : "Siguiente"} <ArrowRight size={17} />
                        </button>
                    )}
                </div>

                {/* Hoja del PDF: los textarea no se estiran al imprimir y cortarían
                    el texto, así que se vuelca el guion como texto plano. */}
                <div className="solo-print" aria-hidden="true">
                    <h1 className="cons-serif" style={{ color: C.vino, fontSize: "24px", marginBottom: "2px" }}>Mi publicación</h1>
                    <p style={{ color: C.suave, fontSize: "12px", marginBottom: "20px" }}>Arquitecta de tu Propio Éxito</p>
                    {construidas.map((ver, i) => (
                        <div key={ver.id} className="bloque-print" style={{ marginBottom: "26px" }}>
                            {construidas.length > 1 && (
                                <p className="cons-serif" style={{ color: C.vino, fontSize: "15px", marginBottom: "8px" }}>
                                    Versión {i + 1} · {ANGULOS.find(a => a.id === ver.angulo)?.nombre}
                                </p>
                            )}
                            <Guion datos={datos} version={ver} paraImprimir />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Piezas ───────────────────────────────────────────────────────────────────

function Guion({ datos, version, paraImprimir = false }) {
    const angulo = ANGULOS.find(a => a.id === version.angulo);
    const cta = CTAS.find(c => c.id === version.ctaTipo);
    const objetivo = OBJETIVOS.find(o => o.id === datos.objetivo);
    const etiquetas = DESARROLLOS[version.angulo] || DESARROLLOS.problema;

    const filas = [
        ["Objetivo", objetivo?.nombre],
        ["Idea", datos.idea],
        ["Ángulo", angulo?.nombre],
        ["Hook", version.hook],
        ...etiquetas.map(et => [et, version.desarrollo?.[et]]),
        ["Cierre", version.cierre],
        [cta ? `CTA · ${cta.nombre}` : "CTA", version.ctaTexto]
    ];

    return (
        <div>
            {filas.map(([etiqueta, valor], i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3"
                    style={{ borderTop: i === 0 ? "none" : `1px solid ${C.blush}` }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider sm:w-32 shrink-0 sm:pt-0.5"
                        style={{ color: C.tenue }}>
                        {etiqueta}
                    </p>
                    <p className={`text-sm leading-relaxed flex-1 whitespace-pre-wrap ${paraImprimir ? "" : ""}`}
                        style={{ color: (valor || "").trim() ? C.vino : C.tenue }}>
                        {(valor || "").trim() || "—"}
                    </p>
                </div>
            ))}
        </div>
    );
}

function Progreso({ paso, onIr }) {
    return (
        <nav className="flex items-center justify-center gap-1 mb-8 no-print" aria-label="Progreso">
            {PASOS.map((nombre, i) => {
                const n = i + 1;
                const activo = paso === n;
                const hecho = paso > n;
                return (
                    <div key={n} className="flex items-center">
                        <button type="button" onClick={() => onIr(n)} title={nombre}
                            aria-label={`Paso ${n}: ${nombre}`} aria-current={activo ? "step" : undefined}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                            style={activo
                                ? { background: C.coral, color: C.vino, transform: "scale(1.12)", boxShadow: "0 4px 12px rgba(232,166,160,.4)" }
                                : hecho
                                    ? { background: C.nude, color: C.vino }
                                    : { background: "#FFFFFF", color: C.tenue, border: `1px solid ${C.nude}` }}>
                            {n}
                        </button>
                        {n < PASOS.length && (
                            <span className="w-3 h-px" style={{ background: paso > n ? C.coral : C.blush }} />
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

const Panel = ({ children }) => (
    <section className="rounded-3xl p-6 md:p-8" style={{ background: "#FFFFFF", boxShadow: "0 8px 30px rgba(107,43,58,.06)" }}>
        {children}
    </section>
);

const Titulo = ({ children }) => (
    <h2 className="cons-serif text-2xl mb-3" style={{ color: C.vino }}>{children}</h2>
);

const Boton = ({ onClick, children }) => (
    <button type="button" onClick={onClick} className="px-6 py-3 rounded-2xl font-bold"
        style={{ background: C.coral, color: C.vino }}>{children}</button>
);

const Ejemplo = ({ titulo, children }) => (
    <div className="rounded-2xl p-5" style={{ background: C.nude }}>
        <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: C.tenue }}>{titulo}</p>
        {children}
    </div>
);

function Estilos() {
    return (
        <style>{`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Inter:wght@400;500;600;700&display=swap');

.cons { font-family: 'Inter', -apple-system, 'Segoe UI', sans-serif; }
.cons-serif { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; }
.cons .campo:focus { border-color: ${C.coral} !important; background: #FFFFFF !important; }
.cons textarea, .cons input { font-family: inherit; }
.cons ::placeholder { color: #C4A9A6; }

.solo-print { display: none; }

@media print {
  body * { visibility: hidden !important; }
  .solo-print, .solo-print * { visibility: visible !important; }
  .solo-print { display: block !important; position: absolute; left: 0; top: 0; width: 100%; }
  .bloque-print { break-inside: avoid; page-break-inside: avoid; }
  @page { margin: 15mm; }
}
        `}</style>
    );
}

export default ConstructorPublicaciones;
