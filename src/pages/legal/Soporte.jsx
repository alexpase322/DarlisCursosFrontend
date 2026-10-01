import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MessageCircle, ChevronDown, LifeBuoy, CreditCard, KeyRound, Sparkles } from "lucide-react";
import LegalLayout from "./LegalLayout";
import { DATOS } from "./datos";

const WHATSAPP = "https://chat.whatsapp.com/JAwyMpcAIY9HnQwV6xttMD";

// Las dudas que más llegan, con la solución que la alumna puede aplicar sola.
// Cuanto más resuelva esta página, menos correos hay que contestar a mano.
const TEMAS = [
    {
        icono: <KeyRound size={18} />,
        titulo: "Acceso a tu cuenta",
        preguntas: [
            {
                q: "Pagué pero no me llega el correo de acceso",
                a: "Revisa primero la carpeta de spam y la de promociones: el correo sale desde soporte@arquitectadetupropioexito.com. Si no está, escríbenos indicando el correo exacto con el que pagaste. Suele ser que el pago se hizo con una dirección distinta a la que esperabas."
            },
            {
                q: "Olvidé mi contraseña",
                a: "Desde la pantalla de inicio de sesión, pulsa “¿Olvidaste tu contraseña?” y sigue el enlace que te llega al correo. El enlace caduca, así que úsalo pronto; si expiró, pídelo otra vez."
            },
            {
                q: "El enlace de activación ya no funciona",
                a: "Los enlaces de activación tienen vigencia limitada. Escríbenos y te generamos uno nuevo el mismo día."
            }
        ]
    },
    {
        icono: <CreditCard size={18} />,
        titulo: "Pagos y suscripción",
        preguntas: [
            {
                q: "Quiero cancelar mi plan mensual",
                a: "Puedes hacerlo tú misma desde el portal de pagos al que accedes dentro de la plataforma: es inmediato. También puedes escribirnos desde el correo de tu cuenta y lo procesamos en un máximo de 2 días hábiles. En ambos casos conservas el acceso hasta el final del mes que ya pagaste."
            },
            {
                q: "Me cobraron dos veces",
                a: "Escríbenos con la fecha y el importe de los dos cargos. Comprobamos en Stripe y, si hubo un cobro duplicado, lo devolvemos. Esto sí se devuelve, es un error nuestro."
            },
            {
                q: "¿Hay reembolsos?",
                a: "No. El acceso al contenido es inmediato tras el pago, así que las compras son definitivas. Las únicas excepciones son los cobros por error, los duplicados y los fallos técnicos que te impidan entrar."
            },
            {
                q: "Mi tarjeta fue rechazada",
                a: "Stripe reintenta el cobro automáticamente durante unos días. Si quieres adelantarte, actualiza la tarjeta desde el portal de pagos. Si el cobro no se completa, el acceso queda suspendido hasta regularizarlo."
            }
        ]
    },
    {
        icono: <Sparkles size={18} />,
        titulo: "Programa de afiliadas",
        preguntas: [
            {
                q: "Alguien se inscribió con mi enlace pero no veo la comisión",
                a: "La comisión aparece cuando el pago se ha completado. Si pagó hace poco, dale unas horas. Si la persona llegó por tu enlace pero compró más de 60 días después del primer clic, la atribución ya había caducado. Si no cuadra, escríbenos con el correo de esa alumna y lo revisamos."
            },
            {
                q: "¿Cuánto gano por cada plan?",
                a: "Del plan mensual, el 40% cada mes que la alumna siga activa ($20 USD). Del pago único, el 80% ($237.60 USD sobre $297). La del mensual se repite mes a mes mientras ella continúe."
            },
            {
                q: "Una comisión pasó a anulada",
                a: "Ocurre cuando la venta que la originó se revirtió: una devolución, una disputa con el banco o un contracargo. Si crees que fue un error, escríbenos."
            },
            {
                q: "¿Dónde está mi enlace?",
                a: "En tu Panel de Afiliada, dentro de la plataforma. Ahí también ves tus clics, tus referidas y tu rango."
            }
        ]
    },
    {
        icono: <LifeBuoy size={18} />,
        titulo: "La plataforma",
        preguntas: [
            {
                q: "Un video no carga",
                a: "Prueba a recargar la página y, si sigue, con otro navegador o con los datos del móvil en lugar del wifi. Si el problema continúa, dinos el nombre exacto de la clase para revisarla."
            },
            {
                q: "No me llegan las notificaciones",
                a: "Tienes que activarlas desde la plataforma y aceptar el permiso que pide el navegador. Si lo rechazaste, hay que volver a darlo desde la configuración del navegador para este sitio."
            },
            {
                q: "¿Puedo entrar desde el móvil?",
                a: "Sí. Además puedes instalarla como aplicación: el botón aparece en la pantalla de inicio de sesión y te crea un icono en la pantalla de tu teléfono."
            },
            {
                q: "Perdí lo que escribí en el Mapa de Pilares",
                a: "Esas herramientas guardan en tu propio navegador, no en nuestros servidores. Si borraste los datos de navegación, cambiaste de dispositivo o usaste modo incógnito, no podemos recuperarlo. Descarga el PDF cuando termines de trabajar en ellas."
            }
        ]
    }
];

function Pregunta({ q, a }) {
    const [abierta, setAbierta] = useState(false);
    return (
        <div className="border-b border-marino/8 last:border-0">
            <button
                type="button"
                onClick={() => setAbierta(v => !v)}
                aria-expanded={abierta}
                className="w-full flex items-start justify-between gap-4 py-4 text-left group"
            >
                <span className="font-medium text-marino group-hover:text-vino transition-colors">{q}</span>
                <ChevronDown
                    size={18}
                    className={`shrink-0 mt-0.5 text-marino/35 transition-transform duration-300 ${abierta ? "rotate-180" : ""}`}
                />
            </button>
            {abierta && (
                <p className="pb-5 pr-8 text-[15px] leading-[1.7] text-marino/75">{a}</p>
            )}
        </div>
    );
}

function Soporte() {
    return (
        <LegalLayout
            titulo="Soporte"
            bajada="Casi todo se resuelve aquí mismo sin esperar respuesta. Si no encuentras lo tuyo, escríbenos y te contestamos."
            seo={{
                title: "Soporte | Arquitecta de tu Propio Éxito",
                description: "Ayuda con el acceso, los pagos, la cancelación y el programa de afiliadas de Arquitecta de tu Propio Éxito."
            }}
        >
            {/* Canales, antes que las preguntas: quien ya sabe lo que necesita no
                debería tener que bajar media página para encontrar el correo. */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
                <a
                    href={`mailto:${DATOS.email}`}
                    className="group rounded-2xl bg-white/80 border border-marino/8 p-6 hover:bg-white hover:shadow-media hover:-translate-y-1 transition-all duration-500"
                >
                    <span className="w-11 h-11 rounded-xl bg-rosa text-vino flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                        <Mail size={20} />
                    </span>
                    <p className="font-display text-xl font-bold text-marino mb-1">Escríbenos</p>
                    <p className="text-sm text-marino/65 leading-relaxed mb-3">
                        Para cualquier tema de cuenta, pagos o comisiones.
                    </p>
                    <p className="text-sm font-medium text-vino break-all">{DATOS.email}</p>
                </a>

                <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl bg-white/80 border border-marino/8 p-6 hover:bg-white hover:shadow-media hover:-translate-y-1 transition-all duration-500"
                >
                    <span className="w-11 h-11 rounded-xl bg-arena text-marino flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                        <MessageCircle size={20} />
                    </span>
                    <p className="font-display text-xl font-bold text-marino mb-1">Comunidad</p>
                    <p className="text-sm text-marino/65 leading-relaxed mb-3">
                        El grupo de alumnas, para dudas del día a día.
                    </p>
                    <p className="text-sm font-medium text-vino">Entrar al grupo de WhatsApp</p>
                </a>
            </div>

            <div className="rounded-2xl bg-rosa/60 border border-vino/15 p-5 mb-12">
                <p className="text-[14px] leading-relaxed text-marino/85">
                    <strong className="text-vino-oscuro">Tiempos de respuesta.</strong> Respondemos de
                    lunes a viernes, normalmente en menos de 24 horas y como máximo en 2 días hábiles.
                    Escríbenos desde el correo de tu cuenta: así te identificamos y resolvemos a la primera.
                </p>
            </div>

            {TEMAS.map(tema => (
                <section key={tema.titulo} className="mb-10">
                    <h2 className="font-display text-2xl font-bold text-marino mb-1 flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-rosa text-vino flex items-center justify-center shrink-0">
                            {tema.icono}
                        </span>
                        {tema.titulo}
                    </h2>
                    <div className="mt-3 rounded-2xl bg-white/70 border border-marino/8 px-5">
                        {tema.preguntas.map(p => <Pregunta key={p.q} {...p} />)}
                    </div>
                </section>
            ))}

            <div className="rounded-2xl bg-white/70 border border-marino/8 p-6">
                <p className="font-display text-xl font-bold text-marino mb-2">¿Buscas las condiciones?</p>
                <p className="text-[15px] text-marino/70 leading-relaxed mb-4">
                    Lo relativo a cobros, cancelación, comisiones y uso del contenido está detallado en
                    los documentos legales.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/terminos"
                        className="px-5 py-2.5 rounded-full bg-marino text-white text-sm font-semibold hover:bg-vino active:scale-[0.97] transition-all duration-300"
                    >
                        Términos del servicio
                    </Link>
                    <Link
                        to="/privacidad"
                        className="px-5 py-2.5 rounded-full bg-white border border-marino/15 text-marino text-sm font-semibold hover:border-vino hover:text-vino active:scale-[0.97] transition-all duration-300"
                    >
                        Privacidad
                    </Link>
                </div>
            </div>
        </LegalLayout>
    );
}

export default Soporte;
