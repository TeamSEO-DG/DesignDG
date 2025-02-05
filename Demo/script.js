// Función para obtener los parámetros de la URL (mes, campaign, version)
function obtenerParametroURL(nombre, url = window.location.href) {
    nombre = nombre.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + nombre + '(=([^&#]*)|&|#|$)');
    const resultados = regex.exec(url);
    return resultados ? decodeURIComponent(resultados[2].replace(/\+/g, ' ')) : null;
}

// Objeto que mapea los valores del selector a sus respectivas medidas
const medidasBanners = {
    '970x250': '970x250',
    '300x600': '300x600',
    '300x250': '300x250',
    '320x100': '320x100',
    '160x600': '160x600',
    '728x90': '728x90',
};

// Función para cargar y mostrar el banner
function cargarYMostrarBanner(medida) {
    const mes = obtenerParametroURL('mes');
    const campaign = obtenerParametroURL('campaign');
    const version = obtenerParametroURL('version') || 'v1';

    // Validación básica de parámetros
    if (!mes || !campaign) {
        console.error('Los parámetros "mes" y "campaign" son obligatorios.');
        // Aquí puedes mostrar un mensaje de error al usuario
        return;
    }

    const rutaBanner = `banners/${mes}/${campaign}/${version}/${medida}/index.html`;
    const bannerIframe = document.getElementById('banner');
    const bannerContainer = document.getElementById('banner-container');

    bannerIframe.src = rutaBanner;
    bannerIframe.width = medida.split('x')[0];
    bannerIframe.height = medida.split('x')[1];

    // Ajustar el tamaño del contenedor del banner
    bannerContainer.style.width = `${medida.split('x')[0]}px`;
    bannerContainer.style.height = `${medida.split('x')[1]}px`;

    // Manejo de error simple
    bannerIframe.onerror = () => {
        console.error(`Error al cargar el banner: ${rutaBanner}`);
        bannerIframe.src = ''; // Limpiar el iframe
        // Aquí puedes mostrar un mensaje de error al usuario
    };

    // Actualizar la información del banner
    document.getElementById('banner-info').innerHTML = `
    <p>Mes: <strong>${mes}</strong></p>
    <p>Campaña: <strong>${campaign}</strong></p>
    <p>Versión: <strong>${version}</strong></p>
  `;
}

// Obtener el selector
const sizeSelector = document.getElementById('size-selector');

// Crear las opciones del selector a partir del objeto medidasBanners
for (const medida in medidasBanners) {
    const option = document.createElement('option');
    option.value = medida;
    option.text = medida;
    sizeSelector.add(option);
}

// Evento change en el selector
sizeSelector.addEventListener('change', () => {
    const medidaSeleccionada = sizeSelector.value;
    cargarYMostrarBanner(medidaSeleccionada);
    document.getElementById('all-banners-container').style.display = 'none'; // Ocultar todos los banners
    document.getElementById('banner-container').style.display = 'flex'; // Mostrar banner individual
});

//Mostrar todos los banners
document.getElementById('ver-todos').addEventListener('click', () => {
    const mes = obtenerParametroURL('mes');
    const campaign = obtenerParametroURL('campaign');
    const version = obtenerParametroURL('version') || 'v1';
    const allBannersContainer = document.getElementById('all-banners-container');
    allBannersContainer.innerHTML = ''; // Limpiar banners anteriores
    document.getElementById('banner-container').style.display = 'none'; // Ocultar banner individual
    document.getElementById('all-banners-container').style.display = 'flex'; // Mostrar contenedor de todos los banners

    for (const medida in medidasBanners) {
        const rutaBanner = `banners/${mes}/${campaign}/${version}/${medida}/index.html`;
        const bannerItem = document.createElement('div');
        bannerItem.classList.add('banner-item');
        bannerItem.style.width = `${medida.split('x')[0]}px`;
        bannerItem.style.height = `${medida.split('x')[1]}px`;

        const iframe = document.createElement('iframe');
        iframe.src = rutaBanner;
        iframe.width = medida.split('x')[0];
        iframe.height = medida.split('x')[1];
        iframe.style.border = 'none';

        bannerItem.appendChild(iframe);
        allBannersContainer.appendChild(bannerItem);
    }
});

// Mostrar el banner 970x250 por defecto al cargar la página
window.addEventListener('load', () => {
    const medidaInicial = sizeSelector.value;
    cargarYMostrarBanner(medidaInicial);
});