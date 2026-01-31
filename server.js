const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
// CONFIGURACIÓN GLOBAL DE RUTAS
// __dirname es el directorio donde vive server.js
const PUBLIC_PATH = path.join(__dirname, 'public');

app.use(cors());
app.use(express.json({ limit: '50mb' }));


/**
 * CONFIGURACIÓN DE CARPETAS ESTÁTICAS
 * Si tus imágenes están en public/SITE/1.png
 * Esta línea permite que http://localhost:3000/SITE/1.png funcione directamente.
 */
app.use(express.static(path.join(__dirname, 'public')));

// También servimos la raíz por si los HTML están fuera de public
app.use(express.static(__dirname));








/*** ? ****/
app.get('/comprobar-sitio/:id', (req, res) => {
    const siteId = req.params.id;
    const nombreArchivo = `${siteId}.png`;
    // Construimos la ruta hacia la carpeta de imágenes de los sitios
    const rutaImagen = path.join(PUBLIC_PATH, 'sites', nombreArchivo);

    try {
        const stats = fs.stat(rutaImagen);
        return stats.isFile(); // true solo si es fichero
  } catch {
        return false;
  }

    
});



/**
 * Función auxiliar para guardar archivos de forma segura
 */

const guardarArchivoJSON = (fileName, datos, res) => {
    const rutaAbsoluta = path.join(PUBLIC_PATH, 'sites', 'data', fileName);
    const directorio = path.dirname(rutaAbsoluta);
    console.log("> ",directorio)
    // Validar que los datos existan
    if (!datos) {
        return res.status(400).json({ error: "No se recibieron datos para guardar" });
    }

    try {
        // Asegurar que el directorio existe
        if (!fs.existsSync(directorio)) {
            fs.mkdirSync(directorio, { recursive: true });
        }

        const contenido = JSON.stringify(datos, null, 2);

        fs.writeFile(rutaAbsoluta, contenido, (err) => {
            if (err) {
                console.error("❌ ERROR FS:", err.message);
                return res.status(500).json({ 
                    error: "Error de escritura en disco", 
                    codigo: err.code,
                    ruta: rutaAbsoluta 
                });
            }
            console.log(`✅ Guardado exitoso: ${fileName}`);
            res.json({ status: "OK", path: `/sites/data/${fileName}` });
        });
    } catch (error) {
        console.error("❌ ERROR CRÍTICO:", error);
        res.status(500).json({ error: "Fallo al crear carpetas", detalle: error.message });
    }
};


app.post('/guardar-POI', (req, res) => {
    const fileName = `poi${req.body.suffix || ''}.json`;
    console.log("--- fichero", fileName)
    guardarArchivoJSON(fileName, req.body.puntos, res);
});


app.post('/guardar-gaze', (req, res) => {
    const fileName = `gaze${req.body.suffix || ''}.json`;
    guardarArchivoJSON(fileName, req.body.puntos, res);
});

app.post('/guardar-clics', (req, res) => {
    const fileName = `clics${req.body.suffix || ''}.json`;
    guardarArchivoJSON(fileName, req.body.puntos, res);
});






// Guardar Gaze con nombre dinámico

/**
 * Guardar Gaze
 * Estructura esperada: { puntos: Array, suffix: String }
 
app.post('/guardar-gaze', (req, res) => {
    try {
        const { puntos, suffix } = req.body;
        
        // Validación básica para evitar error 500
        if (!puntos) {
            return res.status(400).json({ error: "Faltan los datos (puntos)" });
        }
        const fileName = `gaze${suffix || ''}.json`;
        guardarArchivoJSON(fileName, puntos, res);
    } catch (e) {
        res.status(500).json({ error: "Error al procesar la petición" });
    }
});



// Guardar Clics con nombre dinámico

app.post('/guardar-clics', (req, res) => {
    try {
        const { puntos, suffix } = req.body;
        
        if (!puntos) {
            return res.status(400).json({ error: "Faltan los datos (puntos)" });
        }

        const fileName = `clics${suffix || ''}.json`;
        guardarArchivoJSON(fileName, puntos, res);
    } catch (e) {
        res.status(500).json({ error: "Error al procesar la petición" });
    }
});

***/
// Obtener datos (ahora acepta query params para el sufijo)
app.get('/obtener-datos', (req, res) => {
    const suffix = req.query.site || '';
    const filePath = path.join(__dirname, 'public', 'sites', 'data', `gaze-${suffix}.json`);
    
     if (fs.existsSync(filePath)) {
        const contenido = fs.readFileSync(filePath, 'utf8');
        console.log("encontrado", filePath);
        res.json(JSON.parse(contenido));
    } else {
        console.log("❌ No se encontró en:", filePath);
        res.status(404).send("Archivo no encontrado");
    }
});


// Obtener datos (ahora acepta query params para el sufijo)
app.get('/obtener-clics', (req, res) => {
    const suffix = req.query.site || '';
    const filePath = path.join(__dirname, 'public', 'sites', 'data', `clics-${suffix}.json`);
    
    if (fs.existsSync(filePath)) {
        const contenido = fs.readFileSync(filePath, 'utf8');
        console.log("encontrado", filePath);
        res.json(JSON.parse(contenido));
    } else {
        console.log("❌ No se encontró en:", filePath);
        res.status(404).send("Archivo no encontrado");
    }
});

app.get('/obtener-clics', (req, res) => {
    const site = req.query.site;
    // Busca archivos como clics-1.json, clics-2.json
    const filePath = path.join(__dirname, 'public', 'sites', 'data', `clics-${site}.json`);

    if (fs.existsSync(filePath)) {
        const contenido = fs.readFileSync(filePath, 'utf8');
        res.json(JSON.parse(contenido));
    } else {
        res.status(404).send("No hay datos");
    }
});


// Obtener datos (ahora acepta query params para el sufijo)
app.get('/obtener-poi', (req, res) => {
    const suffix = req.query.site || '';
    const filePath = path.join(__dirname, 'public', 'sites', 'data', `poi-${suffix}.json`);
    
    if (fs.existsSync(filePath)) {
        const contenido = fs.readFileSync(filePath, 'utf8');
        console.log("encontrado");
        res.json(JSON.parse(contenido));
    } else {
        console.log("nombre obtener-poi", filePath, "sufijo=", suffix);
        console.log("❌ No se encontró en:", filePath);
        res.status(404).send("Archivo no encontrado");
    }
});



//  USUARIOS ALMACENAR 

app.post('/guardar-usuario', (req, res) => {
    const nuevoUsuario = req.body;
    const filePath = path.join(__dirname, 'public', 'sites',  `users.json`);

    // Leer el archivo actual (o crear uno vacío si no existe)
    fs.readFile(filePath, 'utf8', (err, data) => {
        let listaUsuarios = [];
        if (!err && data) {
            listaUsuarios = JSON.parse(data);
        }

        listaUsuarios.push(nuevoUsuario);

        // Guardar la lista actualizada
        fs.writeFile(filePath, JSON.stringify(listaUsuarios, null, 2), (err) => {
            if (err) return res.status(500).send("Error escribiendo archivo");
            res.send("Usuario guardado");
        });
    });
});


app.get('/total-usuarios', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'sites', 'users.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err || !data) {
            return res.json({ total: 0 }); // Si no existe el archivo, devolver 0
        }
        try {
            const usuarios = JSON.parse(data);
            res.json({ total: usuarios.length });
        } catch (e) {
            res.json({ total: 0 });
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📁 Carpeta estática: ${path.join(__dirname, 'public')}`);
});