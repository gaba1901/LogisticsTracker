const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const dataFile = path.join(__dirname, 'data.json');

function readData() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ vehicles: [], drivers: [], routes: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(dataFile));
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// Endpoint para registrar un vehículo
app.post('/api/vehicles', (req, res) => {
  const { plate, model, color, brand, loadCapacity } = req.body;
  const data = readData();
  data.vehicles.push({ plate, model, color, brand, loadCapacity });
  writeData(data);
  res.status(201).json({ message: 'Vehículo registrado con éxito.' });
});

// Endpoint para registrar un conductor
app.post("/api/drivers", (req, res) => {
  const { id, firstName, lastName, licenseNumber, phone, email } = req.body;

  // Validar que todos los campos estén presentes
  if (!id || !firstName || !lastName || !licenseNumber || !phone || !email) {
    return res.status(400).json({ message: "Todos los campos son obligatorios." });
  }

  const data = readData();
  data.drivers.push({ id, firstName, lastName, licenseNumber, phone, email });
  writeData(data);
  res.status(201).json({ message: "Conductor registrado exitosamente." });
});






// Endpoint para programar una ruta
app.post("/api/routes", (req, res) => {
  const { vehiclePlate, driverId, date, routeDetails } = req.body;

  // Validar que todos los campos estén presentes
  if (!vehiclePlate || !driverId || !date || !routeDetails || !Array.isArray(routeDetails)) {
    return res.status(400).json({ message: "Todos los campos son obligatorios y routeDetails debe ser un array." });
  }

  const data = readData();
  data.routes.push({ vehiclePlate, driverId, date, routeDetails });
  writeData(data); // Guardar los datos en el archivo JSON
  res.status(201).json({ message: "Ruta programada exitosamente." });
});

// Endpoint para obtener las rutas con puntos
app.get('/api/routes', (req, res) => {
  const data = readData();
  res.status(200).json(data.routes);
});

// Endpoint para obtener todos los datos (vehículos, conductores, rutas)
app.get('/data.json', (req, res) => {
  const data = readData();
  res.status(200).json(data);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
