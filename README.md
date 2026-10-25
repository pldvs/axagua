# Axagua - Vitrina de Arte y Artesanía Torrense

**Axagua** es una plataforma web interactiva diseñada para catalogar, preservar y difundir las obras de arte y artesanías criollas creadas en las 17 parroquias del **Municipio Torres, Estado Lara, Venezuela** (Camay, Curarigua, Carora, Río Tocuyo, entre otras).

## 🚀 Características Principales

1. **Estructura Semántica Avanzada**: Desarrollado bajo estándares modernos de HTML5 y CSS Grid autoajustable.
2. **Base de Datos Persistente Local**: Almacenamiento directo mediante `localStorage` para salvaguardar los registros introducidos por los artesanos sin necesidad de servidores externos.
3. **Filtros Avanzados**: Búsqueda por texto en tiempo real integrada junto a una botonera de clasificación rápida por escala de valoración cultural.
4. **Temática Arenosa-Colonial Inteligente**: Soporte nativo para cambio de interfaz entre Modo Claro (tonos tierra/arena) y Modo Oscuro (tonos de barro profundo) con persistencia de estado.
5. **Controlador de Erreos y Validación Rigurosa**: Validación de números telefónicos venezolanos acompañada de una alerta visual de sacudida y parpadeo de error si el formulario contiene información incorrecta.
6. **Módulo de Exportación**: Preparación de hojas de estilo de impresión (`@media print`) para generar catálogos limpios en formato PDF directamente desde el navegador.

## 📁 Estructura del Proyecto

El proyecto se compone de 4 archivos esenciales localizados en el mismo directorio:

```text
axagua/
│
├── index.html       # Interfaz de usuario, formulario y vitrina activa.
├── historia.html    # Página secundaria que detalla las raíces históricas del término Axagua.
├── estilos.css      # Variables de diseño, responsividad y animaciones de error.
└── script.js        # Lógica de la base de datos, filtros interactivos y validaciones.
```

## 🛠️ Instalación y Uso Local

1. Clona o descarga los archivos en una carpeta local llamada `axagua`.
2. Abre la carpeta dentro de **Visual Studio Code**.
3. Asegúrate de tener instalada la extensión **Live Server**.
4. Haz clic derecho sobre `index.html` y selecciona **Open with Live Server**.
5. Pon a prueba el sistema de validación del formulario introduciendo un número telefónico sin el guion o con menos dígitos para observar el parpadeo de alerta.
