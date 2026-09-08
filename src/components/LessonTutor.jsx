import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, Send, X, Loader2, RotateCcw } from "lucide-react";
import api from "../api/axios";

// El endpoint del tutor responde en SSE (texto que va llegando), no en JSON,
// y axios no sabe leer eso: hay que usar fetch. Pero la URL base se toma de la
// instancia de axios para no tener dos sitios donde configurar el backend.
const API = api.defaults.baseURL || "";

function LessonTutor({ courseId, lesson, moduleTitle }) {
    // El backend puede estar desplegado sin las variables del proveedor de IA.
    // Se pregunta primero: sin esto la alumna vería un botón que falla al
    // usarlo, y el orden en que se despliegan cliente y servidor importaría.
    const [disponible, setDisponible] = useState(null);
    const [abierto, setAbierto] = useState(false);
    const [mensajes, setMensajes] = useState([]);
    const [borrador, setBorrador] = useState("");
    const [pensando, setPensando] = useState(false);
    const finRef = useRef(null);
    const abortRef = useRef(null);
    const inputRef = useRef(null);

    // Cada clase es una conversación distinta: al cambiar de clase se limpia,
    // porque el contexto del servidor también cambia y mezclarlas confunde.
    useEffect(() => {
        setMensajes([]);
        setBorrador("");
        abortRef.current?.abort();
        setPensando(false);
    }, [lesson?._id]);

    // Cancelar la petición en vuelo si el componente se va.
    useEffect(() => () => abortRef.current?.abort(), []);

    // Se consulta una sola vez por montaje; si falla, se asume no disponible.
    useEffect(() => {
        let vivo = true;
        api.get("/tutor/available")
            .then(r => { if (vivo) setDisponible(!!r.data?.available); })
            .catch(() => { if (vivo) setDisponible(false); });
        return () => { vivo = false; };
    }, []);

    useEffect(() => {
        finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [mensajes, pensando]);

    useEffect(() => {
        if (abierto) inputRef.current?.focus();
    }, [abierto]);

    const preguntar = useCallback(async (e) => {
        e?.preventDefault();
        const pregunta = borrador.trim();
        if (!pregunta || pensando || !lesson?._id) return;

        const historial = mensajes.map(m => ({ role: m.role, content: m.content }));
        setMensajes(prev => [...prev, { role: "user", content: pregunta }]);
        setBorrador("");
        setPensando(true);

        const controller = new AbortController();
        abortRef.current = controller;

        // Se añade el hueco de la respuesta ya, y se va rellenando con lo que
        // llega: así la alumna ve escribir en vez de esperar en blanco.
        setMensajes(prev => [...prev, { role: "assistant", content: "" }]);

        const escribir = (texto) => {
            setMensajes(prev => {
                const copia = [...prev];
                const i = copia.length - 1;
                if (i >= 0 && copia[i].role === "assistant") {
                    copia[i] = { ...copia[i], content: copia[i].content + texto };
                }
                return copia;
            });
        };

        const fallar = (msg) => {
            setMensajes(prev => {
                const copia = [...prev];
                const i = copia.length - 1;
                if (i >= 0 && copia[i].role === "assistant" && !copia[i].content) {
                    copia[i] = { role: "assistant", content: msg, error: true };
                    return copia;
                }
                return [...copia, { role: "assistant", content: msg, error: true }];
            });
        };

        try {
            const res = await fetch(`${API}/tutor/ask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`
                },
                body: JSON.stringify({ courseId, lessonId: lesson._id, question: pregunta, history: historial }),
                signal: controller.signal
            });

            if (!res.ok || !res.body) {
                const data = await res.json().catch(() => ({}));
                fallar(data.message || "La tutora no está disponible ahora mismo.");
                return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            for (;;) {
                const { done, value } = await reader.read();
                if (done) break;

                // SSE separa los eventos con una línea en blanco; un chunk de
                // red puede partir uno por la mitad, así que se acumula.
                buffer += decoder.decode(value, { stream: true });
                const bloques = buffer.split("\n\n");
                buffer = bloques.pop() || "";

                for (const bloque of bloques) {
                    const evento = bloque.match(/^event: (.+)$/m)?.[1];
                    const datosCrudos = bloque.match(/^data: (.*)$/m)?.[1];
                    if (!evento || datosCrudos === undefined) continue;

                    let datos;
                    try { datos = JSON.parse(datosCrudos); } catch { continue; }

                    if (evento === "token" && datos.t) escribir(datos.t);
                    else if (evento === "error") fallar(datos.message || "Se cortó la respuesta.");
                }
            }
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error("[tutor]", err);
                fallar("Se perdió la conexión con la tutora. Inténtalo de nuevo.");
            }
        } finally {
            setPensando(false);
            abortRef.current = null;
            // Si terminó sin haber escrito nada, se avisa en vez de dejar una burbuja vacía.
            setMensajes(prev => {
                const i = prev.length - 1;
                if (i >= 0 && prev[i].role === "assistant" && !prev[i].content) {
                    const copia = [...prev];
                    copia[i] = { role: "assistant", content: "No pude responder esta vez. Inténtalo de nuevo.", error: true };
                    return copia;
                }
                return prev;
            });
        }
    }, [borrador, pensando, mensajes, courseId, lesson]);

    // Sin clase abierta, o con la tutora sin configurar en el servidor, no se
    // pinta nada. `null` es "todavía preguntando": tampoco se muestra, para que
    // el botón no parpadee al entrar.
    if (!lesson?._id || disponible !== true) return null;

    return (
        <>
            {/* Botón flotante */}
            {!abierto && (
                <button
                    type="button"
                    onClick={() => setAbierto(true)}
                    className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3.5 bg-[#905361] text-white rounded-full shadow-lg hover:bg-[#7a4552] hover:shadow-xl transition-all"
                >
                    <Sparkles size={20} />
                    <span className="font-bold text-sm hidden sm:inline">Pregúntale a la tutora</span>
                </button>
            )}

            {/* Panel */}
            {abierto && (
                <div className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:right-6 sm:bottom-6 z-40 w-full sm:w-[400px] h-[75vh] sm:h-[560px] bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">

                    <header className="bg-[#1B3854] text-white px-5 py-4 flex items-center justify-between shrink-0">
                        <div className="min-w-0">
                            <p className="font-bold flex items-center gap-2">
                                <Sparkles size={16} /> Tutora de la clase
                            </p>
                            <p className="text-[11px] text-white/60 truncate">{lesson.title}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            {mensajes.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => { abortRef.current?.abort(); setMensajes([]); }}
                                    title="Empezar de nuevo"
                                    className="p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition"
                                >
                                    <RotateCcw size={16} />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setAbierto(false)}
                                aria-label="Cerrar"
                                className="p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F2EF]">
                        {mensajes.length === 0 && (
                            <div className="text-center py-8 px-4">
                                <div className="w-14 h-14 bg-[#FDE5E5] text-[#905361] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Sparkles size={26} />
                                </div>
                                <p className="font-bold text-[#1B3854] mb-1">¿Alguna duda de esta clase?</p>
                                <p className="text-sm text-gray-500">
                                    Pregúntame lo que quieras sobre <strong>{lesson.title}</strong>
                                    {moduleTitle ? <> del módulo <strong>{moduleTitle}</strong></> : null}.
                                </p>
                            </div>
                        )}

                        {mensajes.map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                                        m.role === "user"
                                            ? "bg-[#905361] text-white rounded-br-md"
                                            : m.error
                                                ? "bg-red-50 text-red-700 border border-red-100 rounded-bl-md"
                                                : "bg-white text-gray-700 border border-gray-100 rounded-bl-md"
                                    }`}
                                >
                                    {m.content || (
                                        <span className="inline-flex gap-1 py-1" aria-label="Escribiendo">
                                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={finRef} />
                    </div>

                    <form onSubmit={preguntar} className="p-3 border-t border-gray-100 flex gap-2 shrink-0 bg-white">
                        <input
                            ref={inputRef}
                            type="text"
                            value={borrador}
                            onChange={(e) => setBorrador(e.target.value)}
                            placeholder="Escribe tu pregunta…"
                            maxLength={1000}
                            disabled={pensando}
                            className="flex-1 min-w-0 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#905361]/25 focus:border-[#905361] disabled:opacity-60"
                        />
                        <button
                            type="submit"
                            disabled={!borrador.trim() || pensando}
                            aria-label="Enviar pregunta"
                            className="w-11 h-11 shrink-0 flex items-center justify-center bg-[#905361] text-white rounded-xl hover:bg-[#7a4552] transition disabled:opacity-40"
                        >
                            {pensando ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

export default LessonTutor;
