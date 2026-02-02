/*
 * server.js - GazeMapping Backend
 * Optimizado para Render.com
 *   Web Eye Tracking Analysis & Heatmap Visualization tool 
 * version 1.0, Junio 2026 
 * autor: Miguel Gea
 *  
 * repo:        https://github.com/mgea/GazeMapping
 * live demo:   https://gazemapping.onrender.com/ 
 * 
 * Almacena datos en: 
 *  Imágenes:  http://localhost:3000/site/1.png 
 *  Usuarios:  http://localhost:3000/site/users.json
 *  Datos gaze:  http://localhost:3000/site/data/gaze-1.json 
 *  Clics usr:   http://localhost:3000/site/data/clics-1.json
 *  POI imagen:  http://localhost:3000/site/data/POI-1.json
 */

import express from 'express';
import { existsSync, mkdirSync, writeFile, readFile } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// Configuración necesaria para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_PATH = join(__dirname, 'public');

app.use(cors());
app.use(express.json({ limit: '50mb' }));


/* 
 * Servir archivos estáticos
 * Si tus imágenes están en public/site/1.png
 * Esta línea permite que http://localhost:3000/site/1.png funcione directamente.
 */
app.use(express.static(PUBLIC_PATH));



/*  
 *  se usa?
 */
app.get('/comprobar-sitio/:id', (req, res) => {
    const siteId = req.params.id;
    const nombreArchivo = `${siteId}.png`;
    // Construimos la ruta hacia la carpeta de imágenes de los sitios
    const rutaImagen = join(PUBLIC_PATH, 'sites', nombreArchivo);

    try {
        const stats = stat(rutaImagen);
        return stats.isFile(); // true solo si es fichero
    } catch {
        return false;
    }    
});



/*
 * Función auxiliar para guardar archivos de datos de forma segura
 * Se almacena en /public/site/data/n.json
 * gaze-n   --- heatmap
 * clics-n  --  clics de mouse en testing 
 * poi-n    --- POI creados para cada sitio (puntos de interés) 
 * Estructura esperada: { puntos: Array, suffix: String }
 */

const guardarArchivoJSON = (fileName, datos, res) => {
    const rutaAbsoluta = join(PUBLIC_PATH, 'sites', 'data', fileName);
    const directorio = dirname(rutaAbsoluta);
   
    // Validar que los datos existan
    if (!datos) {
        return res.status(400).json({ error: "No se recibieron datos para guardar" });
    }

    try {
        // Asegurar que el directorio existe
        if (!existsSync(directorio)) {
            mkdirSync(directorio, { recursive: true });
        }

        const contenido = JSON.stringify(datos, null, 2);

        writeFile(rutaAbsoluta, contenido, (err) => {
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



/*
 *  Obtener datos de heatmap 
 * (ahora acepta query params para el sufijo)
 */
app.get('/obtener-datos', (req, res) => {
    const suffix = req.query.site || '';
    const filePath = join(__dirname, 'public', 'sites', 'data', `gaze-${suffix}.json`);
    
    // VERIFICACIÓN FICHERO: Si no existe, enviamos [] en lugar de un error de texto
    if (!fs.existsSync(filePath)) {
        console.log(`No hay datos de Gaze para Sitio ${suffix} `);
        return res.json([]); 
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error al leer el archivo" });
        }
        try {
            res.json(JSON.parse(data));
        } catch (e) {
            res.status(500).json({ error: "JSON corrupto" });
        }
    });

});


/*
 *  Obtener datos clics 
 * (ahora acepta query params para el sufijo)
 */
app.get('/obtener-clics', (req, res) => {
    const suffix = req.query.site || '1'; // 1 por defecto

    // Busca archivos como clics-1.json, clics-2.json
    const filePath = join(__dirname, 'public', 'sites', 'data', `clics-${site}.json`);

        // VERIFICACIÓN FICHERO: Si no existe, enviamos [] en lugar de un error de texto
    if (!fs.existsSync(filePath)) {
        console.log(`No hay datos de Clics para Sitio ${suffix} `);
        return res.json([]); 
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error al leer el archivo" });
        }
        try {
            res.json(JSON.parse(data));
        } catch (e) {
            res.status(500).json({ error: "JSON corrupto" });
        }
    });
});


/*
 *  Obtener datos POI 
 * (ahora acepta query params para el sufijo)
 */
app.get('/obtener-poi', (req, res) => {
    const suffix = req.query.site || '1'; // 1 por defecto
    const filePath = join(__dirname, 'public', 'sites', 'data', `poi-${suffix}.json`);

    // VERIFICACIÓN FICHERO: Si no existe, enviamos [] en lugar de un error de texto
    if (!fs.existsSync(filePath)) {
        console.log(`No hay datos de POI para Sitio ${suffix} `);
        return res.json([]); 
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error al leer el archivo" });
        }
        try {
            res.json(JSON.parse(data));
        } catch (e) {
            res.status(500).json({ error: "JSON corrupto" });
        }
    });

});


/*
 *  Guardar datos usuarios de sesión 
 * Se almacena en /public/site/users.json
 * (se crea si no existe y se van añadiendo)
 */
app.post('/guardar-usuario', (req, res) => {
    const nuevoUsuario = req.body;
    const filePath = join(__dirname, 'public', 'sites',  `users.json`);

    // Leer el archivo actual (o crear uno vacío si no existe)
    readFile(filePath, 'utf8', (err, data) => {
        let listaUsuarios = [];
        if (!err && data) {
            listaUsuarios = JSON.parse(data);
        }

        listaUsuarios.push(nuevoUsuario);

        // Guardar la lista actualizada
        writeFile(filePath, JSON.stringify(listaUsuarios, null, 2), (err) => {
            if (err) return res.status(500).send("Error escribiendo archivo");
            res.send("Usuario guardado");
        });
    });
});

/*
 * Conocer numero de usuarios que han usado sesión testing 
 * Normalmente el heatmap acumula datos de más de una visita
 */
app.get('/total-usuarios', (req, res) => {
    const filePath = join(__dirname, 'public', 'sites', 'users.json');

    readFile(filePath, 'utf8', (err, data) => {
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

/*
 * Exportar Usuarios JSON 
 * Descarga datos de usuarios 
 */
app.get('/exportar-usuarios-json', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'sites', 'users.json');

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("No hay usuarios registrados todavía.");
    }

    // Forzamos al navegador a descargar el archivo en lugar de abrirlo
    res.download(filePath, `usuarios_gazemapping_${Date.now()}.json`);
});

/*
 * Exportar Usuarios CSV 
 * Descarga datos de usuarios 
 */
app.get('/exportar-usuarios-csv', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'sites', 'users.json');

    if (!fs.existsSync(filePath)) return res.status(404).send("Sin datos.");

    const rawData = fs.readFileSync(filePath);
    const usuarios = JSON.parse(rawData);

    if (usuarios.length === 0) return res.send("Archivo vacío");

    // Crear cabeceras del CSV basadas en las llaves del primer objeto
    const fields = Object.keys(usuarios[0]);
    const csv = [
        fields.join(','), // Cabecera: id,nombre,timestamp...
        ...usuarios.map(u => fields.map(f => `"${u[f]}"`).join(',')) // Datos
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=usuarios_gaze.csv');
    res.status(200).send(csv);
});


// Ruta para servir el index o about si entran a la raíz
app.get('/', (req, res) => {
    res.sendFile(join(PUBLIC_PATH, 'index.html'));
});


app.listen(PORT, () => {
    console.log(`🚀 GazeMapping Online: Port ${PORT}`);
});