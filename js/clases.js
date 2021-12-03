class Vehiculo {
	constructor(id, marca, modelo, precio) {
		this.id = id;
		this.marca = marca;
		this.modelo = modelo;
		this.precio = precio;
	}
	set setId(id) {
		this.id = id;
	}
	get getId() {
		return this.id;
	}
	set setMarca(marca) {
		this.marca = marca;
	}
	get getMarca() {
		return this.marca;
	}
	set setModelo(modelo) {
		this.modelo = modelo;
	}
	get getModelo() {
		return this.modelo;
	}
	set setPrecio(precio) {
		this.precio = precio;
	}
}

class Auto extends Vehiculo {
	constructor(id, marca, modelo, precio, puertas) {
		super(id, marca, modelo, precio);
		this.puertas = puertas;
	}
	set setPuertas(puertas) {
		this.puertas = puertas;
	}
	get getPuertas() {
		return this.puertas;
	}
}

class Camioneta extends Vehiculo {
	constructor(id, marca, modelo, precio, cuatroXcuatro) {
		super(id, marca, modelo, precio);
		this.cuatroXcuatro = cuatroXcuatro;
	}
	set setCuatroXcuatro(cuatroXcuatro) {
		this.cuatroXcuatro = cuatroXcuatro;
	}
	get getCuatroXcuatro() {
		return this.cuatroXcuatro;
	}
}
