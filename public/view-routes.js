import { initMap, showRouteOnMap } from './map-handler.js'; // Importar funciones del mapa

// Cargar vehículos en el select box
function loadVehicles() {
  fetch('/data.json')
    .then((res) => res.json())
    .then((data) => {
      const vehicleSelect = document.getElementById('vehicleSelect');
      vehicleSelect.innerHTML = '<option value="">Seleccionar Vehículo</option>'; // Opción por defecto

      // Agregar vehículos al select
      data.vehicles.forEach((vehicle) => {
        const option = document.createElement('option');
        option.value = vehicle.plate; // Usamos la placa como identificador
        option.textContent = `${vehicle.plate} - ${vehicle.brand} ${vehicle.model}`;
        vehicleSelect.appendChild(option);
      });
    })
    .catch((err) => console.error('Error al cargar los vehículos:', err));
}

// Filtrar rutas por vehículo y fecha
function filterRoutes(e) {
  e.preventDefault();

  const vehiclePlate = document.getElementById('vehicleSelect').value;
  const selectedDate = document.getElementById('dateSelect').value;

  if (!vehiclePlate || !selectedDate) {
    alert('Por favor, selecciona un vehículo y una fecha.');
    return;
  }

  fetch('/data.json')
    .then((res) => res.json())
    .then((data) => {
      const routesTable = document.getElementById('routesTable');
      routesTable.innerHTML = ''; // Limpiar la tabla

      const mapContainer = document.getElementById("map");
      mapContainer.style.display = "none"; // Ocultar el mapa inicialmente

      // Filtrar rutas
      const filteredRoutes = data.routes.filter(
        (route) => route.vehiclePlate === vehiclePlate && route.date === selectedDate
      );

      // Mostrar rutas filtradas en la tabla
      if (filteredRoutes.length === 0) {
        routesTable.innerHTML = '<tr><td colspan="3">No se encontraron rutas para los filtros seleccionados.</td></tr>';
        return;
      }

      filteredRoutes.forEach((route, index) => {
        const details = route.routeDetails
          .map((detail) => `${detail.address} (Paquete ${detail.packageNumber})`)
          .join(', ');

        const row = `
          <tr>
            <td>${route.date}</td>
            <td>${route.driverId}</td>
            <td>${details}</td>
          </tr>
        `;
        routesTable.innerHTML += row;

        // Mostrar la primera ruta en el mapa
        if (index === 0) {
          mapContainer.style.display = "block"; // Mostrar el mapa
          showRouteOnMap(route.routeDetails); // Dibujar la ruta en el mapa
        }
      });
    })
    .catch((err) => console.error('Error al filtrar las rutas:', err));
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
  loadVehicles(); // Cargar vehículos al cargar la página
  initMap(); // Inicializar el mapa desde map-handler.js
  document.getElementById('filter-form').addEventListener('submit', filterRoutes);
});
