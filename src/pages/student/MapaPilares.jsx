import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
    Layers, ListChecks, Compass, Plus, Trash2, Download,
    Check, X, Sparkles, Lightbulb
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// MAPA DE PILARES
// Herramienta de trabajo para que la alumna construya sus pilares de contenido.
// Todo se guarda solo; no hay botón de "guardar".
// ─────────────────────────────────────────────────────────────────────────────

const CLAVE = "arquitecta:mapa-pilares:v1";
const MAX_PILARES = 5;
const MIN_PILARES = 3;

// ── Capa de guardado ─────────────────────────────────────────────────────────
// Aislada a propósito: el día que esto se guarde en la plataforma, solo hay que
// cambiar estas dos funciones por llamadas a la API. Nada más del archivo cambia.
async function saveData(datos) {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
}

async function loadData() {
    try {
        const crudo = localStorage.getItem(CLAVE);
        return crudo ? JSON.parse(crudo) : null;
    } catch {
        // Si el guardado se corrompió, se empieza limpio en vez de romper la página.
        return null;
    }
}

// ── Contenido fijo ───────────────────────────────────────────────────────────

const COLUMNAS = [
    { clave: "subtema", titulo: "Subtema", ayuda: "Ej: Creación de contenido para emprendedoras digitales" },
    { clave: "problema", titulo: "Problema o pregunta frecuente", ayuda: "Ej: Todos los días me pregunto qué puedo publicar" },
    { clave: "experiencia", titulo: "Experiencia", ayuda: "Ej: Yo pasé dos años publicando sin rumbo hasta que ordené mis temas" },
    { clave: "ensenar", titulo: "Qué puedo enseñar", ayuda: "Ej: Cómo agrupar todo lo que sé en pocos temas que sí se repiten" },
    { clave: "vender", titulo: "Qué puedo vender", ayuda: "Ej: Una asesoría para armar el calendario de contenido del mes" }
];

// Los seis ángulos. Sustituye estos ejemplos por los del video 2 cuando los tengas
// a mano: están en un solo sitio a propósito para que sea un copiar y pegar.
const ANGULOS = [
    { nombre: "Error", icono: "✕", texto: "El fallo que casi todas cometen al empezar, y qué hacer en su lugar.", ejemplo: "Ej: El error de publicar todos los días sin saber para quién." },
    { nombre: "Tutorial", icono: "☰", texto: "El paso a paso de algo concreto que tú ya sabes hacer.", ejemplo: "Ej: Cómo armar tu calendario de la semana en 20 minutos." },
    { nombre: "Historia", icono: "❝", texto: "Tu propio recorrido: de dónde saliste y cómo llegaste hasta aquí.", ejemplo: "Ej: Lo que me pasó el mes que no vendí nada." },
    { nombre: "Opinión", icono: "✦", texto: "Lo que piensas de algo que en tu sector se da por sentado.", ejemplo: "Ej: Por qué no creo en publicar todos los días." },
    { nombre: "Objeción", icono: "?", texto: "Esa duda que te repiten antes de comprarte, respondida de frente.", ejemplo: "Ej: \"No tengo tiempo para crear contenido\"." },
    { nombre: "Resultado", icono: "↑", texto: "El cambio concreto que tú o alguien logró, con datos si los tienes.", ejemplo: "Ej: De 3 a 40 mensajes al mes cambiando solo una cosa." }
];

const nuevoPilar = () => ({
    id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    nombre: "",
    subtema: "", problema: "", experiencia: "", ensenar: "", vender: ""
});

const estadoInicial = () => ({
    pilares: [nuevoPilar()],
    prueba: { pilarId: null, ideas: Array(10).fill("") }
});

// ── Página ───────────────────────────────────────────────────────────────────

function MapaPilares() {
    const [datos, setDatos] = useState(null);
    const [pantalla, setPantalla] = useState("pilares");
    const [verAngulos, setVerAngulos] = useState(false);
    const [aviso, setAviso] = useState("");
    const [porBorrar, setPorBorrar] = useState(null);
    const guardadoRef = useRef(null);

    useEffect(() => {
        loadData().then(guardado => setDatos(guardado || estadoInicial()));
    }, []);

    // Autoguardado: espera 1s desde la última tecla. Sin esto se escribiría en
    // disco en cada pulsación.
    useEffect(() => {
        if (!datos) return;
        clearTimeout(guardadoRef.current);
        guardadoRef.current = setTimeout(() => { saveData(datos); }, 1000);
        return () => clearTimeout(guardadoRef.current);
    }, [datos]);

    // El listener necesita los datos más recientes, pero si dependiera de `datos`
    // su limpieza correría en cada tecla y guardaría en cada pulsación, que es
    // justo lo que el debounce evita. Con la ref se registra una sola vez.
    const datosRef = useRef(datos);
    useEffect(() => { datosRef.current = datos; }, [datos]);

    // Si cierra la pestaña o cambia de página antes de que salte el
    // temporizador, se guarda igual.
    useEffect(() => {
        const alSalir = () => { if (datosRef.current) saveData(datosRef.current); };
        window.addEventListener("beforeunload", alSalir);
        return () => {
            window.removeEventListener("beforeunload", alSalir);
            alSalir();
        };
    }, []);

    const pilaresConNombre = useMemo(
        () => (datos?.pilares || []).filter(p => p.nombre.trim()),
        [datos]
    );

    const ideasLlenas = useMemo(
        () => (datos?.prueba.ideas || []).filter(i => i.trim()).length,
        [datos]
    );

    // Aviso amable al salir de la prueba con menos de 10. No bloquea.
    const cambiarPantalla = useCallback((destino) => {
        if (pantalla === "prueba" && destino !== "prueba" && datos?.prueba.pilarId) {
            const faltan = 10 - ideasLlenas;
            if (faltan > 0 && faltan < 10) {
                setAviso(`Te faltan ${faltan} ${faltan === 1 ? "idea" : "ideas"}. Si te cuesta llegar a 10, prueba con los 6 ángulos: error, tutorial, historia, opinión, objeción, resultado.`);
            }
        }
        setPantalla(destino);
    }, [pantalla, datos, ideasLlenas]);

    if (!datos) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F3EF" }}>
                <div className="animate-pulse" style={{ color: "#6B2B3A" }}>Abriendo tu mapa…</div>
            </div>
        );
    }

    const actualizarPilar = (id, campo, valor) => {
        setDatos(d => ({
            ...d,
            pilares: d.pilares.map(p => (p.id === id ? { ...p, [campo]: valor } : p))
        }));
    };

    const agregarPilar = () => {
        if (datos.pilares.length >= MAX_PILARES) return;
        setDatos(d => ({ ...d, pilares: [...d.pilares, nuevoPilar()] }));
    };

    const eliminarPilar = (id) => {
        setDatos(d => ({
            ...d,
            pilares: d.pilares.filter(p => p.id !== id),
            // Si borra el pilar que estaba probando, la prueba se queda sin dueño.
            prueba: d.prueba.pilarId === id ? { pilarId: null, ideas: Array(10).fill("") } : d.prueba
        }));
        setPorBorrar(null);
    };

    const actualizarIdea = (i, valor) => {
        setDatos(d => {
            const ideas = [...d.prueba.ideas];
            ideas[i] = valor;
            return { ...d, prueba: { ...d.prueba, ideas } };
        });
    };

    const elegirPilar = (id) => {
        setDatos(d => ({
            ...d,
            // Cambiar de pilar limpia las ideas: son de ese pilar, no del anterior.
            prueba: d.prueba.pilarId === id ? d.prueba : { pilarId: id, ideas: Array(10).fill("") }
        }));
    };

    const pilarDeLaPrueba = datos.pilares.find(p => p.id === datos.prueba.pilarId);
    const completo = ideasLlenas === 10;

    return (
        <div className="min-h-screen" style={{ background: "#F7F3EF" }}>
            <EstilosMapa />

            <div className="max-w-5xl mx-auto px-4 py-10 mapa" id="pantalla-mapa">

                {/* Cabecera */}
                <header className="text-center mb-10">
                    <p className="tracking-[0.25em] text-[11px] font-semibold mb-3" style={{ color: "#C08B86" }}>
                        ARQUITECTA DE TU PROPIO ÉXITO
                    </p>
                    <h1 className="mapa-serif text-4xl md:text-5xl mb-3" style={{ color: "#6B2B3A" }}>
                        Vamos a construir tus pilares
                    </h1>
                    <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: "#8A6A70" }}>
                        Aquí ordenas de qué hablas y qué vendes. Todo se guarda solo,
                        así que puedes volver cuando quieras y seguir donde lo dejaste.
                    </p>
                </header>

                {/* Navegación */}
                <nav className="flex flex-wrap justify-center gap-2 mb-8 no-print">
                    {[
                        { id: "pilares", icono: <Layers size={16} />, texto: "Mis pilares" },
                        { id: "prueba", icono: <ListChecks size={16} />, texto: "La prueba de los 10" },
                        { id: "angulos", icono: <Compass size={16} />, texto: "Los 6 ángulos" }
                    ].map(t => {
                        const activa = pantalla === t.id;
                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => cambiarPantalla(t.id)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all"
                                style={activa
                                    ? { background: "#E8A6A0", color: "#6B2B3A", boxShadow: "0 6px 18px rgba(232,166,160,.35)" }
                                    : { background: "#FFFFFF", color: "#8A6A70", border: "1px solid #F1E2D9" }}
                            >
                                {t.icono} {t.texto}
                            </button>
                        );
                    })}
                </nav>

                {/* Aviso amable */}
                {aviso && (
                    <div
                        className="flex items-start gap-3 rounded-2xl p-4 mb-6 no-print"
                        style={{ background: "#F1E2D9", color: "#6B2B3A" }}
                    >
                        <Lightbulb size={18} className="shrink-0 mt-0.5" />
                        <p className="text-sm leading-relaxed flex-1">{aviso}</p>
                        <button type="button" onClick={() => setAviso("")} aria-label="Cerrar aviso" className="shrink-0 opacity-60 hover:opacity-100">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* ── PANTALLA 1 ── */}
                {pantalla === "pilares" && (
                    <section className="space-y-6">
                        <p className="text-sm text-center" style={{ color: "#8A6A70" }}>
                            Necesitas entre {MIN_PILARES} y {MAX_PILARES} pilares.
                            Ahora tienes <strong style={{ color: "#6B2B3A" }}>{datos.pilares.length}</strong>.
                        </p>

                        {datos.pilares.map((pilar, i) => (
                            <article
                                key={pilar.id}
                                className="rounded-3xl p-6 md:p-8 tarjeta-pilar"
                                style={{ background: "#FFFFFF", boxShadow: "0 8px 30px rgba(107,43,58,.06)" }}
                            >
                                <div className="flex items-start gap-3 mb-6">
                                    <span
                                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-1"
                                        style={{ background: "#F1E2D9", color: "#6B2B3A" }}
                                    >
                                        {i + 1}
                                    </span>
                                    <input
                                        type="text"
                                        value={pilar.nombre}
                                        onChange={(e) => actualizarPilar(pilar.id, "nombre", e.target.value)}
                                        placeholder="Nombre del pilar · Ej: Negocios digitales"
                                        className="flex-1 min-w-0 mapa-serif text-2xl bg-transparent outline-none pb-2"
                                        style={{ color: "#6B2B3A", borderBottom: "1px solid #E9C9C5" }}
                                    />
                                    {datos.pilares.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setPorBorrar(pilar.id)}
                                            aria-label={`Eliminar pilar ${i + 1}`}
                                            className="shrink-0 p-2 rounded-xl transition-opacity opacity-40 hover:opacity-100 no-print"
                                            style={{ color: "#6B2B3A" }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {COLUMNAS.map(col => (
                                        <div key={col.clave}>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#A8807F" }}>
                                                {col.titulo}
                                            </label>
                                            <textarea
                                                value={pilar[col.clave]}
                                                onChange={(e) => actualizarPilar(pilar.id, col.clave, e.target.value)}
                                                placeholder={col.ayuda}
                                                rows={3}
                                                className="w-full rounded-2xl p-3 text-sm leading-relaxed outline-none resize-y transition-colors campo"
                                                style={{ background: "#F7F3EF", color: "#6B2B3A", border: "1px solid #F1E2D9" }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Confirmación de borrado */}
                                {porBorrar === pilar.id && (
                                    <div className="mt-5 rounded-2xl p-4 flex flex-wrap items-center gap-3 no-print" style={{ background: "#E9C9C5" }}>
                                        <p className="text-sm flex-1 min-w-[200px]" style={{ color: "#6B2B3A" }}>
                                            ¿Seguro que quieres eliminar este pilar? Se borra todo lo que escribiste en él.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => eliminarPilar(pilar.id)}
                                            className="px-4 py-2 rounded-xl text-sm font-bold"
                                            style={{ background: "#E8A6A0", color: "#6B2B3A" }}
                                        >
                                            Sí, eliminar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPorBorrar(null)}
                                            className="px-4 py-2 rounded-xl text-sm font-semibold"
                                            style={{ color: "#6B2B3A" }}
                                        >
                                            Mejor no
                                        </button>
                                    </div>
                                )}
                            </article>
                        ))}

                        <div className="flex flex-col items-center gap-3 pt-2 no-print">
                            <button
                                type="button"
                                onClick={agregarPilar}
                                disabled={datos.pilares.length >= MAX_PILARES}
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all disabled:opacity-40"
                                style={{ background: "#E8A6A0", color: "#6B2B3A" }}
                            >
                                <Plus size={18} /> Agregar pilar
                            </button>
                            {datos.pilares.length >= MAX_PILARES && (
                                <p className="text-sm" style={{ color: "#8A6A70" }}>
                                    Cinco pilares es el máximo. Más de eso deja de ser un sistema.
                                </p>
                            )}
                        </div>
                    </section>
                )}

                {/* ── PANTALLA 2 ── */}
                {pantalla === "prueba" && (
                    <section className="space-y-6">
                        {pilaresConNombre.length === 0 ? (
                            <div className="rounded-3xl p-10 text-center" style={{ background: "#FFFFFF" }}>
                                <Layers size={36} className="mx-auto mb-4" style={{ color: "#E8A6A0" }} />
                                <h2 className="mapa-serif text-2xl mb-2" style={{ color: "#6B2B3A" }}>
                                    Primero ponle nombre a un pilar
                                </h2>
                                <p className="text-sm mb-6" style={{ color: "#8A6A70" }}>
                                    Vuelve a “Mis pilares” y nombra al menos uno. Después regresas aquí.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => cambiarPantalla("pilares")}
                                    className="px-6 py-3 rounded-2xl font-bold"
                                    style={{ background: "#E8A6A0", color: "#6B2B3A" }}
                                >
                                    Ir a mis pilares
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="rounded-3xl p-6 md:p-8" style={{ background: "#FFFFFF", boxShadow: "0 8px 30px rgba(107,43,58,.06)" }}>
                                    <h2 className="mapa-serif text-2xl mb-2" style={{ color: "#6B2B3A" }}>
                                        La prueba de los 10 contenidos
                                    </h2>
                                    <p className="text-sm mb-5 leading-relaxed" style={{ color: "#8A6A70" }}>
                                        Elige uno de tus pilares y saca 10 ideas de contenido. Si salen las 10,
                                        ese pilar aguanta. Si no, quizá no era un pilar.
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {pilaresConNombre.map(p => {
                                            const elegido = datos.prueba.pilarId === p.id;
                                            return (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => elegirPilar(p.id)}
                                                    className="px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all"
                                                    style={elegido
                                                        ? { background: "#E8A6A0", color: "#6B2B3A" }
                                                        : { background: "#F7F3EF", color: "#8A6A70", border: "1px solid #F1E2D9" }}
                                                >
                                                    {p.nombre}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {pilarDeLaPrueba && (
                                    <div className="rounded-3xl p-6 md:p-8" style={{ background: "#FFFFFF", boxShadow: "0 8px 30px rgba(107,43,58,.06)" }}>
                                        {/* Contador */}
                                        <div className="flex items-center justify-between gap-4 mb-6">
                                            <p className="text-sm" style={{ color: "#8A6A70" }}>
                                                Pilar: <strong style={{ color: "#6B2B3A" }}>{pilarDeLaPrueba.nombre}</strong>
                                            </p>
                                            <p className="text-sm font-bold shrink-0" style={{ color: "#6B2B3A" }}>
                                                Llevas {ideasLlenas} de 10
                                            </p>
                                        </div>

                                        <div className="h-2 rounded-full overflow-hidden mb-7" style={{ background: "#F1E2D9" }}>
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{ width: `${ideasLlenas * 10}%`, background: "#E8A6A0" }}
                                            />
                                        </div>

                                        <ol className="space-y-3">
                                            {datos.prueba.ideas.map((idea, i) => (
                                                <li key={i} className="flex items-center gap-3">
                                                    <span
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                                        style={idea.trim()
                                                            ? { background: "#E8A6A0", color: "#6B2B3A" }
                                                            : { background: "#F1E2D9", color: "#A8807F" }}
                                                    >
                                                        {idea.trim() ? <Check size={14} /> : i + 1}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={idea}
                                                        onChange={(e) => actualizarIdea(i, e.target.value)}
                                                        placeholder={`Idea ${i + 1}`}
                                                        className="flex-1 min-w-0 rounded-2xl px-4 py-2.5 text-sm outline-none campo"
                                                        style={{ background: "#F7F3EF", color: "#6B2B3A", border: "1px solid #F1E2D9" }}
                                                    />
                                                </li>
                                            ))}
                                        </ol>

                                        {completo && (
                                            <div className="mt-7 rounded-2xl p-6 text-center" style={{ background: "#F1E2D9" }}>
                                                <Sparkles size={26} className="mx-auto mb-3" style={{ color: "#6B2B3A" }} />
                                                <p className="mapa-serif text-xl mb-1" style={{ color: "#6B2B3A" }}>¡Lo lograste!</p>
                                                <p className="text-sm" style={{ color: "#8A6A70" }}>
                                                    Nunca te faltaron temas, te faltaba el sistema.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                )}

                {/* ── PANTALLA 3 ── */}
                {pantalla === "angulos" && (
                    <section>
                        <div className="text-center mb-7">
                            <h2 className="mapa-serif text-3xl mb-2" style={{ color: "#6B2B3A" }}>Los 6 ángulos</h2>
                            <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: "#8A6A70" }}>
                                Cuando te quedes en blanco, vuelve aquí. Un mismo tema da para seis
                                contenidos distintos según desde dónde lo mires.
                            </p>
                        </div>
                        <ListaAngulos />
                    </section>
                )}

                {/* Hoja para el PDF. Los <textarea> no se estiran al imprimir y
                    cortarían el texto, así que se vuelca todo como texto plano.
                    Invisible en pantalla; lo único visible al imprimir. */}
                <div className="solo-print" aria-hidden="true">
                    <h1 className="mapa-serif" style={{ color: "#6B2B3A", fontSize: "26px", marginBottom: "2px" }}>
                        Mi Mapa de Pilares
                    </h1>
                    <p style={{ color: "#8A6A70", fontSize: "12px", marginBottom: "22px" }}>
                        Arquitecta de tu Propio Éxito
                    </p>

                    {datos.pilares.filter(p => p.nombre.trim() || COLUMNAS.some(c => p[c.clave].trim())).map((p, i) => (
                        <div key={p.id} className="bloque-print">
                            <h2 className="mapa-serif" style={{ color: "#6B2B3A", fontSize: "17px", marginBottom: "8px" }}>
                                {i + 1}. {p.nombre.trim() || "Pilar sin nombre"}
                            </h2>
                            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                                <tbody>
                                    {COLUMNAS.map(col => (
                                        <tr key={col.clave}>
                                            <th style={{
                                                textAlign: "left", verticalAlign: "top", width: "165px",
                                                padding: "7px 10px 7px 0", fontSize: "10.5px", fontWeight: 700,
                                                textTransform: "uppercase", letterSpacing: ".05em",
                                                color: "#A8807F", borderTop: "1px solid #E9C9C5"
                                            }}>
                                                {col.titulo}
                                            </th>
                                            <td style={{
                                                padding: "7px 0", fontSize: "12px", lineHeight: 1.55,
                                                color: "#6B2B3A", borderTop: "1px solid #E9C9C5",
                                                whiteSpace: "pre-wrap"
                                            }}>
                                                {p[col.clave].trim() || "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}

                    {pilarDeLaPrueba && ideasLlenas > 0 && (
                        <div className="bloque-print">
                            <h2 className="mapa-serif" style={{ color: "#6B2B3A", fontSize: "17px", marginBottom: "4px" }}>
                                Mis 10 contenidos · {pilarDeLaPrueba.nombre}
                            </h2>
                            <p style={{ color: "#8A6A70", fontSize: "11px", marginBottom: "10px" }}>
                                {ideasLlenas} de 10 ideas
                            </p>
                            <ol style={{ paddingLeft: "18px", color: "#6B2B3A", fontSize: "12px", lineHeight: 1.85 }}>
                                {datos.prueba.ideas.map((idea, i) => (
                                    <li key={i}>{idea.trim() || "—"}</li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>

                {/* Descargar */}
                <div className="mt-12 pt-8 text-center no-print" style={{ borderTop: "1px solid #F1E2D9" }}>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold transition-all"
                        style={{ background: "#E8A6A0", color: "#6B2B3A", boxShadow: "0 6px 20px rgba(232,166,160,.35)" }}
                    >
                        <Download size={18} /> Descargar mi Mapa de Pilares
                    </button>
                    <p className="text-xs mt-3" style={{ color: "#A8807F" }}>
                        Se abre la ventana de impresión: elige <strong>Guardar como PDF</strong> como destino.
                    </p>
                </div>
            </div>

            {/* Consulta rápida de ángulos mientras trabaja en la prueba */}
            {pantalla === "prueba" && !verAngulos && (
                <button
                    type="button"
                    onClick={() => setVerAngulos(true)}
                    className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3.5 rounded-full font-bold text-sm no-print"
                    style={{ background: "#E8A6A0", color: "#6B2B3A", boxShadow: "0 10px 28px rgba(107,43,58,.18)" }}
                >
                    <Compass size={18} /> <span className="hidden sm:inline">¿Te quedaste en blanco?</span>
                </button>
            )}

            {verAngulos && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 no-print" style={{ background: "rgba(107,43,58,.35)" }}>
                    <div
                        className="w-full sm:max-w-2xl max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6 md:p-8"
                        style={{ background: "#F7F3EF" }}
                    >
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div>
                                <h2 className="mapa-serif text-2xl" style={{ color: "#6B2B3A" }}>Los 6 ángulos</h2>
                                <p className="text-sm mt-1" style={{ color: "#8A6A70" }}>
                                    Toma cualquier tema y míralo desde aquí.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setVerAngulos(false)}
                                aria-label="Cerrar"
                                className="shrink-0 p-2 rounded-xl"
                                style={{ color: "#6B2B3A", background: "#F1E2D9" }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <ListaAngulos compacto />
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Piezas reutilizadas ──────────────────────────────────────────────────────

function ListaAngulos({ compacto = false }) {
    return (
        <div className={`grid gap-4 ${compacto ? "sm:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
            {ANGULOS.map((a, i) => (
                <article
                    key={a.nombre}
                    className="rounded-3xl p-5"
                    style={{
                        // Se alternan los tres tonos suaves para que la cuadrícula
                        // respire sin recurrir a bordes marcados.
                        background: ["#FFFFFF", "#F1E2D9", "#D6C5D8"][i % 3],
                        boxShadow: "0 6px 22px rgba(107,43,58,.05)"
                    }}
                >
                    <div className="flex items-center gap-2.5 mb-2.5">
                        <span
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                            style={{ background: "#FFFFFF", color: "#6B2B3A", border: "1px solid #E9C9C5" }}
                        >
                            {a.icono}
                        </span>
                        <h3 className="mapa-serif text-lg" style={{ color: "#6B2B3A" }}>{a.nombre}</h3>
                    </div>
                    <p className="text-sm leading-relaxed mb-2" style={{ color: "#6B2B3A" }}>{a.texto}</p>
                    <p className="text-xs italic" style={{ color: "#8A6A70" }}>{a.ejemplo}</p>
                </article>
            ))}
        </div>
    );
}

function EstilosMapa() {
    return (
        <style>{`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Inter:wght@400;500;600;700&display=swap');

.mapa { font-family: 'Inter', -apple-system, 'Segoe UI', sans-serif; }
.mapa-serif { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; }

.mapa .campo:focus { border-color: #E8A6A0 !important; background: #FFFFFF !important; }
.mapa textarea, .mapa input { font-family: inherit; }
.mapa ::placeholder { color: #C4A9A6; }

/* En pantalla, la hoja del PDF no se ve. */
.solo-print { display: none; }

/* Al imprimir se oculta la plataforma entera (barra lateral incluida) y solo
   sale la hoja limpia, no el formulario: los <textarea> no se estiran al
   imprimir y cortarían el texto largo. */
@media print {
  body * { visibility: hidden !important; }
  .solo-print, .solo-print * { visibility: visible !important; }
  .solo-print {
    display: block !important;
    position: absolute; left: 0; top: 0; width: 100%;
  }
  .bloque-print { break-inside: avoid; page-break-inside: avoid; }
  @page { margin: 15mm; }
}
        `}</style>
    );
}

export default MapaPilares;
