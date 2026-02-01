/*
 * GazeMapping : api.js 
 * Módulo para la comunicación con el servidor Node.js
 */

// Eliminamos BASE_URL con localhost. Al usar rutas relativas '/', 
// el navegador usará automáticamente el dominio donde esté alojada la web.

/*
 * Comprueba si existe la imagen de un sitio específico en el servidor.
 */
async function comprobarExistenciaSitio(siteId) {
    try {
        const respuesta = await fetch(`/comprobar-sitio/${siteId}`);
        return respuesta.ok;
    } catch (error) {
        console.error("Error al comprobar existencia de sitio:", error);
        return false;
    }
}

/*
 * Devuelve número total de usuarios registrados en users.json
 */
async function obtenerTotalUsuarios() {
    try {
        const response = await fetch('/total-usuarios'); // Ruta relativa
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return 0;
        }

        const data = await response.json();
        return data.total || 0;
    } catch (error) {
        console.error("Error de conexión:", error);
        return 0;
    }
}

/*
 * Comprobar si existe el archivo de imagen físicamente
 */
async function existeFichero(n) {
    const rutaImagen = `sites/${n}.png`; 

    try {
        // Usamos HEAD para no descargar la imagen completa, solo verificar si está
        const respuesta = await fetch(rutaImagen, { method: 'HEAD' });
        return respuesta.ok; 
    } catch (error) {
        return false;
    }
}

/*
 * Obtiene los datos de Gaze (mirada) filtrados por sitio
 */
async function obtenerDatosGaze(siteId = 1) {
    try {
        const response = await fetch(`/obtener-datos?site=${siteId}`);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener datos gaze:", error);
        return [];
    }
}

/*
 * Obtiene los clics registrados filtrados por sitio
 */
async function obtenerDatosClics(siteId = 1) {
    try {
        const response = await fetch(`/obtener-clics?site=${siteId}`);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener clics:", error);
        return [];
    }
}

/*
 * Obtiene los POIs (Puntos de Interés) filtrados por sitio
 */
async function obtenerDatosPOIs(siteId = 1) {
    try {
        const response = await fetch(`/obtener-poi?site=${siteId}`);
        const data = await response.json();
        // Manejamos si el servidor devuelve el objeto envuelto o el array directo
        return data.puntos || data;
    } catch (error) {
        console.error("Error al obtener POIs:", error);
        return [];
    }
}