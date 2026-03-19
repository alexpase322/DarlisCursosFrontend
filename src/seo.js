import { SITE_URL } from "./components/Seo";

const defaultImage = `${SITE_URL}/social-preview.svg`;

export const seoConfigs = {
  home: {
    title: "Arquitecta de tu Propio Éxito | Cursos de negocio digital para mamás",
    description:
      "Cursos de negocio digital para mamás con estrategia, mentalidad y tecnología para crear ingresos sin descuidar a tu familia.",
    path: "/",
    image: defaultImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          name: "Arquitecta de tu Propio Éxito",
          url: SITE_URL,
          email: "soporte@arquitectadetupropioexito.com",
          description:
            "Plataforma de cursos de negocio digital para mamás y mujeres emprendedoras.",
          sameAs: [
            "https://www.instagram.com/darlisfrancov?igsh=MWdyNThneWJqdWx6dg==",
            "https://www.tiktok.com/@darlisfv?_r=1&_t=ZS-94OR6yTfuCt",
          ],
        },
        {
          "@type": "WebSite",
          name: "Arquitecta de tu Propio Éxito",
          url: SITE_URL,
          description:
            "Cursos de negocio digital para mamás con estrategia, mentalidad y tecnología.",
        },
      ],
    },
  },
  agencia: {
    title: "BluePrint Digital | Agencia de arquitectura digital e IA",
    description:
      "BluePrint Digital diseña marcas, sitios web y automatizaciones con inteligencia artificial para negocios que quieren escalar con una presencia premium.",
    path: "/agencia",
    image: defaultImage,
  },
  metodoAdn: {
    title: "Método ADN | Manifiesto, discurso y avatar de marca",
    description:
      "Aprende a definir el manifiesto, el discurso y el avatar de tu marca con el Método ADN para posicionarte con claridad y autoridad.",
    path: "/metodo-adn",
    image: defaultImage,
  },
  guiaIngreso: {
    title: "Guía de Primer Ingreso | Empieza tu negocio digital desde cero",
    description:
      "Descubre la guía de primer ingreso para pasar de cero a tus primeras ventas digitales con pasos, enfoque y recursos accionables.",
    path: "/guia-ingreso",
    image: defaultImage,
  },
  pilaresContenido: {
    title: "Pilares de Contenido | Estructura tu mensaje de marca",
    description:
      "Organiza tus pilares de contenido para comunicar tu propuesta de valor, conectar con tu audiencia y vender con estrategia.",
    path: "/pilares-contenido",
    image: defaultImage,
  },
  memoriaEmocional: {
    title: "Memoria Emocional | Construye una marca que conecte",
    description:
      "Explora la memoria emocional de tu marca para transformar tu historia en mensajes, contenido y posicionamiento memorables.",
    path: "/memoria-emocional",
    image: defaultImage,
  },
  amazonResenas: {
    title: "Amazon Reseñas | Guía para productos gratis e ingresos",
    description:
      "Aprende cómo funciona Amazon Reseñas, cómo contactar proveedores y cómo monetizar productos gratis paso a paso.",
    path: "/amazon-resenas",
    image: defaultImage,
  },
  amazonInfluencer: {
    title: "Amazon Influencer | Guía para aplicar y monetizar",
    description:
      "Todo lo que necesitas saber para aplicar al programa Amazon Influencer, ser aprobada y monetizar tus recomendaciones.",
    path: "/amazon-influencer",
    image: defaultImage,
  },
};
