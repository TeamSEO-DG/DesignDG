// Función para obtener parámetros de la URL
function obtenerParametroURL(nombre, url = window.location.href) {
    nombre = nombre.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + nombre + '(=([^&#]*)|&|#|$)');
    const resultados = regex.exec(url);
    return resultados ? decodeURIComponent(resultados[2].replace(/\+/g, ' ')) : null;
}

// Función para cargar y mostrar el banner
function cargarYMostrarBanner(medida) {
    const mes = obtenerParametroURL('mes');
    const campaign = obtenerParametroURL('campaign');
    const version = obtenerParametroURL('version') || 'v1';

    if (!mes || !campaign) {
        console.error('Los parámetros "mes" y "campaign" son obligatorios.');
        return;
    }

    const rutaBanner = `banners/${mes}/${campaign}/${version}/${medida}/index.html`;
    const bannerIframe = document.getElementById('banner');
    const bannerContainer = document.getElementById('banner-container');

    const [width, height] = medida.split('x');

    // Ajustar tamaño dinámicamente
    bannerContainer.style.width = `${width}px`;
    bannerContainer.style.height = `${height}px`;
    bannerIframe.width = width;
    bannerIframe.height = height;
    bannerIframe.src = rutaBanner;

    bannerIframe.onerror = () => {
        console.error(`Error al cargar el banner: ${rutaBanner}`);
        bannerIframe.src = ''; // Limpiar el iframe en caso de error
    };

    // Actualizar la información del banner
    document.getElementById('banner-info').innerHTML = `
      <p>Mes: <strong>${mes}</strong></p>
      <p>Campaña: <strong>${campaign}</strong></p>
      <p>Versión: <strong>${version}</strong></p>
    `;
}

// Evento change en el selector
document.getElementById('size-selector').addEventListener('change', () => {
    const medidaSeleccionada = document.getElementById('size-selector').value;
    cargarYMostrarBanner(medidaSeleccionada);
});

// Mostrar el banner 970x250 por defecto al cargar la página
window.addEventListener('load', () => {
    const medidaInicial = document.getElementById('size-selector').value;
    cargarYMostrarBanner(medidaInicial);
});
