// Clase que representa un Combo de Hamburguesa
class ComboHamburguesa {
  constructor(id, nombre, precio, ingredientes) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.ingredientes = ingredientes;
  }
}

// Clase que representa un producto individual
class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }
}

// Combos de hamburguesa disponibles en la hamburguesería
const combosHamburguesa = [
  new ComboHamburguesa(1, "TheAsyncBurger", 1200, ["Carne", "Cebolla caramelizada", "Bacon", "Salsa especial", "Aros de pimiento"]),
  new ComboHamburguesa(2, "TheVanillaClassic", 1500, ["Carne", "Lechuga", "Tomate", "Cebolla", "Salsa de vainilla"]),
  new ComboHamburguesa(3, "TheES6Supreme", 1700, ["Carne de res y cerdo sazonada con hierbas", "Aguacate", "Queso cheddar", "Mayonesa"])
];

// Productos individuales disponibles en la hamburguesería
const productos = [
  new Producto("Hamburguesa Simple", 0),
  new Producto("Hamburguesa Doble", 500),
  new Producto("Papas", 300)
];

// Función para mostrar los ingredientes de un Combo de Hamburguesa
function mostrarIngredientes(comboHamburguesa) {
  console.log(`Ingredientes del ${comboHamburguesa.nombre}:`);
  comboHamburguesa.ingredientes.forEach(ingrediente => {
    console.log("- " + ingrediente);
  });
}

// Funciones para obtener las selecciones del formulario
function obtenerComboSeleccionado() {
  const comboId = document.querySelector('input[name="combo"]:checked').value;
  return parseInt(comboId);
}

function obtenerHamburguesaDoble() {
  const hamburguesaDoble = document.querySelector('input[name="doble"]:checked').value;
  return hamburguesaDoble === "si";
}

function obtenerOrdenPapas() {
  const ordenarPapas = document.querySelector('input[name="papas"]:checked').value;
  return ordenarPapas === "si";
}

// Función para mostrar el total a pagar en la página
function mostrarTotalAPagar(totalAPagar) {
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = `<p>El total a pagar es de $${totalAPagar}</p>`;
  resultadoDiv.style.display = "block";
}

// Función para mostrar el pedido actual del cliente
function mostrarPedidoActual() {
  const pedidoDiv = document.getElementById("pedido");
  pedidoDiv.innerHTML = "<h2>Pedido actual:</h2>";

  window.pedidos.forEach((pedido, index) => {
    const hamburguesaDobleMsg = pedido.hamburguesaDoble ? "Hamburguesa doble" : "";
    const papasMsg = pedido.ordenarPapas ? "Papas" : "";
    pedidoDiv.innerHTML += `
      <div class="pedido-item">
        <p><strong>Combo ${index + 1}: ${pedido.combo.nombre}</strong></p>
        <p>${hamburguesaDobleMsg}</p>
        <p>${papasMsg}</p>
        <p>Total a pagar: $${pedido.total}</p>
      </div>
    `;
  });

  pedidoDiv.style.display = "block";
}

// Función para calcular el total a pagar por el pedido actual
function calcularTotalAPagar(comboHamburguesa, hamburguesaDoble, ordenarPapas) {
  let totalAPagar = comboHamburguesa.precio;

  if (hamburguesaDoble) {
    const hamburguesaDoblePrecio = productos.find(producto => producto.nombre === "Hamburguesa Doble").precio;
    totalAPagar += hamburguesaDoblePrecio;
  }

  if (ordenarPapas) {
    const papasPrecio = productos.find(producto => producto.nombre === "Papas").precio;
    totalAPagar += papasPrecio;
  }

  return totalAPagar;
}

// Función para agregar el pedido actual a la lista de pedidos y mostrarlo en la página
function agregarAlPedido() {
  const comboId = obtenerComboSeleccionado();
  const comboHamburguesaSeleccionado = combosHamburguesa.find(combo => combo.id === comboId);
  const hamburguesaDoble = obtenerHamburguesaDoble();
  const ordenarPapas = obtenerOrdenPapas();
  const totalAPagar = calcularTotalAPagar(comboHamburguesaSeleccionado, hamburguesaDoble, ordenarPapas);

  const pedido = {
    combo: comboHamburguesaSeleccionado,
    hamburguesaDoble: hamburguesaDoble,
    ordenarPapas: ordenarPapas,
    total: totalAPagar
  };

  if (!window.pedidos) {
    window.pedidos = [];
  }

  window.pedidos.push(pedido);
  localStorage.setItem("pedido", JSON.stringify(window.pedidos));

  mostrarIngredientes(comboHamburguesaSeleccionado);
  mostrarTotalAPagar(calcularTotalPedido());
  mostrarPedidoActual();

  limpiarFormulario();

  const btnFinalizar = document.getElementById("btn-finalizar");
  btnFinalizar.style.display = "block";
  btnFinalizar.addEventListener("click", finalizarPedido);

  const btnLimpiar = document.getElementById("btn-limpiar");
  btnLimpiar.style.display = "block";
  btnLimpiar.addEventListener("click", limpiarPedido);
}

// Función para calcular el total a pagar de todos los pedidos realizados
function calcularTotalPedido() {
  return window.pedidos.reduce((total, pedido) => total + pedido.total, 0);
}

// Función para mostrar el resultado final del pedido
function mostrarResultado(total) {
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = `<p>El total a pagar es de $${total}</p>`;
  resultadoDiv.style.display = "block";
}

// Función para finalizar el pedido
function finalizarPedido() {
  const totalPedido = calcularTotalPedido();
  mostrarResultado(totalPedido);

  document.getElementById("btn-agregar").style.display = "none";
  document.getElementById("btn-finalizar").style.display = "none";
  document.getElementById("btn-limpiar").style.display = "none";
  document.getElementById("pedido").style.display = "none";
}

// Función para limpiar el pedido y el formulario
function limpiarPedido() {
  localStorage.removeItem("pedido");
  window.pedidos = [];
  limpiarFormulario();
  document.getElementById("resultado").style.display = "none";
  document.getElementById("pedido").style.display = "none";
  document.getElementById("btn-finalizar").style.display = "none";
  document.getElementById("btn-limpiar").style.display = "none";
  document.getElementById("btn-agregar").style.display = "block";
}

// Función para limpiar el formulario
function limpiarFormulario() {
  document.querySelectorAll('input[name="combo"]').forEach(input => (input.checked = false));
  document.querySelectorAll('input[name="doble"]').forEach(input => (input.checked = false));
  document.querySelectorAll('input[name="papas"]').forEach(input => (input.checked = false));
}

// Event Listener para el botón de agregar al pedido
document.getElementById("btn-agregar").addEventListener("click", agregarAlPedido);