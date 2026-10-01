import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import Seo from "../../components/Seo";
import { DATOS } from "./datos";

// Resalta en rojo lo que falta por rellenar: así es imposible publicar sin verlo.
export const Pendiente = ({ children }) => (
    <mark className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-semibold not-italic">
        {children}
    </mark>
);

export const Seccion = ({ n, titulo, children }) => (
    <section className="scroll-mt-28" id={`s${n}`}>
        <h2 className="font-display text-2xl md:text-[1.75rem] font-bold text-marino mt-12 mb-4 flex gap-3 items-baseline">
            <span className="cota text-vino/60 shrink-0">{String(n).padStart(2, "0")}</span>
            {titulo}
        </h2>
        <div className="space-y-4 text-[15px] leading-[1.75] text-marino/80">{children}</div>
    </section>
);

export const Lista = ({ children }) => (
    <ul className="space-y-2.5 pl-1">{children}</ul>
);

export const Item = ({ children }) => (
    <li className="flex gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-vino mt-[0.6rem] shrink-0" />
        <span>{children}</span>
    </li>
);

export const Aviso = ({ titulo, children }) => (
    <div className="rounded-2xl bg-rosa/60 border border-vino/15 p-5 my-6">
        {titulo && <p className="font-semibold text-vino-oscuro mb-1.5">{titulo}</p>}
        <div className="text-[14px] leading-relaxed text-marino/85">{children}</div>
    </div>
);

function LegalLayout({ titulo, bajada, seo, indice = [], children }) {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <>
            {seo && <Seo {...seo} />}
            <div className="min-h-screen bg-ivory textura-grano">
                {/* Cabecera con la retícula del plano, como el resto del sitio */}
                <header className="relative overflow-hidden border-b border-marino/8">
                    <div aria-hidden="true" className="absolute inset-0 reticula-plano reticula-difuminada pointer-events-none" />
                    <div className="relative max-w-3xl mx-auto px-6 pt-10 pb-12">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm font-medium text-marino/60 hover:text-vino transition-colors mb-8"
                        >
                            <ArrowLeft size={16} /> Volver al inicio
                        </Link>

                        <p className="cota text-vino/60 mb-3">Documento legal</p>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-marino leading-[1.05] tracking-[-0.03em]">
                            {titulo}
                        </h1>
                        {bajada && <p className="mt-4 text-marino/65 leading-relaxed max-w-xl">{bajada}</p>}

                        <p className="cota text-marino/40 mt-6">
                            Última actualización · {DATOS.actualizado}
                        </p>
                    </div>
                </header>

                <div className="max-w-3xl mx-auto px-6 py-10">
                    {/* Índice: estos documentos se consultan por secciones, no se
                        leen de corrido. Sin él habría que bajar a ciegas. */}
                    {indice.length > 0 && (
                        <nav aria-label="Índice" className="rounded-2xl bg-white/70 border border-marino/8 p-5 mb-4">
                            <p className="cota text-marino/45 mb-3">En esta página</p>
                            <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                                {indice.map((t, i) => (
                                    <li key={i}>
                                        <a
                                            href={`#s${i + 1}`}
                                            className="text-[14px] text-marino/75 hover:text-vino transition-colors flex gap-2"
                                        >
                                            <span className="cota text-vino/40 pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                                            {t}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    )}

                    <article>{children}</article>

                    <div className="mt-14 pt-8 border-t border-marino/10">
                        <p className="text-[15px] text-marino/70 leading-relaxed">
                            ¿Tienes dudas sobre este documento? Escríbenos y te respondemos.
                        </p>
                        <a
                            href={`mailto:${DATOS.email}`}
                            className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full bg-vino text-white font-semibold text-sm hover:bg-vino-oscuro hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                        >
                            <Mail size={16} /> {DATOS.email}
                        </a>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-10 text-sm text-marino/55">
                            <Link to="/terminos" className="hover:text-vino transition-colors">Términos del servicio</Link>
                            <Link to="/privacidad" className="hover:text-vino transition-colors">Privacidad</Link>
                            <Link to="/soporte" className="hover:text-vino transition-colors">Soporte</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LegalLayout;
