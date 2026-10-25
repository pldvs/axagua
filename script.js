document.addEventListener('DOMContentLoaded', () => {

    // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnOeMz-f_rfp78svKjvmRCHU8a7Uyrts0",
  authDomain: "axagua-proyecto.firebaseapp.com",
  projectId: "axagua-proyecto",
  storageBucket: "axagua-proyecto.firebasestorage.app",
  messagingSenderId: "1079951734993",
  appId: "1:1079951734993:web:ca2d78e51f95a84e142df0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
    
    
    
    
    // 1. CONFIGURACIÓN DE LAS CREDENCIALES DE TU PROYECTO FIREBASE
    // Reemplaza estos valores por los que te proporcione la consola de Firebase
    const firebaseConfig = {
        apiKey: "TU_API_KEY_AQUÍ",
        authDomain: "://firebaseapp.com",
        projectId: "axagua-proyecto",
        storageBucket: "://appspot.com",
        messagingSenderId: "1234567890",
        appId: "1:1234:web:abcd"
    };

    // Inicializamos Firebase de forma segura si no se ha inicializado antes
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    
    
    



    
    
    Instanciamos los servicios en la nube
     const db = firebase.firestore();
    const storage = firebase.storage();

     let baseDeDatos = []; // Se poblará en tiempo real desde Firestore
     let filtroValoracionActivo = "todos";

     const gridDinamico = document.getElementById('grid-dinamico');
     const formulario = document.getElementById('form-artesano');
     const formularioBox = document.getElementById('contenedor-formulario-box');
    const buscador = document.getElementById('buscador');
     const panelContadores = document.getElementById('panel-contadores');
     const inputTelefono = document.getElementById('telefono');
     const errorTelMsg = document.getElementById('error-tel-msg');
     const btnTema = document.getElementById('btn-tema');
     const btnImprimir = document.getElementById('btn-imprimir');
     const botonesFiltro = document.querySelectorAll('.btn-filtro');
     const btnSubmitTexto = document.getElementById('btn-submit-texto');

    
    
    
    
    
  
    
    
    
    // 2. LEER DATOS EN TIEMPO REAL DESDE LA NUBE (FIRESTORE)
    function escucharBaseDeDatosNube() {
        // Hacemos una escucha activa. Cada cambio en la nube refrescará la web de todos los usuarios
        db.collection("artesanias").onSnapshot((snapshot) => {
            baseDeDatos = [];
            snapshot.forEach((doc) => {
                let data = doc.data();
                data.id = doc.id; // Guardamos el ID autogenerado por Firebase para poder borrar luego
                baseDeDatos.push(data);
            });
            renderizarGaleria();
        });
    }

    function actualizarEstadisticas() {
        panelContadores.innerHTML = "";
        const conteo = baseDeDatos.reduce((acumulador, obra) => {
            acumulador[obra.parroquia] = (acumulador[obra.parroquia] || 0) + 1;
            return acumulador;
        }, {});

        Object.keys(conteo).forEach(parroquia => {
            const badge = document.createElement('span');
            badge.className = 'badge-contador';
            badge.innerHTML = `📍 <strong>${parroquia}:</strong> ${conteo[parroquia]} ${conteo[parroquia] === 1 ? 'obra' : 'obras'}`;
            panelContadores.appendChild(badge);
        });
    }

    // 3. RENDERIZADO CON BOTÓN COMERCIAL DE WHATSAPP
    function renderizarGaleria() {
        gridDinamico.innerHTML = "";
        const queryText = buscador.value.toLowerCase();

        baseDeDatos.forEach((obra) => {
            const coincideTexto = obra.parroquia.toLowerCase().includes(queryText) || 
                                  obra.creador.toLowerCase().includes(queryText) || 
                                  obra.tipo.toLowerCase().includes(queryText);

            const coincideFiltroRapido = (filtroValoracionActivo === "todos" || obra.valoracion === filtroValoracionActivo);

            if (coincideTexto && coincideFiltroRapido) {
                const tarjeta = document.createElement('article');
                tarjeta.className = 'tarjeta-obra';

                // CONEXIÓN AUTOMÁTICA DEL MENSAJE DE COMPRA DE WHATSAPP
                // Codificamos el texto para que los espacios y caracteres especiales viajen seguros en el enlace
                const mensajeVenta = encodeURIComponent(`👋 ¡Hola! Vi tu hermosa artesanía "${obra.tipo}" en la Galería Axagua y estoy interesado en adquirirla. ¿Está disponible?`);
                const enlaceWhatsApp = `https://wa.me{obra.telefono}?text=${mensajeVenta}`;

                // Renderizamos la tarjeta apuntando a la url real guardada en Firebase Storage
                tarjeta.innerHTML = `
                    <div class="imagen-artesania-box">
                        <img src="${obra.fotoUrl}" alt="${obra.tipo}" onerror="this.src='https://unsplash.com'">
                    </div>
                    <div class="info-obra">
                        <div class="contenedor-tags">
                            <span class="tag-parroquia">${obra.parroquia}</span>
                            <span class="tag-valoracion">${obra.valoracion}</span>
                        </div>
                        <h3>${obra.tipo}</h3>
                        <p><strong>Artista:</strong> ${obra.creador}</p>
                        <p>${obra.descripcion}</p>
                        
                        <!-- Botón de Enlace Comercial -->
                        <a href="${enlaceWhatsApp}" target="_blank" class="boton-comprar-wa">💬 Comprar al Artesano</a>
                        
                        <button class="boton-eliminar" data-id="${obra.id}">Eliminar</button>
                    </div>
                `;
                gridDinamico.appendChild(tarjeta);
            }
        });

        // Eventos para eliminar registros directamente de la nube
        document.querySelectorAll('.boton-eliminar').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const idDoc = e.target.getAttribute('data-id');
                eliminarObraNube(idDoc);
            });
        });

        actualizarEstadisticas();
    }

    // 4. ELIMINACIÓN DE REGISTROS DE LA NUBE
    function eliminarObraNube(id) {
        if(confirm("¿Deseas remover esta artesanía de la base de datos en la nube de Axagua?")) {
            db.collection("artesanias").doc(id).delete()
                .then(() => alert("Registro eliminado de la nube con éxito."))
                .catch((error) => console.error("Error al borrar: ", error));
        }
    }

    // FILTROS Y BUSCADOR
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            e.target.classList.add('activo');
            filtroValoracionActivo = e.target.getAttribute('data-filtro');
            renderizarGaleria();
        });
    });

    if (buscador) { buscador.addEventListener('input', renderizarGaleria); }

    // VALIDACIÓN NUMÉRICA INTERNACIONAL
    const regexInternacional = /^\d{11,13}$/; // Solo números de 11 a 13 dígitos
    if (inputTelefono) {
        inputTelefono.addEventListener('input', () => {
            if (inputTelefono.value === "" || regexInternacional.test(inputTelefono.value)) {
                errorTelMsg.textContent = "";
            } else {
                errorTelMsg.textContent = "⚠️ Formato inválido. Use solo números con código de país (Ej: 584121234567).";
            }
        });
    }

    // 5. PROCESAMIENTO DE SUBIDA: FOTO (STORAGE) + DATOS (FIRESTORE)
    if (formulario) {
        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const creador = document.getElementById('nombre').value.trim();
            const parroquia = document.getElementById('parroquia').value;
            const telefono = inputTelefono.value.trim();
            const tipo = document.getElementById('tipo').value.trim();
            const valoracion = document.getElementById('valoracion').value;
            const descripcion = document.getElementById('descripcion').value.trim();
            const fotoArchivo = document.getElementById('foto-archivo').files[0];

            if (!creador || !parroquia || !tipo || !valoracion || !descripcion || !fotoArchivo || !regexInternacional.test(telefono)) {
                formularioBox.classList.add('formulario-error-shaking');
                setTimeout(() => formularioBox.classList.remove('formulario-error-shaking'), 400);
                return; 
            }

            // Cambiamos el estado del botón mientras sube a la nube
            btnSubmitTexto.disabled = true;
            btnSubmitTexto.textContent = "Subiendo archivo a Firebase... ⏳";

            // A) SUBIMOS LA FOTO AL STORAGE
            // Guardamos el archivo usando una estampa de tiempo única para evitar archivos duplicados
            const nombreUnicoFoto = `${Date.now()}_${fotoArchivo.name}`;
            const referenciaStorage = storage.ref().child(`artesanias/${nombreUnicoFoto}`);
            
            referenciaStorage.put(fotoArchivo)
                .then((snapshot) => {
                    // B) YA SUBIDO EL ARCHIVO, OBTENEMOS SU URL PÚBLICA DE INTERNET
                    return snapshot.ref.getDownloadURL();
                })
                .then((urlDeDescargaDeFoto) => {
                    // C) GUARDAMOS EL DOCUMENTO COMPLETO EN LA COLECCIÓN DE FIRESTORE
                    return db.collection("artesanias").add({
                        creador,
                        parroquia,
                        telefono,
                        tipo,
                        valoracion,
                        descripcion,
                        fotoUrl: urlDeDescargaDeFoto, // Almacenamos el enlace directo a internet de la foto
                        fechaCreacion: firebase.firestore.FieldValue.serverTimestamp()
                    });
                })
                .then(() => {
                    alert("¡Éxito total! Datos e imagen real almacenados de manera segura en la nube de Firebase.");
                    formulario.reset();
                })
                .catch((error) => {
                    console.error("Error en el proceso de carga: ", error);
