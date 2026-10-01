import LegalLayout, { Seccion, Lista, Item, Aviso, Pendiente } from "./LegalLayout";
import { DATOS } from "./datos";

const INDICE = [
    "Quiénes somos",
    "Quién puede inscribirse",
    "Tu cuenta",
    "Qué incluye el programa",
    "Precios y cobros",
    "Renovación automática",
    "Cómo cancelar",
    "Política de reembolsos",
    "Programa de afiliadas",
    "Sobre los resultados",
    "Propiedad del contenido",
    "Normas de la comunidad",
    "Suspensión y cierre de cuenta",
    "Límites de responsabilidad",
    "Ley aplicable",
    "Cambios en estos términos"
];

function Terminos() {
    return (
        <LegalLayout
            titulo="Términos del servicio"
            bajada="Las reglas de uso de Arquitecta de tu Propio Éxito. Al inscribirte y usar la plataforma, aceptas lo que está escrito aquí."
            indice={INDICE}
            seo={{
                title: "Términos del servicio | Arquitecta de tu Propio Éxito",
                description: "Condiciones de uso, cobros, cancelación y programa de afiliadas de Arquitecta de tu Propio Éxito.",
                noindex: false
            }}
        >
            <Seccion n={1} titulo="Quiénes somos">
                <p>
                    Arquitecta de tu Propio Éxito es un programa de formación en negocio digital operado
                    por <Pendiente>{DATOS.titular}</Pendiente>, persona física con domicilio
                    en <Pendiente>{DATOS.direccion}</Pendiente>, Estados Unidos.
                </p>
                <p>
                    A lo largo de este documento, “nosotros” se refiere a esa persona y “tú” a quien
                    usa la plataforma. Puedes contactarnos en{" "}
                    <a href={`mailto:${DATOS.email}`} className="text-vino font-medium underline underline-offset-2">{DATOS.email}</a>.
                </p>
            </Seccion>

            <Seccion n={2} titulo="Quién puede inscribirse">
                <p>
                    Debes tener <strong>18 años o más</strong> para crear una cuenta y comprar. El programa
                    está dirigido a personas adultas que quieren emprender, e implica pagos y, si eliges
                    participar, el cobro de comisiones. No está pensado para menores de edad ni recogemos
                    datos de menores a sabiendas.
                </p>
                <p>
                    Operamos principalmente desde Estados Unidos. Si te inscribes desde otro país, eres
                    responsable de cumplir las leyes que te apliquen, incluidas las fiscales.
                </p>
            </Seccion>

            <Seccion n={3} titulo="Tu cuenta">
                <Lista>
                    <Item>Tu cuenta es <strong>personal e intransferible</strong>. No la compartas ni cedas tu contraseña.</Item>
                    <Item>Eres responsable de lo que ocurra desde tu cuenta. Avísanos de inmediato si crees que alguien entró sin tu permiso.</Item>
                    <Item>Los datos que nos des deben ser reales y estar al día, sobre todo el correo: es por donde te mandamos el acceso y los avisos importantes.</Item>
                    <Item>Detectar varias personas usando una misma cuenta es motivo de cierre sin devolución.</Item>
                </Lista>
            </Seccion>

            <Seccion n={4} titulo="Qué incluye el programa">
                <p>
                    El acceso incluye los cursos grabados disponibles en la plataforma, las sesiones en
                    vivo y mentorías que se anuncien, la comunidad privada y los materiales descargables
                    asociados a cada clase.
                </p>
                <Aviso>
                    El contenido se amplía y se actualiza con el tiempo. También podemos retirar, sustituir
                    o reorganizar módulos cuando queden desactualizados. No garantizamos que una clase
                    concreta siga disponible indefinidamente.
                </Aviso>
            </Seccion>

            <Seccion n={5} titulo="Precios y cobros">
                <p>Hoy existen dos formas de acceder, ambas en dólares estadounidenses (USD):</p>
                <Lista>
                    <Item><strong>Plan mensual — $50 USD al mes.</strong> Se cobra cada mes hasta que lo canceles.</Item>
                    <Item><strong>Pago único — $297 USD.</strong> Un solo cobro que da acceso permanente y te activa como afiliada desde el primer día.</Item>
                </Lista>
                <p>
                    Los pagos se procesan a través de <strong>Stripe</strong>. Nosotros no vemos ni
                    guardamos el número de tu tarjeta: esa información la gestiona Stripe directamente.
                </p>
                <p>
                    Podemos cambiar los precios en cualquier momento. Si tienes el plan mensual activo,
                    te avisaremos por correo <strong>antes</strong> de que un precio nuevo te afecte, y
                    podrás cancelar si no estás de acuerdo. Las compras ya realizadas no cambian de precio.
                </p>
                <p>
                    Si un cobro es rechazado, se reintentará. Si sigue sin completarse, el acceso puede
                    suspenderse hasta regularizar el pago.
                </p>
            </Seccion>

            <Seccion n={6} titulo="Renovación automática">
                <Aviso titulo="Esto es importante, léelo antes de comprar el plan mensual">
                    El plan de $50 USD es una <strong>suscripción que se renueva sola cada mes</strong> y
                    se cobra automáticamente a la tarjeta que registraste, hasta que tú la canceles.
                    No te avisaremos antes de cada cobro mensual. Puedes cancelar cuando quieras, y la
                    cancelación evita los cobros futuros.
                </Aviso>
                <p>
                    El pago único de $297 USD <strong>no se renueva</strong>: es un cobro de una sola vez.
                </p>
            </Seccion>

            <Seccion n={7} titulo="Cómo cancelar">
                <p>Puedes cancelar el plan mensual por cualquiera de estas dos vías, las dos igual de válidas:</p>
                <Lista>
                    <Item>
                        <strong>Desde tu cuenta</strong>, en el portal de pagos de Stripe al que accedes
                        desde la plataforma. Es inmediato y no necesitas hablar con nadie.
                    </Item>
                    <Item>
                        <strong>Escribiendo a</strong>{" "}
                        <a href={`mailto:${DATOS.email}`} className="text-vino font-medium underline underline-offset-2">{DATOS.email}</a>{" "}
                        desde el correo de tu cuenta. La procesamos en un máximo de 2 días hábiles.
                    </Item>
                </Lista>
                <p>
                    Al cancelar, <strong>conservas el acceso hasta el final del periodo que ya pagaste</strong>.
                    No se cobra nada más después de eso. Cancelar no genera devolución del periodo en curso.
                </p>
            </Seccion>

            <Seccion n={8} titulo="Política de reembolsos">
                <Aviso titulo="No hay reembolsos">
                    Todas las compras son <strong>definitivas y no reembolsables</strong>. El acceso al
                    contenido es inmediato tras el pago: desde ese momento ya dispones de material
                    digital que no puede devolverse. Al completar la compra confirmas que entiendes y
                    aceptas esta condición.
                </Aviso>
                <p>
                    Esto no limita los derechos que la ley te reconozca de forma obligatoria en tu
                    jurisdicción. Si se te cobró por error, hubo un cargo duplicado o un fallo técnico
                    te impidió acceder, escríbenos: esos casos los resolvemos.
                </p>
                <p>
                    Si abres una disputa con tu banco en lugar de hablar con nosotros, el acceso quedará
                    suspendido mientras se resuelve, y las comisiones generadas por esa venta se anulan.
                </p>
            </Seccion>

            <Seccion n={9} titulo="Programa de afiliadas">
                <p>
                    Las alumnas que alcanzan el nivel Partner, y quienes compran el plan de pago único,
                    reciben un enlace propio para recomendar el programa y ganar comisión.
                </p>
                <Lista>
                    <Item><strong>Cuánto se gana:</strong> 40% recurrente del plan mensual ($20 USD por cada mes que la referida siga activa) y 80% del pago único ($237.60 USD sobre $297).</Item>
                    <Item><strong>Cómo se atribuye:</strong> por el enlace de referida, con una ventana de atribución de 60 días desde el primer clic.</Item>
                    <Item><strong>Cuándo se paga:</strong> una comisión pasa a estar disponible cuando el pago que la originó se ha completado y ha superado el plazo de disputa.</Item>
                    <Item><strong>Cuándo se pierde:</strong> si la venta se anula, se revierte o termina en contracargo, la comisión correspondiente se cancela. Si ya se pagó, puede descontarse de comisiones futuras.</Item>
                    <Item><strong>No puedes</strong> comprar a través de tu propio enlace, usar publicidad pagada con nuestra marca, enviar correo masivo no solicitado, ni prometer resultados que no podemos respaldar.</Item>
                </Lista>
                <p>
                    Participar como afiliada <strong>no crea una relación laboral</strong>, ni de sociedad,
                    ni de representación. Eres responsable de declarar tus ingresos y de cumplir tus
                    obligaciones fiscales donde residas. Podemos pedirte la documentación fiscal que la
                    ley estadounidense exija antes de realizar un pago.
                </p>
                <p>
                    Podemos modificar los porcentajes o las condiciones del programa avisando por correo.
                    Los cambios no afectan a comisiones ya generadas.
                </p>
            </Seccion>

            <Seccion n={10} titulo="Sobre los resultados">
                <Aviso titulo="No prometemos ingresos">
                    Lo que ganes depende de tu trabajo, tu constancia, tu mercado y muchos factores que
                    no controlamos. <strong>No garantizamos ningún resultado económico.</strong> Los
                    ejemplos, cifras o testimonios que veas en la web o en la comunidad son casos
                    concretos, no una promesa ni un resultado típico.
                </Aviso>
                <p>
                    Nada de lo que enseñamos constituye asesoría financiera, legal, fiscal ni médica.
                    Para esas materias, consulta a un profesional con licencia.
                </p>
            </Seccion>

            <Seccion n={11} titulo="Propiedad del contenido">
                <p>
                    Todos los cursos, videos, plantillas, textos, materiales descargables y el diseño de
                    la plataforma son nuestros o están licenciados a nosotros. Al inscribirte recibes una
                    licencia <strong>personal, limitada y revocable</strong> para usarlos en tu propio
                    aprendizaje.
                </p>
                <Lista>
                    <Item>No puedes grabar, descargar para redistribuir, revender ni publicar el contenido.</Item>
                    <Item>No puedes dar acceso a terceros ni compartir tus credenciales.</Item>
                    <Item>No puedes usar el material para crear un programa competidor.</Item>
                </Lista>
                <p>
                    Lo que tú publiques (mensajes en el muro, comentarios, testimonios) sigue siendo tuyo,
                    pero nos autorizas a mostrarlo dentro de la plataforma y, si es un testimonio que
                    envías a esa sección, también a usarlo en materiales de difusión.
                </p>
            </Seccion>

            <Seccion n={12} titulo="Normas de la comunidad">
                <p>La comunidad y el muro existen para apoyarse. Dentro no se permite:</p>
                <Lista>
                    <Item>Acoso, insultos, discriminación o contenido sexual.</Item>
                    <Item>Vender productos ajenos, reclutar para otros programas o hacer spam.</Item>
                    <Item>Compartir material del programa fuera de la plataforma.</Item>
                    <Item>Publicar datos personales de otras personas sin su permiso.</Item>
                    <Item>Pedir o dar asesoría profesional haciéndose pasar por experta con licencia.</Item>
                </Lista>
                <p>Podemos retirar cualquier publicación que incumpla estas normas, sin aviso previo.</p>
            </Seccion>

            <Seccion n={13} titulo="Suspensión y cierre de cuenta">
                <p>
                    Podemos suspender o cerrar tu cuenta si incumples estos términos, especialmente por
                    compartir credenciales o material, por conducta abusiva en la comunidad, por fraude
                    en el programa de afiliadas o por impago.
                </p>
                <p>
                    En esos casos <strong>no hay devolución</strong>, y las comisiones pendientes obtenidas
                    de forma irregular se anulan. Tú puedes cerrar tu cuenta cuando quieras escribiéndonos.
                </p>
            </Seccion>

            <Seccion n={14} titulo="Límites de responsabilidad">
                <p>
                    La plataforma se ofrece “tal cual”. Hacemos lo razonable para que funcione, pero no
                    garantizamos que esté disponible sin interrupciones ni libre de errores. Dependemos de
                    servicios de terceros (alojamiento, pagos, correo, video) que pueden fallar.
                </p>
                <p>
                    En la medida que la ley lo permita, nuestra responsabilidad total frente a ti por
                    cualquier reclamación se limita a <strong>lo que nos hayas pagado en los 12 meses
                    anteriores</strong>. No respondemos por lucro cesante, pérdida de oportunidades ni
                    daños indirectos.
                </p>
            </Seccion>

            <Seccion n={15} titulo="Ley aplicable">
                <p>
                    Estos términos se rigen por las leyes del estado de <Pendiente>{DATOS.estado}</Pendiente>,
                    Estados Unidos, sin aplicar sus normas de conflicto de leyes. Cualquier disputa se
                    someterá a los tribunales competentes de ese estado.
                </p>
                <p>
                    Antes de acudir a un tribunal, te pedimos que nos escribas: casi todo se resuelve
                    hablando.
                </p>
            </Seccion>

            <Seccion n={16} titulo="Cambios en estos términos">
                <p>
                    Podemos actualizar este documento. Cuando el cambio sea relevante te avisaremos por
                    correo o dentro de la plataforma con antelación razonable. La fecha de la última
                    actualización está al principio de esta página.
                </p>
                <p>
                    Si sigues usando la plataforma después de un cambio, entendemos que lo aceptas. Si no
                    estás de acuerdo, puedes cancelar.
                </p>
            </Seccion>
        </LegalLayout>
    );
}

export default Terminos;
