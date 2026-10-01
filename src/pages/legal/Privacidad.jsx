import LegalLayout, { Seccion, Lista, Item, Aviso, Pendiente } from "./LegalLayout";
import { DATOS } from "./datos";

const INDICE = [
    "Resumen rápido",
    "Qué datos recogemos",
    "Para qué los usamos",
    "Con quién los compartimos",
    "La tutora con inteligencia artificial",
    "Qué guardamos en tu navegador",
    "Cuánto tiempo los conservamos",
    "Cómo los protegemos",
    "Tus derechos",
    "Si vives en California",
    "Otros estados de EE.UU.",
    "Si escribes desde fuera de EE.UU.",
    "Menores de edad",
    "Cambios en esta política"
];

// Inventario real, sacado de revisar el código: modelos de base de datos,
// llamadas a servicios externos y lo que se guarda en el navegador.
const TERCEROS = [
    ["Stripe", "Cobros y suscripciones", "Correo, nombre, datos de la tarjeta (los procesa Stripe, nosotros no los vemos), historial de pagos"],
    ["MongoDB Atlas", "Base de datos", "Todo lo de tu cuenta y tu actividad en la plataforma"],
    ["Render", "Servidor del backend", "Tráfico de la aplicación y registros técnicos"],
    ["Vercel", "Alojamiento web y métricas de uso", "Páginas visitadas, tipo de dispositivo, rendimiento de carga"],
    ["Cloudinary", "Almacenamiento de imágenes", "Tu foto de perfil y las imágenes que publiques"],
    ["Resend", "Envío de correos", "Tu correo y el contenido de los mensajes que te enviamos"],
    ["Web3Forms", "Formulario de contacto de la web", "Nombre, correo y mensaje que escribas ahí"],
    ["Google Fonts", "Tipografías de la web", "Tu dirección IP, por la petición del archivo de fuente"],
    ["Groq", "Tutora con IA de las clases", "El texto de tus preguntas y el título y descripción de la clase"]
];

function Privacidad() {
    return (
        <LegalLayout
            titulo="Privacidad de tus datos"
            bajada="Qué información recogemos, para qué la usamos y qué puedes pedirnos. Escrito en claro, sin letra pequeña."
            indice={INDICE}
            seo={{
                title: "Política de privacidad | Arquitecta de tu Propio Éxito",
                description: "Qué datos personales recoge Arquitecta de tu Propio Éxito, con quién se comparten y cómo ejercer tus derechos."
            }}
        >
            <Seccion n={1} titulo="Resumen rápido">
                <Aviso titulo="Lo esencial en cinco líneas">
                    <Lista>
                        <Item><strong>No vendemos tus datos.</strong> Nunca lo hemos hecho y no está en nuestros planes.</Item>
                        <Item><strong>No vemos tu tarjeta.</strong> Los pagos los procesa Stripe de punta a punta.</Item>
                        <Item><strong>Tu contraseña está cifrada</strong> y ni siquiera nosotros podemos leerla.</Item>
                        <Item><strong>Puedes pedir una copia o el borrado</strong> de tus datos escribiéndonos.</Item>
                        <Item>Usamos servicios externos para funcionar; están todos listados más abajo.</Item>
                    </Lista>
                </Aviso>
                <p>
                    Responsable del tratamiento: <Pendiente>{DATOS.titular}</Pendiente>,{" "}
                    <Pendiente>{DATOS.direccion}</Pendiente>, Estados Unidos. Contacto:{" "}
                    <a href={`mailto:${DATOS.email}`} className="text-vino font-medium underline underline-offset-2">{DATOS.email}</a>.
                </p>
            </Seccion>

            <Seccion n={2} titulo="Qué datos recogemos">
                <p className="font-semibold text-marino">Los que tú nos das</p>
                <Lista>
                    <Item><strong>Al crear tu cuenta:</strong> nombre de usuaria y correo electrónico.</Item>
                    <Item><strong>Tu contraseña:</strong> se guarda cifrada con bcrypt. Es un cifrado de una sola dirección: no se puede revertir, así que nadie puede leerla, nosotros tampoco.</Item>
                    <Item><strong>Tu perfil:</strong> foto y biografía, si decides ponerlas.</Item>
                    <Item><strong>Lo que publicas:</strong> mensajes en el muro, comentarios, reacciones, testimonios y mensajes de chat.</Item>
                    <Item><strong>Si escribes por el formulario de contacto:</strong> nombre, correo y tu mensaje.</Item>
                    <Item><strong>Si te registras a un webinar:</strong> nombre y correo.</Item>
                    <Item><strong>Si usas la tutora con IA:</strong> el texto de las preguntas que escribas.</Item>
                </Lista>

                <p className="font-semibold text-marino pt-2">Los que se generan al usar la plataforma</p>
                <Lista>
                    <Item><strong>Tu progreso:</strong> qué clases completaste, intentos y resultados de los exámenes.</Item>
                    <Item><strong>Tu actividad:</strong> racha de días, logros desbloqueados, última conexión.</Item>
                    <Item><strong>Tus pagos:</strong> importe, fecha, plan y estado. Identificadores de Stripe, nunca el número de tarjeta.</Item>
                    <Item><strong>Si participas como afiliada:</strong> tu código de referida, cuántos clics recibió, quién se inscribió con él y las comisiones generadas.</Item>
                    <Item><strong>Si activas las notificaciones:</strong> la clave técnica que permite a tu navegador recibirlas.</Item>
                    <Item><strong>Datos técnicos:</strong> dirección IP, navegador y dispositivo, por el propio funcionamiento de internet y los registros del servidor.</Item>
                </Lista>

                <Aviso>
                    No recogemos datos de categorías sensibles: ni salud, ni origen étnico, ni religión,
                    ni orientación sexual, ni datos biométricos. Tampoco geolocalización precisa.
                </Aviso>
            </Seccion>

            <Seccion n={3} titulo="Para qué los usamos">
                <Lista>
                    <Item><strong>Darte el servicio:</strong> crear tu cuenta, mostrarte los cursos, guardar tu progreso, que puedas participar en la comunidad.</Item>
                    <Item><strong>Cobrar:</strong> procesar los pagos y las renovaciones, y llevar el registro de tus facturas.</Item>
                    <Item><strong>Escribirte:</strong> el correo de bienvenida, avisos de pago, recordatorios y novedades del programa.</Item>
                    <Item><strong>Calcular comisiones:</strong> saber qué inscripciones vinieron de tu enlace y cuánto te corresponde.</Item>
                    <Item><strong>Mejorar la plataforma:</strong> entender qué secciones se usan y dónde falla el rendimiento.</Item>
                    <Item><strong>Mantenerla segura:</strong> detectar accesos indebidos, fraude en el programa de afiliadas y abusos en la comunidad.</Item>
                    <Item><strong>Cumplir la ley:</strong> conservar registros contables y fiscales durante el plazo exigido.</Item>
                </Lista>
                <p>
                    No tomamos decisiones automatizadas que tengan efectos legales sobre ti. El sistema de
                    rangos y logros es un juego de motivación, no afecta a tu acceso ni a tus pagos.
                </p>
            </Seccion>

            <Seccion n={4} titulo="Con quién los compartimos">
                <p>
                    Solo con los servicios que necesitamos para funcionar. Cada uno recibe únicamente lo
                    imprescindible para su tarea, y ninguno tiene permiso para usar tus datos por su cuenta:
                </p>

                <div className="overflow-x-auto my-5 rounded-2xl border border-marino/10">
                    <table className="w-full text-[13.5px]">
                        <thead>
                            <tr className="bg-white/70 text-left">
                                <th className="px-4 py-3 font-semibold text-marino">Servicio</th>
                                <th className="px-4 py-3 font-semibold text-marino">Para qué</th>
                                <th className="px-4 py-3 font-semibold text-marino">Qué recibe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TERCEROS.map(([nombre, para, que]) => (
                                <tr key={nombre} className="border-t border-marino/8 align-top">
                                    <td className="px-4 py-3 font-semibold text-marino whitespace-nowrap">{nombre}</td>
                                    <td className="px-4 py-3 text-marino/70">{para}</td>
                                    <td className="px-4 py-3 text-marino/70">{que}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p>
                    También compartiremos datos si nos lo exige una autoridad competente o una orden
                    judicial. Si algún día vendemos o traspasamos el negocio, los datos formarían parte
                    de la operación y te lo comunicaríamos antes.
                </p>

                <Aviso titulo="Lo que no hacemos">
                    No vendemos tus datos personales. No los cedemos a anunciantes ni a intermediarios
                    de datos. No los usamos para publicidad dirigida fuera de nuestra plataforma.
                </Aviso>
            </Seccion>

            <Seccion n={5} titulo="La tutora con inteligencia artificial">
                <p>
                    Dentro de cada clase hay una tutora con IA a la que puedes hacer preguntas. Merece
                    una explicación aparte porque ahí sale información tuya hacia un tercero.
                </p>
                <Lista>
                    <Item><strong>Qué se envía:</strong> el texto de tu pregunta, las preguntas y respuestas anteriores de esa misma conversación, y el título y la descripción de la clase que estás viendo.</Item>
                    <Item><strong>Qué NO se envía:</strong> tu nombre, tu correo, tus pagos ni ningún otro dato de tu cuenta. El proveedor no sabe quién eres.</Item>
                    <Item><strong>Dónde se procesa:</strong> en el proveedor de IA que tengamos configurado, hoy Groq, con servidores en Estados Unidos.</Item>
                    <Item><strong>Qué guardamos:</strong> la conversación vive solo en tu navegador mientras tienes la clase abierta. Al cambiar de clase se borra y no la almacenamos.</Item>
                </Lista>
                <Aviso>
                    No escribas datos sensibles ni información confidencial en el chat de la tutora. Y
                    recuerda que una IA puede equivocarse: sus respuestas son un apoyo para estudiar, no
                    asesoría profesional.
                </Aviso>
            </Seccion>

            <Seccion n={6} titulo="Qué guardamos en tu navegador">
                <p>
                    No usamos cookies de publicidad ni de seguimiento entre sitios. Lo que guardamos es
                    lo mínimo para que la plataforma funcione:
                </p>
                <Lista>
                    <Item><strong>Tu sesión</strong> (almacenamiento local): el testigo que te mantiene dentro sin tener que escribir la contraseña en cada página. Se borra al cerrar sesión.</Item>
                    <Item><strong>Tus datos básicos de perfil</strong> (almacenamiento local): nombre y foto, para pintar la interfaz sin pedirlos al servidor cada vez.</Item>
                    <Item><strong>Código de referida</strong> (cookie, 60 días): si llegaste por el enlace de una alumna, para reconocerle la comisión aunque cierres y vuelvas días después. Es una cookie propia, con <span className="font-mono text-[12.5px]">SameSite=Lax</span>, que no te sigue por otros sitios.</Item>
                    <Item><strong>Herramientas de trabajo</strong> (almacenamiento local): lo que escribes en el Mapa de Pilares y el Constructor de Publicaciones se guarda en tu propio navegador. Eso no llega a nuestros servidores.</Item>
                </Lista>
                <p>
                    Puedes borrar todo esto desde la configuración de tu navegador. Si lo haces, tendrás
                    que iniciar sesión otra vez y perderás lo guardado en las herramientas de trabajo.
                </p>
            </Seccion>

            <Seccion n={7} titulo="Cuánto tiempo los conservamos">
                <Lista>
                    <Item><strong>Mientras tengas la cuenta abierta:</strong> todos los datos de tu perfil y tu actividad.</Item>
                    <Item><strong>Registros de pagos y comisiones:</strong> al menos 7 años después de la última operación, porque la normativa fiscal estadounidense lo exige.</Item>
                    <Item><strong>Lo que publicaste en la comunidad:</strong> si cierras la cuenta puedes pedirnos que lo borremos; si no lo pides, puede quedar visible sin tu nombre.</Item>
                    <Item><strong>Correos que te enviamos:</strong> el registro de envío queda en Resend según su propia política.</Item>
                </Lista>
            </Seccion>

            <Seccion n={8} titulo="Cómo los protegemos">
                <Lista>
                    <Item>Todo el tráfico va cifrado con HTTPS.</Item>
                    <Item>Las contraseñas se guardan con bcrypt, un cifrado de una sola dirección.</Item>
                    <Item>El acceso a la plataforma usa tokens firmados con caducidad.</Item>
                    <Item>Tenemos límites de peticiones y sanitización de los campos para frenar ataques automatizados.</Item>
                    <Item>Los datos de tarjeta no pasan por nuestros servidores en ningún momento.</Item>
                </Lista>
                <p>
                    Ningún sistema es invulnerable. Si ocurriera una brecha que afecte a tus datos, te lo
                    comunicaríamos y avisaríamos a las autoridades que correspondan.
                </p>
            </Seccion>

            <Seccion n={9} titulo="Tus derechos">
                <p>Vivas donde vivas, puedes pedirnos:</p>
                <Lista>
                    <Item><strong>Saber</strong> qué datos tuyos tenemos y para qué.</Item>
                    <Item><strong>Una copia</strong> de tus datos en un formato legible.</Item>
                    <Item><strong>Corregir</strong> lo que esté mal o desactualizado.</Item>
                    <Item><strong>Borrar</strong> tu cuenta y tus datos, salvo lo que debamos conservar por ley.</Item>
                    <Item><strong>Dejar de recibir</strong> correos de novedades, con el enlace del pie de cada correo o escribiéndonos.</Item>
                </Lista>
                <p>
                    Escríbenos a{" "}
                    <a href={`mailto:${DATOS.email}`} className="text-vino font-medium underline underline-offset-2">{DATOS.email}</a>{" "}
                    desde el correo de tu cuenta. Respondemos en un máximo de <strong>45 días</strong>, y
                    normalmente mucho antes. No te cobramos por ejercer estos derechos ni te damos peor
                    servicio por hacerlo.
                </p>
            </Seccion>

            <Seccion n={10} titulo="Si vives en California">
                <p>
                    La ley de California (CCPA/CPRA) te reconoce derechos adicionales. Te resumimos cómo
                    aplican a nuestro caso:
                </p>
                <Lista>
                    <Item><strong>Categorías que recogemos:</strong> identificadores (nombre, correo, IP), información comercial (historial de compras), actividad en internet (uso de la plataforma) y contenido que tú publicas.</Item>
                    <Item><strong>De dónde salen:</strong> de ti directamente y de tu propio uso de la plataforma.</Item>
                    <Item><strong>Venta o cesión para publicidad:</strong> <strong>no vendemos ni cedemos</strong> datos personales, ni lo hemos hecho en los últimos 12 meses. Tampoco con datos de menores.</Item>
                    <Item><strong>Publicidad dirigida:</strong> no hacemos. Por eso no verás un botón de “No vendas mi información”: no hay nada que rechazar.</Item>
                    <Item><strong>Datos sensibles:</strong> no recogemos de las categorías que la ley considera sensibles.</Item>
                </Lista>
                <p>
                    Puedes ejercer tus derechos de conocer, borrar, corregir y no discriminación por el
                    correo de arriba. Si quieres, puede hacerlo alguien en tu nombre con una autorización
                    por escrito.
                </p>
            </Seccion>

            <Seccion n={11} titulo="Otros estados de EE.UU.">
                <p>
                    Varios estados — entre ellos Virginia, Colorado, Connecticut, Utah, Texas y Oregón —
                    tienen leyes propias de privacidad con derechos parecidos: conocer, corregir, borrar,
                    obtener una copia y oponerte a ciertos tratamientos.
                </p>
                <p>
                    Atendemos esas solicitudes por el mismo canal y en los mismos plazos, sin importar el
                    estado. Si rechazamos una petición, te explicaremos por qué y podrás pedirnos que la
                    revisemos.
                </p>
            </Seccion>

            <Seccion n={12} titulo="Si escribes desde fuera de EE.UU.">
                <p>
                    Operamos desde Estados Unidos y nuestros servidores y proveedores están allí. Si te
                    conectas desde América Latina, Europa o cualquier otro sitio, tus datos{" "}
                    <strong>se tratan en Estados Unidos</strong>, donde la protección de datos puede
                    funcionar de forma distinta a la de tu país.
                </p>
                <p>
                    Al usar la plataforma aceptas esa transferencia. Si resides en un país con normas
                    específicas que te den derechos adicionales, escríbenos y los atenderemos.
                </p>
            </Seccion>

            <Seccion n={13} titulo="Menores de edad">
                <p>
                    La plataforma es para personas de <strong>18 años o más</strong>. No recogemos datos
                    de menores a sabiendas. Si descubrimos que una cuenta pertenece a una persona menor
                    de edad, la cerraremos y borraremos sus datos.
                </p>
                <p>
                    Si eres madre, padre o tutor y crees que un menor nos dio datos, escríbenos y lo
                    resolvemos de inmediato.
                </p>
            </Seccion>

            <Seccion n={14} titulo="Cambios en esta política">
                <p>
                    Si cambiamos algo relevante — un proveedor nuevo, un uso distinto de los datos — lo
                    actualizaremos aquí y te avisaremos por correo o dentro de la plataforma. La fecha de
                    la última revisión está al principio de la página.
                </p>
            </Seccion>
        </LegalLayout>
    );
}

export default Privacidad;
