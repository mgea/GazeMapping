/**
 * api.js - Módulo para la comunicación con el servidor Node.js
 */



const BASE_URL = 'http://localhost:3000';

/**
 * Comprueba si existe la imagen de un sitio específico en el servidor.
 * @param {number|string} siteId - El ID del sitio (ej: 1, 2, 3)
 * @returns {Promise<Object|null>} - Retorna un objeto con status 'ok' si existe, o null.
 */
async function comprobarExistenciaSitio(siteId) {
    try {
        const respuesta = await fetch(`/comprobar-sitio/${siteId}`);
        if (!respuesta.ok) return false;
        return true;
    } catch (error) {
        console.error("Error al comprobar existencia de sitio-> no existe", error);
        return false;
    }
}

async function obtenerTotalUsuarios() {
    try {
        const response = await fetch('http://localhost:3000/total-usuarios');
        
        // Verificamos si la respuesta es realmente JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error("El servidor no devolvió JSON, sino:", contentType);
            return 0;
        }

        const data = await response.json();
        return data.total || 0;
    } catch (error) {
        console.error("Error de conexión:", error);
        return 0;
    }
}


/*** Comprobar fichero si existe  ****/
// Reemplaza tu función actual por esta versión para el navegador
async function existeFichero(n) {
    const nombreArchivo = `${n}.png`;
    const rutaImagen = `sites/${nombreArchivo}`; // Ruta relativa a tu carpeta web

    try {
        const respuesta = await fetch(rutaImagen, { method: 'HEAD' });
        return respuesta.ok; // Devuelve true si el archivo existe (status 200)
    } catch (error) {
        return false;
    }
}


/**
 * Obtiene los datos de Gaze (mirada) desde el servidor.
 * @returns {Promise<Array>}
 */
async function obtenerDatosGaze() {
    try {
        const response = await fetch(`${BASE_URL}/obtener-datos`);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener datos gaze:", error);
        return [];
    }
}

/**
 * Obtiene los clics registrados.
 */
async function obtenerDatosClics() {
    try {
        const response = await fetch(`${BASE_URL}/obtener-clics`);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener clics:", error);
        return [];
    }
}

/**
 * Obtiene los POIs (Puntos de Interés).
 */
async function obtenerDatosPOIs() {
    try {
        const response = await fetch(`${BASE_URL}/obtener-poi`);
        const data = await response.json();
        return data.puntos || data;
    } catch (error) {
        console.error("Error al obtener POIs:", error);
        return [];
    }
}