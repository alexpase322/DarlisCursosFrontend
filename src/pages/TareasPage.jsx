import WallPage from "./WallPage";

// Mismo tablero que el muro, con otro destino y permitiendo adjuntar archivos:
// una entrega suele ser un PDF o un documento, no una foto.
function TareasPage() {
  return (
    <WallPage
      board="tareas"
      titulo="Tareas"
      bajada="Sube aquí tus entregas. Puedes adjuntar un archivo o una captura, y las demás pueden comentarte."
      permiteArchivos
      placeholder="Cuenta qué entregas y de qué clase es…"
      textoBoton="Entregar"
      textoVacio="Todavía no hay entregas"
    />
  );
}

export default TareasPage;
