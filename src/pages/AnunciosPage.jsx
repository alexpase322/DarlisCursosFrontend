import WallPage from "./WallPage";

// Solo el equipo publica. El permiso se aplica también en el servidor: aquí
// únicamente se oculta el formulario, que no es una medida de seguridad.
function AnunciosPage() {
  return (
    <WallPage
      board="anuncios"
      titulo="Anuncios"
      bajada="Novedades, fechas de clases en vivo y avisos importantes del equipo."
      soloAdminPublica
      placeholder="Escribe el anuncio para la comunidad…"
      textoBoton="Anunciar"
      textoVacio="Todavía no hay anuncios"
    />
  );
}

export default AnunciosPage;
