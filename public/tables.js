// Función para cargar la tabla de vehículos
function loadVehiclesTable(data) {
    const vehicleTable = document.getElementById("vehicle-table");
    if (!vehicleTable) {
      console.error("Contenedor para la tabla de vehículos no encontrado.");
      return;
    }
  
    vehicleTable.innerHTML = ""; // Limpiar tabla anterior
  
    data.vehicles.forEach((vehicle) => {
      const row = `
        <tr>
          <td>${vehicle.plate}</td>
          <td>${vehicle.model}</td>
          <td>${vehicle.color}</td>
          <td>${vehicle.brand}</td>
          <td>${vehicle.loadCapacity}</td>
        </tr>
      `;
      vehicleTable.innerHTML += row;
    });
  }
  
  // Función para cargar la tabla de conductores
  function loadDriversTable(data) {
    const driverTable = document.getElementById("driver-table");
    if (!driverTable) {
      console.error("Contenedor para la tabla de conductores no encontrado.");
      return;
    }
  
    driverTable.innerHTML = ""; // Limpiar tabla anterior
  
    data.drivers.forEach((driver) => {
      const row = `
        <tr>
          <td>${driver.id}</td>
          <td>${driver.firstName}</td>
          <td>${driver.lastName}</td>
          <td>${driver.licenseNumber}</td>
          <td>${driver.phone}</td>
          <td>${driver.email}</td>
        </tr>
      `;
      driverTable.innerHTML += row;
    });
  }
  
  // Función para cargar las tablas de rutas agrupadas por vehículo
  function loadRoutesTable(data) {
    const groupedRoutes = groupBy(data.routes, "vehiclePlate");
    const tableContainer = document.getElementById("route-tables-container");
    if (!tableContainer) {
      console.error("Contenedor de tablas de rutas no encontrado.");
      return;
    }
  
    tableContainer.innerHTML = ""; // Limpiar tablas anteriores
  
    // Crear una sección colapsable por cada vehículo
    Object.keys(groupedRoutes).forEach((vehicle, index) => {
      const routes = groupedRoutes[vehicle];
  
      // Crear la estructura del accordion
      const accordionItem = `
        <div class="accordion-item">
          <h4 class="accordion-header" id="heading-${vehicle}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${vehicle}" aria-expanded="false" aria-controls="collapse-${vehicle}">
              Vehículo: ${vehicle}
            </button>
          </h4>
          <div id="collapse-${vehicle}" class="accordion-collapse collapse" aria-labelledby="heading-${vehicle}" data-bs-parent="#routesAccordion">
            <div class="accordion-body">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Conductor</th>
                    <th>Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  ${routes
                    .map(
                      (route) => `
                        <tr>
                          <td>${route.date}</td>
                          <td>${route.driverId}</td>
                          <td>${route.routeDetails
                            .map(
                              (detail) =>
                                `${detail.address} (Paquete ${detail.packageNumber})`
                            )
                            .join(", ")}</td>
                        </tr>
                      `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
  
      tableContainer.innerHTML += accordionItem;
    });
  }
  
  // Función para agrupar rutas por vehículo
  function groupBy(array, key) {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  }
  
  // Función para cargar todas las tablas
  function loadTables() {
    console.log("Cargando las tablas...");
  
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos obtenidos:", data);
  
        // Cargar datos en las tablas correspondientes
        loadVehiclesTable(data);
        loadDriversTable(data);
        loadRoutesTable(data);
      })
      .catch((err) => console.error("Error al cargar las tablas:", err));
  }
  
  // Llamar a la función al cargar el DOM
  document.addEventListener("DOMContentLoaded", () => {
    loadTables();
  });
  