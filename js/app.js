const API_URL = 'http://localhost:3001/';
const vehiculos = [];
let vehiculosMostrados = [];

window.addEventListener('load', () => {
	document.getElementById('filter-vehiculo').addEventListener('change', filtrarTabla);
	document.getElementById('calcular-promedio').addEventListener('click', calcularPromedio);
	document.getElementById('agregar').addEventListener('click', abrirFormAlta);
	document.getElementById('alta-vehiculo-tipo').addEventListener('click', mostrarInputAlta);
	document.getElementById('btn-exit').addEventListener('click', event => {
		event.preventDefault();
		cerrarFormAlta();
	});
	document.getElementById('btn-alta').addEventListener('click', event => {
		event.preventDefault();
		agregarVehiculo();
	});
	let prom = new Promise(getVehiculos);
	prom
		.then(data => {
			getVehiculosSuccess(data);
		})
		.then(() => {
			llenarTabla(vehiculos);
		})
		.catch(err => {
			getVehiculosError(err);
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

const getVehiculosError = err => {
	alert(err);
};

const llenarTabla = listado => {
	listado.forEach(vehiculo => {
		const row = document.createElement('tr');
		row.innerHTML = `
            <td>${vehiculo.id}</td>
            <td class="column-1">${vehiculo.marca}</td>
            <td class="column-2">${vehiculo.modelo}</td>
            <td class="column-3">${vehiculo.precio}</td>
            <td> <button class="eliminar-vehiculo" onclick="eliminarVehiculo(${vehiculo.id})">Eliminar</button></td>
        `;
		document.getElementById('table-body').appendChild(row);
	});
	vehiculosMostrados = listado;
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
	limpiarPromedio();
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

const limpiarPromedio = () => {
	document.getElementById('promedio').value = null;
};

const calcularPromedio = () => {
	const promedio = vehiculosMostrados.reduce((acumulador, vehiculo) => {
		return acumulador + vehiculo.precio;
	}, 0);
	document.getElementById('promedio').value = promedio / vehiculosMostrados.length;
};

// Function that takes a column number and hides or displays based on a checkbox
const toggleColumn = columnNumber => {
	const column = document.getElementById(`column-${columnNumber}`);
	const checkbox = document.getElementById(`checkbox-${columnNumber}`);
	const tds = document.getElementsByClassName(`column-${columnNumber}`);
	if (checkbox.checked) {
		column.style.display = 'table-cell';
		for (let i = 0; i < tds.length; i++) {
			tds[i].style.display = 'table-cell';
		}
	} else {
		column.style.display = 'none';
		for (let i = 0; i < tds.length; i++) {
			tds[i].style.display = 'none';
		}
	}
};

const abrirFormAlta = () => {
	mostrarInputAlta();
	document.getElementById('alta').classList.remove('hidden');
};

const cerrarFormAlta = () => {
	document.getElementById('alta').classList.add('hidden');
};

const mostrarInputAlta = () => {
	const tipo = document.getElementById('alta-vehiculo-tipo').value;
	if (tipo === '1') {
		document.getElementById('input-auto').classList.remove('hidden');
		document.getElementById('input-camioneta').classList.add('hidden');
	} else if (tipo === '2') {
		document.getElementById('input-camioneta').classList.remove('hidden');
		document.getElementById('input-auto').classList.add('hidden');
	}
};

const getNextId = () => {
	let id = 0;
	vehiculos.forEach(vehiculo => {
		if (vehiculo.id > id) {
			id = vehiculo.id;
		}
	});
	return id + 1;
};

const agregarVehiculo = () => {
	const tipo = document.getElementById('alta-vehiculo-tipo').value;
	const marca = document.getElementById('alta-vehiculo-marca').value;
	const modelo = document.getElementById('alta-vehiculo-modelo').value;
	const precio = document.getElementById('alta-vehiculo-precio').value;
	const id = getNextId();
	if (marca !== '' && modelo !== '' && precio !== '') {
		if (tipo === '1') {
			const cantidadPuertas = document.getElementById('alta-vehiculo-puertas').value;
			const auto = new Auto(id, marca, modelo, precio, cantidadPuertas);
			vehiculos.push(auto);
		} else if (tipo === '2') {
			const cuatroXcuatro = document.getElementById('alta-vehiculo-cuatroXcuatro').checked;
			const camioneta = new Camioneta(id, marca, modelo, precio, cuatroXcuatro);
			vehiculos.push(camioneta);
		}
		cerrarFormAlta();
		limpiarTabla();
		llenarTabla(vehiculos);
	} else {
		alert('Debe completar todos los campos');
	}
};
