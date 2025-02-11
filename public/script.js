let map;
let directionsService;

// Función para inicializar el mapa
function initMap() {
  const warehouse = { lat: 4.757786586246297, lng: -74.04488664305592 };

  // Inicializar el mapa
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: warehouse,
  });

  // Inicializar el servicio de direcciones
  directionsService = new google.maps.DirectionsService();

  // Agregar marcador de la bodega
  new google.maps.Marker({
    position: warehouse,
    map: map,
    title: "Bodega",
  });

  // Cargar rutas en el mapa
  loadRoutesOnMap();
}

// Función para cargar y dibujar múltiples rutas en el mapa
function loadRoutesOnMap() {
  fetch("/data.json")
    .then((res) => res.json())
    .then((data) => {
      data.routes.forEach((route) => {
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map: map,
        });

        const waypoints = route.routeDetails.map((point) => ({
          location: { lat: point.latitude, lng: point.longitude },
          stopover: true,
        }));

        directionsService.route(
          {
            origin: { lat: 4.757786586246297, lng: -74.04488664305592 }, // Bodega
            destination: waypoints[waypoints.length - 1].location, // Último punto
            waypoints: waypoints.slice(0, -1), // Puntos intermedios
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result);
            } else {
              console.error("Error al calcular la ruta:", status);
            }
          }
        );

        // Agregar marcadores con info windows
        route.routeDetails.forEach((point) => {
          const marker = new google.maps.Marker({
            position: { lat: point.latitude, lng: point.longitude },
            map: map,
            title: point.address,
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div>
                <strong>Dirección:</strong> ${point.address}<br>
                <strong>Paquete:</strong> ${point.packageNumber}
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        });
      });
    })
    .catch((err) => console.error("Error al cargar las rutas:", err));
}


// Inicializar todo al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  loadTables();
});

document.addEventListener("DOMContentLoaded", () => {
  fetch('/routes')
      .then(response => response.json())
      .then(data => {
          let selectVehicle = document.getElementById("select-vehicle");
          let vehicles = [...new Set(data.map(route => route.vehicle))];
          vehicles.forEach(vehicle => {
              let option = document.createElement("option");
              option.value = vehicle;
              option.textContent = vehicle;
              selectVehicle.appendChild(option);
          });
      });
});

document.getElementById("btn-filter").addEventListener("click", () => {
  let plate = document.getElementById("select-vehicle").value;
  let date = document.getElementById("input-date").value;
  fetch(`/routes/filter?plate=${plate}&date=${date}`)
      .then(response => response.json())
      .then(data => {
          let listRoutes = document.getElementById("list-routes");
          listRoutes.innerHTML = "";
          data.forEach(route => {
              let div = document.createElement("div");
              div.textContent = `Ruta: ${route.route}, Paquetes: ${route.packages.length}`;
              listRoutes.appendChild(div);
          });
      });
});