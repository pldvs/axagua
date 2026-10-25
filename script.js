document.addEventListener('DOMContentLoaded', () => {
    
    const obrasPredeterminadas = [
        { creador: "Juana Camacaro", parroquia: "Chiquinquirá", telefono: "0412-5554433", tipo: "Locería de Camay", valoracion: "Patrimonio Histórico (Exhibición)", descripcion: "Tinaja tradicional moldeada completamente a mano y quemada a cielo abierto." },
        { creador: "Carlos Castillo", parroquia: "Antonio Díaz", telefono: "0252-4411223", tipo: "Cuatro de Curarigua", valoracion: "Pieza Única de Colección", descripcion: "Instrumento musical construido con maderas nobles de la región de Torres." },
        { creador: "Ramón Blanco", parroquia: "Trinidad Samuel", telefono: "0416-9998877", tipo: "Silla de Cuero Torrense", valoracion: "Accesible / Uso Diario", descripcion: "Mueble tradicional de madera labrada con asentamiento de cuero curtido puro." }
    ];

    let baseDeDatos = JSON.parse(localStorage.getItem('axagua_obras')) || obrasPredeterminadas;
    let filtroValoracionActivo = "todos"; // Estado del filtro rápido

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

    function actualizarEstadisticas() {
        panelContadores.innerHTML = "";
        const conteo = baseDeDatos.reduce((acumulador, obra) => {
            acumulador[obra.parroquia] = (acumulador[obra.parroquia] || 0) + 1;
            return acumulador;
        }, {});

        const parroquiasActivas = Object.keys(conteo);
        if (parroquiasActivas.length === 0) {
            panelContadores.innerHTML = "<span class='badge-contador'>Sin obras registradas en el municipio</span>";
            return;
        }

        parroquiasActivas.forEach(parroquia => {
            const badge = document.createElement('span');
            badge.className = 'badge-contador';
            badge.innerHTML = `📍 <strong>${parroquia}:</strong> ${conteo[parroquia]} ${conteo[parroquia] === 1 ? 'obra' : 'obras'}`;
            panelContadores.appendChild(badge);
        });
    }

    // RENDERIZADO QUE CRUZA BUSCADOR DE TEXTO + BOTONES DE FILTRO RÁPIDO
    function renderizarGaleria() {
        gridDinamico.innerHTML = "";
        const queryText = buscador.value.toLowerCase();

        baseDeDatos.forEach((obra, indice) => {
            // Validación de buscador de texto
            const coincideTexto = obra.parroquia.toLowerCase().includes(queryText) || 
                                  obra.creador.toLowerCase().includes(queryText) || 
                                  obra.tipo.toLowerCase().includes(queryText);

            // Validación de botón de filtro rápido
            const coincideFiltroRapido = (filtroValoracionActivo === "todos" || obra.valoracion === filtroValoracionActivo);

            if (coincideTexto && coincideFiltroRapido) {
                const tarjeta = document.createElement('article');
                tarjeta.className = 'tarjeta-obra';

                tarjeta.innerHTML = `
                    <div class="info-obra">
                        <div class="contenedor-tags">
                            <span class="tag-parroquia">Parroquia ${obra.parroquia}</span>
                            <span class="tag-valoracion">${obra.valoracion}</span>
                        </div>
                        <h3>${obra.tipo}</h3>
                        <p><strong>Por:</strong> ${obra.creador}</p>
                        <p><strong>Contacto:</strong> ${obra.telefono}</p>
                        <p>${obra.descripcion}</p>
                        <button class="boton-eliminar" data-index="${indice}">Eliminar Registro</button>
                    </div>
                `;
                gridDinamico.appendChild(tarjeta);
            }
        });

        document.querySelectorAll('.boton-eliminar').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const indexARemover = e.target.getAttribute('data-index');
                eliminarObra(indexARemover);
            });
        });

        actualizarEstadisticas();
    }

    function eliminarObra(index) {
        if(confirm("¿Deseas remover esta artesanía del catálogo de Axagua?")) {
            baseDeDatos.splice(index, 1);
            localStorage.setItem('axagua_obras', JSON.stringify(baseDeDatos));
            renderizarGaleria();
        }
    }

    // MANEJO DE LOS BOTONES DE FILTROS RÁPIDOS
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            // Cambiar clase activa visualmente
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            e.target.classList.add('activo');

            // Cambiar estado del filtro y re-renderizar
            filtroValoracionActivo = e.target.getAttribute('data-filtro');
            renderizarGaleria();
        });
    });

    if (buscador) {
        buscador.addEventListener('input', renderizarGaleria);
    }

    // VALIDACIÓN DINÁMICA DEL TELÉFONO
    const regexFormat = /^(0412|0414|0424|0416|0426|0252)-\d{7}$/;
    if (inputTelefono) {
        inputTelefono.addEventListener('input', () => {
            if (inputTelefono.value === "" || regexFormat.test(inputTelefono.value)) {
                errorTelMsg.textContent = "";
            } else {
                errorTelMsg.textContent = "⚠️ Formato inválido. Use: 0412-1234567";
            }
        });
    }

    // CAPTURA CON MANEJO DE ANIMACIÓN ALERTA DE ERROR VISUAL
    if (formulario) {
        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const creador = document.getElementById('nombre').value.trim();
            const parroquia = document.getElementById('parroquia').value;
            const telefono = inputTelefono.value.trim();
            const tipo = document.getElementById('tipo').value.trim();
            const valoracion = document.getElementById('valoracion').value;
            const descripcion = document.getElementById('descripcion').value.trim();

            // Evaluar si algún campo está vacío o el formato del teléfono es erróneo
            if (!creador || !parroquia || !tipo || !valoracion || !descripcion || !regexFormat.test(telefono)) {
                
                // Disparamos la alerta visual parpadeante (sacudida roja)
                formularioBox.classList.add('formulario-error-shaking');
                
                // Remover la clase tras terminar la animación para permitir que vuelva a activarse luego
                setTimeout(() => {
                    formularioBox.classList.remove('formulario-error-shaking');
                }, 400);

                if(!regexFormat.test(telefono)) {
                    errorTelMsg.textContent = "⚠️ Teléfono obligatorio y con formato correcto para registrar.";
                    inputTelefono.focus();
                }
                return; 
            }

            // Si pasa el control, se inserta normalmente
            const nuevaObra = { creador, parroquia, telefono, tipo, valoracion, descripcion };
            baseDeDatos.push(nuevaObra);
            localStorage.setItem('axagua_obras', JSON.stringify(baseDeDatos));
            
            buscador.value = "";
            filtroValoracionActivo = "todos";
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            document.querySelector('[data-filtro="todos"]').classList.add('activo');
            
            renderizarGaleria();
            formulario.reset();
            errorTelMsg.textContent = "";
            alert(`¡Excelente! La pieza ha sido catalogada con éxito.`);
        });
    }

    // MODO OSCURO / CLARO
    const temaGuardado = localStorage.getItem('axagua_theme') || 'light';
    document.documentElement.setAttribute('data-theme', temaGuardado);
    btnTema.textContent = (temaGuardado === 'dark') ? '☀️ Modo Claro' : '🌙 Modo Oscuro';

    btnTema.addEventListener('click', () => {
        let temaActual = document.documentElement.getAttribute('data-theme');
        let nuevoTema = (temaActual === 'dark') ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nuevoTema);
        localStorage.setItem('axagua_theme', nuevoTema);
        btnTema.textContent = (nuevoTema === 'dark') ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
    });

    btnImprimir.addEventListener('click', () => { window.print(); });

    renderizarGaleria();
});
