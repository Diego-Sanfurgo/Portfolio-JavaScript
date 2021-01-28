//VARIABLES y SELECTORES
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

//EVENTS
eventListeners();
function eventListeners() {
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto);

    formulario.addEventListener("submit", agregarGasto);
}

//CLASES
class Presupuesto {
    constructor(presupuesto) {
        //Los transformamos porque la entrada es un String
        this.presupuesto = Number(presupuesto); //Lo transforma a número float o int según el input
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce(
            (total, gasto) => total + gasto.cantidad,
            0
        );
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        //Extrayendo valores con destructuring
        const { presupuesto, restante } = cantidad;

        //Agregar al HTML
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }

    imprimirAlerta(mensaje, tipoMsje) {

        //AGREGADO
        const cantCarteles = document.querySelector(".primario").childElementCount;
        if ((cantCarteles >= 3) && (tipoMsje === undefined)) {

        } else if ((cantCarteles >= 3) && (tipoMsje === 'error')) {
            return;
        } else if (cantCarteles >= 4) {
            return;
        }

        //Crear el div
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert"); //Alert es una clase de Bootstrap

        if (tipoMsje === "error") {
            divMensaje.classList.add("alert-danger");
        } else {
            divMensaje.classList.add("alert-success");
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        //Insertar en el HTML
        document.querySelector(".primario").insertBefore(divMensaje, formulario);

        //Quitar el HTML
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos) {
        limpiarHTML(); //Elimina el HTML previo

        //Iterar sobre los gastos
        gastos.forEach((gasto) => {
            const { cantidad, nombre, id } = gasto;

            //Crear un li
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center"; //Trae la clase del elemento

            // .dataset agrega "data-" lo que vaya luego del . de su derecha, agrega lo que iría a la derecha del guión de "data-"
            nuevoGasto.dataset.id = id;

            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad}</span> `;

            //Botón para borrar el gasto
            const btnBorrar = document.createElement("button");
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
            btnBorrar.innerHTML = "Borrar";
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            };

            nuevoGasto.appendChild(btnBorrar);

            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        });
    }

    actualizarRestante(restante) {
        document.querySelector("#restante").textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector(".restante");

        //Comprobar 25%
        if (presupuesto / 4 > restante) {
            restanteDiv.classList.remove("alert-success", "alert-warning");
            restanteDiv.classList.add("alert-danger");
        } else if (presupuesto / 2 > restante) {
            restanteDiv.classList.remove("alert-success");
            restanteDiv.classList.add("alert-warning");
        } else {
            restanteDiv.classList.remove("alert-danger", "alert-warning");
            restanteDiv.classList.add("alert-success");
        }

        //Si el total es <= 0
        //Maneja si el botón "agregar" está habilitado o no
        if (restante <= 0) {
            ui.imprimirAlerta("El presupuesto se ha agotado", "error");
            formulario.querySelector('button[type="submit"]').disabled = true;

        } else {
            formulario.querySelector('button[type="submit"]').disabled = false;
        }
    }
}
//Intanciar
const ui = new UI();
let presupuesto;

//FUNCIONES
function preguntarPresupuesto() {
    //Si el usuario clickea en "cancelar" la variable tiene valor null
    const presupuestoUsuario = prompt("¿Cuál es tu presupuesto?");

    if (
        presupuestoUsuario === "" ||
        presupuestoUsuario === null ||
        isNaN(presupuestoUsuario) ||
        presupuestoUsuario <= 0
    ) {
        window.location.reload(); // .reload recarga la página
    }

    // Tenemmos un presupuesto válido
    presupuesto = new Presupuesto(presupuestoUsuario);

    //Le pasamos la instancia de presupuesto
    ui.insertarPresupuesto(presupuesto);
}

//Añade gastos
function agregarGasto(e) {
    e.preventDefault();

    //Leer los datos del formulario
    const nombre = document.querySelector("#gasto").value;
    const cantidad = Number(document.querySelector("#cantidad").value);

    if (nombre === "" || cantidad === "") {
        ui.imprimirAlerta("Ambos campos son obligatorios", "error");
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta("Cantidad no válida", "error");
        return;
    }

    //Crear un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() };

    //Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //Mensaje de todo bien
    ui.imprimirAlerta("Gasto agregado correctamente");

    //Imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    //Reiniciar formulario
    formulario.reset();
}

function limpiarHTML() {
    while (gastoListado.firstChild) {
        gastoListado.removeChild(gastoListado.firstChild);
    }
}

function eliminarGasto(id) {
    //Elimina gastos del objeto
    presupuesto.eliminarGasto(id);

    //Elimina los gastos del HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}
