const API_URL = 'http://localhost:3001/';
const vehiculos = [];

window.addEventListener('load', () => {
	let prom = new Promise(getVehiculos);
	prom
		.then(data => {
			getVehiculosSuccess(data);
		})
		.then(() => {
			llenarTabla(vehiculos);
		});
});

const getVehiculos = async (exito, error) => {
	try {
		let res = await fetch(API_URL + 'vehiculos', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});
		console.log(res.statusText.toString());
		if (res.statusText.toString() === 'OK') {
			let json = await res.json();
			exito(json);
		}
	} catch (err) {
		error(err);
	}
};

const getVehiculosSuccess = data => {
	Array.from(data).forEach(vehiculo => {
		if (vehiculo.hasOwnProperty('cuatroXcuatro')) {
			const camioneta = new Camioneta(vehiculo.id, vehiculo.make, vehiculo.model, vehiculo.price, vehiculo.cuatroXcuatro);
			vehiculos.push(camioneta);
		} else {
			const auto = new Auto(vehiculo.id, vehiculo.make, vehiculo.model, vehiculo.price, vehiculo.cantidadPuertas);
			vehiculos.push(auto);
		}
	});
};

const llenarTabla = listado => {
	listado.forEach(vehiculo => {
		const row = document.createElement('tr');
		row.innerHTML = `
            <td>${vehiculo.id}</td>
            <td>${vehiculo.marca}</td>
            <td>${vehiculo.modelo}</td>
            <td>${vehiculo.precio}</td>
            <td> <button class="eliminar-vehiculo" onclick="eliminarVehiculo(${vehiculo.id})">Eliminar</button></td>
        `;
		document.getElementById('table-body').appendChild(row);
	});
};

const eliminarVehiculo = id => {
	const vehiculo = vehiculos.find(vehiculo => vehiculo.id === id);
	if (vehiculo) {
		const index = vehiculos.indexOf(vehiculo);
		vehiculos.splice(index, 1);
		document.getElementById('table-body').innerHTML = '';
		llenarTabla(vehiculos);
	} else {
		alert('No se encontró el vehículo');
	}
};

const filtrarTabla = () => {
	limpiarTabla();
	const filtro = document.getElementById('filter-vehiculo').value;
	if (filtro === '1') {
		const autos = vehiculos.filter(vehiculo => vehiculo instanceof Auto);
		llenarTabla(autos);
	} else if (filtro === '2') {
		const camionetas = vehiculos.filter(vehiculo => vehiculo instanceof Camioneta);
		llenarTabla(camionetas);
	} else {
		llenarTabla(vehiculos);
	}
};

const limpiarTabla = () => {
	document.getElementById('table-body').innerHTML = '';
};
