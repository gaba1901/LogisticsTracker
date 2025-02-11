let map; // Variable global para el mapa
let directionsService; // Servicio para calcular rutas
let directionsRenderer; // Renderizador de rutas

// Inicializar el mapa
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 4.757786586246297, lng: -74.04488664305592 }, // Centro inicial (Bodega)
    zoom: 12,
  });
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
}

// Mostrar la ruta en el mapa
function showRouteOnMap(routeDetails) {
  if (!routeDetails || routeDetails.length === 0) {
    console.error("No hay detalles de ruta para mostrar en el mapa.");
    return;
  }

  // Convertir routeDetails en waypoints
  const waypoints = routeDetails.slice(1, -1).map((point) => ({
    location: { lat: point.latitude, lng: point.longitude },
    stopover: true,
  }));

  // Configurar solicitud para la API de Google Directions
  const request = {
    origin: {
      lat: routeDetails[0].latitude,
      lng: routeDetails[0].longitude,
    },
    destination: {
      lat: routeDetails[routeDetails.length - 1].latitude,
      lng: routeDetails[routeDetails.length - 1].longitude,
    },
    waypoints: waypoints,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);
    } else {
      console.error("Error al mostrar la ruta en el mapa:", status);
    }
  });
}

// Exportar las funciones para que puedan ser usadas desde otros scripts
export { initMap, showRouteOnMap };
